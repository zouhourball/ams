import cls from 'classnames'
import addSkillSVG from 'images/add-skills.svg'
import cover from 'images/apps/workspace.jpg'
import './styles.scss'

const WorkspaceCard = ({ className, onCreate, onView, ...rest }) => {
  const actoins = [
    {
      label: 'Create Workspace',
      icon: addSkillSVG,
      onClick: () => {
        onCreate && onCreate()
      },
    },
    {
      label: 'View All Workspaces',
      icon: addSkillSVG,
      onClick: () => {
        onView && onView()
      },
    },
  ]
  return (
    <div className={cls('ws-bigcard-workspace', className || '')} {...rest}>
      <img className="ws-bigcard-workspace-img" src={cover} />
      <div className="ws-bigcard-workspace-content">
        <div className="ws-bigcard-workspace-content-inner">
          <div className="ws-bigcard-workspace-content-title">Workspace</div>
          <div className="ws-bigcard-workspace-content-text">
            The Meera workspace allows you to create collabration environment
            for your projects and targets. Join the people you work with
            together and access many handy tools and Apps.
          </div>
        </div>
        <div className="ws-bigcard-workspace-items">
          {actoins.map((i) => (
            <ActionItem onClick={i.onClick} key={i.label} action={i} />
          ))}
        </div>
      </div>
    </div>
  )
}
function ActionItem ({ action }) {
  return (
    <div onClick={action.onClick} className="ws-bigcard-workspace-item">
      <div className="ws-bigcard-workspace-item-icon-wrap">
        <img className="ws-bigcard-workspace-item-icon" src={action.icon} />
      </div>
      <div className="ws-bigcard-workspace-item-label">{action.label}</div>
    </div>
  )
}

export default WorkspaceCard
