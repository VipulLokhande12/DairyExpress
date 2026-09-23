package com.dairyxpress.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "support_tickets")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class SupportTicket {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false, unique = true, length = 24)
    private String ticketNumber;
    @Column(nullable = false, length = 80)
    private String name;
    @Column(nullable = false, length = 120)
    private String email;
    @Column(length = 20)
    private String phone;
    @Column(nullable = false, length = 120)
    private String subject;
    @Column(nullable = false, length = 2000)
    private String message;
    @Column(nullable = false, length = 20)
    private String status;
    @CreationTimestamp
    private LocalDateTime createdAt;
}
