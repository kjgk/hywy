package com.unicorn.hywy.model.po;

import lombok.Data;

import javax.persistence.*;

@Data
@Entity(name = "tbl_users")
public class User {

    @Id
    @Column(name = "userid")
    private String id;

    private String name;

    private String mobile;

    @Column(name = "pass")
    private String password;

    private String odby;

    private String project;

    private Character status;

}