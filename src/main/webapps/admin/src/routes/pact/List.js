import React from 'react'
import queryString from 'query-string'
import {Table, Divider} from 'antd'
import {Link} from 'react-router-dom'
import NumberFormat from "react-number-format"
import DateFormatter from "../../compoment/DateFormatter"
import "./pact.css"

const List = ({onDeleteItem, location, execStates, ...tableProps}) => {

  location.query = queryString.parse(location.search)

  const getExecStateName = (execState, execStates) => {
    for (let {id, name} of execStates) {
      if (id === execState) {
        return name
      }
    }
  }

  const getCompanyList = (pact) => {
    return <ul className="pact-list-company">{
      [pact.signA, pact.signB, pact.signC, pact.signD]
        .filter(item => item !== undefined)
        .map(company => <li>{company}</li>)
    }</ul>
  }

  const columns = [
    {
      title: '合同编号',
      dataIndex: 'pactNo',
      render: (value, record) => <Link to={`/pact/${value}`}>{record.serialNo} <br/> {(record.serialCode || '')}</Link>
    },
    {
      title: '合同名称',
      dataIndex: 'name',
      render: (value, record) => <div> {record.projectName} <br/> {record.name}</div>
    },
    {
      title: '合同日期',
      dataIndex: 'signDate',
      render: (value, record) => <DateFormatter pattern="Y-MM-DD" value={value}/>
    },
    {
      title: '签订方',
      dataIndex: 'signA',
      render: (value, record) => getCompanyList(record)
    },
    {
      title: '状态',
      dataIndex: 'execState',
      render: (value, record) => getExecStateName(value, execStates)
    },
    {
      title: '审核金额',
      dataIndex: 'auditSum',
      render: (value, record) => <NumberFormat value={value} displayType={'text'} thousandSeparator={true} prefix={'￥'}/>
    },
    {
      title: '已付金额',
      dataIndex: 'balance',
      render: (value, record) => <NumberFormat value={record.auditSum - record.balance} displayType={'text'} thousandSeparator={true} prefix={'￥'}/>
    },
    {
      title: '操作',
      dataIndex: '',
      render: (value, record) => <div className="operateBtn">
        <Link to={`/pact/${record.pactNo}/edit`}>编辑</Link>
        <Link to={`/pact/${record.pactNo}/preview`} target="_blank" >打印</Link>
      </div>
    },
  ]

  return (
    <div>
      <div className="panel panel-default contractL">
        <Table
          {...tableProps}
          bordered
          columns={columns}
          rowKey='pactNo'
          className="table table-small"
        />
      </div>
    </div>
  )
}

export default List
