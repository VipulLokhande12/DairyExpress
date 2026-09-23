package com.dairyxpress.controller;

import com.dairyxpress.dto.ApiResponse;
import com.dairyxpress.dto.ChatRequest;
import com.dairyxpress.service.ChatService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {
    private final ChatService chatService;

    @PostMapping
    public ResponseEntity<ApiResponse<Map<String, String>>> chat(@Valid @RequestBody ChatRequest request) {
        return ResponseEntity.ok(ApiResponse.ok(Map.of("reply", chatService.reply(request.getMessage()))));
    }
}
