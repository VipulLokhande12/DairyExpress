package com.dairyxpress.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ProductPricingRequest {
    @NotNull @DecimalMin("0.0") private Double price;
    @DecimalMin("0.0") private Double oldPrice;
}
