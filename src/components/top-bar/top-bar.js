import { Button, MenuButton, ListItem, FontIcon } from 'react-md'
import { useState, useCallback } from 'react'
import cls from 'classnames'
import { navigate, useLocation } from '@reach/router'

import listView from './images/list_view.svg'
import analyticView from './images/analytic_view.svg'

import './style.scss'
const specificPaths = [
  {
    path: 'hse/flaring',
    to: '/ams/hse/flaring/analytics/dashboard',
  },
  {
    path: 'ams/production',
    to: '/ams/production/analytics/dashboard',
  },
  {
    path: 'ams/inventory',
    to: '/ams/inventory/analytics/dashboard',
  },
  {
    path: 'ams/planning',
    to: '/ams/planning/analytics/dashboard',
  },
  {
    path: 'ams/permitting',
    to: '/ams/permitting/analytics/dashboard',
  },
  {
    path: 'ams/costrecovery',
    to: '/ams/costrecovery/analytics/dashboard',
  },
  {
    path: 'ams/downstream',
    to: '/ams/downstream/analytics/dashboard',
  },
  {
    path: 'ams/reserves',
    to: '/ams/reserves/analytics/dashboard',
  },
]
const TopBar = ({
  title,
  actions,
  menuItems,
  returnTo,
  currentView: view,
  changeView,
  role,
}) => {
  const [currentView, setCurrentView] = useState(view || 'file')

  const { pathname } = useLocation()

  const onViewClick = useCallback(
    (view) => {
      setCurrentView(view)
      if (view === 'reports') {
        changeView(view)
      }
      if (view === 'dashboard' && !pathname.includes('/analytics/dashboard')) {
        const findItem = specificPaths.find((i) => pathname.includes(i.path))
        if (findItem) {
          navigate(findItem.to)
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
        <div className="top-bar-buttons-list">{actions}</div>

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
            <Button
              icon
              onClick={() => onViewClick('reports')}
              tooltipLabel={'reports'}
              className={cls(
                'top-bar-buttons-switch-view-btn',
                currentView === 'reports' && 'active',
              )}
              iconEl={<img src={analyticView} />}
            />
          </div>
          {role === 'operator' && (
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
          )}
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
