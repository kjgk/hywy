package com.unicorn.hywy.repository;

import com.unicorn.hywy.model.po.User;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;
import org.springframework.data.repository.CrudRepository;

public interface UserRepository extends CrudRepository<User, Long>, QuerydslPredicateExecutor<User> {

    User findByMobile(String mobile);
}