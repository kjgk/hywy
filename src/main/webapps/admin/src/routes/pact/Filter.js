import React from 'react'
import {Form} from 'antd'
import SimpleSelect from '../../compoment/SimpleSelect'
import ProjectSelect from "../../compoment/ProjectSelect"

const Filter = ({
                  onAdd,
                  onFilterChange,
                  filter,
                  execStates,
                  form: {
                    getFieldDecorator,
                    getFieldsValue,
                  },
                }) => {

  const handleSubmit = (e) => {
    if (e && e.preventDefault) {
      e.preventDefault()
    }
    setTimeout(() => {
      onFilterChange(getFieldsValue())
    })
  }

  const {keyword, execState, projectId} = filter

  return (
    <div className="row searchBox">
      <form onSubmit={handleSubmit}>
        <div className="col-xs-2">
          {getFieldDecorator('projectId', {
            initialValue: projectId,
          })(<ProjectSelect size="large" allowClear={true} onChange={handleSubmit} placeholder="所属项目"/>)}
        </div>
        <div className="col-xs-2">
          {getFieldDecorator('execState', {
            initialValue: execState && parseInt(execState, 10),
          })(<SimpleSelect size="large" allowClear={true} list={execStates} onChange={handleSubmit} placeholder="请选择状态"/>)}
        </div>
        <div className="col-xs-4">
          <div className="input-group">
            {getFieldDecorator('keyword', {initialValue: keyword || ''})(
              <input type="text" className="form-control" placeholder="请输入关键字"/>
            )}
            <span className="input-group-btn">
					        <button className="btn btn-default btnSearch" type="submit">搜索</button>
					      </span>
          </div>
        </div>
        <div className="col-xs-4">
          <button className="btn btn-default btnAdd" type="button" onClick={onAdd}><span className="fa fa-plus"></span>新增合同</button>
        </div>
      </form>
    </div>
  )
}

export default Form.create()(Filter)
