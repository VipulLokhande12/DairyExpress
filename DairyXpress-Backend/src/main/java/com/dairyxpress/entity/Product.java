package com.dairyxpress.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "products")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String slug;

    @Column(nullable = false)
    private String name;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @Column(nullable = false)
    private Double price;

    private Double oldPrice;

    @Column(nullable = false)
    private String image;

    @Column(nullable = false)
    private String gallery;

    @Column(nullable = false)
    private Double rating;

    @Column(nullable = false)
    private Integer reviews;

    @Column(nullable = false)
    private Integer stock;

    @Column(nullable = false)
    private Integer deliveryMins;

    @Column(nullable = false)
    private Boolean organic;

    private String badge;

    @Column(nullable = false, length = 2000)
    private String description;

    @Column(nullable = false)
    private String ingredients;

    @Column(nullable = false)
    private String benefits;

    @Column(nullable = false)
    private String nutrition;

    @Column(nullable = false)
    private String unit;

    @OneToMany(mappedBy = "product", fetch = FetchType.LAZY)
    @Builder.Default
    private List<Review> reviewsList = new ArrayList<>();

    @Transient
    private List<String> galleryList;

    @Transient
    private List<String> ingredientsList;

    @Transient
    private List<String> benefitsList;

    @Transient
    private List<NutritionFact> nutritionList;
}
