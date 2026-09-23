package com.dairyxpress.controller;

import com.dairyxpress.dto.ApiResponse;
import com.dairyxpress.dto.SupportTicketDto;
import com.dairyxpress.dto.SupportTicketRequest;
import com.dairyxpress.service.SupportTicketService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/support/tickets")
@RequiredArgsConstructor
public class SupportTicketController {
    private final SupportTicketService service;

    @PostMapping
    public ResponseEntity<ApiResponse<SupportTicketDto>> create(@Valid @RequestBody SupportTicketRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok("Support ticket raised", service.create(request)));
    }
}
