package com.dairyxpress.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class AdminStatsDto {
    private double revenueMtd;
    private long ordersMtd;
    private long newCustomers;
    private double avgOrderValue;
    private long totalProducts;
    private long lowStockCount;
}
