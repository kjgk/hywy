import React from 'react'
import {Form} from 'antd'
import SimpleSelect from "../../compoment/SimpleSelect"

const Filter = ({
                  onAdd,
                  onFilterChange,
                  filter,
                  payTypes,
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

  const {keyword, payType} = filter

  return (

    <div className="row searchBox">
      <form onSubmit={handleSubmit}>
        <div className="col-xs-2">
          {getFieldDecorator('payType', {
            initialValue: payType && parseInt(payType, 10),
          })(<SimpleSelect size="large" allowClear={true} list={payTypes} onChange={handleSubmit} placeholder="请选择付款类型"/>)}
        </div>
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
      </form>
    </div>
  )
}

export default Form.create()(Filter)
