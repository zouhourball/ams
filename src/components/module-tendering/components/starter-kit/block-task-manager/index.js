import PropType from 'prop-types'
import task from 'images/started-kit-cards/task_manager.svg'
import './styles.scss'

const TaskManagerCard = (props) => {
  const { onClick, onButtonClick } = props
  const handleButtonClick = (event) => {
    event.stopPropagation()
    onButtonClick && onButtonClick()
  }
  return (
    <div className="start-task-manager-card" onClick={onClick}>
      <div className="start-task-manager-card-info">
        <span className="start-task-manager-card-title">Task Manager</span>
        <span className="start-task-manager-card-second-title">
          Create, assign, track and monitor tashs of your teams at a galance
        </span>
        <button
          className="start-task-manager-card-button"
          onClick={handleButtonClick}
        >
          Start Creating Tasks
        </button>
      </div>
      <div className="start-task-manager-card-icon">
        <img src={task} className="start-task-manager-card-svg" />
      </div>
    </div>
  )
}
TaskManagerCard.propTypes = {
  onButtonClick: PropType.func,
  onClick: PropType.func,
}
export default TaskManagerCard
