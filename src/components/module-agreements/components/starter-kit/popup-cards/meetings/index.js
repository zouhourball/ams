import React from 'react'
import CardLayout from '../card-layout'
import meetingsSVG from 'images/apps/meetings.svg'
import createMeetingSVG from 'images/started-kit-cards/create_meeting.svg'
import './styles.scss'

const MeetingsCard = ({
  onCreateMeeting,
  onCreateMeetingBtn,
  className,
  ...rest
}) => {
  const actions = [
    {
      label: 'Create A Meeting',
      iconSrc: createMeetingSVG,
      onClick: () => {
        onCreateMeeting && onCreateMeeting()
      },
      onBtnClick: () => {
        onCreateMeetingBtn && onCreateMeetingBtn()
      },
    },
  ]
  return (
    <CardLayout
      actions={actions}
      className="ws-popupcard-meeting"
      title="Meetings"
      background="#018B97"
      description="Meera Meeting system is a powerful meeting management tool all you to organize and conduct your meetings effectively."
      iconSrc={meetingsSVG}
      {...rest}
    />
  )
}

export default MeetingsCard
