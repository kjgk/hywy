package com.unicorn.hywy.model.po;

import lombok.Data;

import javax.persistence.Entity;
import javax.persistence.Id;

@Data
@Entity(name = "pact_serial")
public class PactSerial {

    @Id
    private Long id;

    private Long currentNo;

}