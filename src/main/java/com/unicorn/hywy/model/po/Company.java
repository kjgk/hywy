package com.unicorn.hywy.model.po;

import lombok.Data;

import javax.persistence.*;

@Data
@Entity(name = "company")
public class Company {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "comp_no")
    private Long id;

    @Column(name = "comp_name")
    private String name;

    @Column(name = "comp_alias")
    private String alias;

    @Column(name = "comp_status")
    private String status;
}