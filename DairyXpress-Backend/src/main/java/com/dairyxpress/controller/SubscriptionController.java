package com.dairyxpress.controller;

import com.dairyxpress.dto.ApiResponse;
import com.dairyxpress.dto.SubscriptionDto;
import com.dairyxpress.dto.SubscriptionRequest;
import com.dairyxpress.service.SubscriptionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/subscriptions")
@RequiredArgsConstructor
public class SubscriptionController {

    private final SubscriptionService subscriptionService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<SubscriptionDto>>> getSubscriptions(Authentication auth) {
        return ResponseEntity.ok(ApiResponse.ok(subscriptionService.getSubscriptions(auth.getName())));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<SubscriptionDto>> createSubscription(
            Authentication auth,
            @Valid @RequestBody SubscriptionRequest req
    ) {
        return ResponseEntity.ok(ApiResponse.ok("Subscription created", subscriptionService.createSubscription(auth.getName(), req)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> cancelSubscription(
            Authentication auth,
            @PathVariable Long id
    ) {
        subscriptionService.cancelSubscription(auth.getName(), id);
        return ResponseEntity.ok(ApiResponse.ok("Subscription cancelled", null));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse<SubscriptionDto>> updateStatus(Authentication auth, @PathVariable Long id, @RequestParam String status) {
        return ResponseEntity.ok(ApiResponse.ok("Subscription updated", subscriptionService.updateStatus(auth.getName(), id, status.toUpperCase())));
    }
}
