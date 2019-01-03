package com.unicorn.hywy.model.vo;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.io.Serializable;
import java.util.Date;

@Getter
@Setter
@ToString
public class PaymentInfo implements Serializable {

    private Long pactNo;

    private String serialNo;

    private String pactNumber;

    private String pactName;

    private String projectName;

    private String signA;

    private String signB;

    private String signC;

    private String signD;

    private Double pactSum;

    private Double auditSum;

    private Double balance;

    private Double payCount;

    private Date payDate;

    private String warrant;

    private String remark;
}
