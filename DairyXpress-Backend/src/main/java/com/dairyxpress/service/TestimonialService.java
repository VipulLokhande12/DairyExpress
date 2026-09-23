package com.dairyxpress.service;

import com.dairyxpress.dto.TestimonialDto;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.InputStream;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class TestimonialService {

    private final ObjectMapper objectMapper;

    public List<TestimonialDto> getTestimonials() {
        try (InputStream is = new ClassPathResource("testimonials.json").getInputStream()) {
            return objectMapper.readValue(is, new com.fasterxml.jackson.core.type.TypeReference<List<TestimonialDto>>() {});
        } catch (Exception e) {
            log.warn("Could not load testimonials.json, returning empty list", e);
            return List.of();
        }
    }
}
