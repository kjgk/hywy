package com.unicorn.hywy.model.vo;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.io.Serializable;

@Getter
@Setter
@ToString
public class ContractInfo implements Serializable {

    protected Long projectId;

    protected String projectName;

    protected Integer category1;

    protected Integer category2;

    protected Integer category3;

    protected Integer category4;

    protected Integer total;
}
