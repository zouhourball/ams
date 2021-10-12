import { useState } from 'react'
import { Button, MenuButton, Avatar } from 'react-md'

import { cls } from 'reactutils'

import listView from './images/list_view.svg'
import analyticView from './images/analytic_view.svg'

import './style.scss'

const FlaringTopBar = () => {
  const [currentView, setCurrentView] = useState('file')
  return (
    <div className="flaring">

      <div className="flaring-title">
        Flaring
      </div>

      <div>

        <div>

          <div className="switch-view">
            <Button
              icon
              onClick={() => setCurrentView('file')}
              tooltipLabel={'list'}
              className={cls(
                'switch-view-btn',
                currentView === 'file' && 'active',
              )}
              iconEl={<img src={listView} />}
            />
            <Button
              icon
              onClick={() => setCurrentView('dashboard')}
              tooltipLabel={'dashboard'}
              className={cls(
                'switch-view-btn',
                currentView === 'dashboard' && 'active',
              )}
              iconEl={<img src={analyticView} />}
            />
          </div>
          <MenuButton
            id="menu-button-2"
            icon
            menuItems={[]}
            anchor={{
              x: MenuButton.HorizontalAnchors.RIGHT,
              y: MenuButton.VerticalAnchors.BOTTOM,
            }}
            menuClassName="top-asset-card-menuButton"
          >
          more_vert
          </MenuButton>
        </div>
      </div>
    </div>)
}

export default FlaringTopBar