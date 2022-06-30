import { Button, Avatar, List } from 'react-md'
import InfoItem from '../info-item'
import PropTypes from 'prop-types'

import './styles.scss'

function nameTransfer (name = '') {
  return name
    .trim()
    .split(/\s|-/)
    .map((i) => i.charAt(0))
    .join('')
    .toUpperCase()
    .substring(0, 3)
}
export default function BlockProfile (props) {
  const { profile, onClick, onActionItemClick, onGoProfile } = props
  const { name, title, avatar } = profile || {}
  const infoList = [
    { label: 'Employment History' },
    { label: 'Education History' },
    { label: 'Skills' },
    { label: 'Projects' },
    { label: 'Interests' },
  ]

  return (
    <section
      className="app-starterkit-blockprofile-container"
      onClick={onClick}
    >
      <section className="app-starterkit-blockprofile-content">
        <h2 className="app-starterkit-blockprofile-name">{name}</h2>
        <h6 className="app-starterkit-blockprofile-title">{title}</h6>
        <div>
          <Avatar className="app-starterkit-blockprofile-avatar" src={avatar}>
            {!avatar && nameTransfer(name || '')}
          </Avatar>
        </div>
        <Button
          className="app-starterkit-blockprofile-btngo"
          flat
          primary
          onClick={onGoProfile}
        >
          {`Go to Profile`} <span>{'→'}</span>
        </Button>
      </section>
      <List className="app-starterkit-blockprofile-infolist">
        {infoList.map((m) => (
          <InfoItem
            key={m.label}
            className="app-starterkit-blockprofile-infoitem"
            tileClassName="app-starterkit-blockprofile-infoitem-tile"
            primaryText={m.label}
            onClick={onActionItemClick}
          />
        ))}
      </List>
    </section>
  )
}

BlockProfile.defaultProps = {
  profile: {
    name: 'N/N',
    title: 'N/N',
  },
}
BlockProfile.propTypes = {
  profile: PropTypes.shape({
    sub: PropTypes.string,
    name: PropTypes.string,
    title: PropTypes.string,
    avatar: PropTypes.string,
  }),
  onGoProfile: PropTypes.func,
  onActionItemClick: PropTypes.func,
  onClick: PropTypes.func,
}
