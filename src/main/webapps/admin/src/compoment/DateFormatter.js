import React, { PureComponent } from 'react'
import moment from 'moment'
export default class DateFormatter extends PureComponent {
  render () {
    const { value, pattern = 'Y-MM-DD HH:mm'} = this.props
    if(value === undefined || value === null) {
      return <span style={this.props.style}> </span>
    }
    let text = moment(value)
      .format(pattern)
    return (
      <span style={this.props.style}>{text}</span>
    )
  }
}
