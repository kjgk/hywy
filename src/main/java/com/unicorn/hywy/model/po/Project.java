package com.unicorn.hywy.model.po;

import lombok.Data;

import javax.persistence.*;

@Data
@Entity(name = "tbl_project")
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "projetcid")
    private Long id;

    private String name;

    @Column(name = "p_logo")
    private String logo;

    private String sort;

    private Character status;
}