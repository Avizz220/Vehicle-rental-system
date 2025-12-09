package com.vehiclerental.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "vehicles")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class Vehicle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String make;

    @Column(nullable = false)
    private String model;

    @Column(nullable = false)
    private Integer year;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private VehicleCategory category;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private VehicleStatus status = VehicleStatus.AVAILABLE;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal dailyRate;

    @Column(nullable = false)
    private Integer mileage;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private FuelType fuelType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TransmissionType transmission;

    @Column(nullable = false)
    private Integer seats;

    private String color;

    @Column(unique = true, nullable = false)
    private String licensePlate;

    private String imageUrl;

    @ElementCollection
    @CollectionTable(name = "vehicle_features", joinColumns = @JoinColumn(name = "vehicle_id"))
    @Column(name = "feature")
    private List<String> features = new ArrayList<>();

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    public enum VehicleCategory {
        SEDAN, SUV, TRUCK, VAN, SPORTS, LUXURY
    }

    public enum VehicleStatus {
        AVAILABLE, RENTED, MAINTENANCE, RESERVED
    }

    public enum FuelType {
        PETROL, DIESEL, ELECTRIC, HYBRID
    }

    public enum TransmissionType {
        MANUAL, AUTOMATIC
    }
}
