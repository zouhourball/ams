import React, { useRef, Fragment, useState } from 'react'
import { Button } from 'react-md'
import BlockNotification from './block-notification'
import BlockFileManager from './block-file-manager'
import BlockMeetings from './block-meetings'
import BlockPlanner from './block-planner'
import BlockTaskManager from './block-task-manager'
import BlockUpgrade from './block-upgrade'
import BlockInventory from './block-inventory'
import BlockRoadSafety from './block-road-safety'
import BlockReport from './block-report'
import BlockOptimization from './block-optimization'
import BlockAssets from './block-assets'
import BlockProfile from './block-profile'
import BlockWorkspace from './block-workspace'
import BlockOKR from './block-okr'
import BlockCollaborations from './block-collaborations'
import BlockJobs from './block-jobs'
import PopupCards, { CARD_TYPE } from './popup-cards'
import { getPublicUrl } from 'libs/utils/custom-function'
import cn from 'classnames'
import './styles.scss'

export default function StarterKit (props) {
  const { visible, onHide, me, history, setCreateWsVisible } = props
  const overlayEle = useRef(null)
  const [popupType, setPopupType] = useState(null)
  const [popupVisible, setPopupVisible] = useState(false)
  const [popupPosition, setPopupPosition] = useState(false)

  const handleBlockClick = (type, e) => {
    const target = e.currentTarget
    let isRight = false
    if (target.offsetLeft > overlayEle.current.clientWidth / 2) {
      isRight = true
    }
    setPopupPosition({
      ...(!isRight
        ? { left: e.currentTarget.offsetLeft }
        : {
          right:
              overlayEle.current.clientWidth -
              (target.offsetLeft + target.clientWidth),
        }),
      top: target.offsetTop,
    })
    setPopupType(type)
    setPopupVisible(true)
  }

  return (
    <Fragment>
      <div
        id="temporary-overlay"
        ref={overlayEle}
        className={cn(
          'md-overlay app-starterkit-overlay',
          {
            'md-overlay--active': visible,
          },
          'powerlevel-over-9000',
        )}
      >
        <Button className="app-starterkit-btnclose" icon onClick={onHide}>
          close
        </Button>
        <section className="app-starterkit-block-container">
          <div className="app-starterkit-block-item app-starterkit-block-item--profile">
            <BlockProfile
              profile={{
                name: me && me.fullName,
                title: me && me.title,
                avatar:
                  me && me.pictureURL ? getPublicUrl(me.pictureURL) : null,
              }}
              onGoProfile={() => window.open(PRODUCT_APP_URL_PROFILE)}
              onActionItemClick={() => window.open(PRODUCT_APP_URL_PROFILE)}
            />
          </div>
          <div
            className="app-starterkit-block-item app-starterkit-block-item--workspace"
            onClick={e => handleBlockClick(CARD_TYPE.WORKSPCAE, e)}
          >
            <BlockWorkspace
              onCreateClick={() => {
                onHide()
                window.open(`${PRODUCT_WORKSPACE_URL}/workspace`)
                setCreateWsVisible(true)
              }}
            />
          </div>
          <div className="app-starterkit-block-item app-starterkit-block-item--notification">
            <BlockNotification
              onClick={() => {
                onHide()
                window.open(`${PRODUCT_WORKSPACE_URL}/workspace/notification`)
              }}
            />
          </div>
          <div
            className="app-starterkit-block-item app-starterkit-block-item--fm"
            onClick={e => handleBlockClick(CARD_TYPE.FILE_MANAGER, e)}
          >
            <BlockFileManager
              onButtonClick={() => {
                window.open(PRODUCT_APP_URL_EDGE)
              }}
            />
          </div>
          <div
            className="app-starterkit-block-item app-starterkit-block-item--okr"
            onClick={e => handleBlockClick(CARD_TYPE.OKR, e)}
          >
            <BlockOKR />
          </div>
          <div
            className="app-starterkit-block-item app-starterkit-block-item--meetings"
            onClick={e => handleBlockClick(CARD_TYPE.MEETINGS, e)}
          >
            <BlockMeetings
              onButtonClick={() => {
                onHide()
                window.open(`${PRODUCT_WORKSPACE_URL}/meetings`)
              }}
            />
          </div>
          <div className="app-starterkit-block-item app-starterkit-block-item--upgrade">
            <BlockUpgrade
              onButtonClick={() => {
                onHide()
                window.open(`${PRODUCT_WORKSPACE_URL}/upgrade`)
              }}
            />
          </div>
          <div
            className="app-starterkit-block-item app-starterkit-block-item--collaborations"
            onClick={e => handleBlockClick(CARD_TYPE.COLLABORATION, e)}
          >
            <BlockCollaborations
              onInviteMember={() => {}}
              onCreateGroup={() => {}}
            />
          </div>
          <div
            className="app-starterkit-block-item app-starterkit-block-item--planner"
            onClick={e => handleBlockClick(CARD_TYPE.PLANNER, e)}
          >
            <BlockPlanner
              onButtonClick={() => {
                window.open(PRODUCT_APP_URL_PLANNER)
              }}
            />
          </div>
          <div
            className="app-starterkit-block-item app-starterkit-block-item--taskmanager"
            onClick={e => handleBlockClick(CARD_TYPE.TASKMANAGER, e)}
          >
            <BlockTaskManager
              onButtonClick={() => {
                onHide()
                window.open(`${PRODUCT_WORKSPACE_URL}/ws-task-manager`)
              }}
            />
          </div>
          <div
            className="app-starterkit-block-item app-starterkit-block-item--jobs"
            onClick={e => handleBlockClick(CARD_TYPE.JOBS, e)}
          >
            <BlockJobs />
          </div>
          <div className="app-starterkit-block-item app-starterkit-block-item--reporting">
            <BlockReport />
          </div>
          <div className="app-starterkit-block-item app-starterkit-block-item--assets">
            <BlockAssets />
          </div>
          <div className="app-starterkit-block-item app-starterkit-block-item--roadsafety">
            <BlockRoadSafety />
          </div>
          <div className="app-starterkit-block-item app-starterkit-block-item--optimization">
            <BlockOptimization />
          </div>
          <div className="app-starterkit-block-item app-starterkit-block-item--inventory">
            <BlockInventory />
          </div>
        </section>
      </div>
      <PopupCards
        visible={popupVisible}
        type={popupType}
        style={{
          height: popupVisible
            ? overlayEle.current && overlayEle.current.clientHeight
            : 0,
        }}
        history={history}
        position={popupPosition}
        onHide={() => setPopupVisible(false)}
        onStarterKitHide={onHide}
        setCreateWsVisible={setCreateWsVisible}
      />
    </Fragment>
  )
}
