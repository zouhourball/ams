import { navigate } from '@reach/router'

import overviewActive from 'images/submodules/over_view_enable.svg'
import timelineActive from 'images/submodules/timeline_enable.svg'
import membersActive from 'images/submodules/member.svg'
import activitiesActive from 'images/submodules/activities_enable.svg'
import tasksActive from 'images/submodules/tasks_enable.svg'
import workspaceActive from 'images/submodules/workspace_enable.svg'
import filesActive from 'images/submodules/files_enable.svg'
import sprintsActive from 'images/submodules/sprints_enable.svg'

import overview from 'images/submodules/over_view_disabled.svg'
import timeline from 'images/submodules/timeline_disabled.svg'
import members from 'images/submodules/members_disabled.svg'
import activities from 'images/submodules/activities_disabled.svg'
import tasks from 'images/submodules/tasks_disabled.svg'
import workspace from 'images/submodules/workspace_disabled.svg'
import files from 'images/submodules/files_disabled.svg'
import sprints from 'images/submodules/sprints_disabled.svg'

import image from 'images/submodules/commercial.svg'

import { Button } from 'react-md'

import { getPublicUrl } from 'libs/utils/custom-function'

const onClickSubModule = (val, id) => {
  navigate(`/projects/${val}/${id}`)
}
export const appListInvestor = id => [
  {
    icon: overview,
    activeIcon: overviewActive,
    text: 'Overview',
    key: 'overview',
    onClick: val => onClickSubModule(val, id),
  },
  {
    icon: timeline,
    activeIcon: timelineActive,
    text: 'Timeline',
    key: 'timeline',
    onClick: val => onClickSubModule(val, id),
  },
  {
    icon: members,
    activeIcon: membersActive,
    text: 'Members',
    key: 'members',
    onClick: val => onClickSubModule(val, id),
  },
  {
    icon: sprints,
    activeIcon: sprintsActive,
    text: 'Sprints',
    key: 'sprints',
    onClick: val => onClickSubModule(val, id),
  },
  {
    icon: tasks,
    activeIcon: tasksActive,
    text: 'Tasks',
    key: 'tasks',
    onClick: val => onClickSubModule(val, id),
  },
  {
    icon: workspace,
    activeIcon: workspaceActive,
    text: 'Workspaces',
    key: 'workspaces',
    onClick: val => onClickSubModule(val, id),
  },
  {
    icon: activities,
    activeIcon: activitiesActive,
    text: 'Activities',
    key: 'activities',
    onClick: val => onClickSubModule(val, id),
  },

  {
    icon: files,
    activeIcon: filesActive,
    text: 'Files',
    key: 'files',
    onClick: val => onClickSubModule(val, id),
  },
]
export const currentModule = (id, name, img) => {
  return (
    <div className="title">
      <Button
        icon
        iconClassName="mdi mdi-arrow-left"
        className={`backButton`}
        // onClick={() => navigate(`/novm/${key}/${investorId}`)}
        // onClick={() => navigate(`/projects/list`)}
      />
      <img src={getPublicUrl(img) || image} width="30px" />
      <div className="project-name">{name}</div>
    </div>
  )
}
