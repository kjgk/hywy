import service from '../services/payment'
import {model} from './base'
import modelExtend from 'dva-model-extend'

export default modelExtend(model, {
  namespace: 'paymentPrint',
  state: {
    payment: {}
  },

  subscriptions: {
    setup({dispatch, history}) {
      history.listen((location) => {
        if (/\/payment\/\d+\/preview$/.test(location.pathname)) {
          let paths = location.pathname.split('/')
          dispatch({
            type: 'query',
            payload: {
              payNo: paths[2],
            },
          })
        } else {
        }
      })
    },
  },

  effects: {
    * query({payload}, {put, call, select}) {
      const payment = yield call(service.getPaymentInfo, payload.payNo)
      yield put({
        type: 'updateState',
        payload: {payment},
      })
    },
  },
})
