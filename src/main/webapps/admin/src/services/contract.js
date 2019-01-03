import {createCrudService} from './base'
import request from "../utils/request"
import {apiPrefix} from "../utils/config"
import {stringify} from "qs"

export default {
  ...createCrudService('/contract'),
  getAccCodeList() {
    return request(`${apiPrefix}/contract/accCode`)
  },
  getPactList(params) {
    return request(`${apiPrefix}/contract/pact?${stringify(params)}`)
  },
  createPact(params){
    return request(`${apiPrefix}/contract/pact`, {
      method: 'POST',
      body: params,
    })
  },
  updatePact(params){
    return request(`${apiPrefix}/contract/pact/${params.pactNo}`, {
      method: 'PATCH',
      body: params,
    })
  },
  getPact(pactNo){
    return request(`${apiPrefix}/contract/pact/${pactNo}`)
  },
  getPactDetail(pactNo){
    return request(`${apiPrefix}/contract/pact/${pactNo}/detail`)
  },
  saveAttach(params){
    return request(`${apiPrefix}/contract/attach`, {
      method: 'POST',
      body: params,
    })
  },
  removeAttach(id) {
    return request(`${apiPrefix}/contract/attach/${id}`, {
      method: 'DELETE',
    })
  },
  getAttachList(params){
    return request(`${apiPrefix}/contract/attach?${stringify(params)}`)
  },
}
