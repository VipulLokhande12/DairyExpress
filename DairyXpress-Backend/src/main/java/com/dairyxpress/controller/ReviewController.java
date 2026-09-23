package com.dairyxpress.controller;

import com.dairyxpress.dto.ApiResponse;
import com.dairyxpress.dto.ReviewDto;
import com.dairyxpress.dto.ReviewRequest;
import com.dairyxpress.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @GetMapping("/products/{productId}/reviews")
    public ResponseEntity<ApiResponse<List<ReviewDto>>> getReviews(@PathVariable Long productId) {
        return ResponseEntity.ok(ApiResponse.ok(reviewService.getProductReviews(productId)));
    }

    @PostMapping("/reviews")
    public ResponseEntity<ApiResponse<ReviewDto>> createReview(
            Authentication auth,
            @Valid @RequestBody ReviewRequest req
    ) {
        return ResponseEntity.ok(ApiResponse.ok("Review posted", reviewService.createReview(auth.getName(), req)));
    }
}
