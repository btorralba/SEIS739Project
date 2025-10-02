package com.example.demo.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name="shipping", schema="seis739finalschema")
public class Shipping {
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    @Id
    @Column(name = "shipping_sk")
    private Integer shippingId;

    @Column(name = "address_line_1")
    private String addressLine1;

    @Column(name = "address_line_2")
    private String addressLine2;

    @Column(name = "address_line_3")
    private String addressLine3;

    @Column(name = "zip_code")
    private String zipCode;

    @Column(name = "zip_code_extension")
    private String zipCodeExtension;

    @Column(name = "city")
    private String city;

    @Column(name = "state_abbr")
    private String stateAbbr;

    @Column(name = "customer_sk")
    private String customerId;
}
