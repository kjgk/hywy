package com.unicorn.hywy.model.po;

import lombok.Data;

import javax.persistence.Entity;
import javax.persistence.Id;
import java.util.Date;

@Data
@Entity(name = "tbl_attach")
public class PactAttach {

    @Id
    private Long attachNo;

    private Long pactNo;

    private String filename;

    private String uploadFilename;

    private Date uploadTime;

    private Character status;
}