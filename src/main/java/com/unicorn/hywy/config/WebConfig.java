package com.unicorn.hywy.config;

import com.alibaba.fastjson.JSON;
import com.unicorn.hywy.security.DefaultLoginProcessingFilter;
import com.unicorn.hywy.security.PasswordEncoder;
import com.unicorn.hywy.security.reg.RegAuthenticationProvider;
import com.unicorn.hywy.security.reg.RegLoginProcessingFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.authentication.*;
import org.springframework.security.web.authentication.logout.LogoutSuccessHandler;
import org.springframework.security.web.authentication.session.SessionFixationProtectionStrategy;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Configuration
public class WebConfig extends WebSecurityConfigurerAdapter implements WebMvcConfigurer {

    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private RegAuthenticationProvider regAuthenticationProvider;

    @Override
    public void addArgumentResolvers(List<HandlerMethodArgumentResolver> argumentResolvers) {

        PageableHandlerMethodArgumentResolver pageableResolver = new PageableHandlerMethodArgumentResolver();
        pageableResolver.setOneIndexedParameters(true);
        pageableResolver.setSizeParameterName("pageSize");
        argumentResolvers.add(pageableResolver);
    }

    @Override
    public void configure(AuthenticationManagerBuilder auth) throws Exception {

        auth.userDetailsService(userDetailsService).passwordEncoder(passwordEncoder);
        auth.authenticationProvider(regAuthenticationProvider);
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {

        http
                .addFilterBefore(regLoginProcessingFilter(), UsernamePasswordAuthenticationFilter.class)
                .addFilterBefore(defaultLoginProcessingFilter(), UsernamePasswordAuthenticationFilter.class)
                .authorizeRequests()
                .antMatchers("/").permitAll()
                .antMatchers("/index.html").permitAll()
                .antMatchers("/login/**").permitAll()
                .antMatchers("/admin/**").permitAll()
                .antMatchers("/dist/**").permitAll()
                .antMatchers("/public/**").permitAll()
                .antMatchers("/api/v1/sms/**").permitAll()
                .antMatchers("/api/v1/current").permitAll()
                .antMatchers("/**").hasAnyRole("USER", "ADMIN")

                .anyRequest().authenticated()
                .and()
                .exceptionHandling().authenticationEntryPoint((request, response, exception) -> response.sendError(HttpStatus.UNAUTHORIZED.value(), "Unauthorized"))
                .and()
                .logout()
                .logoutSuccessHandler(logoutSuccessHandler())
                .permitAll()
                .and()
                .headers().frameOptions().disable()
                .and()
                .csrf().disable()
        ;
    }


    @Bean
    DefaultLoginProcessingFilter defaultLoginProcessingFilter() throws Exception {

        DefaultLoginProcessingFilter processingFilter = new DefaultLoginProcessingFilter("/login");
        processingFilter.setAuthenticationManager(authenticationManager());
        processingFilter.setSessionAuthenticationStrategy(new SessionFixationProtectionStrategy());
        processingFilter.setAuthenticationFailureHandler(authenticationFailureHandler());
        processingFilter.setAuthenticationSuccessHandler(authenticationSuccessHandler());
        return processingFilter;
    }

    @Bean
    RegLoginProcessingFilter regLoginProcessingFilter() throws Exception {
        RegLoginProcessingFilter processingFilter = new RegLoginProcessingFilter("/register");
        processingFilter.setAuthenticationManager(authenticationManager());
        processingFilter.setSessionAuthenticationStrategy(new SessionFixationProtectionStrategy());
        processingFilter.setAuthenticationFailureHandler(authenticationFailureHandler());
        processingFilter.setAuthenticationSuccessHandler(authenticationSuccessHandler());
        return processingFilter;
    }

    @Bean(name = "authenticationSuccessHandler")
    public AuthenticationSuccessHandler authenticationSuccessHandler() {
        return new SimpleUrlAuthenticationSuccessHandler() {
            public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
                Map result = new HashMap();
                result.put("message", "登录成功");
                result.put("success", true);
                response.setCharacterEncoding("UTF-8");
                response.getWriter().print(JSON.toJSONString(result));
            }
        };
    }

    @Bean(name = "authenticationFailureHandler")
    public AuthenticationFailureHandler authenticationFailureHandler() {
        return new SimpleUrlAuthenticationFailureHandler() {
            public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response, AuthenticationException exception) throws IOException, ServletException {
                String message;
                if (exception instanceof UsernameNotFoundException) {
                    message = "用户不存在!";
                } else if (exception instanceof BadCredentialsException) {
                    message = "帐号密码错误，请重新输入!";
                } else {
                    message = exception.getMessage();
                }
                Map result = new HashMap();
                result.put("message", message);
                result.put("success", false);
                response.setCharacterEncoding("UTF-8");
                response.getWriter().print(JSON.toJSONString(result));
            }
        };
    }

    @Bean
    public LogoutSuccessHandler logoutSuccessHandler() {
        return (httpServletRequest, httpServletResponse, authentication) -> {
            if ("application/json".equals(httpServletRequest.getHeader("accept"))) {
                httpServletResponse.getWriter().print("{\"success\": true}");
            } else {
                httpServletResponse.sendRedirect(httpServletRequest.getContextPath());
            }
        };
    }
}