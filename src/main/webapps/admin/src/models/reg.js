import {routerRedux} from 'dva/router'
import {login, sendVerifyCode, register} from '../services/index'
import {model} from './base'
import modelExtend from 'dva-model-extend'

function delay(timeout) {
  return new Promise(resolve => {
    setTimeout(resolve, timeout)
  })
}

function isBlank(str) {
  if (str === null || str === undefined || str === '' || str.trim() === '') {
    return true
  }
  return false
}

export default modelExtend(model, {

  namespace: 'reg',

  state: {
    errorMessage: undefined,
    countDown: 0,
    /**
     * 0：初始状态，显示用户注册窗口
     * 1：手机号已注册并且已经通过审核，允许直接登录（如果用户忘记密码可以通过重新注册，找回密码）
     * 2：注册成功，需要等待审核
     * 3：手机号已注册但未通过审核，提示错误信息
     */
    resultCode: 0,
  },

  subscriptions: {
    setup({dispatch, history}) {
      history.listen((location) => {
        const {pathname} = location
        if (!/\/reg$/.test(pathname)) {
          dispatch({
            type: 'updateState',
            payload: {
              errorMessage: undefined,
              countDown: 0,
              resultCode: 0,
            },
          })
        }
      })
    },
  },

  effects: {

    * register({payload}, {call, put, select}) {
      let errorMessage
      yield put({
        type: 'updateState',
        payload: {errorMessage},
      })
      if (payload.password !== payload.confirmPassword) {
        errorMessage = '两次密码输入不一致！'
      }
      if (errorMessage) {
        yield put({
          type: 'updateState',
          payload: {errorMessage},
        })
      } else {
        const {success, message, resultCode} = yield call(register, payload)
        if (success) {
          yield put({type: 'app/query'})
          yield put(routerRedux.push('/contract'))
        } else {
          yield put({
            type: 'updateState',
            payload: {
              errorMessage: resultCode !== 2 ? (message || '注册失败！') : undefined,
              resultCode,
            },
          })
        }
      }
    },
    * sendVerifyCode({payload}, {call, put, select}) {
      yield call(sendVerifyCode, payload.phoneNo, payload.tunnel)
    },

    * sendVerifyCodeAndCountDown({payload}, {call, put, select}) {
      let errorMessage
      yield put({
        type: 'updateState',
        payload: {errorMessage},
      })
      if (isBlank(payload.phoneNo)) {
        errorMessage = '请输入手机号'
      } else {
        if (!/^1[34578][0-9]{9}$/.test(payload.phoneNo)) {
          errorMessage = '手机号不正确'
        }
      }
      if (errorMessage) {
        yield put({
          type: 'updateState',
          payload: {errorMessage},
        })
      } else {
        yield put({type: 'sendVerifyCode', payload})
        // 60秒倒计时...
        let countDown = 60
        while (countDown-- > 0) {
          yield put({
            type: 'updateState',
            payload: {
              countDown
            }
          })
          yield call(delay, 1000)
        }
      }
    },
  },
})
