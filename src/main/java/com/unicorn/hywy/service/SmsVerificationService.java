package com.unicorn.hywy.service;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.unicorn.hywy.exception.ServiceException;
import com.unicorn.hywy.utils.Identities;
import com.unicorn.hywy.utils.Md5Utils;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.concurrent.TimeUnit;

@Component
public class SmsVerificationService {

    private final static Logger logger = LoggerFactory.getLogger(SmsVerificationService.class);

    @Autowired
    private StringRedisTemplate redisTemplate;

    @Autowired
    private EnvironmentService  environmentService;

    public void sendVerifyCode(String phoneNo, String tunnel) {

        String code = new Long(Identities.randomLong()).toString().substring(0, 6);

        // 将验证码保存到redis
        String key = getRedisKey(phoneNo, tunnel);
        redisTemplate.opsForValue().set(key, code, 30, TimeUnit.MINUTES);

        OkHttpClient okHttpClient = new OkHttpClient();

        String timestamp = new SimpleDateFormat("yyyyMMddHHmmss").format(new Date());
        String sign = Md5Utils.encrypt(environmentService.getSms().getAccountSid() + environmentService.getSms().getAuthToken() + timestamp);
        Request request = new Request.Builder()
                .url(environmentService.getSms().getUrl())
                .post(RequestBody.create(null, "accountSid=" + environmentService.getSms().getAccountSid() + "&smsContent=" + code + "&templateid=" + environmentService.getSms().getTemplateId() + "&param=" + code + "&to=" + phoneNo + "&timestamp=" + timestamp + "&sig=" + sign))
                .header("Content-Type", "application/x-www-form-urlencoded").build();

        try {
            Response response = okHttpClient.newCall(request).execute();
            String result = response.body().string();
            JSONObject jsonObject = JSON.parseObject(result);
            if (!"00000".equals(jsonObject.getString("respCode"))) {
                String message = "短信发送失败：" + jsonObject.getString("respDesc");
                logger.error(message);
                throw new ServiceException(message);
            }
        } catch (IOException e) {
            String message = "短信发送失败：" + e.getMessage();
            logger.error(message);
            throw new ServiceException(message);
        }
    }


    public String getVerifyCode(String phoneNo, String tunnel) {

        return redisTemplate.opsForValue().get(getRedisKey(phoneNo, tunnel));
    }

    public void removeVerifyCode(String phoneNo, String tunnel) {

        redisTemplate.delete(getRedisKey(phoneNo, tunnel));
    }

    private String getRedisKey(String phoneNo, String tunnel) {

        return ("sms_verification:" + phoneNo + ":" + tunnel).toLowerCase();
    }
}
