package com.unicorn.hywy.model.vo;

import lombok.*;

import java.io.Serializable;
import java.util.Date;
import java.util.List;

@Getter
@Setter
@ToString
public class PactInfo implements Serializable {

    private Long pactNo;

    private String serialNo;

    private String serialCode;

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

    private Date signDate3;

    private String transactor1;

    private String transactor2;

    private Integer execState;

    private String subject;

    private String remark;

    private String updateNote;

    private Integer payType;

    private Integer payMode;

    private Double pactSum;

    private Double auditSum;

    private Double balance;

    private Double monthPay;

    private String payContent;

    private Double prePercent;

    private List<PaymentTotal> payments;

    @Getter
    @Setter
    @ToString
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PaymentTotal implements Serializable {

        private String year;

        private Double total;
    }
}
