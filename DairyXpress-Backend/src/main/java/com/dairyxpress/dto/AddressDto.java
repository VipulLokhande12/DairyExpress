package com.dairyxpress.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class AddressDto {
    private Long id;
    private String label;
    private String line1;
    private String line2;
    private String city;
    private String pincode;
    private Double latitude;
    private Double longitude;
    private Boolean isDefault;
}
