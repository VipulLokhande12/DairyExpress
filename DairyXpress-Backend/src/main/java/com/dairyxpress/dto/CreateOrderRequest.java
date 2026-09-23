package com.dairyxpress.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class CreateOrderRequest {
    @NotEmpty
    private List<OrderItemRequest> items;

    @NotNull
    private Double subtotal;

    private Double discount = 0.0;

    @NotNull
    private Double deliveryFee;

    @NotNull
    private Double total;

    @NotNull
    private String address;

    private Double deliveryLatitude;

    private Double deliveryLongitude;

    @NotNull
    private String paymentMethod;

    private String couponCode;
}
