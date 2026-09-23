package com.dairyxpress.service;

import com.dairyxpress.dto.AdminStatsDto;
import com.dairyxpress.dto.OrderDto;
import com.dairyxpress.dto.ProductDto;
import com.dairyxpress.entity.Order;
import com.dairyxpress.entity.Product;
import com.dairyxpress.exception.ResourceNotFoundException;
import com.dairyxpress.repository.OrderRepository;
import com.dairyxpress.repository.ProductRepository;
import com.dairyxpress.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import com.dairyxpress.dto.AdminProductRequest;
import com.dairyxpress.dto.ProductPricingRequest;
import com.dairyxpress.repository.CategoryRepository;
import com.dairyxpress.repository.ReviewRepository;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final ProductService productService;
    private final CategoryRepository categoryRepository;
    private final ObjectMapper objectMapper;
    private final ReviewRepository reviewRepository;

    public AdminStatsDto getStats() {
        LocalDateTime monthStart = LocalDateTime.now().withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0);
        List<Order> monthOrders = orderRepository.findAll().stream()
                .filter(o -> o.getCreatedAt() != null && o.getCreatedAt().isAfter(monthStart))
                .toList();

        double revenue = monthOrders.stream().mapToDouble(Order::getTotal).sum();
        long orderCount = monthOrders.size();
        long newCustomers = userRepository.findAll().stream()
                .filter(u -> u.getCreatedAt() != null && u.getCreatedAt().isAfter(monthStart))
                .count();
        double avg = orderCount > 0 ? revenue / orderCount : 0;
        long lowStock = productRepository.findAll().stream().filter(p -> p.getStock() < 10).count();

        return AdminStatsDto.builder()
                .revenueMtd(Math.round(revenue * 100.0) / 100.0)
                .ordersMtd(orderCount)
                .newCustomers(newCustomers)
                .avgOrderValue(Math.round(avg * 100.0) / 100.0)
                .totalProducts(productRepository.count())
                .lowStockCount(lowStock)
                .build();
    }

    public List<OrderDto> getRecentOrders() {
        return orderRepository.findAll().stream()
                .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                .limit(10)
                .map(o -> OrderDto.builder()
                        .id(o.getId())
                        .orderId(o.getOrderId())
                        .total(o.getTotal())
                        .status(o.getStatus())
                        .createdAt(o.getCreatedAt())
                        .items(o.getItems().stream().map(i -> com.dairyxpress.dto.OrderItemDto.builder()
                                .productName(i.getProductName())
                                .qty(i.getQty())
                                .build()).toList())
                        .build())
                .toList();
    }

    public List<ProductDto> getLowStockProducts() {
        return productRepository.findAll().stream()
                .filter(p -> p.getStock() < 10)
                .map(productService::toDto)
                .toList();
    }

    public ProductDto updateStock(Long productId, Integer stock) {
        Product p = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        p.setStock(stock);
        productRepository.save(p);
        return productService.toDto(p);
    }

    public List<ProductDto> getProducts() {
        return productRepository.findAll().stream().map(productService::toDto).toList();
    }

    public ProductDto createProduct(AdminProductRequest req) {
        if (productRepository.findBySlug(req.getSlug()).isPresent()) throw new IllegalArgumentException("Product slug already exists");
        var category = categoryRepository.findBySlug(req.getCategory())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found: " + req.getCategory()));
        try {
            String gallery = objectMapper.writeValueAsString(List.of(req.getImage()));
            Product p = Product.builder().slug(req.getSlug()).name(req.getName()).category(category)
                    .price(req.getPrice()).oldPrice(req.getOldPrice()).image(req.getImage()).gallery(gallery)
                    .rating(0.0).reviews(0).stock(req.getStock()).deliveryMins(req.getDeliveryMins() == null ? 30 : req.getDeliveryMins())
                    .organic(Boolean.TRUE.equals(req.getOrganic())).badge(req.getBadge())
                    .description(req.getDescription() == null || req.getDescription().isBlank() ? "Fresh DairyXpress product" : req.getDescription())
                    .ingredients("[]").benefits("[]").nutrition("[]").unit(req.getUnit()).build();
            return productService.toDto(productRepository.save(p));
        } catch (Exception e) { throw new IllegalArgumentException("Could not create product", e); }
    }

    public ProductDto updatePricing(Long id, ProductPricingRequest req) {
        Product p = productRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        p.setPrice(req.getPrice()); p.setOldPrice(req.getOldPrice());
        return productService.toDto(productRepository.save(p));
    }

    @org.springframework.transaction.annotation.Transactional
    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        reviewRepository.deleteByProductId(id);
        productRepository.delete(product);
    }
}
