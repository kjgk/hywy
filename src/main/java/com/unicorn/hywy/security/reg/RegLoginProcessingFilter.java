package com.unicorn.hywy.security.reg;

import com.alibaba.fastjson.JSON;
import com.unicorn.hywy.exception.ServiceException;
import com.unicorn.hywy.model.vo.RegisterInfo;
import com.unicorn.hywy.service.RegisterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.AbstractAuthenticationProcessingFilter;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

public class RegLoginProcessingFilter extends AbstractAuthenticationProcessingFilter {

    @Autowired
    public RegisterService registerService;

    public RegLoginProcessingFilter(String defaultFilterProcessesUrl) {
        super(defaultFilterProcessesUrl);
    }

    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) throws AuthenticationException, IOException, ServletException {

        BufferedReader br = new BufferedReader(new InputStreamReader(request.getInputStream(), "utf-8"));
        String line = null;
        StringBuilder sb = new StringBuilder();
        while ((line = br.readLine()) != null) {
            sb.append(line);
        }

        RegisterInfo registerInfo = JSON.parseObject(sb.toString(), RegisterInfo.class);

        try {
            registerService.register(registerInfo);
        } catch (ServiceException e) {
            throw new AuthenticationException(e.getMessage()) {
            };
        }

        RegAuthenticationToken authenticationToken = new RegAuthenticationToken(registerInfo);
        authenticationToken.setDetails(this.authenticationDetailsSource.buildDetails(request));
        return getAuthenticationManager().authenticate(authenticationToken);
    }
}
