package com.unicorn.hywy.model.vo;

import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;

@Getter
@Setter
public class RegisterInfo implements Serializable {

    private String phoneNo;

    private String verifyCode;

    private String password;
}
