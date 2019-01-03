package com.unicorn.hywy.controller;

import com.querydsl.core.types.dsl.BooleanExpression;
import com.unicorn.hywy.model.po.Company;
import com.unicorn.hywy.model.po.QCompany;
import com.unicorn.hywy.repository.CompanyRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import javax.persistence.EntityNotFoundException;

import static com.unicorn.hywy.controller.ApiNamespace.API_V1;

@RestController
@RequestMapping(API_V1 + "/company")
public class CompanyController {

    private final CompanyRepository repository;

    CompanyController(CompanyRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    Page<Company> page(Pageable page, String keyword) {

        QCompany company = QCompany.company;
        BooleanExpression expression = company.status.eq("1");
        if (!StringUtils.isEmpty(keyword)) {
            expression = expression.and(company.name.contains(keyword));
        }
        return repository.findAll(expression, page);
    }

    @GetMapping("/list")
    Iterable<Company> getCompanyList() {

        return repository.findAll(QCompany.company.status.eq("1"));
    }

    @GetMapping("/{id}")
    Company get(@PathVariable Long id) {

        return repository.findById(id).orElseThrow(() -> new EntityNotFoundException(Company.class.getName() + "#" + id));
    }

    @PostMapping
    Company create(@RequestBody Company company) {

        company.setStatus("1");
        return repository.save(company);
    }

    @PatchMapping("/{id}")
    Company update(@RequestBody Company company, @PathVariable Long id) {

        return repository.findById(id)
                .map(current -> {
                    current.setName(company.getName());
                    current.setAlias(company.getAlias());
                    return repository.save(current);
                })
                .orElse(null);
    }

    @DeleteMapping("/{id}")
    void remove(@PathVariable Long id) {
        repository.findById(id)
                .map(current -> {
                    current.setStatus("0");
                    return repository.save(current);
                });
    }
}