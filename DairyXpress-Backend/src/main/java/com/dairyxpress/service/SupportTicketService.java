package com.dairyxpress.service;

import com.dairyxpress.dto.SupportTicketDto;
import com.dairyxpress.dto.SupportTicketRequest;
import com.dairyxpress.entity.SupportTicket;
import com.dairyxpress.repository.SupportTicketRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.Locale;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class SupportTicketService {
    private final SupportTicketRepository repository;

    public SupportTicketDto create(SupportTicketRequest request) {
        String number = "DX-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase(Locale.ROOT);
        SupportTicket saved = repository.save(SupportTicket.builder()
                .ticketNumber(number).name(request.getName().trim()).email(request.getEmail().trim().toLowerCase(Locale.ROOT))
                .phone(request.getPhone() == null ? "" : request.getPhone().trim()).subject(request.getSubject().trim())
                .message(request.getMessage().trim()).status("OPEN").build());
        return new SupportTicketDto(saved.getTicketNumber(), saved.getStatus(), saved.getCreatedAt());
    }
}
