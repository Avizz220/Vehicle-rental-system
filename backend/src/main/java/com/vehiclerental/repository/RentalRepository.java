package com.vehiclerental.repository;

import com.vehiclerental.entity.Rental;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface RentalRepository extends JpaRepository<Rental, Long> {

    Page<Rental> findByStatus(Rental.RentalStatus status, Pageable pageable);

    Page<Rental> findByCustomerId(Long customerId, Pageable pageable);

    Page<Rental> findByVehicleId(Long vehicleId, Pageable pageable);

    @Query("SELECT r FROM Rental r WHERE r.vehicle.id = :vehicleId AND " +
           "r.status IN ('ACTIVE', 'PENDING') AND " +
           "((r.startDate <= :endDate) AND (r.endDate >= :startDate))")
    List<Rental> findConflictingRentals(@Param("vehicleId") Long vehicleId,
                                       @Param("startDate") LocalDate startDate,
                                       @Param("endDate") LocalDate endDate);

    @Query("SELECT r FROM Rental r WHERE r.endDate < :date AND r.status = 'ACTIVE'")
    List<Rental> findOverdueRentals(@Param("date") LocalDate date);

    @Query("SELECT COUNT(r) FROM Rental r WHERE r.status = :status")
    long countByStatus(@Param("status") Rental.RentalStatus status);
}
