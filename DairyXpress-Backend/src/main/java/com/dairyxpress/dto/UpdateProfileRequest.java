package com.dairyxpress.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UpdateProfileRequest {
    @NotBlank private String name;
    @NotBlank @Email private String email;
    @NotBlank private String phone;
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;
}
