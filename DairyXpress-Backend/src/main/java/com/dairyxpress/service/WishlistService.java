package com.dairyxpress.service;

import com.dairyxpress.dto.WishlistDto;
import com.dairyxpress.dto.WishlistRequest;
import com.dairyxpress.entity.User;
import com.dairyxpress.entity.Wishlist;
import com.dairyxpress.exception.ResourceNotFoundException;
import com.dairyxpress.repository.UserRepository;
import com.dairyxpress.repository.WishlistRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class WishlistService {

    private final WishlistRepository wishlistRepository;
    private final UserRepository userRepository;

    public List<WishlistDto> getWishlist(String email) {
        User user = getUser(email);
        return wishlistRepository.findByUserId(user.getId()).stream()
                .map(this::toDto).toList();
    }

    @Transactional
    public WishlistDto addToWishlist(String email, WishlistRequest req) {
        User user = getUser(email);
        // Toggle: if exists, remove
        var existing = wishlistRepository.findByUserIdAndProductId(user.getId(), req.getProductId());
        if (existing.isPresent()) {
            wishlistRepository.delete(existing.get());
            return null; // removed
        }
        Wishlist w = Wishlist.builder()
                .user(user)
                .productId(req.getProductId())
                .productName(req.getProductName())
                .productPrice(req.getProductPrice())
                .productImage(req.getProductImage())
                .build();
        wishlistRepository.save(w);
        return toDto(w);
    }

    @Transactional
    public void removeFromWishlist(String email, String productId) {
        User user = getUser(email);
        wishlistRepository.deleteByUserIdAndProductId(user.getId(), productId);
    }

    private User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private WishlistDto toDto(Wishlist w) {
        return WishlistDto.builder()
                .id(w.getId())
                .productId(w.getProductId())
                .productName(w.getProductName())
                .productPrice(w.getProductPrice())
                .productImage(w.getProductImage())
                .build();
    }
}
