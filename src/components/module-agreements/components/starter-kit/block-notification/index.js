import React from 'react'
import PropType from 'prop-types'
import notification from 'images/started-kit-cards/notifications.svg'
import './styles.scss'

const NotificationCard = props => {
  const { onClick } = props
  return (
    <div className="notification-card" onClick={onClick}>
      <div className="notification-card-info">
        <span className="notification-card-title">Notification</span>
        <br />
        <span className="notification-card-description">
          You will be notified for any messages/events that need your attention
        </span>
      </div>
      <img src={notification} className="notification-card-svg" />
    </div>
  )
}
NotificationCard.propTypes = {
  onClick: PropType.func,
}
export default NotificationCard
