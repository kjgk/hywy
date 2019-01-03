package com.unicorn.hywy.controller;

import com.unicorn.hywy.service.EnvironmentService;
import com.unicorn.hywy.utils.FileTypeUtils;
import com.unicorn.hywy.utils.ThumbnailUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.Base64Utils;
import org.springframework.util.FileCopyUtils;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.io.FileInputStream;

import static com.unicorn.hywy.controller.ApiNamespace.API_V1;


@RestController
@RequestMapping(API_V1 + "/attachment")
public class AttachmentController {

    @Autowired
    private EnvironmentService environmentService;

    @RequestMapping(value = "/{tag}", method = RequestMethod.GET)
    public void download(HttpServletResponse response, @PathVariable String tag) throws Exception {

        File file;
        if (StringUtils.isEmpty(tag)) {
            return;
        }

        String image, convert = null;
        if (tag.contains("!")) {
            image = tag.split("!")[0];
            convert = tag.split("!")[1];
        } else {
            image = tag;
        }
        if (StringUtils.isEmpty(image)) {
            return;
        }

        file = new File(environmentService.getUploadPath() + new String(Base64Utils.decode(image.getBytes())));

        if (!file.exists() || file.isDirectory()) {
            return;
        }

        response.setContentType("image/jpeg");

        if (convert != null && convert.indexOf("_") > 0) {
            ThumbnailUtils.process(file, Integer.parseInt(convert.split("_")[0]), Integer.parseInt(convert.split("_")[1]), response.getOutputStream());
            response.getOutputStream().close();
            return;
        }
        if ("thumbnail".equals(convert)) {
            ThumbnailUtils.process(file, 100, 75, response.getOutputStream());
            response.getOutputStream().close();
            return;
        }

        String fileType = FileTypeUtils.getImageFileType(file);
        if ("png".equals(fileType)) {
            response.setContentType("image/png");
        }
        if ("gif".equals(fileType)) {
            response.setContentType("image/gif");
        }
        response.setHeader("Content-Length", file.length() + "");
        FileCopyUtils.copy(new FileInputStream(file), response.getOutputStream());
    }
}
