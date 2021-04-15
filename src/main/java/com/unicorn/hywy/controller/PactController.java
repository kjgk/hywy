package com.unicorn.hywy.controller;

import com.unicorn.hywy.model.po.Pact;
import com.unicorn.hywy.model.po.PactAttach;
import com.unicorn.hywy.model.po.Payment;
import com.unicorn.hywy.model.vo.PactAttaches;
import com.unicorn.hywy.model.vo.PactInfo;
import com.unicorn.hywy.model.vo.PaymentInfo;
import com.unicorn.hywy.service.EnvironmentService;
import com.unicorn.hywy.service.PactService;
import com.unicorn.hywy.utils.FileTypeUtils;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import javax.servlet.http.HttpServletResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.util.FileCopyUtils;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import static com.unicorn.hywy.controller.ApiNamespace.API_V1;

@RestController
@RequestMapping({API_V1 + "/pact"})
public class PactController extends BaseController {

    private final PactService pactService;

    private final EnvironmentService environmentService;

    PactController(PactService pactService, EnvironmentService environmentService) {
        this.pactService = pactService;
        this.environmentService = environmentService;
    }

    @GetMapping
    Page<PactInfo> queryPactInfo(Pageable page, String keyword, Long projectId, Integer execState) {
        return this.pactService.queryPactInfo(keyword, projectId, execState, page);
    }

    @PostMapping
    Pact createPact(@RequestBody Pact pact) {
        return this.pactService.createPact(pact);
    }

    @PatchMapping({"/{id}"})
    Pact updatePact(@RequestBody Pact pact, @PathVariable Long id) {
        pact.setPactNo(id);
        return this.pactService.updatePact(pact);
    }

    @DeleteMapping({"/{id}"})
    void removePact(@PathVariable Long id) {
        this.pactService.removePact(id);
    }

    @GetMapping({"/{id}"})
    Pact getPact(@PathVariable Long id) {
        return this.pactService.getPact(id);
    }

    @GetMapping({"/{id}/detail"})
    PactInfo getPactInfo(@PathVariable Long id) {
        return this.pactService.getPactInfo(id, true);
    }

    @GetMapping({"/{id}/payment"})
    Iterable<Payment> getPaymentList(@PathVariable Long id) {
        return this.pactService.getPaymentList(id);
    }

    @GetMapping({"/payment"})
    Page<PactInfo> queryPaymentInfo(Pageable page, String keyword, Integer payType) {
        return this.pactService.queryPaymentInfo(keyword, payType, page);
    }

    @PostMapping({"/payment"})
    Payment createPayment(@RequestBody Payment payment) {
        return this.pactService.createPayment(payment);
    }

    @PatchMapping({"/payment/{id}"})
    Payment updatePayment(@RequestBody Payment payment, @PathVariable Long id) {
        payment.setPayNo(id);
        return this.pactService.updatePayment(payment);
    }

    @DeleteMapping({"/payment/{id}"})
    void removePayment(@PathVariable Long id) {
        this.pactService.removePayment(id);
    }

    @GetMapping({"/payment/{id}/detail"})
    PaymentInfo getPaymentInfo(@PathVariable Long id) {
        return this.pactService.getPaymentInfo(id);
    }

    @PostMapping({"/attach"})
    void createPactAttach(@RequestBody PactAttaches pactAttaches) {
        this.pactService.createPactAttaches(pactAttaches);
    }

    @DeleteMapping({"/attach/{id}"})
    void removePactAttach(@PathVariable Long id) {
        this.pactService.removePactAttach(id);
    }

    @GetMapping({"/attach/{id}/download"})
    void downloadPactAttach(@PathVariable Long id, HttpServletResponse response) throws IOException {
        PactAttach pactAttach = this.pactService.getPactAttach(id);
        if (pactAttach != null) {
            File file = new File(this.environmentService.getUploadPath() + pactAttach.getUploadFilename());
            if (file.exists() && !file.isDirectory()) {
                if (FileTypeUtils.isImage(file)) {
                    response.setContentType("image/jpeg");
                    String fileType = FileTypeUtils.getImageFileType(file);
                    if ("png".equals(fileType)) {
                        response.setContentType("image/png");
                    }

                    if ("gif".equals(fileType)) {
                        response.setContentType("image/gif");
                    }
                } else if (pactAttach.getFilename().toLowerCase().endsWith(".pdf")) {
                    response.setContentType("application/pdf");
                } else {
                    response.setContentType("application/octet-stream");
                }

                response.setHeader("Content-Length", file.length() + "");
                response.setHeader("Content-Disposition", "attachment;filename=" + new String(pactAttach.getFilename().getBytes("GBK"), "ISO8859-1"));
                FileCopyUtils.copy(new FileInputStream(file), response.getOutputStream());
            }
        }
    }

    @GetMapping({"/{id}/attach"})
    Iterable<PactAttach> getPactAttachList(@PathVariable Long id) {
        return this.pactService.getPactAttachList(id);
    }
}
