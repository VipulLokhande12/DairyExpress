package com.dairyxpress.service;

import com.dairyxpress.dto.ReviewDto;
import com.dairyxpress.dto.ReviewRequest;
import com.dairyxpress.entity.Product;
import com.dairyxpress.entity.Review;
import com.dairyxpress.entity.User;
import com.dairyxpress.exception.ResourceNotFoundException;
import com.dairyxpress.repository.ProductRepository;
import com.dairyxpress.repository.ReviewRepository;
import com.dairyxpress.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public List<ReviewDto> getProductReviews(Long productId) {
        return reviewRepository.findByProductId(productId).stream().map(this::toDto).toList();
    }

    @Transactional
    public ReviewDto createReview(String email, ReviewRequest req) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Product product = productRepository.findById(req.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        Review review = Review.builder()
                .product(product)
                .user(user)
                .rating(req.getRating())
                .text(req.getText())
                .build();
        reviewRepository.save(review);

        // Update product aggregate rating
        List<Review> all = reviewRepository.findByProductId(product.getId());
        double avg = all.stream().mapToInt(Review::getRating).average().orElse(product.getRating());
        product.setRating(Math.round(avg * 10.0) / 10.0);
        product.setReviews(product.getReviews() + 1);
        productRepository.save(product);

        return toDto(review);
    }

    private ReviewDto toDto(Review r) {
        return ReviewDto.builder()
                .id(r.getId())
                .userName(r.getUser().getName())
                .rating(r.getRating())
                .text(r.getText())
                .createdAt(r.getCreatedAt())
                .build();
    }
}
