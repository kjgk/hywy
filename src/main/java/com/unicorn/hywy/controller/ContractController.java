package com.unicorn.hywy.controller;

import com.unicorn.hywy.model.po.Pact;
import com.unicorn.hywy.model.po.PactAttach;
import com.unicorn.hywy.model.po.Payment;
import com.unicorn.hywy.model.vo.*;
import com.unicorn.hywy.service.ContractService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static com.unicorn.hywy.controller.ApiNamespace.API_V1;

@RestController
@RequestMapping(API_V1 + "/contract")
public class ContractController extends BaseController {

    private final ContractService contractService;

    ContractController(ContractService contractService) {
        this.contractService = contractService;
    }

    @GetMapping
    Page<ContractInfo> queryContractInfo(Pageable page, String keyword) {

        return contractService.queryContractInfo(keyword, page);
    }

    @GetMapping("/pact")
    Iterable<Pact> getPactList(Long projectId, String categoryId) {

        return contractService.getPactList(projectId, categoryId);
    }

    @PostMapping("/pact")
    Pact createPact(@RequestBody Pact pact) {

        return contractService.createPact(pact);
    }

    @PatchMapping("/pact/{id}")
    Pact updatePact(@RequestBody Pact pact, @PathVariable Long id) {

        pact.setPactNo(id);
        return contractService.updatePact(pact);
    }

    @DeleteMapping("/pact/{id}")
    void removePact(@PathVariable Long id) {
        contractService.removePact(id);
    }

    @GetMapping("/pact/{id}")
    Pact getPact(@PathVariable Long id) {

        return contractService.getPact(id);
    }

    @GetMapping("/pact/{id}/detail")
    PactInfo getPactInfo(@PathVariable Long id) {

        return contractService.getPactInfo(id);
    }

    @PostMapping("/payment")
    Payment createPayment(@RequestBody Payment payment) {

        return contractService.createPayment(payment);
    }

    @PatchMapping("/payment/{id}")
    Payment updatePayment(@RequestBody Payment payment, @PathVariable Long id) {

        payment.setPayNo(id);
        return contractService.updatePayment(payment);
    }

    @DeleteMapping("/payment/{id}")
    void removePayment(@PathVariable Long id) {
        contractService.removePayment(id);
    }

    @GetMapping("/payment")
    Page<Payment> queryPayment(Pageable page, Long pactNo) {

        return contractService.queryPayment(pactNo, page);
    }

    @GetMapping("/payment/{id}/detail")
    PaymentInfo getPaymentInfo(@PathVariable Long id) {

        return contractService.getPaymentInfo(id);
    }

    @PostMapping("/attach")
    void createPactAttach(@RequestBody PactAttaches pactAttaches) {

        contractService.createPactAttaches(pactAttaches);
    }

    @DeleteMapping("/attach/{id}")
    void removePactAttach(@PathVariable Long id) {
        contractService.removePactAttach(id);
    }

    @GetMapping("/attach")
    Page<PactAttach> queryPactAttach(Pageable page, Long pactNo) {

        return contractService.queryPactAttach(pactNo, page);
    }

    @GetMapping("/accCode")
    List<BasicInfo> getAccCode() {

        return contractService.getAccCode();
    }
}