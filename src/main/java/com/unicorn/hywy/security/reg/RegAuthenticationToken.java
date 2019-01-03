package com.unicorn.hywy.security.reg;

import com.unicorn.hywy.model.vo.RegisterInfo;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;

import java.util.Collection;


public class RegAuthenticationToken extends AbstractAuthenticationToken {

    private final Object principal;

    private RegisterInfo registerInfo;

    public RegAuthenticationToken(RegisterInfo registerInfo) {

        super(null);
        this.registerInfo = registerInfo;
        this.principal = registerInfo;
    }

    public RegAuthenticationToken(Object principal, Collection<? extends GrantedAuthority> authorities) {

        super(authorities);
        this.principal = principal;
    }

    @Override
    public Object getCredentials() {

        return null;
    }

    @Override
    public Object getPrincipal() {

        return principal;
    }

    public RegisterInfo getRegisterInfo() {
        return registerInfo;
    }
}
