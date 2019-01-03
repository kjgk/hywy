import service from '../services/contract'
import {model} from './base'
import modelExtend from "dva-model-extend"
import {routerRedux} from 'dva/router'

const namespace = 'pactForm'

export default modelExtend(model, {

  namespace,

  state: {
    pact: {},
    execStates: [
      {id: 0, name: '未执行'},
      {id: 1, name: '正在执行'},
      {id: 2, name: '已结清'},
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
              pact: {},
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
        },
      })
    },
  },

  reducers: {},
})
