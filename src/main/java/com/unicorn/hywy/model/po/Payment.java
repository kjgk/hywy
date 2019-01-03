package com.unicorn.hywy.model.po;

import lombok.Data;

import javax.persistence.Entity;
import javax.persistence.Id;
import java.util.Date;

@Data
@Entity(name = "payment")
public class Payment {

    @Id
    private Long payNo;

    private Long pactNo;

    private Date payDate;

    private Double payCount;

    private String warrant;

    private Double invCount;

    private String remark;
}