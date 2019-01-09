package com.unicorn.hywy.service;

import com.querydsl.core.types.dsl.BooleanExpression;
import com.unicorn.hywy.exception.ServiceException;
import com.unicorn.hywy.model.po.QUser;
import com.unicorn.hywy.model.po.User;
import com.unicorn.hywy.model.vo.RegisterInfo;
import com.unicorn.hywy.repository.UserRepository;
import com.unicorn.hywy.security.PasswordEncoder;
import com.unicorn.hywy.utils.SnowflakeIdWorker;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import javax.transaction.Transactional;

@Service
@Transactional
public class RegisterService {

    @Autowired
    private SmsVerificationService smsVerificationService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private SnowflakeIdWorker idWorker;


    public void register(RegisterInfo registerInfo) {

        String verifyCode = smsVerificationService.getVerifyCode(registerInfo.getPhoneNo(), "reg");
        if (StringUtils.isEmpty(verifyCode) || !verifyCode.equals(registerInfo.getVerifyCode())) {
            throw new ServiceException("验证码不正确!");
        }

        // 保存用户和帐号信息
        BooleanExpression expression = QUser.user.mobile.eq(registerInfo.getPhoneNo());
        User current = userRepository.findOne(expression).orElse(null);

        if (current == null) {
            User user = new User();
            user.setId(idWorker.nextId() + "");
            user.setMobile(registerInfo.getPhoneNo());
            user.setName(registerInfo.getPhoneNo());
            user.setStatus('0');
            current = userRepository.save(user);
        }
        current.setPassword(passwordEncoder.encode(registerInfo.getPassword()));
    }
}
