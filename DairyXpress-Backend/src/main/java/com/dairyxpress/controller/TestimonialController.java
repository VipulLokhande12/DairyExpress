package com.dairyxpress.controller;

import com.dairyxpress.dto.ApiResponse;
import com.dairyxpress.dto.TestimonialDto;
import com.dairyxpress.service.TestimonialService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/testimonials")
@RequiredArgsConstructor
public class TestimonialController {

    private final TestimonialService testimonialService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<TestimonialDto>>> getTestimonials() {
        return ResponseEntity.ok(ApiResponse.ok(testimonialService.getTestimonials()));
    }
}
