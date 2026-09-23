package com.dairyxpress.controller;

import com.dairyxpress.dto.ApiResponse;
import com.dairyxpress.dto.CategoryDto;
import com.dairyxpress.dto.ProductDto;
import com.dairyxpress.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @GetMapping("/products")
    public ResponseEntity<ApiResponse<List<ProductDto>>> getProducts(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String search
    ) {
        return ResponseEntity.ok(ApiResponse.ok(productService.getAllProducts(category, search)));
    }

    @GetMapping("/products/featured")
    public ResponseEntity<ApiResponse<List<ProductDto>>> getFeatured() {
        return ResponseEntity.ok(ApiResponse.ok(productService.getFeaturedProducts()));
    }

    @GetMapping("/products/{slug}")
    public ResponseEntity<ApiResponse<ProductDto>> getProduct(@PathVariable String slug) {
        return ResponseEntity.ok(ApiResponse.ok(productService.getProductBySlug(slug)));
    }

    @GetMapping("/categories")
    public ResponseEntity<ApiResponse<List<CategoryDto>>> getCategories() {
        return ResponseEntity.ok(ApiResponse.ok(productService.getAllCategories()));
    }
}
