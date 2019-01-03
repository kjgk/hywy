package com.unicorn.hywy.service;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@Setter
@ConfigurationProperties(prefix = "environment")
public class EnvironmentService {

    @Getter
    private EnvironmentService.Path path;

    @Getter
    private EnvironmentService.Sms sms;

    public String getTempPath() {
        return path.getTemp();
    }

    public String getUploadPath() {
        return path.getUpload();
    }


    @Getter
    @Setter
    public static class Path {

        private String temp = "./temp";

        private String upload = "./upload";

        public Path() {
        }
    }

    @Getter
    @Setter
    public static class Sms {

        private String url;

        private String accountSid;

        private String authToken;

        private String templateId;

        public Sms() {
        }
    }

}


