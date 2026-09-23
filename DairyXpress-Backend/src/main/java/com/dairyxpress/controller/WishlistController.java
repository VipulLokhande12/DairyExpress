package com.dairyxpress.controller;

import com.dairyxpress.dto.ApiResponse;
import com.dairyxpress.dto.WishlistDto;
import com.dairyxpress.dto.WishlistRequest;
import com.dairyxpress.service.WishlistService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/wishlist")
@RequiredArgsConstructor
public class WishlistController {

    private final WishlistService wishlistService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<WishlistDto>>> getWishlist(Authentication auth) {
        return ResponseEntity.ok(ApiResponse.ok(wishlistService.getWishlist(auth.getName())));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<WishlistDto>> toggleWishlist(
            Authentication auth,
            @Valid @RequestBody WishlistRequest req
    ) {
        WishlistDto result = wishlistService.addToWishlist(auth.getName(), req);
        String message = result == null ? "Removed from wishlist" : "Added to wishlist";
        return ResponseEntity.ok(ApiResponse.ok(message, result));
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<ApiResponse<Void>> removeWishlist(
            Authentication auth,
            @PathVariable String productId
    ) {
        wishlistService.removeFromWishlist(auth.getName(), productId);
        return ResponseEntity.ok(ApiResponse.ok("Removed from wishlist", null));
    }
}
