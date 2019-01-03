package com.unicorn.hywy.controller;

import com.unicorn.hywy.service.EnvironmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.FileCopyUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.io.FileInputStream;

import static com.unicorn.hywy.controller.ApiNamespace.API_V1;


@RestController
@RequestMapping(API_V1 + "/file/download")
public class FileDownloadController {

    @Autowired
    private EnvironmentService environmentService;

    @RequestMapping(method = RequestMethod.GET)
    public void download(HttpServletRequest request, HttpServletResponse response) throws Exception {

        String filename = request.getParameter("filename");
        String tempFilename = request.getParameter("tempFilename");
        String type = request.getParameter("type");
        String tempFilePath = environmentService.getTempPath() + '/' + tempFilename;
        File file = new File(tempFilePath);
        FileInputStream fileInputStream = new FileInputStream(file);

        response.setHeader("Content-Length", file.length() + "");
        if (filename != null) {
            response.setHeader("Content-Disposition", "filename=" + new String(filename.getBytes("GBK"), "ISO-8859-1"));
        }
        if ("image".equals(type)) {
            response.setContentType("image/jpg");
        } else {
            response.setContentType("application/octet-stream");
        }

        FileCopyUtils.copy(fileInputStream, response.getOutputStream());
        fileInputStream.close();
        response.getOutputStream().flush();
        response.getOutputStream().close();
    }
}
