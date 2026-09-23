package com.dairyxpress.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class SupportTicketDto {
    private String ticketNumber;
    private String status;
    private LocalDateTime createdAt;
}
