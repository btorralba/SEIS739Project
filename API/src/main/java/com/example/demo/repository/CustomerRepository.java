package com.example.demo.repository;

import com.example.demo.model.Customer;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface CustomerRepository extends CrudRepository<Customer, Integer> {
    @Query("select c from Customer c where customerId = ?1")
    Customer getCustomerByID(Integer customerId);
}
