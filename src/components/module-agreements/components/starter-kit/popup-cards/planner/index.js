import CardLayout from '../card-layout'
import plannerSVG from 'images/apps/planner.svg'
import calendarSVG from 'images/started-kit-cards/calendar.svg'
import './styles.scss'

const PlannerCard = ({
  onCreateEvent,
  onCreateEventBtn,
  className,
  ...rest
}) => {
  const actions = [
    {
      label: 'Create Event',
      iconSrc: calendarSVG,
      iconClassName: 'popup-card-planner-icon',
      onClick: () => {
        onCreateEvent && onCreateEvent()
      },
      onBtnClick: () => {
        onCreateEventBtn && onCreateEventBtn()
      },
    },
  ]
  return (
    <CardLayout
      className="ws-popupcard-planner"
      actions={actions}
      title={`Don’t miss out your important events,
    Plan your scheduler with Meera Planner`}
      background="#CE0239"
      description="Meera Planner is your personal professional calendar where centralize your important event, critical deadlines, and personal events etc. It's connected to the entire Meera platform, allows you to quickly navigate to the related App page."
      iconSrc={plannerSVG}
      {...rest}
    />
  )
}

export default PlannerCard
