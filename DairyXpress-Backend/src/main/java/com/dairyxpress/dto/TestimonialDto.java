package com.dairyxpress.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class TestimonialDto {
    private Long id;
    private String name;
    private String role;
    private String photo;
    private Integer rating;
    private String text;
}
