package com.dairyxpress.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
public class OrderDto {
    private Long id;
    private String orderId;
    private Double subtotal;
    private Double discount;
    private Double deliveryFee;
    private Double total;
    private String status;
    private String address;
    private Double deliveryLatitude;
    private Double deliveryLongitude;
    private String paymentMethod;
    private LocalDateTime createdAt;
    private List<OrderItemDto> items;
}
