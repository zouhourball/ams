import { useState } from 'react'
import { Button } from 'react-md'
import Mht from '@target-energysolutions/mht'

import TopBar from 'components/top-bar'
import NavBar from 'components/nav-bar'
const Reserves = () => {
  const [currentTab, setCurrentTab] = useState(0)

  const annualReservesReportingActionsHelper = [
    { title: 'Upload Annual Reserves Report', onClick: () => { } },
    { title: 'Download Template', onClick: () => { } },
  ]

  const HistoryAndForecastActionsHelper = [
    { title: 'Upload History and Forecast Report', onClick: () => { } },
    { title: 'Download Template', onClick: () => { } },
  ]

  const AnnualResourceDetailActionsHelper = [
    { title: 'Upload Annual Resource Detail Report', onClick: () => { } },
    { title: 'Download Template', onClick: () => { } },
  ]

  const createActionsByCurrentTab = (actionsList = []) => {
    return actionsList.map((btn, index) =>
      <Button
        key={'top-bar-btn-' + index}
        className="top-bar-buttons-list-item-btn"
        flat
        primary
        swapTheming
        onClick={() => {
          btn.onClick()
        }}
      >{btn?.title}
      </Button>
    )
  }

  const renderActionsByCurrentTab = () => {
    switch (currentTab) {
      case 0:
        return createActionsByCurrentTab(annualReservesReportingActionsHelper)
      case 1:
        return createActionsByCurrentTab(HistoryAndForecastActionsHelper)
      case 2:
        return createActionsByCurrentTab(AnnualResourceDetailActionsHelper)
      default:
        break
    }
  }

  const tabsList = [
    'Annual Reserves Reporting',
    'History and Forecast',
    'Annual Resource Detail',
  ]

  const renderCurrentTabData = () => {
    switch (currentTab) {
      case 0:
        break
      case 1:
        break
      case 2:
      default:
        break
    }
    return []
  }

  const renderCurrentTabConfigs = () => {
    switch (currentTab) {
      case 0:
        break
      case 1:
        break
      case 2:
      default:
        break
    }
    return []
  }

  return (
    <>
      <TopBar title="Reserve Reporting" actions={renderActionsByCurrentTab()} />
      <NavBar
        tabsList={tabsList}
        activeTab={currentTab}
        setActiveTab={setCurrentTab}
      />
      <Mht
        configs={renderCurrentTabConfigs()}
        tableData={renderCurrentTabData()}
      />
    </>
  )
}
export default Reserves
