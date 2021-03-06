import projectService from '../services/project'
import {model} from './base'
import modelExtend from "dva-model-extend"

const namespace = 'projectDetail'

export default modelExtend(model, {

  namespace: namespace,

  state: {
    tabList: [],
    pactList: [],
    currentCategoryId: undefined,
    projectInfo: {},
  },

  subscriptions: {
    setup({dispatch, history}) {
      history.listen((location) => {
        const {pathname} = location
        if (/\/project\/\d+$/.test(pathname) || /\/project\/\d+\/\d+$/.test(pathname)) {
          const [p0, p1, p2, p3] = pathname.split('/')
          dispatch({
            type: 'initTabList',
          })
          dispatch({
            type: 'fetchProjectInfo',
            payload: {
              projectId: p2,
            }
          })
          dispatch({
            type: 'fetchPactList',
            payload: {
              projectId: p2,
              categoryId: p3,
            }
          })
        } else {
          dispatch({
            type: 'updateState',
            payload: {
              pactList: [],
              currentCategoryId: undefined,
              projectInfo: {},
            }
          })
        }
      })
    },
  },

  effects: {

    * initTabList({payload = {}}, {call, put, select}) {
      const state = yield select(_ => _[namespace])
      let tabList = state.tabList
      if (tabList.length > 0) {
        return
      }
      tabList = yield call(projectService.getAccCodeList)
      yield put({
        type: 'updateState',
        payload: {
          tabList
        },
      })
    },
    * fetchProjectInfo({payload = {}}, {call, put, select}) {
      let projectInfo = yield call(projectService.get, payload.projectId)
      yield put({
        type: 'updateState',
        payload: {
          projectInfo,
        },
      })
    },
    * fetchPactList({payload = {}}, {call, put, select}) {
      let pactList = yield call(projectService.getPactList, payload.projectId, payload.categoryId)
      yield put({
        type: 'updateState',
        payload: {
          pactList,
          currentCategoryId: payload.categoryId
        },
      })
    },
  },

  reducers: {},
})
