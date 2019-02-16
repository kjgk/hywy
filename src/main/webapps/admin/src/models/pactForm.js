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
      {id: 0, name: '其他'},
      {id: 1, name: '收入性'},
      {id: 2, name: '支出性'},
    ],
    payModes: [
      {id: 1, name: '全年'},
      {id: 2, name: '半年'},
      {id: 3, name: '季'},
      {id: 4, name: '月'},
      {id: 5, name: '预收付'},
      {id: 6, name: '事后结清'},
      {id: 7, name: '一次性'},
      {id: 0, name: '其他'},
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
