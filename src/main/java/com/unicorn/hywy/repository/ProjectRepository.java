package com.unicorn.hywy.repository;

import com.unicorn.hywy.model.po.Project;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;
import org.springframework.data.repository.CrudRepository;

public interface ProjectRepository extends CrudRepository<Project, Long>, QuerydslPredicateExecutor<Project> {

}