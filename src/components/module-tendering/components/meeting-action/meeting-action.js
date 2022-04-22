import { useState, useEffect } from 'react'
import { useQuery } from 'react-query'
import { meetings } from 'libs/api/api-tendering'
import { Button } from 'react-md'
import { useSelector } from 'react-redux'
import { get } from 'lodash-es'

import './style.scss'

const MeetingAction = ({ processInstanceId, disabled }) => {
  const [status, setStatus] = useState(null)
  const { data: meeting } = useQuery(
    ['meetingsList', processInstanceId],
    meetings,
  )
  const currentUser = useSelector(
    ({ query }) => query?.DEFAULT?.me?.data?.subject,
  )

  useEffect(() => {
    get(meeting, 'content.0.participants', []).filter(
      (elem) => elem.sub === currentUser,
    ).length !== 0 &&
      setStatus(
        get(meeting, 'content.0.participants', []).filter(
          (elem) => elem.sub === currentUser,
        )[0].status,
      )
  }, [meeting])
  const renderMeetingView = () => {
    switch (status) {
      case 'JOINNED':
        return (
          <Button
            // onClick={() => handleShowMeeting(row?.agendas[0], row.id)}
            onClick={() =>
              meetings &&
              window.open(`meeting/${get(meeting, 'content.0.id', '')}`)
            }
            icon
            disabled={disabled}
            primary
            iconClassName="mdi mdi-eye-outline"
            title="Meeting View"
          />
        )

      case 'PENDING':
        return (
          <div className="btns">
            <Button
              primary
              flat
              // onClick={() => onAccept && onAccept()}
              className="left-panel-asset-btn"
            >
              Accept
            </Button>
            <Button
              primary
              flat
              // onClick={() => onReject && onReject()}
              className="left-panel-asset-btn"
            >
              Reject
            </Button>
          </div>
        )

      case 'DECLINED':
        return <div>rejected</div>

      default:
        return <div />
    }
  }
  return (
    <div className="meeting-action">
      {renderMeetingView()}
      {/* <Button
        // onClick={() => handleShowMeeting(row?.agendas[0], row.id)}
        icon
        disabled={disabled}
        primary
        iconClassName="mdi mdi-eye-outline"
        title="Meeting View"
      /> */}
    </div>
  )
}

export default MeetingAction
