import { Component } from 'react'
import { ListItem, MenuButton, Button, Avatar } from 'react-md'
import { get } from 'lodash-es'

import UserInfoBySubject from 'components/user-info-by-subject'

import { getPublicUrl } from 'libs/utils/custom-function'

import './style.scss'

class MeetingCard extends Component {
  constructor (props) {
    super(props)
    this.state = {}
  }
  renderStatus = () => {
    const { status, onAcceptMeeting, onRejectMeeting, meetingId } = this.props
    switch (status) {
      case 'PENDING':
        return (
          <div className="meeting-card-container-Content-status-pending-btn">
            <Button
              className="meeting-card-container-Content-status-pending-btn-reject"
              flat
              onClick={(e) => {
                e.stopPropagation()
                onRejectMeeting(meetingId)
              }}
            >
              Reject
            </Button>
            <Button
              className="meeting-card-container-Content-status-pending-btn-accept"
              flat
              primary
              onClick={(e) => {
                e.stopPropagation()
                onAcceptMeeting(meetingId)
              }}
            >
              Accept
            </Button>
          </div>
        )
      case 'JOINNED':
        return (
          <div className="meeting-card-container-Content-status-label joined">
            Joined
          </div>
        )
      case 'DECLINED':
        return (
          <div className="meeting-card-container-Content-status-label declined">
            Declined
          </div>
        )
      case 'LEFT':
        return (
          <div className="meeting-card-container-Content-status-label left">
            Left
          </div>
        )
    }
  }

  render () {
    const {
      meetingTitle,
      members,
      menuButton,
      meetingTime,
      requestTitle,
      workspaceId,
      meetingId,
    } = this.props
    return (
      <div
        className="meeting-card md-cell md-cell--3"
        onClick={() => {
          window.location.href = `${PRODUCT_WORKSPACE_URL}/workspace/meeting/${workspaceId}/${meetingId}`
        }}
      >
        <div className="meeting-card-container">
          <div>
            <div className="meeting-card-container-Content">
              {meetingTime && (
                <div className="meeting-card-container-Content-DateTime">
                  {meetingTime}
                </div>
              )}
              {requestTitle && (
                <div className="meeting-card-container-Content-requestTitle">
                  {requestTitle}
                </div>
              )}
              {menuButton && (
                <MenuButton
                  id="menu-button-2"
                  className="vertical-button"
                  icon
                  menuItems={
                    menuButton &&
                    menuButton.map((item) => (
                      <ListItem key={1} primaryText={item} />
                    ))
                  }
                  listInline
                  centered
                  anchor={{
                    x: MenuButton.HorizontalAnchors.CENTER,
                    y: MenuButton.VerticalAnchors.CENTER,
                  }}
                >
                  more_vert
                </MenuButton>
              )}
            </div>

            {meetingTitle && (
              <div className="meeting-card-container-Content-text">
                {meetingTitle}
              </div>
            )}
          </div>

          {this.renderStatus() && (
            <div className="meeting-card-container-Content-avatar">
              {members && (
                <div className="meeting-card-container-Content-avatar-md-list-unstyled">
                  {(members.length > 4 ? members.slice(0, 3) : members).map(
                    (member) => (
                      <UserInfoBySubject key={member.sub} subject={member.sub}>
                        {(res) =>
                          get(res, 'photo.aPIURL', null) ? (
                            <Avatar
                              key={member.id}
                              className="meeting-card-container-Content-avatar-md-list-unstyled-img"
                              src={getPublicUrl(res.photo.aPIURL)}
                            />
                          ) : (
                            <Avatar
                              key={member.id}
                              className="meeting-card-container-Content-avatar-md-list-unstyled-img"
                            >
                              {res && res.fullName ? res.fullName[0] : ''}
                            </Avatar>
                          )
                        }
                      </UserInfoBySubject>
                    ),
                  )}
                  {members.length > 4 && (
                    <Avatar className="meeting-card-container-Content-avatar-md-list-unstyled-plus">
                      {`+${members.length - 3}`}
                    </Avatar>
                  )}
                </div>
              )}
            </div>
          )}

          {this.renderStatus() && (
            <div className="meeting-card-container-Content-status">
              {this.renderStatus()}
            </div>
          )}
        </div>
      </div>
    )
  }
}
export default MeetingCard
