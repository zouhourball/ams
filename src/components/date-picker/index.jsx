import { Component } from 'react'
import { FontIcon } from 'react-md'
import onClickOutside from 'react-onclickoutside'
import PropTypes from 'prop-types'
import { format } from 'date-fns'
import { DatePicker } from '@target-energysolutions/date-picker'
import './styles.scss'

@onClickOutside
export default class Picker extends Component {
  static propTypes = {
    startDate: PropTypes.String,
    endDate: PropTypes.String,
  }
  state = {
    visible: false,
  }
  handleClick = () => {
    const oldVisible = this.state.visible
    this.setState({
      visible: !oldVisible,
    })
  }
  handleClickOutside = () => {
    this.setState({
      visible: false,
    })
  }
  handleDatePickCancel = () => {
    this.setState({
      visible: false,
    })
  }
  handleUpdateDate = (start, end) => {
    this.setState({ visible: false })
    this.props.updateDateRange({
      startDate: start.timestamp,
      endDate: end.timestamp,
    })
  }
  timestamp2Date = (date) => {
    const newDate = new Date(date)
    return {
      year: newDate.getFullYear(),
      month: newDate.getMonth() + 1,
      day: newDate.getDate(),
    }
  }
  render () {
    const { visible } = this.state
    return (
      <div className="datepicker">
        <span>Date Range:</span>
        <span className="datepicker-label">
          {this.props.startDate
            ? format(this.props.startDate, 'dd/MM/yyyy')
            : ''}
          -{this.props.endDate ? format(this.props.endDate, 'dd/MM/yyyy') : ''}
        </span>
        <div className="datepicker-icon">
          <FontIcon
            iconClassName="mdi mdi-calendar-range"
            onClick={this.handleClick}
          />
          <DatePicker
            className={visible ? '' : 'disable'}
            visible={visible}
            startDate={
              this.props.startDate
                ? this.timestamp2Date(this.props.startDate)
                : {}
            }
            endDate={
              this.props.endDate ? this.timestamp2Date(this.props.endDate) : {}
            }
            startView="year"
            endView="day"
            onUpdate={this.handleUpdateDate}
            onCancel={this.handleDatePickCancel}
          />
        </div>
      </div>
    )
  }
}
