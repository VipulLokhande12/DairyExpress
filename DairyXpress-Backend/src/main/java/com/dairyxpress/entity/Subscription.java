package com.dairyxpress.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "subscriptions")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class Subscription {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String planName;

    @Column(nullable = false)
    private String frequency;

    @Column(nullable = false)
    private String detail;

    @Column(nullable = false)
    private Double price;

    @Column(nullable = false)
    private String status = "ACTIVE";
}
