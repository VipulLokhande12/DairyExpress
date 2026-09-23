package com.dairyxpress.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class NutritionDto {
    private String label;
    private String value;
}
