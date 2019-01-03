import {createCrudService} from './base'
import request from "../utils/request"
import {apiPrefix} from "../utils/config"

export default {
  ...createCrudService('/contract/payment'),
  getPaymentInfo(payNo) {
    return request(`${apiPrefix}/contract/payment/${payNo}/detail`)
  },
}
