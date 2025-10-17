package com.example.demo.controller;

import com.example.demo.model.*;
import com.example.demo.model.response.Response;
import com.example.demo.service.ApiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.text.ParseException;
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

    @GetMapping("/orders")
    public ResponseEntity<List<Order>> getOrders(
            @RequestParam(value = "customerId", required = false) String customerId,
            @RequestParam(value = "sku", required = false) String sku
    ) {
        List<Order> orders = new ArrayList<Order>();
        if (customerId != null && !customerId.isBlank()) {
            Integer customerIdAsNum = Integer.parseInt(customerId);
            orders = apiService.getOrdersByCustomerId(customerIdAsNum);
        } else if (!sku.isBlank()) {
            Integer skuAsNum = Integer.parseInt(sku);
            orders = apiService.getOrdersBySku(skuAsNum);
        }
        return new ResponseEntity<>(orders, HttpStatus.OK);
    }

    @PostMapping("/add/product")
    public ResponseEntity<Response> addProduct(@RequestBody Product product) {
        Response response = apiService.addProduct(product);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
