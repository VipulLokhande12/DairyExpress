package com.dairyxpress.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class SubscriptionDto {
    private Long id;
    private String planName;
    private String frequency;
    private String detail;
    private Double price;
    private String status;
}
