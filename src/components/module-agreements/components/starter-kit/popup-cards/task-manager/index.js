import CardLayout from '../card-layout'
import taskManagerSVG from 'images/apps/task_manager.svg'

const TaskManagerCard = ({ onViewTask, onCreateTask, className, ...rest }) => {
  const actions = [
    {
      label: 'View All Tasks',
      // todo change the icon
      mdIcon: 'mdi mdi-playlist-check',
      onClick: () => {
        onViewTask && onViewTask()
      },
      withoutBtn: true,
    },
    {
      label: 'Start Creating Tasks',
      mdIcon: 'mdi mdi-playlist-check',
      onClick: () => {
        onCreateTask && onCreateTask()
      },
      withoutBtn: true,
    },
  ]
  return (
    <CardLayout
      actions={actions}
      title="TaskManager"
      subTitle="Create, assign, track and monitor tasks of your teams at a galance."
      background="#6029BB"
      description="Meera Task manager is an advanced fully customizable task managing system, you are allowed to create your own Kanban style task board with custom stream and movable tasks. Tasks created and assigned are automatically connected to the assignee's planner. You can also link tasks to OKRs"
      iconSrc={taskManagerSVG}
      {...rest}
    />
  )
}

export default TaskManagerCard
