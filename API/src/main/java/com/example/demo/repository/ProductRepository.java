package com.example.demo.repository;

import com.example.demo.model.Product;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends CrudRepository<Product, String> {
    @Query("select p from Product p where p.sku = ?1")
    Product getProductBySKU(Integer sku);

    @Query("select p from Product p where p.productName = ?1")
    Product getProductByProductName(String productName);
}
