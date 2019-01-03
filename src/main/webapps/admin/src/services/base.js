import {stringify} from 'qs'
import request from '../utils/request'
import {apiPrefix} from '../utils/config'

const createCrudService = function (path) {

  const api = `${apiPrefix}${path}`

  return {
    query(params) {
      return request(`${api}?${stringify(params)}`)
    },

    get(id) {
      return request(`${api}/${id}`)
    },

    getList(params) {
      return request(`${api}/list?${stringify(params)}`)
    },

    create(params) {
      return request(api, {
        method: 'POST',
        body: params,
      })
    },

    update(params) {
      return request(`${api}/${params.id}`, {
        method: 'PATCH',
        body: params,
      })
    },

    remove(id) {
      return request(`${api}/${id}`, {
        method: 'DELETE',
      })
    },
  }
}

export {
  createCrudService,
}
