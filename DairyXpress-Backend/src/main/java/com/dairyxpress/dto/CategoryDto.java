package com.dairyxpress.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class CategoryDto {
    private Long id;
    private String slug;
    private String name;
    private String icon;
    private String image;
    private String blurb;
    private long count;
}
