import { useState } from 'react'
import { Button } from 'react-md'
import moment from 'moment'

import { DatePicker } from '@target-energysolutions/date-picker'

import './navigate-bar.scss'

export default function NavigateBar ({
  // data,
  date,
  // selectedTab,
  // onChangeTab,
  // handleClickAdd,
  handleStartDate,
  // canCreateMeeting,
  meetingsCount,
}) {
  const [visibleDate, setVisibleDate] = useState(false)

  // const renderList = () => {
  //   return (
  //     data &&
  //     data.map(({ name, length }, index) => (
  //       <li
  //         key={index}
  //         className={`navigate-bar-list-element ${
  //           selectedTab === name ? 'active' : ''
  //         }`}
  //         onClick={() => {
  //           onChangeTab(name)
  //         }}
  //       >
  //         <span>{length}</span>
  //         {name}
  //       </li>
  //     ))
  //   )
  // }
  const testDateToday = () => {
    // const { absoluteRange } = this.props
    const absoluteRange = true
    const endDatameetings = null
    const today = moment().format('dddd DD/MM/YYYY')
    if (!endDatameetings && !absoluteRange) {
      if (today === date) return `Today`
      else return `in ${date}`
    } else if (endDatameetings && !absoluteRange) {
      if (today === date) return `from Today to ${endDatameetings}`
      else return `from ${date} to ${endDatameetings}`
    } else {
      if (today === date) return ``
      else return `starting from ${date}`
    }
  }
  return (
    <div className="navigate-bar">
      <div className="navigate-bar-text">
        {/* <ul className="navigate-bar-list">{renderList()}</ul> */}
        you have {meetingsCount || 'no'} Meeting{meetingsCount !== 1 ? 's' : ''}{' '}
        {testDateToday()}
      </div>

      <div className="navigate-bar-filters">
        <div className="navigate-bar-leftBar">
          {date}
          <Button icon>chevron_right</Button>
          <Button
            icon
            iconClassName="mdi mdi-calendar-today"
            className="today"
            onClick={() => setVisibleDate(true)}
          ></Button>
          {visibleDate && (
            <DatePicker
              singlePick
              startView="year"
              endView="day"
              defaultView="day"
              className="meeting-date"
              translation={{ update: 'select' }}
              onUpdate={(value) => {
                handleStartDate(value)
                setVisibleDate(false)
              }}
              onCancel={() => setVisibleDate(false)}
            />
          )}
          {/* {canCreateMeeting && (
            <Button
              flat
              primary
              iconChildren="add_circle"
              onClick={handleClickAdd}
              className="add_circle"
            >
              Create Meetings
            </Button>
          )} */}
        </div>
      </div>
    </div>
  )
}
