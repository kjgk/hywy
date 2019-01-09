import React from 'react'
import {Form} from 'antd'

const Filter = ({
                  onAdd,
                  onFilterChange,
                  filter,
                  form: {
                    getFieldDecorator,
                    getFieldsValue,
                  },
                }) => {

  const handleSubmit = (e) => {
    e.preventDefault()
    let fields = getFieldsValue()
    onFilterChange(fields)
  }

  const {keyword} = filter

  return (

    <div className="row searchBox">
      <form onSubmit={handleSubmit}>
        <div className="col-xs-4">
          <div className="input-group">
            {getFieldDecorator('keyword', {initialValue: keyword})(
              <input type="text" className="form-control" placeholder="请输入关键字"/>
            )}
            <span className="input-group-btn">
					        <button className="btn btn-default btnSearch" type="submit">搜索</button>
					      </span>
          </div>
        </div>
        <div className="col-xs-4">
          <button className="btn btn-default btnAdd" type="button" onClick={onAdd}><span></span>新增客户</button>
        </div>
      </form>
    </div>
  )
}

export default Form.create()(Filter)
