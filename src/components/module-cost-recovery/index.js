import { useState } from 'react'
import { Button } from 'react-md'
import Mht from '@target-energysolutions/mht'

import TopBar from 'components/top-bar'
import NavBar from 'components/nav-bar'
const CostRecovery = () => {
  const [currentTab, setCurrentTab] = useState(0)

  const annualCostAndExpenditureActionsHelper = [
    { title: 'Upload Annual Cost & Expenditure Report', onClick: () => { } },
    { title: 'Download Template', onClick: () => { } },
  ]

  const contractReportsActionsHelper = [
    { title: 'Upload Contract Report', onClick: () => { } },
    { title: 'Download Template', onClick: () => { } },
  ]

  const productionLiftingActionsHelper = [
    { title: 'Upload Production Lifting Report', onClick: () => { } },
    { title: 'Download Template', onClick: () => { } },
  ]

  const transactionReportActionsHelper = [
    { title: 'Upload Transaction  Report', onClick: () => { } },
    { title: 'Download Template', onClick: () => { } },
  ]

  const affiliateActionsHelper = [
    { title: 'Upload Affiliate Report', onClick: () => { } },
    { title: 'Download Template', onClick: () => { } },
  ]

  const facilitiesActionsHelper = [
    { title: 'Upload facilities Report', onClick: () => { } },
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
        return createActionsByCurrentTab(annualCostAndExpenditureActionsHelper)
      case 1:
        return createActionsByCurrentTab(contractReportsActionsHelper)
      case 2:
        return createActionsByCurrentTab(productionLiftingActionsHelper)
      case 3:
        return createActionsByCurrentTab(transactionReportActionsHelper)
      case 4:
        return createActionsByCurrentTab(affiliateActionsHelper)
      case 5:
        return createActionsByCurrentTab(facilitiesActionsHelper)
      default:
        break
    }
  }

  const tabsList = [
    'Annual Cost and Expenditure',
    'Contract Reports',
    'Production Lifting',
    'Transaction Report',
    'Affiliate',
    'Facilities',
  ]
  const renderCurrentTabData = () => {
    switch (currentTab) {
      case 0:
        break
      case 1:
        break
      case 2:
        break
      case 3:
        break
      case 4:
        break
      case 5:
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
        break
      case 3:
        break
      case 4:
        break
      case 5:
      default:
        break
    }
    return []
  }
  return (
    <div className="module-container">
      <TopBar title="Cost Recovery Reporting" actions={renderActionsByCurrentTab()} />
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
export default CostRecovery
