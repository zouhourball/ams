import React, { Component } from 'react'
import { Tooltipped, Avatar, FontIcon } from 'react-md'
// import { memberList } from './helpers'

import './style.scss'
import UserInfoBySubject from 'components/user-info-by-subject'
import { getPublicUrl } from 'libs/utils/custom-function'

export default class UsersAvatarList extends Component {
  constructor (props) {
    super(props)
    this.state = {}
  }
  render () {
    const { maxParticipants, memberList } = this.props
    const participants = [...memberList]
    participants.splice(maxParticipants)

    return (
      <div className="candidate_members">
        {participants
          ? [
            participants.map((member, indexMember) => {
              if (participants) {
                return (
                  <UserInfoBySubject subject={member}>
                    {res => (
                      <Tooltipped
                        label={res.fullName}
                        position="right"
                        setPosition
                        key={indexMember}
                      >
                        <span key={indexMember} className="candidate_member">
                          {res.photo ? (
                            <Avatar
                              src={getPublicUrl(res.photo.aPIURL)}
                              role="presentation"
                            />
                          ) : (
                            <Avatar icon={<FontIcon>person</FontIcon>} />
                          )}
                        </span>
                      </Tooltipped>
                    )}
                  </UserInfoBySubject>
                )
              } else {
                return null
              }
            }),
            memberList.length > maxParticipants ? (
              <Tooltipped
                label={`${memberList.length -
                    maxParticipants} ${'more participants'}`}
                position="right"
                setPosition
              >
                {/* <span key="abc" className="candidate_member"> */}
                {/* <Avatar
                    key={maxParticipants}
                    className="candidate_member"
                    role="presentation"
                  > */}
                <span>
                  {`& ${memberList.length - maxParticipants} Others`}
                </span>
                {/* </Avatar> */}
                {/* </span> */}
              </Tooltipped>
            ) : (
              ''
            ),
          ]
          : ''}
      </div>
    )
  }
}
