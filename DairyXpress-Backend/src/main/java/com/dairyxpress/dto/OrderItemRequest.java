package com.dairyxpress.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class OrderItemRequest {
    @NotBlank
    private String productId;

    @NotBlank
    private String productName;

    @NotBlank
    private String productImage;

    @NotBlank
    private String productUnit;

    @NotNull
    private Double price;

    @NotNull
    private Integer qty;
}
