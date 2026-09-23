package com.dairyxpress.service;

import com.dairyxpress.dto.SubscriptionDto;
import com.dairyxpress.dto.SubscriptionRequest;
import com.dairyxpress.entity.Subscription;
import com.dairyxpress.entity.User;
import com.dairyxpress.exception.ResourceNotFoundException;
import com.dairyxpress.repository.SubscriptionRepository;
import com.dairyxpress.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SubscriptionService {

    private final SubscriptionRepository subscriptionRepository;
    private final UserRepository userRepository;

    public List<SubscriptionDto> getSubscriptions(String email) {
        User user = getUser(email);
        return subscriptionRepository.findByUserId(user.getId()).stream().map(this::toDto).toList();
    }

    public SubscriptionDto createSubscription(String email, SubscriptionRequest req) {
        User user = getUser(email);
        Subscription sub = Subscription.builder()
                .user(user)
                .planName(req.getPlanName())
                .frequency(req.getFrequency())
                .detail(req.getDetail())
                .price(req.getPrice())
                .status("ACTIVE")
                .build();
        subscriptionRepository.save(sub);
        return toDto(sub);
    }

    public void cancelSubscription(String email, Long id) {
        User user = getUser(email);
        Subscription sub = subscriptionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Subscription not found"));
        if (!sub.getUser().getId().equals(user.getId())) {
            throw new ResourceNotFoundException("Subscription not found");
        }
        sub.setStatus("CANCELLED");
        subscriptionRepository.save(sub);
    }

    public SubscriptionDto updateStatus(String email, Long id, String status) {
        User user = getUser(email);
        Subscription sub = subscriptionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Subscription not found"));
        if (!sub.getUser().getId().equals(user.getId())) throw new ResourceNotFoundException("Subscription not found");
        if (!List.of("ACTIVE", "PAUSED").contains(status)) throw new IllegalArgumentException("Status must be ACTIVE or PAUSED");
        sub.setStatus(status);
        return toDto(subscriptionRepository.save(sub));
    }

    private User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private SubscriptionDto toDto(Subscription s) {
        return SubscriptionDto.builder()
                .id(s.getId())
                .planName(s.getPlanName())
                .frequency(s.getFrequency())
                .detail(s.getDetail())
                .price(s.getPrice())
                .status(s.getStatus())
                .build();
    }
}
