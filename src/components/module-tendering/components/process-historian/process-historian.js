import { Component, Fragment } from 'react'

import UsersAvatarList from '../../components/user-avatar-list'
import ActionCard from '../../components/user-card'

import './style.scss'

export default class ProcessHistorian extends Component {
  constructor (props) {
    super(props)
    this.state = {}
  }
  componentDidMount () {
    // const { hidePrimaryTopBar } = this.props
    // hidePrimaryTopBar()
  }
  renderActionCards = () => {
    const { process } = this.props
    return (
      <div className={`streamsContainer_content_body`}>
        {process.cardData.map((elem, index) => (
          <ActionCard key={index} member={elem} />
        ))}
      </div>
    )
  }
  render () {
    const { process } = this.props
    return (
      <Fragment>
        <div className="streamsContainer">
          <div className={`streamsContainer_header ${process.status}`}>
            <label onClick={() => null}>{process.title}</label>
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

            {this.renderActionCards()}
          </div>
        </div>
      </Fragment>
    )
  }
}
