package com.dairyxpress.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class ChatService {
    private final ObjectMapper objectMapper;

    @Value("${openai.api.key:}")
    private String apiKey;

    @Value("${openai.model:gpt-5.6-luna}")
    private String model;

    public String reply(String message) {
        if (apiKey == null || apiKey.isBlank()) return localReply(message);

        try {
            String body = RestClient.create("https://api.openai.com")
                    .post().uri("/v1/responses")
                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + apiKey)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(Map.of(
                            "model", model,
                            "instructions", "You are Moo, DairyXpress customer support. Answer briefly and warmly about dairy products, checkout, delivery, subscriptions and order tracking. Never invent order details. Tell users to open Profile > Orders for live tracking.",
                            "input", message,
                            "max_output_tokens", 300
                    ))
                    .retrieve().body(String.class);
            JsonNode json = objectMapper.readTree(body);
            if (json.hasNonNull("output_text")) return json.get("output_text").asText();
            for (JsonNode output : json.path("output"))
                for (JsonNode content : output.path("content"))
                    if (content.hasNonNull("text")) return content.get("text").asText();
        } catch (Exception ignored) { }
        return localReply(message);
    }

    private String localReply(String message) {
        String text = message.toLowerCase();
        if (text.contains("call") || text.contains("phone") || text.contains("number")) return "Tap Call below to reach DairyXpress support at +91 1800 123 4567, daily from 8 AM to 10 PM.";
        if (text.contains("email")) return "Tap Email below or write to support@dairyxpress.farm. We normally reply within one business day.";
        if (text.contains("ticket") || text.contains("complaint") || text.contains("issue")) return "Tap Ticket below, enter your contact details and issue, then choose Raise ticket. You will receive a ticket number immediately.";
        if (text.contains("store") || text.contains("origin") || text.contains("anand nagar")) return "All DairyXpress orders are dispatched from our store at Anand Nagar Metro Station, Pune. The order map shows the route from this store to your delivery address.";
        if (text.contains("track") || text.contains("order")) return "Open Profile, choose Orders, then select Track order to see its latest delivery position.";
        if (text.contains("deliver")) return "DairyXpress normally shows the current estimate on your order tracking card. Your exact time can change with traffic.";
        if (text.contains("location") || text.contains("address")) return "At checkout, tap Use my current location, allow browser access, then confirm or edit the address before continuing.";
        if (text.contains("subscription")) return "You can browse recurring dairy plans from the Subscriptions page and manage active plans in Profile.";
        return "I can help with products, delivery, addresses, subscriptions, checkout, and order tracking. What would you like to know?";
    }
}
