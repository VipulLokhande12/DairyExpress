package com.dairyxpress.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
public class ReviewDto {
    private Long id;
    private String userName;
    private Integer rating;
    private String text;
    private LocalDateTime createdAt;
}
