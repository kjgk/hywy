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
        if (location.pathname.indexOf('/contract/payment/') === 0) {
          let paths = location.pathname.split('/')
          dispatch({
            type: 'query',
            payload: {
              payNo: paths[3],
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
