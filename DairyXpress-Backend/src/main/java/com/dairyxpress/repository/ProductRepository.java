package com.dairyxpress.repository;

import com.dairyxpress.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    Optional<Product> findBySlug(String slug);
    List<Product> findByCategorySlug(String categorySlug);
    List<Product> findTop8ByOrderByIdAsc();
    List<Product> findByNameContainingIgnoreCaseOrCategoryNameContainingIgnoreCase(String name, String categoryName);
}
