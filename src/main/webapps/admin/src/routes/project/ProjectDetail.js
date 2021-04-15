import React from 'react'
import {Link} from 'react-router-dom'
import {stringify} from 'qs'
import classNames from 'classnames'
import {connect} from 'dva'
import {routerRedux} from 'dva/router'
import {Table} from 'antd'
import NumberFormat from 'react-number-format'
import DateFormatter from '../../compoment/DateFormatter'
import DocumentTitle from '../../compoment/DocumentTitle'
import Filter from './Filter'

const namespace = 'projectDetail'

const Component = ({
                     location, dispatch, model, loading,
                   }) => {

  const {tabList, pactList, projectInfo, currentCategoryId} = model
  const [p0, p1, p2] = location.pathname.split('/')
  let pathname = [p0, p1, p2].join('/')
  const columns = [
    {
      title: '合同代码',
      dataIndex: 'pactNumber',
    },
    {
      title: '日期',
      dataIndex: 'signDate',
      render: (value) => <DateFormatter pattern="Y-MM-DD" value={value}/>,
    },
    {
      title: '名称',
      dataIndex: 'name',
      // render: (value) => <div style={{maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis'}} title={value}>{value}</div>,
    },
    {
      title: '甲方',
      dataIndex: 'signA',
      // render: (value) => <div style={{maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis'}} title={value}>{value}</div>,
    },
    {
      title: '乙方',
      dataIndex: 'signB',
      // render: (value) => <div style={{maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis'}} title={value}>{value}</div>,
    },
    {
      title: '金额',
      dataIndex: 'pactSum',
      render: (value) => <NumberFormat value={value} displayType={'text'} thousandSeparator prefix={'￥'}/>,
    },
    {
      title: '审核',
      dataIndex: 'auditSum',
      render: (value) => <NumberFormat value={value} displayType={'text'} thousandSeparator prefix={'￥'}/>,
    },
  ]

  const filterProps = {
    filter: {},
    onFilterChange(value) {
      dispatch(routerRedux.push(`/project?${stringify(value)}`))
    },
    onAdd() {
      dispatch(routerRedux.push('/pact/new'))
    },
  }

  const onClickItem = (record) => {
    dispatch(routerRedux.push('/pact/' + record.pactNo))
  }
  return (
    <DocumentTitle title='合同管理'>
      <section className="projectList">
        <div className="container">
          <Filter {...filterProps} />
          <div className="row">
            <div className="col-xs-12 whiteBg">
              <h1 className="productName">{projectInfo.name}</h1>
              <ul className="nav nav-tabs">
                <li className={classNames({active: currentCategoryId === undefined})}>
                  <Link to={pathname}>全部</Link>
                </li>
                {
                  tabList.map((item) => <li key={item.id} className={classNames({active: currentCategoryId === item.id})}>
                    <Link to={pathname + '/' + item.id}>{item.name}</Link>
                  </li>)
                }
              </ul>
              <div className="tab-content">
                <div className="tab-pane active">
                  <div className="panel panel-default contractL">
                    <Table
                      columns={columns}
                      dataSource={pactList}
                      bordered
                      rowKey='pactNo'
                      className="table handTr table-small"
                      onRow={(record, index) => ({
                        onClick() {
                          onClickItem(record, index)
                        },
                      })}
                    />
                  </div>
                </div>
              </div>
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
