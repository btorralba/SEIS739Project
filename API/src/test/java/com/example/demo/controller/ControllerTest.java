package com.example.demo.controller;

import com.example.demo.model.*;
import com.example.demo.model.response.Response;
import com.example.demo.service.ApiService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Collections;
import java.util.List;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.times;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(Controller.class)
class ControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ApiService apiService;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Test
    void login_returnsCustomerIdInResponse() throws Exception {
        User request = new User();
        request.setUserID("user1");
        request.setUserPass("pass");

        User returned = new User();
        returned.setCustomerId(123);
        Mockito.when(apiService.getUserByCreds("user1", "pass")).thenReturn(returned);

        mockMvc.perform(post("/api/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("123"));

        Mockito.verify(apiService, times(1)).getUserByCreds("user1", "pass");
    }

    @Test
    void getProducts_returnsList() throws Exception {
        Product p = new Product();
        Mockito.when(apiService.getAllProduct()).thenReturn(List.of(p));

        mockMvc.perform(get("/api/products"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0]").exists());

        Mockito.verify(apiService, times(1)).getAllProduct();
    }

    @Test
    void getCustomer_byId() throws Exception {
        Customer c = new Customer();
        Mockito.when(apiService.getCustomerById(10)).thenReturn(c);

        mockMvc.perform(get("/api/customer").param("customerID", "10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").exists());

        Mockito.verify(apiService, times(1)).getCustomerById(10);
    }

    @Test
    void getProduct_bySku() throws Exception {
        Product p = new Product();
        Mockito.when(apiService.getProductBySku(100)).thenReturn(p);

        mockMvc.perform(get("/api/product").param("sku", "100"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").exists());

        Mockito.verify(apiService, times(1)).getProductBySku(100);
    }

    @Test
    void getProduct_byName() throws Exception {
        Product p = new Product();
        Mockito.when(apiService.getProductByProductName("Widget")).thenReturn(p);

        mockMvc.perform(get("/api/product").param("productName", "Widget"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").exists());

        Mockito.verify(apiService, times(1)).getProductByProductName("Widget");
    }

    @Test
    void getOrders_byCustomerId() throws Exception {
        Order o = new Order();
        Mockito.when(apiService.getOrdersByCustomerId(5)).thenReturn(List.of(o));

        mockMvc.perform(get("/api/ordersByParam").param("customerId", "5"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0]").exists());

        Mockito.verify(apiService, times(1)).getOrdersByCustomerId(5);
    }

    @Test
    void getOrders_bySku() throws Exception {
        Order o = new Order();
        Mockito.when(apiService.getOrdersBySku(200)).thenReturn(List.of(o));

        mockMvc.perform(get("/api/ordersByParam").param("sku", "200"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0]").exists());

        Mockito.verify(apiService, times(1)).getOrdersBySku(200);
    }

    @Test
    void getOrders_byStatus_all() throws Exception {
        Order o = new Order();
        Mockito.when(apiService.getAllOrders()).thenReturn(List.of(o));

        mockMvc.perform(get("/api/ordersByParam").param("status", "*"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0]").exists());

        Mockito.verify(apiService, times(1)).getAllOrders();
    }

    @Test
    void getOrders_byStatus_specific() throws Exception {
        Order o = new Order();
        Mockito.when(apiService.getOrdersByStatus("SHIPPED")).thenReturn(List.of(o));

        mockMvc.perform(get("/api/ordersByParam").param("status", "SHIPPED"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0]").exists());

        Mockito.verify(apiService, times(1)).getOrdersByStatus("SHIPPED");
    }

    @Test
    void addProduct_endpoint() throws Exception {
        Product p = new Product();
        Response resp = new Response();
        resp.setMessage("added");
        Mockito.when(apiService.addProduct(any(Product.class))).thenReturn(resp);

        mockMvc.perform(post("/api/add/product")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(p)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("added"));

        Mockito.verify(apiService, times(1)).addProduct(any(Product.class));
    }

    @Test
    void addUser_endpoint() throws Exception {
        User u = new User();
        Response resp = new Response();
        resp.setMessage("userAdded");
        Mockito.when(apiService.addUser(any(User.class))).thenReturn(resp);

        mockMvc.perform(post("/api/add/user")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(u)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("userAdded"));

        Mockito.verify(apiService, times(1)).addUser(any(User.class));
    }

    @Test
    void addCustomer_endpoint() throws Exception {
        Customer c = new Customer();
        Response resp = new Response();
        resp.setMessage("customerAdded");
        Mockito.when(apiService.addCustomer(any(Customer.class))).thenReturn(resp);

        mockMvc.perform(post("/api/add/customer")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(c)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("customerAdded"));

        Mockito.verify(apiService, times(1)).addCustomer(any(Customer.class));
    }

    @Test
    void getSKU_endpoint() throws Exception {
        Response resp = new Response();
        resp.setMessage("sku123");
        Mockito.when(apiService.getSkuByProduct("Name", "L", "Red")).thenReturn(resp);

        mockMvc.perform(get("/api/product/sku")
                        .param("name", "Name")
                        .param("size", "L")
                        .param("color", "Red"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("sku123"));

        Mockito.verify(apiService, times(1)).getSkuByProduct("Name", "L", "Red");
    }

    @Test
    void addPayment_endpoint() throws Exception {
        Payment p = new Payment();
        Response resp = new Response();
        resp.setMessage("paymentOk");
        Mockito.when(apiService.addPayment(any(Payment.class))).thenReturn(resp);

        mockMvc.perform(post("/api/add/payment")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(p)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("paymentOk"));

        Mockito.verify(apiService, times(1)).addPayment(any(Payment.class));
    }

    @Test
    void addShipping_endpoint() throws Exception {
        Shipping s = new Shipping();
        Response resp = new Response();
        resp.setMessage("shipOk");
        Mockito.when(apiService.addShipping(any(Shipping.class))).thenReturn(resp);

        mockMvc.perform(post("/api/add/shipping")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(s)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("shipOk"));

        Mockito.verify(apiService, times(1)).addShipping(any(Shipping.class));
    }

    @Test
    void addOrder_endpoint() throws Exception {
        Order o = new Order();
        Response resp = new Response();
        resp.setMessage("orderOk");
        Mockito.when(apiService.addOrder(any(Order.class))).thenReturn(resp);

        mockMvc.perform(post("/api/add/order")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(o)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("orderOk"));

        Mockito.verify(apiService, times(1)).addOrder(any(Order.class));
    }

    @Test
    void getCustomers_returnsList() throws Exception {
        Customer c = new Customer();
        Mockito.when(apiService.getAllCustomer()).thenReturn(List.of(c));

        mockMvc.perform(get("/api/customers"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0]").exists());

        Mockito.verify(apiService, times(1)).getAllCustomer();
    }

    @Test
    void getShippingAddressByCustomerId_returnsFirst() throws Exception {
        Shipping s = new Shipping();
        Mockito.when(apiService.getShippingAddressesByCustomerId(7)).thenReturn(List.of(s));

        mockMvc.perform(get("/api/shippingAddressByCustomerId").param("customerID", "7"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").exists());

        Mockito.verify(apiService, times(1)).getShippingAddressesByCustomerId(7);
    }

    @Test
    void updateProduct_endpoint() throws Exception {
        Product p = new Product();
        Response resp = new Response();
        resp.setMessage("updated");
        Mockito.when(apiService.updateProduct(any(Product.class))).thenReturn(resp);

        mockMvc.perform(post("/api/update/product")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(p)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("updated"));

        Mockito.verify(apiService, times(1)).updateProduct(any(Product.class));
    }

    @Test
    void updateOrder_endpoint() throws Exception {
        Order o = new Order();
        Response resp = new Response();
        resp.setMessage("orderUpdated");
        Mockito.when(apiService.updateOrder(any(Order.class))).thenReturn(resp);

        mockMvc.perform(post("/api/update/order")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(o)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("orderUpdated"));

        Mockito.verify(apiService, times(1)).updateOrder(any(Order.class));
    }
}
