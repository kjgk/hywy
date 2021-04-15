import service from '../services/payment'
import {createCrudModel} from './base'

const namespace = 'payment'
const pathname = '/payment'

const model = createCrudModel(namespace, pathname, service)
model.effects.getPaymentList = function* ({payload = {}}, {call, put, select}) {
  yield put({
    type: 'updateState',
    payload: {
      paymentList: [],
    },
  })
  let paymentList = yield call(service.getPaymentList, payload)
  yield put({
    type: 'updateState',
    payload: {
      paymentList,
    },
  })
}
export default model
