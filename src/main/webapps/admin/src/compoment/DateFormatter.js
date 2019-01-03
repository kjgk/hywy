import React, { PureComponent } from 'react'
import moment from 'moment'
export default class DateFormatter extends PureComponent {
  render () {
    const { value, pattern = 'Y-MM-DD HH:mm'} = this.props
    let text = moment(value)
      .format(pattern)
    return (
      <span>{text}</span>
    )
  }
}
