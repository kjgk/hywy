package com.unicorn.hywy.repository;

import com.unicorn.hywy.model.po.PactSerial;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;
import org.springframework.data.repository.CrudRepository;

public interface PactSerialRepository extends CrudRepository<PactSerial, Long>, QuerydslPredicateExecutor<PactSerial> {

}