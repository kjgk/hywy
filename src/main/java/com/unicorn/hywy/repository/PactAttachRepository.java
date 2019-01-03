package com.unicorn.hywy.repository;

import com.unicorn.hywy.model.po.PactAttach;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;
import org.springframework.data.repository.CrudRepository;

public interface PactAttachRepository extends CrudRepository<PactAttach, Long>, QuerydslPredicateExecutor<PactAttach> {

}