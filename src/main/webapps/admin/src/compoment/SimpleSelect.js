import React from 'react'
import {Select } from 'antd'

const Option = Select.Option

export default class Component extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      list: props.list,
      value: props.value,
    }
  }

  render() {
    return (
      <Select {...this.props}
              optionFilterProp="children"
              style={{ width: '100%' }}
      >
        {this.state.list.map((item) => <Option value={item.id} key={item.id}>{item.name}</Option>)}
      </Select>
    )
  }
}
