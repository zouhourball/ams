import { useState } from 'react'
import { Button } from 'react-md'
import Mht from '@target-energysolutions/mht'

import TopBar from 'components/top-bar'
import NavBar from 'components/nav-bar'
const Reserves = () => {
  const [currentTab, setCurrentTab] = useState(0)
  const actions = [
    <Button
      key="1"
      id="save"
      className="top-bar-buttons-list-item-btn"
      flat
      primary
      swapTheming
      onClick={() => {}}
    >
      Upload Annual Reserves Report
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
      Download Template
    </Button>,
  ]

  const tabsList = [
    'Annual Reserves Reporting',
    'History and Forecast',
    'Annual Resource Detail',
  ]
  const renderCurrentTabData = () => {
    switch (currentTab) {
      case 1:
        break
      case 2:
        break
      case 0:
      default:
        break
    }
    return []
  }
  const renderCurrentTabConfigs = () => {
    switch (currentTab) {
      case 1:
        break
      case 2:
        break
      case 0:
      default:
        break
    }
    return []
  }
  return (
    <div className="module-container">
      <TopBar title="Reserve Reporting" actions={actions} />
      <NavBar
        tabsList={tabsList}
        activeTab={currentTab}
        setActiveTab={setCurrentTab}
      />
      <Mht
        configs={renderCurrentTabConfigs()}
        tableData={renderCurrentTabData()}
      />
    </div>
  )
}
export default Reserves
