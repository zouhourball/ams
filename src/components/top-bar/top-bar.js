import { useState } from 'react'
import { Button, MenuButton, ListItem } from 'react-md'

import { cls } from 'reactutils'

import listView from './images/list_view.svg'
import analyticView from './images/analytic_view.svg'

import './style.scss'

const TopBar = ({ title, actions, menuItems }) => {
  const [currentView, setCurrentView] = useState('file')
  const renderListButtons = () => {
    return actions?.map(btn => btn)
  }
  return (
    <div className="top-bar">
      <div className="top-bar-title">
        {title}
      </div>
      <div className="top-bar-buttons">
        <div className="top-bar-buttons-list">
          {renderListButtons()}
        </div>

        <div className="top-bar-buttons-icons">

          <div className="top-bar-buttons-switch-view">
            <Button
              icon
              onClick={() => setCurrentView('file')}
              tooltipLabel={'list'}
              className={cls(
                'top-bar-buttons-switch-view-btn',
                currentView === 'file' && 'active',
              )}
              iconEl={<img src={listView} />}
            />
            <Button
              icon
              onClick={() => setCurrentView('dashboard')}
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
            menuItems={menuItems()}
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
    </div>)
}

export default TopBar
TopBar.defaultProps = {
  title: 'Flaring',
  actions:
    [
      <Button
        key='1'
        id="save"
        className="top-bar-buttons-list-item-btn"
        flat
        primary
        swapTheming
        onClick={() => {
        }}
      >Upload Monthly Flaring Report
      </Button>,
      <Button
        key="2"
        id="save"
        className="top-bar-buttons-list-item-btn"
        flat
        primary
        swapTheming
        onClick={() => {
        }}
      >Upload Daily Flaring Report
      </Button>,
      <Button
        key="3"
        id="save"
        className="top-bar-buttons-list-item-btn"
        flat
        primary
        swapTheming
        onClick={() => {
        }}
      >Upload Annual Flaring Report
      </Button>,
    ],
  menuItems: () => {
    return [
      <ListItem key={1} primaryText="Edit" onClick={e => null} />,
      <ListItem key={3} primaryText="Delete" onClick={e => null} />,
    ]
  },
}