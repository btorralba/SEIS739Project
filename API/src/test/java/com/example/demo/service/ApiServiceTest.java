package com.example.demo.service;

import com.example.demo.model.*;
import com.example.demo.model.response.Response;
import com.example.demo.repository.*;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ApiServiceTest {

    @Mock
    private ShippingRepository shippingRepository;

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private ProductRepository productRepository;

    @Mock
    private CustomerRepository customerRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private PaymentRepository paymentRepository;

    @InjectMocks
    private ApiService apiService;

    @Test
    void getAllProduct_returnsList() {
        Product p = new Product();
        when(productRepository.findAll()).thenReturn(List.of(p));

        var result = apiService.getAllProduct();

        assertEquals(1, result.size());
        assertSame(p, result.get(0));
        verify(productRepository, times(1)).findAll();
    }

    @Test
    void getCustomerById_returnsCustomer() {
        Customer c = new Customer();
        when(customerRepository.getCustomerByID(10)).thenReturn(c);

        var result = apiService.getCustomerById(10);

        assertSame(c, result);
        verify(customerRepository).getCustomerByID(10);
    }

    @Test
    void getOrdersByCustomerId_returnsList() {
        Order o = new Order();
        when(orderRepository.getOrderListByCustomerId(5)).thenReturn(List.of(o));

        var result = apiService.getOrdersByCustomerId(5);

        assertEquals(1, result.size());
        assertSame(o, result.get(0));
        verify(orderRepository).getOrderListByCustomerId(5);
    }

    @Test
    void getOrdersBySku_returnsList() {
        Order o = new Order();
        when(orderRepository.getOrderListBySKU(200)).thenReturn(List.of(o));

        var result = apiService.getOrdersBySku(200);

        assertEquals(1, result.size());
        verify(orderRepository).getOrderListBySKU(200);
    }

    @Test
    void getProductBySku_returnsProduct() {
        Product p = new Product();
        when(productRepository.getProductBySKU(100)).thenReturn(p);

        var result = apiService.getProductBySku(100);

        assertSame(p, result);
        verify(productRepository).getProductBySKU(100);
    }

    @Test
    void getProductByProductName_returnsFirstProduct() {
        Product p = new Product();
        when(productRepository.getProductByProductName("Widget")).thenReturn(List.of(p));

        var result = apiService.getProductByProductName("Widget");

        assertSame(p, result);
        verify(productRepository).getProductByProductName("Widget");
    }

    @Test
    void getShippingAddressesByCustomerId_returnsList() {
        Shipping s = new Shipping();
        when(shippingRepository.getShippingAddressListByCustomerId(7)).thenReturn(List.of(s));

        var result = apiService.getShippingAddressesByCustomerId(7);

        assertEquals(1, result.size());
        verify(shippingRepository).getShippingAddressListByCustomerId(7);
    }

    @Test
    void getUserByCreds_returnsUser() {
        User u = new User();
        when(userRepository.getUserByCreds("user", "pass")).thenReturn(u);

        var result = apiService.getUserByCreds("user", "pass");

        assertSame(u, result);
        verify(userRepository).getUserByCreds("user", "pass");
    }

    @Test
    void addProduct_savesAndReturnsSuccess() {
        Product p = new Product();
        Response resp = apiService.addProduct(p);

        assertEquals("success", resp.getMessage());
        verify(productRepository).save(p);
    }

    @Test
    void addUser_savesAndReturnsCustomerIdMessage() {
        User u = new User();
        u.setCustomerId(42);
        Response resp = apiService.addUser(u);

        assertEquals("42", resp.getMessage());
        verify(userRepository).save(u);
    }

    @Test
    void addCustomer_savesAndReturnsCustomerIdMessage() {
        Customer c = new Customer();
        c.setCustomerId(77);
        Response resp = apiService.addCustomer(c);

        assertEquals("77", resp.getMessage());
        verify(customerRepository).save(c);
    }

    @Test
    void getSkuByProduct_returnsSkuInResponse() {
        Product p = new Product();
        p.setSku(123);
        when(productRepository.getSkuByProduct("Name", "L", "Red")).thenReturn(p);

        Response resp = apiService.getSkuByProduct("Name", "L", "Red");

        assertEquals("123", resp.getMessage());
        verify(productRepository).getSkuByProduct("Name", "L", "Red");
    }

    @Test
    void addPayment_savesAndReturnsSuccess() {
        Payment payment = new Payment();
        Response resp = apiService.addPayment(payment);

        assertEquals("success", resp.getMessage());
        verify(paymentRepository).save(payment);
    }

    @Test
    void addShipping_savesAndReturnsShippingId() {
        Shipping s = new Shipping();
        s.setShippingId(99);
        Response resp = apiService.addShipping(s);

        assertEquals("99", resp.getMessage());
        verify(shippingRepository).save(s);
    }

    @Test
    void addOrder_savesAndReturnsSuccess() {
        Order o = new Order();
        Response resp = apiService.addOrder(o);

        assertEquals("success", resp.getMessage());
        verify(orderRepository).save(o);
    }

    @Test
    void getAllOrders_returnsList() {
        Order o = new Order();
        when(orderRepository.findAll()).thenReturn(List.of(o));

        var result = apiService.getAllOrders();

        assertEquals(1, result.size());
        verify(orderRepository).findAll();
    }

    @Test
    void getOrdersByStatus_returnsList() {
        Order o = new Order();
        when(orderRepository.getOrderListByStatus("SHIPPED")).thenReturn(List.of(o));

        var result = apiService.getOrdersByStatus("SHIPPED");

        assertEquals(1, result.size());
        verify(orderRepository).getOrderListByStatus("SHIPPED");
    }

    @Test
    void getAllCustomer_returnsList() {
        Customer c = new Customer();
        when(customerRepository.findAll()).thenReturn(List.of(c));

        var result = apiService.getAllCustomer();

        assertEquals(1, result.size());
        verify(customerRepository).findAll();
    }

    @Test
    void updateProduct_callsRepositoryAndReturnsSuccess() {
        Product p = new Product();
        p.setPrice(new Double(9.99));
        p.setQuantity(5);
        p.setSku(555);

        Response resp = apiService.updateProduct(p);

        assertEquals("success", resp.getMessage());
        verify(productRepository).updateProduct(p.getPrice(), p.getQuantity(), p.getSku());
    }

    @Test
    void updateOrder_callsRepositoryAndReturnsSuccess() {
        Order o = new Order();
        o.setStatus("SHIPPED");
        o.setOrderSk(888);

        Response resp = apiService.updateOrder(o);

        assertEquals("success", resp.getMessage());
        verify(orderRepository).updateOrder(o.getStatus(), o.getOrderSk());
    }
}