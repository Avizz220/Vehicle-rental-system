package com.vehiclerental.controller;

import com.vehiclerental.entity.Rental;
import com.vehiclerental.service.RentalService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/rentals")
@RequiredArgsConstructor
public class RentalController {

    private final RentalService rentalService;

    @GetMapping
    public ResponseEntity<Page<Rental>> getAllRentals(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String status) {
        
        Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());
        Page<Rental> rentals;

        if (status != null) {
            rentals = rentalService.getRentalsByStatus(
                Rental.RentalStatus.valueOf(status), pageable);
        } else {
            rentals = rentalService.getAllRentals(pageable);
        }

        return ResponseEntity.ok(rentals);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Rental> getRentalById(@PathVariable Long id) {
        return ResponseEntity.ok(rentalService.getRentalById(id));
    }

    @PostMapping
    public ResponseEntity<Rental> createRental(@Valid @RequestBody Rental rental) {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(rentalService.createRental(rental));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Rental> updateRental(
            @PathVariable Long id,
            @Valid @RequestBody Rental rental) {
        return ResponseEntity.ok(rentalService.updateRental(id, rental));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRental(@PathVariable Long id) {
        rentalService.deleteRental(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/return")
    public ResponseEntity<Rental> returnVehicle(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {
        LocalDate actualReturnDate = LocalDate.parse(request.get("actualReturnDate"));
        return ResponseEntity.ok(rentalService.returnVehicle(id, actualReturnDate));
    }

    @PostMapping("/calculate-cost")
    public ResponseEntity<BigDecimal> calculateCost(@RequestBody Map<String, String> request) {
        Long vehicleId = Long.parseLong(request.get("vehicleId"));
        LocalDate startDate = LocalDate.parse(request.get("startDate"));
        LocalDate endDate = LocalDate.parse(request.get("endDate"));
        
        return ResponseEntity.ok(rentalService.calculateRentalCost(vehicleId, startDate, endDate));
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<Page<Rental>> getRentalsByCustomer(
            @PathVariable Long customerId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());
        return ResponseEntity.ok(rentalService.getRentalsByCustomerId(customerId, pageable));
    }

    @GetMapping("/overdue")
    public ResponseEntity<List<Rental>> getOverdueRentals() {
        return ResponseEntity.ok(rentalService.getOverdueRentals());
    }

    @PostMapping("/{id}/activate")
    public ResponseEntity<Void> activateRental(@PathVariable Long id) {
        rentalService.activateRental(id);
        return ResponseEntity.ok().build();
    }
}
