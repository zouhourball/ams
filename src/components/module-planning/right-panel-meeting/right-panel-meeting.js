import { Button } from 'react-md'

import MeetingCard from '../meeting-card'

import './style.scss'
const RightPanelMeeting = ({ onCreate, visible, onClose, meetings }) => {
  const renderMeetingList = () => {
    return meetings?.map((meeting) => {
      return (
        <MeetingCard
          key={meeting?.id}
          onNavigateToMeeting={
            () => window.open(`${PRODUCT_APP_URL_FLUXBLE_MEETING}/meeting-home`)
            // window.open(
            //   `${PRODUCT_APP_URL_FLUXBLE_MEETING}/meeting/${meeting?.id}`,
            // )
          }
          meetings={{
            title: meeting?.title,
            startDate: meeting?.startDate,
            endDate: meeting?.endDate,
            subject: meeting?.organizer?.sub,
          }}
        />
      )
    })
  }
  return (
    <div className={`left-panel-asset ${visible ? '' : 'isClose'}`}>
      <div className="left-panel-asset-top">
        <div className="left-panel-asset-header">
          <div className="title">Meetings Today</div>
          <Button icon onClick={onClose}>
            close
          </Button>
        </div>

        <div className="left-panel-asset-searchWrapper">
          <div className="filterWrapper"></div>
        </div>
      </div>
      <div className="left-panel-asset-content">{renderMeetingList()}</div>
      <Button
        primary
        flat
        onClick={() => onCreate && onCreate()}
        className="left-panel-asset-btn"
      >
        Create New Meeting
      </Button>
    </div>
  )
}
export default RightPanelMeeting
RightPanelMeeting.defaultProps = {
  meetings: [
    {
      title: 'Meeting ABC Title will bementioned here…',
      date: '12:30 PM - 2:00 PM',
      subject: '',
    },
    {
      title: 'Meeting ABC Title will bementioned here…',
      date: '12:30 PM - 2:00 PM',
      subject: '',
    },
  ],
}
