import service from '../services/contract'
import {message} from 'antd'
import {model} from './base'
import modelExtend from "dva-model-extend"

const namespace = 'pactDetail'

export default modelExtend(model, {

  namespace,

  state: {
    pact: {},
    tabActive: undefined,
    attachModalVisible: false,
    attachList: [],
    attachProgress: undefined,
    attachUploadFiles: [],
  },
  subscriptions: {
    setup({dispatch, history}) {
      history.listen((location) => {
        const {pathname} = location
        if (/\/contract\/pact\/\d+$/.test(pathname)) {
          const pactNo = pathname.split('/')[3]
          dispatch({
            type: 'getPactDetail',
            payload: {
              pactNo,
            }
          }).then(() => {
            dispatch({
              type: 'getAttachList',
              payload: {
                pactNo,
                pageSize: 2000,
              }
            }).then(() => {
              dispatch({
                type: 'payment/query',
                payload: {
                  pactNo,
                  pageSize: 2000,
                }
              })
            })
          })
        } else {
          dispatch({
            type: 'updateState',
            payload: {
              pact: {},
              tabActive: undefined,
              attachModalVisible: false,
              attachList: [],
              attachProgress: undefined,
              attachUploadFiles: [],
            },
          })
        }
      })
    },
  },

  effects: {
    * getPactDetail({payload = {}}, {call, put, select}) {
      let pact = yield call(service.getPactDetail, payload.pactNo)
      let tabActive = pact.payType !== 0 ? 'payment' : 'attach'
      yield put({
        type: 'updateState',
        payload: {
          pact,
          tabActive,
        },
      })
    },
    * getAttachList({payload = {}}, {call, put, select}) {
      let {content} = yield call(service.getAttachList, payload)
      yield put({
        type: 'updateState',
        payload: {
          attachList: content,
        },
      })
    },
    * saveAttach({payload = {}}, {call, put, select}) {
      const {attachUploadFiles} = yield select(_ => _[namespace])
      yield call(service.saveAttach, {fileList: attachUploadFiles, ...payload})
      message.success('附件保存成功！')
      yield put({type: 'hideAttachModal'})
    },
    * deleteAttach({payload}, {call, put, select}) {
      yield call(service.removeAttach, payload)
      message.success('附件删除成功！')
    },
  },

  reducers: {
    showPayment(state) {
      return {
        ...state,
        tabActive: 'payment',
      }
    },
    showAttach(state) {
      return {
        ...state,
        tabActive: 'attach',
      }
    },
    showAttachModal(state) {
      return {
        ...state,
        attachModalVisible: true,
      }
    },
    hideAttachModal(state) {
      return {
        ...state,
        attachModalVisible: false,
        attachProgress: undefined,
        attachUploadFiles: [],
      }
    },
    onAttachUploadChange(state, {payload}) {
      const {event, fileList} = payload
      let attachUploadFiles = []
      for (let file of  fileList) {
        attachUploadFiles.push(file.response)
      }
      return {
        ...state,
        attachProgress: event && event.percent,
        attachUploadFiles,
      }
    },
  },
})
