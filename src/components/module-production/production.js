import { useState } from 'react'
import { Button, SelectField } from 'react-md'
import Mht from '@target-energysolutions/mht'

import TopBar from 'components/top-bar'
import NavBar from 'components/nav-bar'
import UploadReportDialog from 'components/upload-report-dialog'
import HeaderTemplate from 'components/header-template'
import SupportedDocument from 'components/supported-document'
import { userRole } from 'components/shared-hook/get-roles'

import {
  dailyProductionConfigs,
  monthlyProductionConfigs,
  monthlyTrackingConfigs,
  omanHydConfigs,
  dailyProductionData,
  monthlyProductionData,
  monthlyTrackingData,
  omanHydData,
  actionsHeader,
} from './helpers'

const Production = () => {
  const [currentTab, setCurrentTab] = useState(0)
  const [showUploadRapportDialog, setShowUploadRapportDialog] = useState(false)
  const [showSupportedDocumentDialog, setShowSupportedDocumentDialog] = useState(false)
  const [selectedRow, setSelectedRow] = useState([])
  const [selectFieldValue, setSelectFieldValue] = useState(
    'Monthly Production'
  )

  const DailyProductionActionsHelper = [
    {
      title: 'Upload Daily Production Report',
      onClick: () => setShowUploadRapportDialog(true),
    },
    { title: 'Download Template', onClick: () => { } },
  ]

  const monthlyProductionActionsHelper = [
    {
      title: 'Upload Monthly Production Report',
      onClick: () => setShowUploadRapportDialog(true),
    },
    { title: 'Download Template', onClick: () => { } },
  ]

  const monthlyTrackingActionsHelper = [
    {
      title: 'Upload Monthly Tracking Report',
      onClick: () => setShowUploadRapportDialog(true),
    },
    { title: 'Download Template', onClick: () => { } },
  ]

  const omanHydrocarbonActionsHelper = [
    {
      title: 'Upload Oman Hydrocarbon Report',
      onClick: () => setShowUploadRapportDialog(true),
    },
    { title: 'Download Template', onClick: () => { } },
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
        return createActionsByCurrentTab(DailyProductionActionsHelper)
      case 1:
        return createActionsByCurrentTab(monthlyProductionActionsHelper)
      case 2:
        return createActionsByCurrentTab(monthlyTrackingActionsHelper)
      case 3:
      default:
        return createActionsByCurrentTab(omanHydrocarbonActionsHelper)
    }
  }

  const tabsList = [
    'Daily Production',
    'Monthly Production',
    'Monthly Tracking',
    'Oman Hydrocarbon',
  ]

  const renderCurrentTabData = () => {
    switch (currentTab) {
      case 0:
        return dailyProductionData
      case 1:
        return monthlyProductionData
      case 2:
        return monthlyTrackingData
      case 3:
        return omanHydData
      default:
        return dailyProductionData
    }
  }
  const renderCurrentTabConfigs = () => {
    switch (currentTab) {
      case 0:
        return dailyProductionConfigs()
      case 1:
        return monthlyProductionConfigs()
      case 2:
        return monthlyTrackingConfigs()
      case 3:
        return omanHydConfigs()
      default:
        return dailyProductionConfigs()
    }
  }
  const renderDialogData = () => {
    switch (currentTab) {
      case 0:
        return {
          title: 'Upload Daily Production Report',
          optional: 'Attach Supporting Document (Optional)',
          onClick: () => { },
        }
      case 1:
        return {
          title: 'Upload Monthly Production Report',
          optional: 'Attach Supporting Document (Optional)',
          onClick: () => { },
        }
      case 2:
        return {
          title: 'Upload Monthly Tracking Report',
          optional: 'Attach Supporting Document (Optional)',
          onClick: () => { },
        }
      case 3:
        return {
          title: 'Upload Oman Hydrocarbon Report',
          optional: 'Attach Supporting Document (Optional)',
          onClick: () => { },
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
        setActiveTab={tab => {
          setCurrentTab(tab)
          setSelectFieldValue(tab === 1
            ? 'Monthly Production'
            : tab === 2
              ? 'Destination'
              : 'Grid 1')
        }}
      />
      <Mht
        configs={renderCurrentTabConfigs()}
        tableData={renderCurrentTabData()}
        withSearch={selectedRow?.length === 0}
        commonActions={selectedRow?.length === 0}
        onSelectRows={setSelectedRow}
        withChecked
        selectedRow={selectedRow}
        headerTemplate={
          selectedRow?.length !== 0 ? (
            <HeaderTemplate
              title={`1 Row Selected`}
              actions={actionsHeader('production-details', 21561, userRole(), setShowSupportedDocumentDialog)}
            />
          ) : currentTab !== 0 ? (
            <SelectField
              id="monthly-prod"
              menuItems={
                currentTab === 1
                  ? ['Monthly Production', 'Monthly Well Counts']
                  : currentTab === 2
                    ? ['Destination', 'Average Delivery to ORPIC']
                    : ['Grid 1', 'Grid 2']
              }
              block
              position={SelectField.Positions.BELOW}
              value={selectFieldValue}
              onChange={setSelectFieldValue}
              simplifiedMenu={false}
            />
          ) : (
            ''
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

      {showSupportedDocumentDialog && (
        <SupportedDocument
          title={'upload supporting documents'}
          visible={showSupportedDocumentDialog}
          onDiscard={() => setShowSupportedDocumentDialog(false)}
          onSaveUpload={() => { }}
        />
      )}
    </>
  )
}
export default Production
