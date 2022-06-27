import React from 'react'
import PropType from 'prop-types'
import InfoItem from '../info-item'
import createMeeting from 'images/started-kit-cards/create_meeting.svg'
import meeting from 'images/started-kit-cards/meetings.svg'

import './styles.scss'

const BlockMeetings = props => {
  const { onClick, onButtonClick } = props
  return (
    <div className="start-blockmeetings">
      <div className="start-blockmeetings-body" onClick={onClick}>
        <img src={meeting} className="start-blockmeetings-svg" />
        <h2 className="start-blockmeetings-title">Meetings</h2>
        <div className="start-blockmeetings-description">
          Manage and organize your meetings in modern fashion
        </div>
      </div>
      <InfoItem
        key="starter-create-meeting"
        className="start-blockmeeting-infoitem"
        tileClassName="start-blockmeeting-infoitem-tile"
        primaryText={'Create A Meeting'}
        onClick={e => {
          e.stopPropagation()
          onButtonClick()
        }}
        leftAvatar={
          <img src={createMeeting} className="start-blockmeetings-foot-svg" />
        }
      />
    </div>
  )
}
BlockMeetings.propTypes = {
  onClick: PropType.func,
  onButtonClick: PropType.func,
}
export default BlockMeetings
