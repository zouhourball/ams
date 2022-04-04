import { Avatar } from 'react-md'
import { getPublicUrl } from 'libs/utils/custom-function'
import { get } from 'lodash-es'
import moment from 'moment'

import UserInfoBySubject from 'components/user-info-by-subject'

import './style.scss'

const MeetingCard = ({ meetings, onNavigateToMeeting }) => {
  const { title, startDate, endDate, subject } = meetings
  return (
    <div
      className="meeting-card"
      onClick={() => onNavigateToMeeting && onNavigateToMeeting()}
    >
      <div className="meeting-card-title">{title}</div>
      <div className="meeting-card-time">
        {`${moment(new Date(startDate)).format('HH:mm A')} - ${moment(
          new Date(endDate),
        ).format('HH:mm A')}`}
      </div>
      <UserInfoBySubject subject={subject}>
        {(res) => (
          <div className="submittedBy">
            <Avatar
              src={
                get(res, 'photo.aPIURL', null)
                  ? getPublicUrl(res.photo.aPIURL)
                  : null
              }
              className="submittedBy-avatar"
            >
              {get(res, 'photo.aPIURL', null)
                ? null
                : get(res, 'fullName.0', '')}
            </Avatar>
            {res ? res.fullName : 'N/A'}
          </div>
        )}
      </UserInfoBySubject>
    </div>
  )
}
export default MeetingCard
