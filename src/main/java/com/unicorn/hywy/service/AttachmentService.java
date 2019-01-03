package com.unicorn.hywy.service;

import org.springframework.stereotype.Component;
import org.springframework.util.Base64Utils;

import static com.unicorn.hywy.controller.ApiNamespace.API_V1;

@Component
public class AttachmentService {

    AttachmentService() {

    }

    public String buildDownloadUrl(String uploadFilename) {

        return API_V1 + "/attachment/" + Base64Utils.encodeToString(uploadFilename.getBytes());
    }
}
