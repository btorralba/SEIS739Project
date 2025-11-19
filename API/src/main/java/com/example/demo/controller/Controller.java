package com.example.demo.controller;

import com.example.demo.model.*;
import com.example.demo.model.response.Response;
import com.example.demo.service.ApiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class Controller {
    @Autowired
    private ApiService apiService;

    @PostMapping("/login")
    public ResponseEntity<Response> login(@RequestBody User user) {
        User customer = apiService.getUserByCreds(user.getUserID(), user.getUserPass());
        Response response = new Response();
        response.setMessage(String.valueOf(customer.getCustomerId()));
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/products")
    public ResponseEntity<List<Product>> getProducts() {
        List<Product> productList = apiService.getAllProduct();
        return new ResponseEntity<>(productList, HttpStatus.OK);
    }

    @GetMapping("/customer")
    public ResponseEntity<Customer> getCustomer(
            @RequestParam(value = "customerID") Integer customerId
    ) {
        Customer customer = apiService.getCustomerById(customerId);
        return new ResponseEntity<>(customer, HttpStatus.OK);
    }

    @GetMapping("/product")
    public ResponseEntity<Product> getProduct(
            @RequestParam(value = "sku", required = false) String sku,
            @RequestParam(value = "productName", required = false) String productName
    ) {
        Product product = new Product(); 
        if (sku != null && !sku.isBlank()) {
            Integer skuAsNum = Integer.parseInt(sku);
            product = apiService.getProductBySku(skuAsNum);
        } else if (!productName.isBlank()) {
            product = apiService.getProductByProductName(productName);
        }
        return new ResponseEntity<>(product, HttpStatus.OK);
    }

    @GetMapping("/ordersByParam")
    public ResponseEntity<List<Order>> getOrders(
            @RequestParam(value = "customerId", required = false) String customerId,
            @RequestParam(value = "sku", required = false) String sku,
            @RequestParam(value = "status", required = false) String status
    ) {
        List<Order> orders = new ArrayList<Order>();
        if (customerId != null && !customerId.isBlank()) {
            Integer customerIdAsNum = Integer.parseInt(customerId);
            orders = apiService.getOrdersByCustomerId(customerIdAsNum);
        } else if (sku != null && !sku.isBlank()) {
            Integer skuAsNum = Integer.parseInt(sku);
            orders = apiService.getOrdersBySku(skuAsNum);
        } else if (!status.isBlank()) {
            if (status.equals("*")) {
                orders = apiService.getAllOrders();
            } else {
                orders = apiService.getOrdersByStatus(status);
            }
        }
        return new ResponseEntity<>(orders, HttpStatus.OK);
    }

    @PostMapping("/add/product")
    public ResponseEntity<Response> addProduct(@RequestBody Product product) {
        Response response = apiService.addProduct(product);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping("/add/user")
    public ResponseEntity<Response> addProduct(@RequestBody User user) {
        Response response = apiService.addUser(user);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping("/add/customer")
    public ResponseEntity<Response> addProduct(@RequestBody Customer customer) {
        Response response = apiService.addCustomer(customer);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/product/sku")
    public ResponseEntity<Response> getSKU(
            @RequestParam String name,
            @RequestParam String size,
            @RequestParam String color
    ) {
        Response response = apiService.getSkuByProduct(name, size, color);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping("/add/payment")
    public ResponseEntity<Response> addPayment(
            @RequestBody Payment request
    ) {
        Response response = apiService.addPayment(request);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping("/add/shipping")
    public ResponseEntity<Response> addShipping(
            @RequestBody Shipping request
    ) {
        Response response = apiService.addShipping(request);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping("/add/order")
    public ResponseEntity<Response> addOrder(
            @RequestBody Order request
    ) {
        Response response = apiService.addOrder(request);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/customers")
    public ResponseEntity<List<Customer>> getCustomers() {
        List<Customer> customerList = apiService.getAllCustomer();
        return new ResponseEntity<>(customerList, HttpStatus.OK);
    }

    @GetMapping("/shippingAddressByCustomerId")
    public ResponseEntity<Shipping> getShippingAddressByCustomerId(
            @RequestParam (value = "customerID") Integer customerID
    ) {
        Shipping resp = apiService.getShippingAddressesByCustomerId(customerID).get(0);
        return new ResponseEntity<>(resp, HttpStatus.OK);
    }

    @PostMapping("/update/product")
    public ResponseEntity<Response> updateProduct(
            @RequestBody Product product
    ) {
        Response resp = apiService.updateProduct(product);
        return new ResponseEntity<>(resp, HttpStatus.OK);
    }

    @PostMapping("/update/order")
    public ResponseEntity<Response> updateOrder(
            @RequestBody Order order
    ) {
        Response resp = apiService.updateOrder(order);
        return new ResponseEntity<>(resp, HttpStatus.OK);
    }
}
