package com.dairyxpress.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class SupportTicketRequest {
    @NotBlank @Size(max = 80) private String name;
    @NotBlank @Email @Size(max = 120) private String email;
    @Size(max = 20) private String phone;
    @NotBlank @Size(max = 120) private String subject;
    @NotBlank @Size(min = 10, max = 2000) private String message;
}
