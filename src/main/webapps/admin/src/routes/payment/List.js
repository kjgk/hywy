import React from 'react'
import queryString from 'query-string'
import {Table, Modal} from 'antd'
import NumberFormat from 'react-number-format'
import DateFormatter from "../../compoment/DateFormatter"
import {Link} from "react-router-dom"

const List = ({onDeleteItem, onEditItem, location, payTypes, ...tableProps}) => {

  location.query = queryString.parse(location.search)

  const columns = [
    {
      title: '状态',
      dataIndex: 'payType',
      render: (value) => {
        for (let payType of payTypes) {
          if (payType.id === value) {
            return payType.name
          }
        }
      }
    },
    {
      title: '合同日期',
      dataIndex: 'signDate',
      render: (value) => <DateFormatter pattern="Y-MM-DD" value={value}/>
    },
    {
      title: '合同名称',
      dataIndex: 'name',
      render: (value, record) => <div> {record.projectName} - {record.name}</div>
    },
    {
      title: '累计已付款',
      dataIndex: 'auditSum',
      render: (value, record) => <NumberFormat value={value - record.balance} displayType={'text'} thousandSeparator={true} prefix={'￥'}/>,
    },
    {
      title: '尚余款',
      dataIndex: 'balance',
      render: (value) => <NumberFormat value={value} displayType={'text'} thousandSeparator={true} prefix={'￥'}/>,
    },
    {
      title: '操作',
      dataIndex: 'pactNo',
      render: (value, record) => <div className="operateBtn">
        <Link to={`/pact/${value}`}>查看合同</Link>
      </div>
    },
  ]

  return (
    <div>
      <div className="panel panel-default contractL">
        <Table
          {...tableProps}
          columns={columns}
          bordered
          rowKey='id'
          className="table table-small"
        />
      </div>
    </div>
  )
}

export default List
