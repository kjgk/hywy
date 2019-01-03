import modelExtend from 'dva-model-extend'
import queryString from 'query-string'
import NProgress from "nprogress"
import {message} from "antd"

const model = {
  reducers: {
    updateState(state, {payload}) {
      return {
        ...state,
        ...payload,
      }
    },
  },
}

const pageModel = modelExtend(model, {

  state: {
    list: [],
    pagination: {
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: total => `共 ${total} 条`,
      current: 1,
      total: 0,
      pageSize: 10,
    },
  },

  reducers: {
    querySuccess(state, {payload}) {
      const {list, pagination: {total, ...pagination}} = payload
      return {
        ...state,
        list,
        pagination: {
          ...state.pagination,
          ...pagination,
          total: parseInt(total + '', 10)
        },
      }
    },
  },

})

const createCrudModel = function (namespace, pathname, {query, get, create, update, remove, multiRemove}) {

  return modelExtend(pageModel, {
    namespace: namespace,
    state: {
      currentItem: {},
      modalVisible: false,
      modalType: 'create',
      selectedRowKeys: [],
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
          } else {
            dispatch({
              type: 'updateState',
              payload: {
                currentItem: {},
                modalVisible: false,
                modalType: 'create',
                selectedRowKeys: [],
              },
            })
          }
        })
      },
    },

    effects: {

      * query({payload = {}}, {call, put}) {
        const {content, totalElements, number, size} = yield call(query, payload)
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

      * create({payload}, {call, put}) {
        NProgress.start()
        yield call(create, payload)
        yield put({type: 'hideModal'})
        message.success('保存成功！')
        NProgress.done()
      },

      * update({payload}, {call, put}) {
        NProgress.start()
        yield call(update, payload)
        yield put({type: 'hideModal'})
        message.success('更新成功！')
        NProgress.done()
      },

      * delete({payload}, {call, put, select}) {
        NProgress.start()
        yield call(remove, payload)
        const {selectedRowKeys} = yield select(_ => _[namespace])
        yield put({
          type: 'updateState',
          payload: {selectedRowKeys: selectedRowKeys.filter(_ => _ !== payload)},
        })
        message.success('删除成功！')
        NProgress.done()
      },
    },

    reducers: {
      showModal(state, {payload}) {
        return {
          ...state, ...payload,
          modalVisible: true,
        }
      },
      hideModal(state) {
        return {
          ...state,
          modalVisible: false,
        }
      },
    },
  })
}

export {
  model,
  pageModel,
  createCrudModel,
}
