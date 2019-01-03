import {stringify} from 'qs'
import request from '../utils/request'
import {apiPrefix, loginUrl, logoutUrl, registerUrl} from '../utils/config'

export function getCurrentInfo() {
  return request(apiPrefix + '/current')
}

export function login(params) {
  return request(loginUrl, {
    method: 'POST',
    body: stringify(params),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    },
  })
}

export function logout() {
  return request(logoutUrl, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    },
  })
}

export function sendVerifyCode(phoneNo, tunnel) {
  return request(`${apiPrefix}/sms/verifyCode?phoneNo=${phoneNo}&tunnel=${tunnel}`)
}

export function register(params) {
  return request(registerUrl, {
    method: 'POST',
    body: params,
  })
}

