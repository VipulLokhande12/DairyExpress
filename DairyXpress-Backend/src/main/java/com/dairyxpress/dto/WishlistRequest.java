package com.dairyxpress.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class WishlistRequest {
    @NotBlank
    private String productId;

    @NotBlank
    private String productName;

    @NotNull
    private Double productPrice;

    @NotBlank
    private String productImage;
}
