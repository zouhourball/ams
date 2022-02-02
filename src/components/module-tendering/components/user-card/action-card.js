import { Component, Fragment } from 'react'
import { Avatar, Card, CardTitle, CardText, FontIcon } from 'react-md'

import UserInfoBySubject from 'components/user-info-by-subject'

import './style.scss'

export default class ActionCard extends Component {
  constructor (props) {
    super(props)
    this.state = {}
  }
  // renderColor = status => {
  //   if (status === 'Under Review') {
  //     return 'blue'
  //   } else {
  //     return ''
  //   }
  // }
  render () {
    const { member } = this.props
    const { fullName, status, createdAt, avatar, description } = member
    return (
      <Fragment>
        <Card className={`card-hiring_card ${status}`}>
          <>
            <UserInfoBySubject subject={fullName}>
              {(res) => (
                <CardTitle
                  className="card-hiring_title"
                  title={res.fullName || ''}
                  subtitle={
                    <Fragment>
                      <div className="card-hiring_position">
                        {createdAt || 'n/a'}
                      </div>
                      <div className="card-hiring_position" />
                    </Fragment>
                  }
                  avatar={
                    avatar || res.avatar ? (
                      <Avatar
                        className="card-hiring_avatar"
                        src={avatar || res.avatar}
                        role="presentation"
                      />
                    ) : (
                      <Avatar icon={<FontIcon>person</FontIcon>} />
                    )
                  }
                />
              )}
            </UserInfoBySubject>
            <CardText className={`card-hiring_text`}>
              <span>{`${status || 'n/a'}`}</span> {description || 'n/a'}
            </CardText>
          </>
        </Card>
      </Fragment>
    )
  }
}
