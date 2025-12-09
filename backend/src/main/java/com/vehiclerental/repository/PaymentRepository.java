package com.vehiclerental.repository;

import com.vehiclerental.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {

    List<Payment> findByRentalId(Long rentalId);

    List<Payment> findByStatus(Payment.PaymentStatus status);

    @Query("SELECT SUM(p.amount) FROM Payment p WHERE " +
           "p.status = 'COMPLETED' AND " +
           "p.paymentDate BETWEEN :startDate AND :endDate")
    BigDecimal calculateTotalRevenue(@Param("startDate") LocalDateTime startDate,
                                    @Param("endDate") LocalDateTime endDate);

    @Query("SELECT p FROM Payment p WHERE p.paymentDate BETWEEN :startDate AND :endDate")
    List<Payment> findPaymentsByDateRange(@Param("startDate") LocalDateTime startDate,
                                          @Param("endDate") LocalDateTime endDate);
}
