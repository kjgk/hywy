import React, {Fragment} from 'react'
import {Divider, Icon, Select} from 'antd'

const Option = Select.Option

export default class Component extends React.Component {

  render() {
    const {companyList, onAddCompany} = this.props
    return (
      <Select {...this.props}
              optionFilterProp="children"
              style={{width: '100%'}}
              dropdownRender={menu => (
                <Fragment>
                  {menu}
                  {onAddCompany && <Fragment><Divider style={{margin: '0'}}/>
                    <a style={{padding: '8px', display: 'block', cursor: 'pointer'}} onClick={onAddCompany}>
                      <Icon type="plus"/> 新增客户
                    </a>
                  </Fragment>}
                </Fragment>
              )}
      >
        {companyList && companyList.map((item) => <Option value={item.id} key={item.id}>{item.name}</Option>)}
      </Select>
    )
  }
}
