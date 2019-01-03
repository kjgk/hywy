package com.unicorn.hywy;

import com.unicorn.hywy.model.po.User;
import com.unicorn.hywy.repository.UserRepository;
import com.unicorn.hywy.security.PasswordEncoder;
import com.unicorn.hywy.utils.SnowflakeIdWorker;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@Slf4j
class Runner {

    @Bean
    CommandLineRunner run(
            UserRepository userRepository
            , SnowflakeIdWorker idWorker
            , PasswordEncoder passwordEncoder
    ) {
        return args -> {

            User user = new User();
            user.setId(idWorker.nextId() + "");
            user.setMobile("13512345678");
            user.setName("张三");
            user.setPassword(passwordEncoder.encode("111"));
//            userRepository.save(user);
        };
    }
}