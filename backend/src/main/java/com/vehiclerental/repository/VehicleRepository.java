package com.vehiclerental.repository;

import com.vehiclerental.entity.Vehicle;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, Long> {

    Page<Vehicle> findByCategory(Vehicle.VehicleCategory category, Pageable pageable);

    Page<Vehicle> findByStatus(Vehicle.VehicleStatus status, Pageable pageable);

    @Query("SELECT v FROM Vehicle v WHERE " +
           "LOWER(v.make) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(v.model) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(v.licensePlate) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Vehicle> searchVehicles(@Param("query") String query);

    @Query("SELECT v FROM Vehicle v WHERE v.status = 'AVAILABLE' AND v.id NOT IN " +
           "(SELECT r.vehicle.id FROM Rental r WHERE " +
           "r.status IN ('ACTIVE', 'PENDING') AND " +
           "((r.startDate <= :endDate) AND (r.endDate >= :startDate)))")
    List<Vehicle> findAvailableVehicles(@Param("startDate") LocalDate startDate, 
                                       @Param("endDate") LocalDate endDate);

    boolean existsByLicensePlate(String licensePlate);
}
