package com.unicorn.hywy.model.po;

import lombok.Data;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import java.util.Date;

@Data
@Entity(name = "pacts")
public class Pact {

    @Id
    private Long pactNo;

    @Column(name = "type_1")
    private String type1;

    @Column(name = "type_2")
    private Long type2;

    @Column(name = "type_3")
    private Long type3;

    @Column(name = "type_4")
    private Long type4;

    // 合同编号，用户输入
    private String serialNo;

    // 合同代码，系统生成
    private String pactNumber;

    @Column(name = "sign_a")
    private String signA;

    @Column(name = "sign_b")
    private String signB;

    @Column(name = "sign_c")
    private String signC;

    @Column(name = "sign_d")
    private String signD;

    @Column(name = "sign_date")
    private Date signDate;

    @Column(name = "sign_date2")
    private Date signDate2;

    private String name;

    private String subject;

    private Double pactSum;

    private Double auditSum;

    private Double balance;

    @Column(name = "transactor1")
    private String transactor1;

    @Column(name = "transactor2")
    private String transactor2;

    private String pagesNo;

    private String accCode;

    private String pactCode;

    private Character payFinish;

    private String remark;

    private String  queryNo;

    private Integer execState;

    private String pagesNum;

    private String drawingSize;

    @Column(name = "comp_a")
    private Long compA;

    @Column(name = "comp_b")
    private Long compB;

    @Column(name = "comp_c")
    private Long compC;

    @Column(name = "comp_d")
    private Long compD;

    private Character archDate;

    private Integer payType;

    private Integer payMode;

    private Double monthPay;

    private String payContent;
}