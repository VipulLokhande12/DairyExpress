package com.dairyxpress.controller;

import com.dairyxpress.dto.AdminStatsDto;
import com.dairyxpress.dto.ApiResponse;
import com.dairyxpress.dto.OrderDto;
import com.dairyxpress.dto.ProductDto;
import com.dairyxpress.dto.AdminProductRequest;
import com.dairyxpress.dto.ProductPricingRequest;
import jakarta.validation.Valid;
import com.dairyxpress.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<AdminStatsDto>> getStats() {
        return ResponseEntity.ok(ApiResponse.ok(adminService.getStats()));
    }

    @GetMapping("/orders")
    public ResponseEntity<ApiResponse<List<OrderDto>>> getRecentOrders() {
        return ResponseEntity.ok(ApiResponse.ok(adminService.getRecentOrders()));
    }

    @GetMapping("/products/low-stock")
    public ResponseEntity<ApiResponse<List<ProductDto>>> getLowStock() {
        return ResponseEntity.ok(ApiResponse.ok(adminService.getLowStockProducts()));
    }

    @GetMapping("/products")
    public ResponseEntity<ApiResponse<List<ProductDto>>> getProducts() {
        return ResponseEntity.ok(ApiResponse.ok(adminService.getProducts()));
    }

    @PostMapping("/products")
    public ResponseEntity<ApiResponse<ProductDto>> createProduct(@Valid @RequestBody AdminProductRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("Product created", adminService.createProduct(request)));
    }

    @PutMapping("/products/{id}/pricing")
    public ResponseEntity<ApiResponse<ProductDto>> updatePricing(@PathVariable Long id, @Valid @RequestBody ProductPricingRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("Pricing updated", adminService.updatePricing(id, request)));
    }

    @PutMapping("/products/{id}/stock")
    public ResponseEntity<ApiResponse<ProductDto>> updateStock(
            @PathVariable Long id,
            @RequestParam Integer stock
    ) {
        return ResponseEntity.ok(ApiResponse.ok("Stock updated", adminService.updateStock(id, stock)));
    }

    @DeleteMapping("/products/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteProduct(@PathVariable Long id) {
        adminService.deleteProduct(id);
        return ResponseEntity.ok(ApiResponse.ok("Product deleted", null));
    }
}
