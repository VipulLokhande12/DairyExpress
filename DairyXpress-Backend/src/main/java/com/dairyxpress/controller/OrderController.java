package com.dairyxpress.controller;

import com.dairyxpress.dto.ApiResponse;
import com.dairyxpress.dto.CreateOrderRequest;
import com.dairyxpress.dto.OrderDto;
import com.dairyxpress.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    public ResponseEntity<ApiResponse<OrderDto>> createOrder(
            Authentication auth,
            @Valid @RequestBody CreateOrderRequest req
    ) {
        return ResponseEntity.ok(ApiResponse.ok("Order created", orderService.createOrder(auth.getName(), req)));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<OrderDto>>> getMyOrders(Authentication auth) {
        return ResponseEntity.ok(ApiResponse.ok(orderService.getOrders(auth.getName())));
    }
}
