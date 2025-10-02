package com.example.demo.repository;

import com.example.demo.model.Shipping;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ShippingRepository extends CrudRepository<Shipping, String> {
    @Query("select s from Shipping s where s.customerId = ?1")
    List<Shipping> getShippingAddressListByCustomerId(Integer customerId);
}
