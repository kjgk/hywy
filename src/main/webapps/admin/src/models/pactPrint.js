import service from '../services/contract'
import {model} from './base'
import modelExtend from 'dva-model-extend'

export default modelExtend(model, {
  namespace: 'pactPrint',
  state: {
    pact: {},
    accCodeList: []
  },

  subscriptions: {
    setup({dispatch, history}) {
      history.listen((location) => {
        if (/\/contract\/pact\/\d+\/preview$/.test(location.pathname)) {
          let paths = location.pathname.split('/')
          dispatch({
            type: 'query',
            payload: {
              pactNo: paths[3],
            },
          })
        } else {
        }
      })
    },
  },

  effects: {
    * query({payload}, {put, call, select}) {
      const pact = yield call(service.getPactDetail, payload.pactNo)
      const accCodeList = yield call(service.getAccCodeList)
      yield put({
        type: 'updateState',
        payload: {
          pact,
          accCodeList,
        },
      })
    },
  },
})
