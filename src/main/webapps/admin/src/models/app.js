/* global window */
/* global document */
/* global location */
/* eslint no-restricted-globals: ["error", "event"] */

import {getCurrentInfo, logout} from '../services/index'
import {routerRedux} from 'dva/router'
import queryString from 'query-string'
import modelExtend from "dva-model-extend"
import {model} from './base'
import {openPages} from "../utils/config"

export default modelExtend(model, {

  namespace: 'app',

  state: {
    currentUser: {},
    locationQuery: {},
    locationPathname: undefined,
    menus: []
  },

  subscriptions: {
    setupHistory({dispatch, history}) {
      history.listen((location) => {
        dispatch({
          type: 'updateState',
          payload: {
            locationPathname: location.pathname,
            locationQuery: queryString.parse(location.search),
          },
        })
      })
    },

    setup({dispatch}) {
      dispatch({type: 'query'})
      dispatch({type: 'initMenu'})
    },

  },

  effects: {
    * query({payload}, {put, call, select}) {

      const {success, user} = yield call(getCurrentInfo, {})
      const {locationPathname} = yield select(_ => _.app)
      if (success && user) {
        yield put({
          type: 'updateState',
          payload: {
            currentUser: user,
          },
        })
        if (location.pathname === '/login') {
          yield put(routerRedux.push({
            pathname: '/contract',
          }))
        }
      } else if (locationPathname !== '/login' && openPages && openPages.indexOf(location.pathname) === -1) {
        yield put(routerRedux.push({
          pathname: '/login',
          search: queryString.stringify({
            from: locationPathname,
          }),
        }))
      }
    },
    * logout({}, {call, put}) {
      const data = yield call(logout)
      if (data.success) {
        yield put({type: 'query'})
      } else {
        throw (data)
      }
    },
  },

  reducers: {
    initMenu(state) {
      const menus = [
        {name: '首页', path: '/'},
        {name: '合同管理', path: '/contract'},
        {name: '档案管理', path: '/archive'},
        {name: '租售管理', path: '/sale'},
        {name: '系统设置', path: '/system'},
      ]
      return {
        ...state,
        menus
      }
    }
  }
})