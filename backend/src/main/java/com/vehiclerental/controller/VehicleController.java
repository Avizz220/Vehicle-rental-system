package com.vehiclerental.controller;

import com.vehiclerental.entity.Vehicle;
import com.vehiclerental.service.VehicleService;
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
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/vehicles")
@RequiredArgsConstructor
public class VehicleController {

    private final VehicleService vehicleService;

    @GetMapping
    public ResponseEntity<Page<Vehicle>> getAllVehicles(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String status) {
        
        Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());
        Page<Vehicle> vehicles;

        if (category != null) {
            vehicles = vehicleService.getVehiclesByCategory(
                Vehicle.VehicleCategory.valueOf(category), pageable);
        } else if (status != null) {
            vehicles = vehicleService.getVehiclesByStatus(
                Vehicle.VehicleStatus.valueOf(status), pageable);
        } else {
            vehicles = vehicleService.getAllVehicles(pageable);
        }

        return ResponseEntity.ok(vehicles);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Vehicle> getVehicleById(@PathVariable Long id) {
        return ResponseEntity.ok(vehicleService.getVehicleById(id));
    }

    @PostMapping
    public ResponseEntity<Vehicle> createVehicle(@Valid @RequestBody Vehicle vehicle) {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(vehicleService.createVehicle(vehicle));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Vehicle> updateVehicle(
            @PathVariable Long id,
            @Valid @RequestBody Vehicle vehicle) {
        return ResponseEntity.ok(vehicleService.updateVehicle(id, vehicle));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVehicle(@PathVariable Long id) {
        vehicleService.deleteVehicle(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search")
    public ResponseEntity<List<Vehicle>> searchVehicles(@RequestParam String q) {
        return ResponseEntity.ok(vehicleService.searchVehicles(q));
    }

    @GetMapping("/available")
    public ResponseEntity<List<Vehicle>> getAvailableVehicles(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(vehicleService.getAvailableVehicles(startDate, endDate));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Void> updateVehicleStatus(
            @PathVariable Long id,
            @RequestParam String status) {
        vehicleService.updateVehicleStatus(id, Vehicle.VehicleStatus.valueOf(status));
        return ResponseEntity.ok().build();
    }
}
