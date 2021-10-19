import { useState } from 'react'
import { Button } from 'react-md'
import Mht from '@target-energysolutions/mht'

import TopBar from 'components/top-bar'
import NavBar from 'components/nav-bar'
import UploadReportDialog from 'components/upload-report-dialog'
import HeaderTemplate from 'components/header-template'

import {
  annualCostConfigs,
  contractReportConfigs,
  productionLiftingConfigs,
  transactionConfigs,
  affiliateConfigs,
  facilitiesConfigs,
  annualCostData,
  contractReportData,
  productionLiftingData,
  transactionData,
  affiliateData,
  facilitiesData,
  actionsHeader,
} from './helpers'

const CostRecovery = () => {
  const [currentTab, setCurrentTab] = useState(0)
  const [showUploadRapportDialog, setShowUploadRapportDialog] = useState(false)
  const [selectedRow, setSelectedRow] = useState([])

  const annualCostAndExpenditureActionsHelper = [
    { title: 'Upload Annual Cost & Expenditure Report', onClick: () => setShowUploadRapportDialog(true) },
    { title: 'Download Template', onClick: () => {} },
  ]

  const contractReportsActionsHelper = [
    { title: 'Upload Contract Report', onClick: () => setShowUploadRapportDialog(true) },
    { title: 'Download Template', onClick: () => {} },
  ]

  const productionLiftingActionsHelper = [
    { title: 'Upload Production Lifting Report', onClick: () => setShowUploadRapportDialog(true) },
    { title: 'Download Template', onClick: () => {} },
  ]

  const transactionReportActionsHelper = [
    { title: 'Upload Transaction  Report', onClick: () => setShowUploadRapportDialog(true) },
    { title: 'Download Template', onClick: () => {} },
  ]

  const affiliateActionsHelper = [
    { title: 'Upload Affiliate Report', onClick: () => setShowUploadRapportDialog(true) },
    { title: 'Download Template', onClick: () => {} },
  ]

  const facilitiesActionsHelper = [
    { title: 'Upload facilities Report', onClick: () => setShowUploadRapportDialog(true) },
    { title: 'Download Template', onClick: () => {} },
  ]

  const createActionsByCurrentTab = (actionsList = []) => {
    return actionsList.map((btn, index) => (
      <Button
        key={'top-bar-btn-' + index}
        className="top-bar-buttons-list-item-btn"
        flat
        primary
        swapTheming
        onClick={() => {
          btn.onClick()
        }}
      >
        {btn?.title}
      </Button>
    ))
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
        return annualCostData
      case 1:
        return contractReportData
      case 2:
        return productionLiftingData
      case 3:
        return transactionData
      case 4:
        return affiliateData
      case 5:
        return facilitiesData
      default:
        return annualCostData
    }
  }
  const renderCurrentTabConfigs = () => {
    switch (currentTab) {
      case 0:
        return annualCostConfigs()
      case 1:
        return contractReportConfigs()
      case 2:
        return productionLiftingConfigs()
      case 3:
        return transactionConfigs()
      case 4:
        return affiliateConfigs()
      case 5:
        return facilitiesConfigs()
      default:
        return annualCostConfigs()
    }
  }

  const renderDialogData = () => {
    switch (currentTab) {
      case 0:
        return {
          title: 'Upload Annual Cost & Expenditure Report',
          optional: 'Attach Supporting Document (Optional)',
          onClick: () => {},
        }
      case 1:
        return {
          title: 'Upload Contract Report',
          optional: 'Attach Supporting Document (Optional)',
          onClick: () => {},
        }
      case 2:
        return {
          title: 'Upload Production Lifting Report',
          optional: 'Attach Supporting Document (Optional)',
          onClick: () => {},
        }
      case 3:
        return {
          title: 'Upload Transaction Report',
          optional: 'Attach Supporting Document (Optional)',
          onClick: () => {},
        }
      case 4:
        return {
          title: 'Upload Affiliate Report',
          optional: 'Attach Supporting Document (Optional)',
          onClick: () => {},
        }
      case 5:
        return {
          title: 'Upload Facilities Report',
          optional: 'Attach Supporting Document (Optional)',
          onClick: () => {},
        }
      default:
        break
    }
  }
  return (
    <>
      <TopBar
        title="Cost Recovery Reporting"
        actions={renderActionsByCurrentTab()}
      />
      <NavBar
        tabsList={tabsList}
        activeTab={currentTab}
        setActiveTab={setCurrentTab}
      />
      <Mht
        configs={renderCurrentTabConfigs()}
        tableData={renderCurrentTabData()}
        withSearch={selectedRow?.length === 0}
        commonActions={selectedRow?.length === 0}
        onSelectRows={setSelectedRow}
        withChecked
        hideTotal={false}
        withFooter
        selectedRow={selectedRow}
        headerTemplate={
              selectedRow?.length !== 0 && (
            <HeaderTemplate
              title={`${selectedRow?.length} Row Selected`}
              actions={actionsHeader('cost-recovery-details', selectedRow[0]?.id)}
            />
          )
        }
      />
      {showUploadRapportDialog && (
        <UploadReportDialog
          title={renderDialogData().title}
          optional={renderDialogData().optional}
          visible={showUploadRapportDialog}
          onHide={() => setShowUploadRapportDialog(false)}
          onSave={() => renderDialogData().onClick()}
        />
      )}
    </>
  )
}
export default CostRecovery
