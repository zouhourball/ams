import React, { useRef } from 'react'
import { AccessibleFakeButton, Button } from 'react-md'
import FileManager from './file-manager'
import Workspace from './workspace'
import Jobs from './jobs'
import Collaboration from './collaboration'
import Meetings from './meetings'
import TaskManager from './task-manager'
import Okr from './okr'
import Planner from './planner'
import cn from 'classnames'
import PropTypes from 'prop-types'

import './styles.scss'

export const CARD_TYPE = {
  JOBS: 'jobs',
  WORKSPCAE: 'workspace',
  FILE_MANAGER: 'fileManager',
  COLLABORATION: 'collaboration',
  MEETINGS: 'meetings',
  TASKMANAGER: 'taskManager',
  OKR: 'Okr',
  PLANNER: 'Planner',
}

const CARD_COMP = {
  [CARD_TYPE.JOBS]: Jobs,
  [CARD_TYPE.FILE_MANAGER]: FileManager,
  [CARD_TYPE.WORKSPCAE]: Workspace,
  [CARD_TYPE.COLLABORATION]: Collaboration,
  [CARD_TYPE.MEETINGS]: Meetings,
  [CARD_TYPE.TASKMANAGER]: TaskManager,
  [CARD_TYPE.OKR]: Okr,
  [CARD_TYPE.PLANNER]: Planner,
}
const PopupCards = props => {
  const {
    visible,
    type,
    position,
    onHide,
    onStarterKitHide,
    history,
    setCreateWsVisible,
    ...rest
  } = props
  const cardEle = useRef(null)
  const hideStarteKit = () => {
    onHide()
    onStarterKitHide()
  }
  function handleWorkspaceCreate () {
    hideStarteKit()
    setCreateWsVisible(true)
    window.open(`${PRODUCT_WORKSPACE_URL}/workspace`)
  }
  function handleWorkspaceView () {
    hideStarteKit()
    window.open(`${PRODUCT_WORKSPACE_URL}/workspace`)
  }
  function handleTaskCreate () {
    hideStarteKit()
    window.open(`${PRODUCT_WORKSPACE_URL}/ws-task-manager`)
  }
  function handleOkrDefine () {
    hideStarteKit()
    window.open(PRODUCT_APP_URL_OKR)
  }
  function openEDGE () {
    window.open(PRODUCT_APP_URL_EDGE)
  }
  function openPlanner () {
    window.open(PRODUCT_APP_URL_PLANNER)
  }
  const CARD_HANDLERS = {
    [CARD_TYPE.WORKSPCAE]: {
      onCreate: handleWorkspaceCreate,
      onView: handleWorkspaceView,
    },
    [CARD_TYPE.TASKMANAGER]: {
      onViewTask: handleTaskCreate,
      onCreateTask: handleTaskCreate,
    },
    [CARD_TYPE.FILE_MANAGER]: {
      onUpload: openEDGE,
      onViewFile: openEDGE,
      onShareFile: openEDGE,
    },
    [CARD_TYPE.OKR]: {
      onDefineObj: handleOkrDefine,
    },
    [CARD_TYPE.MEETINGS]: {
      onCreateMeeting: () => {
        hideStarteKit()
        window.open(`${PRODUCT_WORKSPACE_URL}/meetings`)
      },
    },
    [CARD_TYPE.PLANNER]: {
      onCreateEvent: openPlanner,
    },
  }

  function renderCard (type) {
    if (type) {
      let CardComp = CARD_COMP[type]
      let handlers = CARD_HANDLERS[type] || {}
      return (
        <CardComp
          id={'app-popup-card'}
          ref={cardEle}
          style={{
            position: 'absolute',
            ...position,
          }}
          {...handlers}
        />
      )
    }
  }
  function hideOverlay (e) {
    if (!document.getElementById('app-popup-card').contains(e.target)) {
      onHide(e)
    }
  }

  return (
    <AccessibleFakeButton
      id="app-popup-cards-temporary-overlay"
      // ref={overlayEle}
      className={cn(
        'md-overlay app-starterkit-popupcards-overlay',
        {
          'md-overlay--active': visible,
        },
        'powerlevel-over-9000',
      )}
      {...rest}
      onClick={hideOverlay}
    >
      <Button
        className="app-starterkit-popupcards-btnclose"
        icon
        onClick={onHide}
      >
        close
      </Button>
      {renderCard(type)}
    </AccessibleFakeButton>
  )
}

PopupCards.propTypes = {
  position: {
    top: PropTypes.string,
    right: PropTypes.string,
    bottom: PropTypes.string,
    left: PropTypes.string,
  },
}

export default PopupCards
