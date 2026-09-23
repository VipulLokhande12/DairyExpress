package com.dairyxpress.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
public class ProductDto {
    private Long id;
    private String slug;
    private String name;
    private String category;
    private Double price;
    private Double oldPrice;
    private String image;
    private List<String> gallery;
    private Double rating;
    private Integer reviews;
    private Integer stock;
    private Integer deliveryMins;
    private Boolean organic;
    private String badge;
    private String description;
    private List<String> ingredients;
    private List<String> benefits;
    private List<NutritionDto> nutrition;
    private String unit;
}
