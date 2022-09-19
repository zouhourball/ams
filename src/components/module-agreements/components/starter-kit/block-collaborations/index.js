import { List, Avatar, FontIcon } from 'react-md'
import collaborationsIcon from 'images/apps/collaborations.svg'
import InfoItem from '../info-item'

import PropTypes from 'prop-types'

import './styles.scss'

export default function BlockCollaborations (props) {
  const { title, desc, onInviteMember, onCreateGroup, ...rest } = props
  const operationList = [
    {
      iconClassName: 'mdi mdi-account-plus',
      label: 'Invite Members',
      onClick: onInviteMember,
    },
    {
      iconClassName: 'mdi mdi-account-multiple-plus',
      label: 'Create Group',
      onClick: onCreateGroup,
    },
  ]
  return (
    <section className="app-starterkit-blockcollaborations-container" {...rest}>
      <div className="app-starterkit-blockcollaborations-content">
        <section className="app-starterkit-blockcollaborations-iconwrapper">
          <img
            className="app-starterkit-blockcollaborations-icon"
            src={collaborationsIcon}
          />
        </section>
        <section>
          <h2 className="app-starterkit-blockcollaborations-title">{title}</h2>
          <p className="app-starterkit-blockcollaborations-desc">{desc}</p>
        </section>
      </div>
      <List className="app-starterkit-blockcollaborations-infolist">
        {operationList.map((m) => (
          <InfoItem
            key={m.label}
            className="app-starterkit-blockcollaborations-infoitem"
            tileClassName="app-starterkit-blockcollaborations-infoitem-tile"
            onClick={(e) => {
              e.stopPropagation()
              m.onClick()
            }}
            leftAvatar={
              <Avatar icon={<FontIcon iconClassName={m.iconClassName} />} />
            }
            primaryText={m.label}
          />
        ))}
      </List>
    </section>
  )
}

BlockCollaborations.defaultProps = {
  title: 'Collaborations',
  desc: 'Meera collaboration will provide you convinient messaging on multiple ways',
}

BlockCollaborations.propTypes = {
  title: PropTypes.string,
  desc: PropTypes.string,
}
