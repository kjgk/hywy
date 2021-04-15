import {createCrudService} from './base'
import request from "../utils/request"
import {apiPrefix} from "../utils/config"

export default {
  ...createCrudService('/pact/payment'),
  getPaymentList(pactNo){
    return request(`${apiPrefix}/pact/${pactNo}/payment`)
  },
  getPaymentInfo(payNo) {
    return request(`${apiPrefix}/pact/payment/${payNo}/detail`)
  },
}
