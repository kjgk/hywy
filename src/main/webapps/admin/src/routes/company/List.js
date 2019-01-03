import React from 'react'
import queryString from 'query-string'
import {Table, Modal} from 'antd'

const List = ({onDeleteItem, onEditItem, location, ...tableProps}) => {

  location.query = queryString.parse(location.search)

  const handleEdit = (record) => {
    onEditItem(record)
  }

  const handleDelete = (record) => {
    Modal.confirm({
      title: '信息提示',
      content: '确定要删除该数据吗?',
      okType: 'danger',
      onOk() {
        onDeleteItem(record.id)
      },
    })
  }

  const columns = [
    {
      title: '编号',
      dataIndex: 'id',
    },
    {
      title: '名称',
      dataIndex: 'name',
    },
    {
      title: '简称',
      dataIndex: 'alias',
    },
    {
      title: '操作',
      width: 120,
      dataIndex: '',
      render: (text, record) => {
        return <div className="operateBtn">
          <a onClick={() => {
            handleEdit(record)
          }}><i className="fa fa-edit"/>编辑</a>
          <a onClick={() => {
            handleDelete(record)
          }}><i className="fa fa-trash-o"/>删除</a>
        </div>
      },
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
          className="table"
        />
      </div>
    </div>
  )
}

export default List
