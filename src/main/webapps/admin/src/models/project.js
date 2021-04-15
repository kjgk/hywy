import service from '../services/project'
import {pageModel} from './base'
import modelExtend from "dva-model-extend"
import queryString from "query-string"

const namespace = 'project'
const pathname = '/project'

export default  modelExtend(pageModel, {
  namespace: namespace,
  state: {
  },

  subscriptions: {
    setup({dispatch, history}) {
      history.listen((location) => {
        if (location.pathname === pathname) {
          const payload = {
            page: 1,
            pageSize: 10,
            ...queryString.parse(location.search),
          }
          dispatch({
            type: 'query',
            payload,
          })
        }
      })
    },
  },

  effects: {

    * query({payload = {}}, {call, put}) {
      const {content, totalElements, number, size} = yield call(service.query, payload)
      if (content) {
        yield put({
          type: 'querySuccess',
          payload: {
            list: content,
            pagination: {
              current: number + 1,
              pageSize: size,
              total: totalElements,
            },
          },
        })
      }
    },
  },
})

