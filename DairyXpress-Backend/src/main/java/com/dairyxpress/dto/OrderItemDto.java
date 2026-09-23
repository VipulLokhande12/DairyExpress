package com.dairyxpress.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class OrderItemDto {
    private String productName;
    private String productImage;
    private String productUnit;
    private Double price;
    private Integer qty;
    private Double subtotal;
}
