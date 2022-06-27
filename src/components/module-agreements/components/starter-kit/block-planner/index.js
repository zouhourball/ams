import React from 'react'
import PropType from 'prop-types'
import event from 'images/started-kit-cards/event.svg'
import './styles.scss'

const BlockPlanner = props => {
  const { onClick, onButtonClick } = props
  const handleButtonClick = event => {
    event.stopPropagation()
    onButtonClick && onButtonClick()
  }
  return (
    <div className="start-blockplanner" onClick={onClick}>
      <div className="start-blockplanner-icon">
        <img src={event} className="start-blockplanner-svg" />
      </div>
      <div className="start-blockplanner-info">
        <span className="start-blockplanner-title">
          Don&acute;t miss out your important events, plan your scheduler with
          Meera Planner
        </span>
        <button
          className="start-blockplanner-button"
          onClick={handleButtonClick}
        >
          Create New Event
        </button>
      </div>
    </div>
  )
}
BlockPlanner.propTypes = {
  onClick: PropType.func,
  onButtonClick: PropType.func,
}
export default BlockPlanner
