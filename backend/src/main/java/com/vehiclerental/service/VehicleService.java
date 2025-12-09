package com.vehiclerental.service;

import com.vehiclerental.entity.Vehicle;
import com.vehiclerental.repository.VehicleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class VehicleService {

    private final VehicleRepository vehicleRepository;

    public Page<Vehicle> getAllVehicles(Pageable pageable) {
        return vehicleRepository.findAll(pageable);
    }

    public Vehicle getVehicleById(Long id) {
        return vehicleRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Vehicle not found with id: " + id));
    }

    public Vehicle createVehicle(Vehicle vehicle) {
        if (vehicleRepository.existsByLicensePlate(vehicle.getLicensePlate())) {
            throw new RuntimeException("Vehicle with license plate " + 
                vehicle.getLicensePlate() + " already exists");
        }
        return vehicleRepository.save(vehicle);
    }

    public Vehicle updateVehicle(Long id, Vehicle vehicleDetails) {
        Vehicle vehicle = getVehicleById(id);
        
        vehicle.setMake(vehicleDetails.getMake());
        vehicle.setModel(vehicleDetails.getModel());
        vehicle.setYear(vehicleDetails.getYear());
        vehicle.setCategory(vehicleDetails.getCategory());
        vehicle.setStatus(vehicleDetails.getStatus());
        vehicle.setDailyRate(vehicleDetails.getDailyRate());
        vehicle.setMileage(vehicleDetails.getMileage());
        vehicle.setFuelType(vehicleDetails.getFuelType());
        vehicle.setTransmission(vehicleDetails.getTransmission());
        vehicle.setSeats(vehicleDetails.getSeats());
        vehicle.setColor(vehicleDetails.getColor());
        vehicle.setImageUrl(vehicleDetails.getImageUrl());
        vehicle.setFeatures(vehicleDetails.getFeatures());
        
        return vehicleRepository.save(vehicle);
    }

    public void deleteVehicle(Long id) {
        Vehicle vehicle = getVehicleById(id);
        vehicleRepository.delete(vehicle);
    }

    public Page<Vehicle> getVehiclesByCategory(Vehicle.VehicleCategory category, Pageable pageable) {
        return vehicleRepository.findByCategory(category, pageable);
    }

    public Page<Vehicle> getVehiclesByStatus(Vehicle.VehicleStatus status, Pageable pageable) {
        return vehicleRepository.findByStatus(status, pageable);
    }

    public List<Vehicle> searchVehicles(String query) {
        return vehicleRepository.searchVehicles(query);
    }

    public List<Vehicle> getAvailableVehicles(LocalDate startDate, LocalDate endDate) {
        return vehicleRepository.findAvailableVehicles(startDate, endDate);
    }

    public void updateVehicleStatus(Long id, Vehicle.VehicleStatus status) {
        Vehicle vehicle = getVehicleById(id);
        vehicle.setStatus(status);
        vehicleRepository.save(vehicle);
    }
}
