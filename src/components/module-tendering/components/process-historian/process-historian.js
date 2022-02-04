import { Fragment } from 'react'

import UsersAvatarList from '../../components/user-avatar-list'
import ActionCard from '../../components/user-card'

import './style.scss'

const ProcessHistorian = ({ process }) => {
  const renderActionCards = () => {
    return (
      <div className={`streamsContainer_content_body`}>
        {process.cardData.map((elem, index) => (
          <ActionCard key={index} member={elem} />
        ))}
      </div>
    )
  }
  return (
    <Fragment>
      <div className="streamsContainer">
        <div className={`streamsContainer_header ${process.status}`}>
          <div className="empty-right-arrow" />
          <label onClick={() => null}>{process.title}</label>
          <div className="arrow-right" />
        </div>

        <div className={`streamsContainer_content`}>
          {process.members.length !== 0 && (
            <div className="streamsContainer_content_avatarWrapper">
              <UsersAvatarList
                maxParticipants={5}
                memberList={process.members}
                collapsable={true}
                useSubject={true}
              />
            </div>
          )}

          {renderActionCards()}
        </div>
      </div>
    </Fragment>
  )
}
export default ProcessHistorian
