package com.dairyxpress.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AddressRequest {
    @NotBlank
    private String label;

    @NotBlank
    private String line1;

    private String line2;

    @NotBlank
    private String city;

    @NotBlank
    private String pincode;

    private Double latitude;

    private Double longitude;

    @NotNull
    private Boolean isDefault;
}
