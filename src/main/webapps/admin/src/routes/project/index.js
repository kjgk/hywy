import React from 'react'
import queryString from 'query-string'
import {routerRedux} from 'dva/router'
import {connect} from 'dva'
import Filter from './Filter'
import List from './List'
import DocumentTitle from '../../compoment/DocumentTitle'

const namespace = 'project'
const name = '项目汇总'

const Component = ({
                     location, dispatch, model, loading,
                   }) => {

  location.query = queryString.parse(location.search)
  const {query, pathname} = location
  const {
    list, pagination,
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
      dispatch(routerRedux.push('/pact/new'))
    },
  }

  return (
    <DocumentTitle title='项目汇总'>
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
  }
})(Component)
