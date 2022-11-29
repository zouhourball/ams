import { useState, useEffect } from 'react'
import { useQuery, useMutation } from 'react-query'
import { meetings } from 'libs/api/api-tendering'
import { Button } from 'react-md'
import { useSelector, useDispatch } from 'react-redux'
import { get } from 'lodash-es'

import { addToast } from 'modules/app/actions'
import { respondToMeeting } from 'libs/api/api-planning'

import ToastMsg from '../../components/toast-msg'

import './style.scss'

const MeetingAction = ({ processInstanceId, disabled }) => {
  const dispatch = useDispatch()

  const [status, setStatus] = useState(null)
  const { data: meeting, refetch } = useQuery(
    ['meetingsList', processInstanceId],
    meetings,
    {
      refetchOnWindowFocus: false,
    },
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
  const respondToMeetingMutation = useMutation(respondToMeeting, {
    onSuccess: (res) => {
      if (!res.error) {
        dispatch(
          addToast(
            <ToastMsg text={res.message || 'success'} type="success" />,
            'hide',
          ),
        )
      } else {
        dispatch(
          addToast(
            <ToastMsg
              text={res.error?.body?.message || 'Something went wrong'}
              type="error"
            />,
            'hide',
          ),
        )
      }
    },
  })

  const respondToMeetingHandler = (status, id) => {
    respondToMeetingMutation.mutate(
      {
        id,
        status,
      },
      {
        onSuccess: () => {
          refetch()
        },
      },
    )
  }
  const renderMeetingView = () => {
    switch (status) {
      case 'JOINNED':
        return (
          <Button
            onClick={() => {
              window.open(`meeting/${get(meeting, 'content.0.id', '')}`)
            }}
            icon
            disabled={false || disabled} // DISABLED THIS FEATURE TEMPORARY
            primary
            iconClassName="mdi mdi-eye-outline"
            title="Meeting View"
          />
        )

      case 'PENDING':
        return (
          <div>
            <Button
              // icon
              disabled={disabled}
              primary
              title="Accept Meeting"
              onClick={() =>
                respondToMeetingHandler(
                  'accept',
                  get(meeting, 'content.0.id', ''),
                )
              }
            >
              {/* event_available */}
              Accept
            </Button>

            <Button
              // icon
              disabled={disabled}
              primary
              title="Reject Meeting"
              onClick={() =>
                respondToMeetingHandler(
                  'reject',
                  get(meeting, 'content.0.id', ''),
                )
              }
              className="rejected"
            >
              {/* event_busy */}
              Reject
            </Button>
          </div>
        )

      case 'DECLINED':
        return (
          <Button
            icon
            disabled={true}
            // primary
            title="Meeting Rejected"
            className="rejected"
          >
            close
          </Button>
        )

      default:
        return <div />
    }
  }
  return <div className="meeting-action">{renderMeetingView()}</div>
}

export default MeetingAction
