package com.vehiclerental.service;

import com.vehiclerental.entity.Customer;
import com.vehiclerental.repository.CustomerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class CustomerService {

    private final CustomerRepository customerRepository;

    public Page<Customer> getAllCustomers(Pageable pageable) {
        return customerRepository.findAll(pageable);
    }

    public Customer getCustomerById(Long id) {
        return customerRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Customer not found with id: " + id));
    }

    public Customer createCustomer(Customer customer) {
        if (customerRepository.existsByEmail(customer.getEmail())) {
            throw new RuntimeException("Customer with email " + 
                customer.getEmail() + " already exists");
        }
        if (customerRepository.existsByLicenseNumber(customer.getLicenseNumber())) {
            throw new RuntimeException("Customer with license number " + 
                customer.getLicenseNumber() + " already exists");
        }
        return customerRepository.save(customer);
    }

    public Customer updateCustomer(Long id, Customer customerDetails) {
        Customer customer = getCustomerById(id);
        
        customer.setFirstName(customerDetails.getFirstName());
        customer.setLastName(customerDetails.getLastName());
        customer.setEmail(customerDetails.getEmail());
        customer.setPhone(customerDetails.getPhone());
        customer.setLicenseNumber(customerDetails.getLicenseNumber());
        customer.setAddress(customerDetails.getAddress());
        customer.setCity(customerDetails.getCity());
        customer.setPostalCode(customerDetails.getPostalCode());
        customer.setCountry(customerDetails.getCountry());
        
        return customerRepository.save(customer);
    }

    public void deleteCustomer(Long id) {
        Customer customer = getCustomerById(id);
        customerRepository.delete(customer);
    }

    public List<Customer> searchCustomers(String query) {
        return customerRepository.searchCustomers(query);
    }

    public Customer getCustomerByEmail(String email) {
        return customerRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("Customer not found with email: " + email));
    }
}
