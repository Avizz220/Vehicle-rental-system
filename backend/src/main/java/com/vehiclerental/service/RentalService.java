package com.vehiclerental.service;

import com.vehiclerental.entity.Rental;
import com.vehiclerental.entity.Vehicle;
import com.vehiclerental.entity.Customer;
import com.vehiclerental.repository.RentalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class RentalService {

    private final RentalRepository rentalRepository;
    private final VehicleService vehicleService;
    private final CustomerService customerService;

    public Page<Rental> getAllRentals(Pageable pageable) {
        return rentalRepository.findAll(pageable);
    }

    public Rental getRentalById(Long id) {
        return rentalRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Rental not found with id: " + id));
    }

    public Rental createRental(Rental rental) {
        // Validate vehicle availability
        List<Rental> conflictingRentals = rentalRepository.findConflictingRentals(
            rental.getVehicle().getId(),
            rental.getStartDate(),
            rental.getEndDate()
        );

        if (!conflictingRentals.isEmpty()) {
            throw new RuntimeException("Vehicle is not available for the selected dates");
        }

        // Calculate total cost
        long days = ChronoUnit.DAYS.between(rental.getStartDate(), rental.getEndDate());
        if (days <= 0) {
            throw new RuntimeException("End date must be after start date");
        }

        Vehicle vehicle = vehicleService.getVehicleById(rental.getVehicle().getId());
        BigDecimal totalCost = vehicle.getDailyRate().multiply(BigDecimal.valueOf(days));
        rental.setTotalCost(totalCost);

        // Set deposit amount (typically 20% of total cost)
        rental.setDepositAmount(totalCost.multiply(BigDecimal.valueOf(0.2)));

        // Update vehicle status
        vehicleService.updateVehicleStatus(vehicle.getId(), Vehicle.VehicleStatus.RESERVED);

        return rentalRepository.save(rental);
    }

    public Rental updateRental(Long id, Rental rentalDetails) {
        Rental rental = getRentalById(id);
        
        rental.setStartDate(rentalDetails.getStartDate());
        rental.setEndDate(rentalDetails.getEndDate());
        rental.setStatus(rentalDetails.getStatus());
        rental.setAdditionalCharges(rentalDetails.getAdditionalCharges());
        rental.setNotes(rentalDetails.getNotes());
        
        return rentalRepository.save(rental);
    }

    public void deleteRental(Long id) {
        Rental rental = getRentalById(id);
        rentalRepository.delete(rental);
    }

    public Rental returnVehicle(Long id, LocalDate actualReturnDate) {
        Rental rental = getRentalById(id);
        rental.setActualReturnDate(actualReturnDate);
        rental.setStatus(Rental.RentalStatus.COMPLETED);

        // Update vehicle status to available
        vehicleService.updateVehicleStatus(rental.getVehicle().getId(), 
            Vehicle.VehicleStatus.AVAILABLE);

        // Calculate late fees if applicable
        if (actualReturnDate.isAfter(rental.getEndDate())) {
            long lateDays = ChronoUnit.DAYS.between(rental.getEndDate(), actualReturnDate);
            BigDecimal lateFee = rental.getVehicle().getDailyRate()
                .multiply(BigDecimal.valueOf(lateDays))
                .multiply(BigDecimal.valueOf(1.5)); // 1.5x daily rate for late returns
            rental.setAdditionalCharges(rental.getAdditionalCharges().add(lateFee));
        }

        return rentalRepository.save(rental);
    }

    public BigDecimal calculateRentalCost(Long vehicleId, LocalDate startDate, LocalDate endDate) {
        Vehicle vehicle = vehicleService.getVehicleById(vehicleId);
        long days = ChronoUnit.DAYS.between(startDate, endDate);
        if (days <= 0) {
            throw new RuntimeException("End date must be after start date");
        }
        return vehicle.getDailyRate().multiply(BigDecimal.valueOf(days));
    }

    public Page<Rental> getRentalsByStatus(Rental.RentalStatus status, Pageable pageable) {
        return rentalRepository.findByStatus(status, pageable);
    }

    public Page<Rental> getRentalsByCustomerId(Long customerId, Pageable pageable) {
        return rentalRepository.findByCustomerId(customerId, pageable);
    }

    public List<Rental> getOverdueRentals() {
        return rentalRepository.findOverdueRentals(LocalDate.now());
    }

    public void activateRental(Long id) {
        Rental rental = getRentalById(id);
        rental.setStatus(Rental.RentalStatus.ACTIVE);
        vehicleService.updateVehicleStatus(rental.getVehicle().getId(), 
            Vehicle.VehicleStatus.RENTED);
        rentalRepository.save(rental);
    }
}
