package com.example.demo.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "user", schema = "seis739finalschema")
public class User {
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    @Id
    @Column(name = "customer_sk")
    private Integer customerId;

    @Column(name = "user_pass")
    private String userPass;

    @Column(name = "user_id")
    private String userID;

}
