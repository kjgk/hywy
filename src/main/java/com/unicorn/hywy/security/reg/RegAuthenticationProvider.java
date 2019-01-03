package com.unicorn.hywy.security.reg;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Component;


@Component
public class RegAuthenticationProvider implements AuthenticationProvider {

    @Autowired
    private UserDetailsService userDetailsService;

    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {

        RegAuthenticationToken regAuthenticationToken = (RegAuthenticationToken) authentication;
        UserDetails userDetails = userDetailsService.loadUserByUsername(regAuthenticationToken.getRegisterInfo().getPhoneNo());
        RegAuthenticationToken authenticationToken = new RegAuthenticationToken(userDetails, userDetails.getAuthorities());
        authenticationToken.setAuthenticated(true);
        return authenticationToken;
    }

    @Override
    public boolean supports(Class<?> aClass) {

        return RegAuthenticationToken.class == aClass;
    }
}
