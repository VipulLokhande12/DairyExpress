package com.dairyxpress.service;

import com.dairyxpress.dto.NutritionDto;
import com.dairyxpress.dto.ProductDto;
import com.dairyxpress.entity.*;
import com.dairyxpress.exception.ResourceNotFoundException;
import com.dairyxpress.repository.CategoryRepository;
import com.dairyxpress.repository.ProductRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import com.dairyxpress.dto.CategoryDto;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final ObjectMapper objectMapper;

    public List<ProductDto> getAllProducts(String category, String search) {
        List<Product> products;
        if (search != null && !search.isBlank()) {
            products = productRepository.findByNameContainingIgnoreCaseOrCategoryNameContainingIgnoreCase(search, search);
        } else if (category != null && !category.isBlank()) {
            products = productRepository.findByCategorySlug(category);
        } else {
            products = productRepository.findAll();
        }
        return products.stream().map(this::toDto).toList();
    }

    public ProductDto getProductBySlug(String slug) {
        Product p = productRepository.findBySlug(slug).orElseGet(() -> {
            try { return productRepository.findById(Long.valueOf(slug)).orElseThrow(); }
            catch (Exception ignored) { throw new ResourceNotFoundException("Product not found: " + slug); }
        });
        return toDto(p);
    }

    public List<ProductDto> getFeaturedProducts() {
        return productRepository.findTop8ByOrderByIdAsc().stream().map(this::toDto).toList();
    }

    public List<CategoryDto> getAllCategories() {
        return categoryRepository.findAll().stream().map(c -> CategoryDto.builder()
                .id(c.getId())
                .slug(c.getSlug())
                .name(c.getName())
                .icon(c.getIcon())
                .image(c.getImage())
                .blurb(c.getBlurb())
                .count(productRepository.findByCategorySlug(c.getSlug()).size())
                .build()).toList();
    }

    public ProductDto toDto(Product p) {
        return ProductDto.builder()
                .id(p.getId())
                .slug(p.getSlug())
                .name(p.getName())
                .category(p.getCategory().getSlug())
                .price(p.getPrice())
                .oldPrice(p.getOldPrice())
                .image(p.getImage())
                .gallery(parseList(p.getGallery(), String.class))
                .rating(p.getRating())
                .reviews(p.getReviews())
                .stock(p.getStock())
                .deliveryMins(p.getDeliveryMins())
                .organic(p.getOrganic())
                .badge(p.getBadge())
                .description(p.getDescription())
                .ingredients(parseList(p.getIngredients(), String.class))
                .benefits(parseList(p.getBenefits(), String.class))
                .nutrition(parseNutrition(p.getNutrition()))
                .unit(p.getUnit())
                .build();
    }

    private <T> List<T> parseList(String json, Class<T> clazz) {
        if (json == null || json.isBlank()) return List.of();
        try {
            return objectMapper.readValue(json, new TypeReference<List<T>>() {});
        } catch (Exception e) {
            log.warn("Failed to parse list: {}", json, e);
            return List.of();
        }
    }

    private List<NutritionDto> parseNutrition(String json) {
        if (json == null || json.isBlank()) return List.of();
        try {
            return objectMapper.readValue(json, new TypeReference<List<NutritionDto>>() {});
        } catch (Exception e) {
            log.warn("Failed to parse nutrition: {}", json, e);
            return List.of();
        }
    }
}
