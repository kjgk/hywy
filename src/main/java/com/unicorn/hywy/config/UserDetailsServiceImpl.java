package com.unicorn.hywy.config;

import com.unicorn.hywy.model.po.User;
import com.unicorn.hywy.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component(value = "userDetailsService")
public class UserDetailsServiceImpl implements UserDetailsService {

    @Autowired
    private UserService userService;

    @Override
    public UserDetails loadUserByUsername(String name) throws UsernameNotFoundException {

        User user = userService.getUserByMobile(name);
        if (user == null) {
            throw new UsernameNotFoundException("用户不存在!");
        }
        boolean enabled = false;
        if (user.getStatus().equals('0')) {
        } else if (user.getStatus().equals('1')) {
            enabled = true;
        } else if (user.getStatus().equals('2')) {
            throw new UsernameNotFoundException("用户已注册，但未通过审核!");
        }
        List<GrantedAuthority> authorities = new ArrayList();
        authorities.add(new SimpleGrantedAuthority("ROLE_USER"));
        return new org.springframework.security.core.userdetails.User(name, user.getPassword(), enabled
                , true, true, true, authorities);
    }
}
