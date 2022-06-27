import React from 'react'
import PropType from 'prop-types'
import upgrade from 'images/started-kit-cards/upgrade.svg'
import './styles.scss'

const UpgradeCard = props => {
  const { onClick, onButtonClick } = props
  const handleButtonClick = event => {
    event.stopPropagation()
    onButtonClick && onButtonClick()
  }
  return (
    <div className="start-upgrade-card" onClick={onClick}>
      <div className="start-upgrade-card-info">
        <div className="start-upgrade-card-title">Get more out of Meera</div>
        <div className="start-upgrade-card-title">- Go Premium</div>
        <button
          className="start-upgrade-card-button"
          onClick={handleButtonClick}
        >
          Upgrade Account
        </button>
      </div>
      <img src={upgrade} className="start-upgrade-card-svg" />
    </div>
  )
}
UpgradeCard.propTypes = {
  onClick: PropType.func,
  onButtonClick: PropType.func,
}
export default UpgradeCard
