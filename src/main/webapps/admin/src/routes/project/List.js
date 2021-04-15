import React from 'react'
import queryString from 'query-string'
import {Table} from 'antd'
import {Link} from 'react-router-dom'

const List = ({onDeleteItem, location, ...tableProps}) => {

  location.query = queryString.parse(location.search)

  const columns = [
    {
      title: '项目名称',
      dataIndex: 'projectName',
      render: (value, record) => <Link to={`/project/${record.projectId}`}>{value}</Link>
    },
    {
      title: '前期合同（份）',
      dataIndex: 'category1',
    },
    {
      title: '设备及安装（份）',
      dataIndex: 'category2',
    },
    {
      title: '其他（份）',
      dataIndex: 'category3',
    },
    {
      title: '三个月以内（份）',
      dataIndex: 'category4',
    },
    {
      title: '合同总计',
      dataIndex: 'total',
    },
  ]

  return (
    <div>
      <div className="panel panel-default contractL">
        <Table
          {...tableProps}
          bordered
          columns={columns}
          rowKey='projectId'
          className="table"
        />
      </div>
    </div>
  )
}

export default List
