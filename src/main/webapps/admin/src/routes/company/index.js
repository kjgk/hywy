import React from 'react'
import queryString from 'query-string'
import {routerRedux} from 'dva/router'
import {connect} from 'dva'
import Filter from './Filter'
import List from './List'
import Modal from './Modal'
import DocumentTitle from '../../compoment/DocumentTitle'

const namespace = 'company'
const name = '客户'

const Component = ({
                     location, dispatch, model, loading,
                   }) => {

  location.query = queryString.parse(location.search)
  const {query, pathname} = location
  const {
    list, pagination, currentItem, modalVisible, modalType, selectedRowKeys,
  } = model

  const handleRefresh = (newQuery) => {
    dispatch(routerRedux.push({
      pathname,
      search: queryString.stringify({
        ...query,
        ...newQuery,
      }),
    }))
  }

  const modalProps = {
    item: modalType === 'create' ? {} : currentItem,
    visible: modalVisible,
    maskClosable: false,
    confirmLoading: loading.effects[`${namespace}/${modalType}`],
    title: modalType === 'create' ? `添加${name}` : `编辑${name}`,
    onOk (data) {
      dispatch({
        type: `${namespace}/${modalType}`,
        payload: data,
      })
        .then(() => handleRefresh())
    },
    onCancel () {
      dispatch({
        type: `${namespace}/hideModal`,
      })
    },
  }

  const listProps = {
    dataSource: list,
    loading: loading.effects[`${namespace}/query`],
    pagination,
    location,
    onChange (page) {
      handleRefresh({
        page: page.current,
        pageSize: page.pageSize,
      })
    },
    onDeleteItem(id) {
      dispatch({
        type: `${namespace}/delete`,
        payload: id,
      })
        .then(() => handleRefresh({
          page: (list.length === 1 && pagination.current > 1) ? pagination.current - 1 : pagination.current,
        }))
    },
    onEditItem(item) {
      dispatch({
        type: `${namespace}/showModal`,
        payload: {
          modalType: 'update',
          currentItem: item,
        },
      })
    },
  }

  const filterProps = {
    filter: {
      ...query,
    },
    onFilterChange(value) {
      handleRefresh({
        ...value,
        page: 0,
      })
    },
    onAdd() {
      dispatch({
        type: `${namespace}/showModal`,
        payload: {
          modalType: 'create',
        },
      })
    },
  }

  return (
    <DocumentTitle title="客户管理">
      <section className="projectList">
        <div className="container">
          <Filter {...filterProps} />
          <div className="row">
            <div className="col-xs-12 whiteBg">
              <List {...listProps} />
            </div>
          </div>
        </div>
        {modalVisible && <Modal {...modalProps} />}
      </section>
    </DocumentTitle>
  )
}

export default connect((models) => {
  return {
    model: models[namespace],
    loading: models.loading,
  }
})(Component)
