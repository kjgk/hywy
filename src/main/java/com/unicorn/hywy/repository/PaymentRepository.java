package com.unicorn.hywy.repository;

import com.unicorn.hywy.model.po.Payment;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;
import org.springframework.data.repository.CrudRepository;

public interface PaymentRepository extends CrudRepository<Payment, Long>, QuerydslPredicateExecutor<Payment> {

}