package com.example.demo.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "order", schema = "seis739finalschema")
public class Order {
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    @Id
    @Column(name = "order_sk")
    private String orderId;

    @Column(name = "sku")
    private Integer sku;

    @Column(name = "status")
    private String status;

    @Column(name = "shipping_sk")
    private Integer shippingId;

    @Column(name = "customer_sk")
    private Integer customerId;
}
