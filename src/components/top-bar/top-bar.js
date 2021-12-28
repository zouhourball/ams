import { Button, MenuButton, ListItem, FontIcon } from 'react-md'
import { useState, useCallback } from 'react'
import cls from 'classnames'
import { navigate, useLocation } from '@reach/router'

import listView from './images/list_view.svg'
import analyticView from './images/analytic_view.svg'

import './style.scss'

const TopBar = ({ title, actions, menuItems, returnTo, currentView: view }) => {
  const [currentView, setCurrentView] = useState(view || 'file')
  const renderListButtons = () => {
    return actions?.map((btn) => btn)
  }
  const { pathname } = useLocation()

  const onViewClick = useCallback(
    (view) => {
      setCurrentView(view)
      if (view === 'dashboard' && !pathname.includes('/analytics/dashboard')) {
        if (pathname.includes('hse/flaring')) {
          navigate(`/ams/hse/flaring/analytics/dashboard`)
        } else if (pathname.includes('ams/production')) {
          navigate(`/ams/production/analytics/dashboard`)
        } else if (pathname.includes('ams/inventory')) {
          navigate(`/ams/inventory/analytics/dashboard`)
        } else {
          navigate(`${pathname}/analytics/dashboard`)
        }
      } else if (view === 'file' && pathname.includes('/analytics/dashboard')) {
        navigate(-1)
      }
    },
    [pathname],
  )

  return (
    <div className="top-bar">
      {returnTo && (
        <FontIcon iconClassName="mdi mdi-chevron-left" onClick={returnTo} />
      )}
      <div className="top-bar-title">{title}</div>
      <div className="top-bar-buttons">
        <div className="top-bar-buttons-list">{renderListButtons()}</div>

        <div className="top-bar-buttons-icons">
          <div className="top-bar-buttons-switch-view">
            <Button
              icon
              onClick={() => onViewClick('file')}
              tooltipLabel={'list'}
              className={cls(
                'top-bar-buttons-switch-view-btn',
                currentView === 'file' && 'active',
              )}
              iconEl={<img src={listView} />}
            />
            <Button
              icon
              onClick={() => onViewClick('dashboard')}
              tooltipLabel={'dashboard'}
              className={cls(
                'top-bar-buttons-switch-view-btn',
                currentView === 'dashboard' && 'active',
              )}
              iconEl={<img src={analyticView} />}
            />
          </div>
          <MenuButton
            id="menu-button-2"
            icon
            menuItems={menuItems()?.map((el) => (
              <ListItem
                key={el?.key}
                primaryText={el?.primaryText}
                onClick={(e) => el?.onClick()}
              />
            ))}
            anchor={{
              x: MenuButton.HorizontalAnchors.RIGHT,
              y: MenuButton.VerticalAnchors.BOTTOM,
            }}
            menuClassName=""
          >
            more_vert
          </MenuButton>
        </div>
      </div>
    </div>
  )
}

export default TopBar
TopBar.defaultProps = {
  title: 'Flaring',
  actions: [
    <Button
      key="1"
      id="save"
      className="top-bar-buttons-list-item-btn"
      flat
      primary
      swapTheming
      onClick={() => {}}
    >
      Upload Monthly Flaring Report
    </Button>,
    <Button
      key="2"
      id="save"
      className="top-bar-buttons-list-item-btn"
      flat
      primary
      swapTheming
      onClick={() => {}}
    >
      Upload Daily Flaring Report
    </Button>,
    <Button
      key="3"
      id="save"
      className="top-bar-buttons-list-item-btn"
      flat
      primary
      swapTheming
      onClick={() => {}}
    >
      Upload Annual Flaring Report
    </Button>,
  ],
  menuItems: () => {
    return [
      <ListItem key={1} primaryText="Edit" onClick={(e) => null} />,
      <ListItem key={3} primaryText="Delete" onClick={(e) => null} />,
    ]
  },
}
