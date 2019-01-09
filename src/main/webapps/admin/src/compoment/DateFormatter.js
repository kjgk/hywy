import React, { PureComponent } from 'react'
import moment from 'moment'
export default class DateFormatter extends PureComponent {
  render () {
    const { value, pattern = 'Y-MM-DD HH:mm'} = this.props
    if(value === undefined || value === null) {
      return <span>无</span>
    }
    let text = moment(value)
      .format(pattern)
    return (
      <span>{text}</span>
    )
  }
}
