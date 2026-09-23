package com.dairyxpress.service;

import com.dairyxpress.dto.*;
import com.dairyxpress.entity.Role;
import com.dairyxpress.entity.User;
import com.dairyxpress.exception.ResourceAlreadyExistsException;
import com.dairyxpress.exception.ResourceNotFoundException;
import com.dairyxpress.repository.*;
import com.dairyxpress.security.CustomUserDetailsService;
import com.dairyxpress.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final CustomUserDetailsService userDetailsService;
    private final OrderRepository orderRepository;
    private final WishlistRepository wishlistRepository;
    private final AddressRepository addressRepository;
    private final SubscriptionRepository subscriptionRepository;

    public AuthResponse register(RegisterRequest req) {
        if (userRepository.existsByEmail(req.getEmail())) {
            throw new ResourceAlreadyExistsException("Email already registered");
        }
        User user = User.builder()
                .name(req.getName())
                .email(req.getEmail())
                .password(passwordEncoder.encode(req.getPassword()))
                .phone(req.getPhone())
                .role(Role.CUSTOMER)
                .rewardPoints(0)
                .build();
        userRepository.save(user);

        String token = jwtService.generateToken(userDetailsService.loadUserByUsername(user.getEmail()));
        return new AuthResponse(token, toDto(user));
    }

    public AuthResponse login(LoginRequest req) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.getEmail(), req.getPassword())
        );
        User user = userRepository.findByEmail(req.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        String token = jwtService.generateToken(userDetailsService.loadUserByUsername(user.getEmail()));
        return new AuthResponse(token, toDto(user));
    }

    /** Dedicated entry point for the management console. */
    public AuthResponse loginAdmin(LoginRequest req) {
        AuthResponse response = login(req);
        if (!Role.ADMIN.name().equals(response.getUser().getRole())) {
            throw new BadCredentialsException("Invalid admin credentials");
        }
        return response;
    }

    public UserDto getCurrentUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        reconcileRewardPoints(user);
        return toDto(user);
    }

    @Transactional
    public ProfileSummaryDto getProfileSummary(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        var orders = orderRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
        var subscriptions = subscriptionRepository.findByUserId(user.getId());
        int earnedPoints = orders.stream()
                .flatMap(order -> order.getItems().stream())
                .mapToInt(item -> item.getQty() * 10)
                .sum();
        if (!Integer.valueOf(earnedPoints).equals(user.getRewardPoints())) {
            user.setRewardPoints(earnedPoints);
            userRepository.save(user);
        }
        long activeSubscriptions = subscriptions.stream()
                .filter(subscription -> "ACTIVE".equalsIgnoreCase(subscription.getStatus()))
                .count();
        long notifications = orders.size() + subscriptions.size() + (earnedPoints > 0 ? 1 : 0);
        return ProfileSummaryDto.builder()
                .totalOrders(orders.size())
                .activeSubscriptions(activeSubscriptions)
                .rewardPoints(earnedPoints)
                .wishlistItems(wishlistRepository.findByUserId(user.getId()).size())
                .savedAddresses(addressRepository.findByUserId(user.getId()).size())
                .notifications(notifications)
                .build();
    }

    private void reconcileRewardPoints(User user) {
        int earnedPoints = orderRepository.findByUserIdOrderByCreatedAtDesc(user.getId()).stream()
                .flatMap(order -> order.getItems().stream())
                .mapToInt(item -> item.getQty() * 10)
                .sum();
        if (!Integer.valueOf(earnedPoints).equals(user.getRewardPoints())) {
            user.setRewardPoints(earnedPoints);
            userRepository.save(user);
        }
    }

    @Transactional
    public AuthResponse updateProfile(String currentEmail, UpdateProfileRequest req) {
        User user = userRepository.findByEmail(currentEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        userRepository.findByEmail(req.getEmail())
                .filter(existing -> !existing.getId().equals(user.getId()))
                .ifPresent(existing -> { throw new ResourceAlreadyExistsException("Email already registered"); });
        user.setName(req.getName().trim());
        user.setEmail(req.getEmail().trim().toLowerCase());
        user.setPhone(req.getPhone().trim());
        if (req.getPassword() != null && !req.getPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(req.getPassword()));
        }
        userRepository.save(user);
        String token = jwtService.generateToken(userDetailsService.loadUserByUsername(user.getEmail()));
        return new AuthResponse(token, toDto(user));
    }

    private UserDto toDto(User user) {
        return UserDto.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .role(user.getRole().name())
                .rewardPoints(user.getRewardPoints())
                .build();
    }
}
