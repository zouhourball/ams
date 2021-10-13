import { useState } from 'react'
import { Button } from 'react-md'
import Mht from '@target-energysolutions/mht'

import TopBar from 'components/top-bar'
import NavBar from 'components/nav-bar'

const Flaring = () => {
  const [currentTab, setCurrentTab] = useState(0)
  const actions = [
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
  ]

  const tabsList = ['Annual Report', 'Monthly Report', 'Daily Report']
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
    <div className='module-container'>
      <TopBar title='Flaring' actions={actions} />
      <NavBar tabsList={tabsList} activeTab={currentTab} setActiveTab={setCurrentTab}/>
      <Mht configs={renderCurrentTabConfigs()} tableData={renderCurrentTabData()}/>
    </div>
  )
}
export default Flaring