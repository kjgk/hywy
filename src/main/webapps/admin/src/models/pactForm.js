import service from '../services/contract'
import {model} from './base'
import modelExtend from "dva-model-extend"
import {routerRedux} from 'dva/router'

const namespace = 'pactForm'

export default modelExtend(model, {

  namespace,

  state: {
    pact: {},
    payType: 0,
    payMode: undefined,
    execStates: [
      {id: 0, name: '未执行'},
      {id: 1, name: '正在执行'},
      {id: 2, name: '已结清'},
    ],
    payTypes: [
      {id: 0, name: '无收付款'},
      {id: 1, name: '需收款'},
      {id: 2, name: '需付款'},
    ],
    payModes: [
      {id: 0, name: '合计金额式'},
      {id: 1, name: '按月付费式'},
      {id: 2, name: '实际使用式'},
    ],
  },

  subscriptions: {
    setup({dispatch, history}) {
      history.listen((location) => {
        const {pathname} = location
        if (/\/contract\/pact\/edit\/\d+$/.test(pathname)) {
          const pactNo = pathname.split('/')[4]
          dispatch({
            type: 'getPact',
            payload: {
              pactNo,
            }
          })
        } else {
          dispatch({
            type: 'updateState',
            payload: {
              pact: {
                payType: 0,
                payMode: undefined,
              },
              payType: 0,
              payMode: undefined,
            },
          })
        }
      })
    },
  },

  effects: {
    * save({payload}, {call, put, select}) {
      const {pact} = yield select(_ => _[namespace])
      let pactNo = pact.pactNo
      if (pactNo) {
        yield call(service.updatePact, {...payload, pactNo})
      } else {
        const pact = yield call(service.createPact, payload)
        pactNo = pact.pactNo
      }
      yield put(routerRedux.push('/contract/pact/' + pactNo))
    },
    * getPact({payload = {}}, {call, put, select}) {
      let pact = yield call(service.getPact, payload.pactNo)
      yield put({
        type: 'updateState',
        payload: {
          pact,
          payType: pact.payType,
          payMode: pact.payMode === null ? undefined : pact.payMode,
        },
      })
    },
  },

  reducers: {},
})
