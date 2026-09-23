package com.dairyxpress.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "order_items")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @Column(nullable = false)
    private String productName;

    @Column(nullable = false)
    private String productImage;

    @Column(nullable = false)
    private String productUnit;

    @Column(nullable = false)
    private Double price;

    @Column(nullable = false)
    private Integer qty;

    @Column(nullable = false)
    private Double subtotal;
}
