package com.dairyxpress.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class WishlistDto {
    private Long id;
    private String productId;
    private String productName;
    private Double productPrice;
    private String productImage;
}
