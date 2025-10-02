package com.example.demo.service;

import com.example.demo.model.*;
import com.example.demo.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class ApiService {
    @Autowired
    private ShippingRepository shippingRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private UserRepository userRepository;

    public List<Product> getAllProduct() {
        return (List<Product>) productRepository.findAll();
    }

    public Customer getCustomerById(Integer customerId) {
        return customerRepository.getCustomerByID(customerId);
    }

    public List<Order> getOrdersByCustomerId(Integer customerId) {
        return orderRepository.getOrderListByCustomerId(customerId);
    }

    public List<Order> getOrdersBySku(Integer sku) {
        return orderRepository.getOrderListBySKU(sku);
    }

    public Product getProductBySku(Integer sku) {
        return productRepository.getProductBySKU(sku);
    }

    public Product getProductByProductName(String productName) {
        return productRepository.getProductByProductName(productName);
    }

    public List<Shipping> getShippingAddressesByCustomerId(Integer customerId) {
        return shippingRepository.getShippingAddressListByCustomerId(customerId);
    }

    public User getUserByCreds(String user, String pass) {
        return userRepository.getUserByCreds(user, pass);
    }


}
