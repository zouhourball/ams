import { Component, Fragment } from 'react'
import { Tooltipped, Avatar, FontIcon, Card, CardTitle, Button } from 'react-md'

import './style.scss'
import UserInfoBySubject from 'components/user-info-by-subject'
import { getPublicUrl } from 'libs/utils/custom-function'

export default class UsersAvatarList extends Component {
  constructor (props) {
    super(props)
    this.state = {
      collapsed: true,
    }
  }
  renderUsersList = () => {
    const { memberList, useSubject } = this.props
    return memberList.map((elem, index) => {
      return (
        <Card
          // onClick={() => navigate(`/manager/lead/${lead.id}`)}
          className="candidate_members_card"
          key={index}
        >
          {!useSubject && (
            <CardTitle
              className="candidate_members_title"
              title={elem.name}
              subtitle={
                <Fragment>
                  <div className="candidate_members_position">{`${
                    elem.title || 'n/a'
                  }`}</div>
                </Fragment>
              }
              avatar={
                <Avatar
                  className="candidate_members_avatar"
                  src={elem.picture}
                  role="presentation"
                />
              }
            />
          )}
          {useSubject && (
            <UserInfoBySubject subject={elem}>
              {(res) => {
                return (
                  <CardTitle
                    className="candidate_members_title"
                    title={res.fullName}
                    subtitle={
                      <Fragment>
                        <div className="candidate_members_position">{`${
                          res.title || 'n/a'
                        }`}</div>
                      </Fragment>
                    }
                    avatar={
                      res.photo &&
                      res.photo.aPIURL && (
                        <Avatar
                          className="candidate_members_avatar"
                          src={getPublicUrl(res.photo.aPIURL)}
                          role="presentation"
                        />
                      )
                    }
                  />
                )
              }}
            </UserInfoBySubject>
          )}
        </Card>
      )
    })
  }
  render () {
    const { maxParticipants, memberList, collapsable, useSubject } = this.props
    const { collapsed } = this.state
    const participants = [...memberList]
    participants.splice(maxParticipants)

    return (
      <Fragment>
        {collapsed && (
          <div className="candidate_members">
            {participants
              ? [
                participants.map((member, indexMember) => {
                  if (participants) {
                    if (!useSubject) {
                      return (
                        <Tooltipped
                          label={member.name}
                          position="right"
                          setPosition
                          key={indexMember}
                        >
                          <span
                            key={indexMember}
                            className="candidate_member"
                          >
                            {member.picture ? (
                              <Avatar
                                src={member.picture}
                                role="presentation"
                              />
                            ) : (
                              <Avatar icon={<FontIcon>person</FontIcon>} />
                            )}
                          </span>
                        </Tooltipped>
                      )
                    } else {
                      return (
                        <UserInfoBySubject subject={member}>
                          {(res) => {
                            return (
                              <Tooltipped
                                label={res.fullName}
                                position="right"
                                setPosition
                                key={indexMember}
                              >
                                <span
                                  key={indexMember}
                                  className="candidate_member"
                                >
                                  {res.photo ? (
                                    <Avatar
                                      src={getPublicUrl(res.photo.aPIURL)}
                                      role="presentation"
                                    />
                                  ) : (
                                    <Avatar
                                      icon={<FontIcon>person</FontIcon>}
                                    />
                                  )}
                                </span>
                              </Tooltipped>
                            )
                          }}
                        </UserInfoBySubject>
                      )
                    }
                  } else {
                    return null
                  }
                }),
                memberList.length > maxParticipants ? (
                  <Tooltipped
                    label={`${
                      memberList.length - maxParticipants
                    } ${'more participants'}`}
                    position="right"
                    setPosition
                  >
                    <span key="abc" className="candidate_member">
                      <Avatar
                        key={maxParticipants}
                        className="candidate_member"
                        role="presentation"
                        onClick={() => {
                          collapsable && this.setState({ collapsed: false })
                        }}
                      >
                        <span className="candidate_remained_members">
                            +{memberList.length - maxParticipants}
                        </span>
                      </Avatar>
                    </span>
                  </Tooltipped>
                ) : (
                  ''
                ),
              ]
              : ''}
          </div>
        )}
        {!collapsed && (
          <Fragment>
            <div className={`candidate_members-cards`}>
              {this.renderUsersList()}
            </div>
            <Button
              icon
              className="candidate_members-collapseButton"
              onClick={() => this.setState({ collapsed: true })}
            >
              arrow_drop_down
            </Button>
          </Fragment>
        )}
      </Fragment>
    )
  }
}
