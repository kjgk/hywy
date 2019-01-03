import {routerRedux} from 'dva/router'
import {login} from '../services/index'
import {model} from './base'
import modelExtend from 'dva-model-extend'

export default modelExtend(model, {

  namespace: 'login',

  state: {
    errorMessage: undefined,
  },

  subscriptions: {
    setup({dispatch, history}) {
      history.listen((location) => {
        const {pathname} = location
        if (!/\/login$/.test(pathname)) {
          dispatch({
            type: 'updateState',
            payload: {
              errorMessage: undefined,
            },
          })
        }
      })
    },
  },

  effects: {
    * login({payload}, {put, call, select}) {

      yield put({
        type: 'updateState',
        payload: {errorMessage: undefined},
      })

      const {success, message} = yield call(login, payload)
      const {locationQuery} = yield select(_ => _.app)
      if (success) {
        const {from} = locationQuery
        yield put({type: 'app/query'})
        if (from && from !== '/login') {
          yield put(routerRedux.push(from))
        } else {
          yield put(routerRedux.push('/contract'))
        }
      } else {
        yield put({
          type: 'updateState',
          payload: {errorMessage: message},
        })
      }
    },
  },
})
