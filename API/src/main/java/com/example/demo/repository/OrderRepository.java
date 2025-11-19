package com.example.demo.repository;

import com.example.demo.model.Order;
import com.example.demo.model.Shipping;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

public interface OrderRepository  extends CrudRepository<Order, String>{
    @Query("select o from Order o where o.customerId = ?1")
    List<Order> getOrderListByCustomerId(Integer customerId);

    @Query("select o from Order o where o.sku = ?1")
    List<Order> getOrderListBySKU(Integer sku);

    @Query("select o from Order o where o.status = ?1")
    List<Order> getOrderListByStatus(String status);

    @Modifying
    @Query("update Order o set o.status = ?1 where o.orderSk = ?2")
    void updateOrder(String status, Integer orderSk);

}