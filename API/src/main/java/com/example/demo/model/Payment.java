package com.example.demo.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name="payment", schema="seis739finalschema")
public class Payment {
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    @Id
    @Column(name = "payment_sk")
    private Integer paymentId;

    @Column(name = "customer_sk")
    private Integer customerId;

    @Column(name = "card_number")
    private String cardNumber;

    @Column(name = "expiration_mm_yy")
    private String expiration;

    @Column(name = "cvv")
    private String cvv;
}
