package com.unicorn.hywy.controller;

import com.unicorn.hywy.model.po.User;
import com.unicorn.hywy.service.SmsVerificationService;
import com.unicorn.hywy.service.UserService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

import static com.unicorn.hywy.controller.ApiNamespace.API_V1;

@RestController
@RequestMapping(API_V1)
public class MainController {

    private final UserService userService;

    private final SmsVerificationService smsVerificationService;

    MainController(UserService userService
            , SmsVerificationService smsVerificationService
    ) {
        this.userService = userService;
        this.smsVerificationService = smsVerificationService;
    }

    @GetMapping("/current")
    Map getCurrentInfo() {
        Map result = new HashMap();
        Map user = new HashMap();
        User currentUser = userService.getCurrentUser();
        if (currentUser != null) {
            user.put("id", currentUser.getId());
            user.put("username", currentUser.getName());
            result.put("user", user);
        }
        result.put("success", true);
        return result;
    }

    @RequestMapping(value = "/sms/verifyCode", method = RequestMethod.GET)
    public void sendVerifyCode(String phoneNo, String tunnel) {

        smsVerificationService.sendVerifyCode(phoneNo, tunnel);
    }
}