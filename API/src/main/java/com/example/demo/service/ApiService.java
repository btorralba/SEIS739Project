package com.example.demo.service;

import com.example.demo.model.*;
import com.example.demo.model.response.Response;
import com.example.demo.repository.*;
import jakarta.transaction.Transactional;
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

    @Autowired
    private PaymentRepository paymentRepository;

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
        return productRepository.getProductByProductName(productName).get(0);
    }

    public List<Shipping> getShippingAddressesByCustomerId(Integer customerId) {
        return shippingRepository.getShippingAddressListByCustomerId(customerId);
    }

    public User getUserByCreds(String user, String pass) {
        return userRepository.getUserByCreds(user, pass);
    }

    public Response addProduct(Product product) {
        Response resp = new Response();
        productRepository.save(product);
        resp.setMessage("success");
        return resp;
    }

    public Response addUser(User user) {
        Response resp = new Response();
        userRepository.save(user);
        resp.setMessage(String.valueOf(user.getCustomerId()));
        return resp;
    }

    public Response addCustomer(Customer customer) {
        Response resp = new Response();
        customerRepository.save(customer);
        resp.setMessage(String.valueOf(customer.getCustomerId()));
        return resp;
    }

    public Response getSkuByProduct(String name, String size, String color) {
        Response resp = new Response();
        Product product = productRepository.getSkuByProduct(name, size, color);
        Integer sku = product.getSku();
        resp.setMessage("" + sku);
        return resp;
    }

    public Response addPayment(Payment paymentRequest) {
        Response  resp = new Response();
        paymentRepository.save(paymentRequest);
        resp.setMessage("success");
        return resp;
    }

    public Response addShipping(Shipping shippingRequest) {
        Response  resp = new Response();
        shippingRepository.save(shippingRequest);
        resp.setMessage("" + shippingRequest.getShippingId());
        return resp;
    }

    public Response addOrder(Order orderRequest) {
        Response resp = new Response();
        orderRepository.save(orderRequest);
        resp.setMessage("success");
        return resp;
    }

    public List<Order> getAllOrders() {
        return (List<Order>) orderRepository.findAll();
    }

    public List<Order> getOrdersByStatus(String status) {
        return orderRepository.getOrderListByStatus(status);
    }

    public List<Customer> getAllCustomer() {
        return (List<Customer>) customerRepository.findAll();
    }

    @Transactional
    public Response updateProduct(Product product){
        Response response = new Response();
        productRepository.updateProduct(product.getPrice(), product.getQuantity(), product.getSku());
        response.setMessage("success");
        return response;
    }

    @Transactional
    public Response updateOrder(Order order){
        Response response = new Response();
        orderRepository.updateOrder(order.getStatus(), order.getOrderSk());
        response.setMessage("success");
        return response;
    }
}
