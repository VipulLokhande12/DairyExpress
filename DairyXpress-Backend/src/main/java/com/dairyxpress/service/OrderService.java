package com.dairyxpress.service;

import com.dairyxpress.dto.*;
import com.dairyxpress.entity.*;
import com.dairyxpress.exception.ResourceNotFoundException;
import com.dairyxpress.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;

    @Transactional
    public OrderDto createOrder(String email, CreateOrderRequest req) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        String orderId = "DV" + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyMMddHHmmss"));

        Order order = Order.builder()
                .orderId(orderId)
                .user(user)
                .subtotal(req.getSubtotal())
                .discount(req.getDiscount() != null ? req.getDiscount() : 0.0)
                .deliveryFee(req.getDeliveryFee())
                .total(req.getTotal())
                .status("PREPARING")
                .address(req.getAddress())
                .deliveryLatitude(req.getDeliveryLatitude())
                .deliveryLongitude(req.getDeliveryLongitude())
                .paymentMethod(req.getPaymentMethod())
                .build();

        List<OrderItem> items = req.getItems().stream().map(i -> OrderItem.builder()
                .order(order)
                .productName(i.getProductName())
                .productImage(i.getProductImage())
                .productUnit(i.getProductUnit())
                .price(i.getPrice())
                .qty(i.getQty())
                .subtotal(i.getPrice() * i.getQty())
                .build()).toList();

        order.setItems(items);
        orderRepository.save(order);

        // Award reward points (1 pt per ₹10)
        int earnedPoints = req.getItems().stream().mapToInt(item -> item.getQty() * 10).sum();
        user.setRewardPoints(user.getRewardPoints() + earnedPoints);
        userRepository.save(user);

        return toDto(order);
    }

    public List<OrderDto> getOrders(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return orderRepository.findByUserIdOrderByCreatedAtDesc(user.getId()).stream()
                .map(this::toDto).toList();
    }

    public List<OrderDto> getAllOrders() {
        return orderRepository.findAll().stream()
                .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                .map(this::toDto).toList();
    }

    private OrderDto toDto(Order o) {
        return OrderDto.builder()
                .id(o.getId())
                .orderId(o.getOrderId())
                .subtotal(o.getSubtotal())
                .discount(o.getDiscount())
                .deliveryFee(o.getDeliveryFee())
                .total(o.getTotal())
                .status(o.getStatus())
                .address(o.getAddress())
                .deliveryLatitude(o.getDeliveryLatitude())
                .deliveryLongitude(o.getDeliveryLongitude())
                .paymentMethod(o.getPaymentMethod())
                .createdAt(o.getCreatedAt())
                .items(o.getItems().stream().map(i -> OrderItemDto.builder()
                        .productName(i.getProductName())
                        .productImage(i.getProductImage())
                        .productUnit(i.getProductUnit())
                        .price(i.getPrice())
                        .qty(i.getQty())
                        .subtotal(i.getSubtotal())
                        .build()).toList())
                .build();
    }
}
