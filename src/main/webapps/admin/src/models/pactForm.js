import service from '../services/pact'
import companyService from '../services/company'
import {model} from './base'
import modelExtend from "dva-model-extend"
import {routerRedux} from 'dva/router'

const namespace = 'pactForm'

export default modelExtend(model, {

  namespace,

  state: {
    pact: {},
    payType: 0,
    payMode: undefined,
    execStates: [
      {id: 0, name: '未执行'},
      {id: 1, name: '正在执行'},
      {id: 2, name: '已结清'},
    ],
    payTypes: [
      {id: 0, name: '其他'},
      {id: 1, name: '收入性'},
      {id: 2, name: '支出性'},
    ],
    // 用于付款管理页面
    payTypes2: [
      {id: 1, name: '收款'},
      {id: 2, name: '付款'},
    ],
    payModes: [
      {id: 1, name: '全年'},
      {id: 2, name: '半年'},
      {id: 3, name: '季'},
      {id: 4, name: '月'},
      {id: 5, name: '预收付'},
      {id: 6, name: '事后结清'},
      {id: 7, name: '一次性'},
      {id: 0, name: '其他'},
    ],
    addCompanyField: undefined,
    companyList: [],
  },

  subscriptions: {
    setup({dispatch, history}) {
      history.listen((location) => {
        const {pathname} = location
        let match = false
        if (/\/pact\/new$/.test(pathname)) {
          dispatch({
            type: 'updateState',
            payload: {
              pact: {
                payType: 0,
                payMode: undefined,
              },
              payType: 0,
              payMode: undefined,
              addCompanyField: undefined,
              companyList: [],
            },
          })
          match = true
        } else if (/\/pact\/\d+\/edit$/.test(pathname)) {
          const pactNo = pathname.split('/')[2]
          dispatch({
            type: 'getPact',
            payload: {
              pactNo,
            }
          })
          match = true
        }

        if (match) {
          dispatch({
            type: 'fetchCompanyList',
          })
        }
      })
    },
  },

  effects: {
    * save({payload}, {call, put, select}) {
      const {pact} = yield select(_ => _[namespace])
      let pactNo = pact.pactNo
      if (pactNo) {
        yield call(service.updatePact, {...payload, pactNo})
      } else {
        const pact = yield call(service.createPact, payload)
        pactNo = pact.pactNo
      }
      yield put(routerRedux.push('/pact/' + pactNo))
    },
    * getPact({payload = {}}, {call, put, select}) {
      let pact = yield call(service.getPact, payload.pactNo)
      yield put({
        type: 'updateState',
        payload: {
          pact,
          payType: pact.payType,
          payMode: pact.payMode === null ? undefined : pact.payMode,
        },
      })
    },
    * fetchCompanyList({payload = {}}, {call, put}) {
      const companyList = yield call(companyService.getList)
      yield put({
        type: 'updateState',
        payload: {companyList},
      })
    },
    * openCompanyModal({payload = {}}, {call, put}) {
      yield put({
        type: 'company/showModal',
        payload: {
          modalType: 'create',
        }
      })
      yield put({
        type: 'updateState',
        payload: payload,
      })
    },
    * createAddSelectCompany({payload = {}}, {call, put, select}) {
      const {companyList, addCompanyField, pact} = yield select(_ => _[namespace])
      pact[addCompanyField] = payload.id
      yield put({
        type: 'updateState',
        payload: {
          companyList: [...companyList, payload],
          pact,
        },
      })
    },
  },
})
