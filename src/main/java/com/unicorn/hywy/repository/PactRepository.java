package com.unicorn.hywy.repository;

import com.unicorn.hywy.model.po.Pact;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;
import org.springframework.data.repository.CrudRepository;

public interface PactRepository extends CrudRepository<Pact, Long>, QuerydslPredicateExecutor<Pact> {

}