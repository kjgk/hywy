package com.unicorn.hywy.model.vo;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.io.Serializable;
import java.util.Date;

@Getter
@Setter
@ToString
public class PactInfo implements Serializable {

    private Long pactNo;

    private String serialNo;

    private String pactNumber;

    private String name;

    private String projectName;

    private Long projectNo;

    private String categoryNo;

    private String signA;

    private String signB;

    private String signC;

    private String signD;

    private Date signDate;

    private Date signDate2;

    private String transactor1;

    private String transactor2;

    private Integer execState;

    private String subject;

    private String remark;

    private Integer payType;

    private Integer payMode;

    private Double pactSum;

    private Double auditSum;

    private Double balance;

}
