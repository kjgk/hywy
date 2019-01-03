package com.unicorn.hywy.repository;

import com.unicorn.hywy.model.po.Company;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;
import org.springframework.data.repository.CrudRepository;

public interface CompanyRepository extends CrudRepository<Company, Long>, QuerydslPredicateExecutor<Company> {

}