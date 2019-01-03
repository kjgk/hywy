package com.unicorn.hywy.model.vo;

import lombok.Data;

import java.util.List;

@Data
public class PactAttaches {

    private Long pactNo;

    private List<FileUploadInfo> fileList;
}