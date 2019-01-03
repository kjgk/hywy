package com.unicorn.hywy.service;

import com.unicorn.hywy.model.po.User;
import com.unicorn.hywy.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;

@Service
@Transactional
public class UserService {

    private final UserRepository repository;

    UserService(UserRepository repository) {
        this.repository = repository;
    }

    public User getUserByMobile(String mobile) {

        return repository.findByMobile(mobile);
    }

    public User getCurrentUser() {

        String name = SecurityContextHolder.getContext().getAuthentication().getName();
        if (name.equals("anonymousUser")) {
            return null;
        }
        return getUserByMobile(name);
    }
}
