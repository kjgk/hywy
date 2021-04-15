import React from 'react'
import queryString from 'query-string'
import {routerRedux} from 'dva/router'
import {connect} from 'dva'
import Filter from './Filter'
import List from './List'
import DocumentTitle from '../../compoment/DocumentTitle'

const namespace = 'payment'
const name = '付款信息'

const Component = ({
                     location, dispatch, model, loading, pactForm,
                   }) => {

  location.query = queryString.parse(location.search)
  const {query, pathname} = location
  const {
    list, pagination, currentItem, modalVisible, modalType, selectedRowKeys,
  } = model
  const {payTypes2: payTypes} = pactForm

  const handleRefresh = (newQuery) => {
    dispatch(routerRedux.push({
      pathname,
      search: queryString.stringify({
        ...query,
        ...newQuery,
      }),
    }))
  }

  const listProps = {
    dataSource: list,
    loading: loading.effects[`${namespace}/query`],
    pagination,
    location,
    payTypes,
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
    payTypes,
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
    <DocumentTitle title="付款管理">
      <section className="projectList">
        <div className="container">
          <Filter {...filterProps} />
          <div className="row">
            <div className="col-xs-12 whiteBg">
              <List {...listProps} />
            </div>
          </div>
        </div>
      </section>
    </DocumentTitle>
  )
}

export default connect((models) => {
  return {
    model: models[namespace],
    loading: models.loading,
    pactForm: models.pactForm,
  }
})(Component)
