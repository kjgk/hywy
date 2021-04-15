import React from 'react'
import {Select} from 'antd'
import service from '../services/project'

const Option = Select.Option

let list

export default class Component extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      list: list || [],
      value: props.value,
    }
  }

  componentDidMount() {
    if (list === undefined || list.length === 0) {
      this.initStatus()
    }
  }

  async initStatus() {
    list = await service.getAccCodeList()
    this.setState({
      list,
    })
  }

  render() {
    return (
      <Select {...this.props}
              optionFilterProp="children"
              style={{width: '100%'}}
      >
        {this.state.list.map((item) => <Option value={item.id} key={item.id}>{item.name}</Option>)}
      </Select>
    )
  }
}
