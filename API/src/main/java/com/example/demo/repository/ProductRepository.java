package com.example.demo.repository;

import com.example.demo.model.Product;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends CrudRepository<Product, String> {
    @Query("select p from Product p where p.sku = ?1")
    Product getProductBySKU(Integer sku);

    @Query("select p from Product p where p.productName = ?1")
    List<Product> getProductByProductName(String productName);

    @Query("select p from Product p where p.productName = ?1 and p.size = ?2 and p.color = ?3")
    Product getSkuByProduct(String productName, String size, String color);

    @Modifying
    @Query("update Product p set p.price = ?1, p.quantity = ?2 where p.sku = ?3")
    void updateProduct(Double price, Integer quantity, Integer sku);

}
