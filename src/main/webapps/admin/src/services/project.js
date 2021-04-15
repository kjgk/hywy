import {createCrudService} from './base'
import request from "../utils/request"
import {apiPrefix} from "../utils/config"
import {stringify} from "qs"

export default {
  ...createCrudService('/project'),
  getPactList(projectId, categoryId) {
    return request(`${apiPrefix}/project/${projectId}/pact?${stringify({categoryId})}`)
  },
  getAccCodeList() {
    return request(`${apiPrefix}/project/accCode`)
  },
}
