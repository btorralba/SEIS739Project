package com.example.demo.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "user", schema = "seis739finalschema")
public class User {
    @Id
    @Column(name = "user_id")
    private String userID;

    @Column(name = "user_pass")
    private String userPass;

    @Column(name = "customer_sk")
    private Integer customerId;
}
