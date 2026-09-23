package com.dairyxpress.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class AdminProductRequest {
    @NotBlank private String slug;
    @NotBlank private String name;
    @NotBlank private String category;
    @NotNull @DecimalMin("0.0") private Double price;
    @DecimalMin("0.0") private Double oldPrice;
    @NotBlank private String image;
    @NotBlank private String unit;
    @NotNull @Min(0) private Integer stock;
    private Integer deliveryMins = 30;
    private Boolean organic = false;
    private String badge;
    private String description = "Fresh DairyXpress product";
}
