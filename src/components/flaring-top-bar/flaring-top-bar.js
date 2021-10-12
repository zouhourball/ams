import { useState } from 'react'
import { Button, MenuButton, ListItem } from 'react-md'

import { cls } from 'reactutils'

import listView from './images/list_view.svg'
import analyticView from './images/analytic_view.svg'

import './style.scss'

const FlaringTopBar = ({ onUploadAnnualReport, onUploadMonthlyReport, onUploadDailyReport, onDownloadTemplate, onDownloadAnnualPlanTemplate }) => {
  const [currentView, setCurrentView] = useState('file')
  return (
    <div className="flaring">

      <div className="flaring-title">
        Flaring
      </div>
      <div className="flaring-buttons">
        <div className="flaring-buttons-list">
          {onUploadDailyReport && <Button
            id="save"
            className="flaring-buttons-list-item-btn"
            flat
            primary
            swapTheming
            onClick={() => {
              onUploadDailyReport && onUploadDailyReport()
            }}
          >Upload Daily Flaring Report
          </Button>}
          {onUploadMonthlyReport && <Button
            id="save"
            className="flaring-buttons-list-item-btn"
            flat
            primary
            swapTheming
            onClick={() => {
              onUploadMonthlyReport && onUploadMonthlyReport()
            }}
          >Upload Monthly Flaring Report
          </Button>}
          {onUploadAnnualReport && <Button
            id="save"
            className="flaring-buttons-list-item-btn"
            flat
            primary
            swapTheming
            onClick={() => {
              onUploadAnnualReport && onUploadAnnualReport()
            }}
          >Upload Annual Flaring Report
          </Button>}
          {onDownloadTemplate && <Button
            id="save"
            className="flaring-buttons-list-item-btn"
            flat
            primary
            swapTheming
            onClick={() => {
              onDownloadTemplate && onDownloadTemplate()
            }}
          >Download Template
          </Button>}
          {onDownloadAnnualPlanTemplate && <Button
            id="save"
            className="flaring-buttons-list-item-btn"
            flat
            primary
            swapTheming
            onClick={() => {
              onDownloadAnnualPlanTemplate && onDownloadAnnualPlanTemplate()
            }}
          >Download Annual Plan Template
          </Button>}
        </div>

        <div className="flaring-buttons-icons">

          <div className="flaring-buttons-switch-view">
            <Button
              icon
              onClick={() => setCurrentView('file')}
              tooltipLabel={'list'}
              className={cls(
                'flaring-buttons-switch-view-btn',
                currentView === 'file' && 'active',
              )}
              iconEl={<img src={listView} />}
            />
            <Button
              icon
              onClick={() => setCurrentView('dashboard')}
              tooltipLabel={'dashboard'}
              className={cls(
                'flaring-buttons-switch-view-btn',
                currentView === 'dashboard' && 'active',
              )}
              iconEl={<img src={analyticView} />}
            />
          </div>
          <MenuButton
            id="menu-button-2"
            icon
            menuItems={[
              <ListItem key={1} primaryText="Edit" onClick={e => null} />,
              <ListItem key={3} primaryText="Delete" onClick={e => null} />,
            ]}
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

export default FlaringTopBar
FlaringTopBar.defaultProps = {
  onUploadAnnualReport: () => {},
  onDownloadTemplate: () => {},
  onDownloadAnnualPlanTemplate: () => {},
}