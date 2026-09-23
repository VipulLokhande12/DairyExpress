package com.dairyxpress.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class SubscriptionRequest {
    @NotBlank
    private String planName;

    @NotBlank
    private String frequency;

    @NotBlank
    private String detail;

    @NotNull
    private Double price;
}
