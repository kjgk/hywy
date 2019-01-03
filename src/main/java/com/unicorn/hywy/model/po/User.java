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

    @Column(name = "odby")
    private String odby;

    @Column(name = "project")
    private String project;

}