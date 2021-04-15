import request from "../utils/request"
import {apiPrefix} from "../utils/config"
import {stringify} from "qs"

export default {
  query(params) {
    return request(`${apiPrefix}/pact?${stringify(params)}`)
  },
  createPact(params){
    return request(`${apiPrefix}/pact`, {
      method: 'POST',
      body: params,
    })
  },
  updatePact(params){
    return request(`${apiPrefix}/pact/${params.pactNo}`, {
      method: 'PATCH',
      body: params,
    })
  },
  getPact(pactNo){
    return request(`${apiPrefix}/pact/${pactNo}`)
  },
  getPactDetail(pactNo){
    return request(`${apiPrefix}/pact/${pactNo}/detail`)
  },
  saveAttach(params){
    return request(`${apiPrefix}/pact/attach`, {
      method: 'POST',
      body: params,
    })
  },
  removeAttach(id) {
    return request(`${apiPrefix}/pact/attach/${id}`, {
      method: 'DELETE',
    })
  },
  getAttachList(pactNo){
    return request(`${apiPrefix}/pact/${pactNo}/attach`)
  },
}
