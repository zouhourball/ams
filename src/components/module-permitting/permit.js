import { useState } from 'react'
import { Button } from 'react-md'
import { navigate } from '@reach/router'
import Mht from '@target-energysolutions/mht'

import TopBar from 'components/top-bar'
import NavBar from 'components/nav-bar'
import UploadPermitDialog from './upload-permit-dialog'
import HeaderTemplate from 'components/header-template'
import SupportedDocument from 'components/supported-document'
import { userRole } from 'components/shared-hook/get-roles'

import {
  permitDrillConfigs,
  permitSuspendConfigs,
  permitAbandonConfigs,
  permitDrillData,
  permitSuspendData,
  permitAbandonData,
  actionsHeader,
} from './helpers'

const Permit = () => {
  const [currentTab, setCurrentTab] = useState(0)
  const [showPermitDialog, setShowPermitDialog] = useState(false)
  const [showSupportedDocumentDialog, setShowSupportedDocumentDialog] = useState(false)
  const [selectedRow, setSelectedRow] = useState([])
  const [information, setInformation] = useState({ date: new Date() })
  const actions =
    currentTab === 0
      ? [
        <Button
          key="0"
          id="save"
          className="top-bar-buttons-list-item-btn"
          flat
          primary
          swapTheming
          onClick={() => setShowPermitDialog(true)}
        >
            Upload Permit to Drill Report
        </Button>,
      ]
      : currentTab === 1
        ? [
          <Button
            key="0"
            id="save"
            className="top-bar-buttons-list-item-btn"
            flat
            primary
            swapTheming
            onClick={() => setShowPermitDialog(true)}
          >
            Upload Permit to Suspend Report
          </Button>,
        ]
        : [
          <Button
            key="0"
            id="save"
            className="top-bar-buttons-list-item-btn"
            flat
            primary
            swapTheming
            onClick={() => setShowPermitDialog(true)}
          >
            Upload Permit to Abandon Report
          </Button>,
        ]

  const tabsList = ['Permit to Drill', 'Permit to Suspend', 'Permit to Abandon']

  const renderCurrentTabData = () => {
    switch (currentTab) {
      case 1:
        return permitSuspendData
      case 2:
        return permitAbandonData
      case 0:
        return permitDrillData
      default:
        break
    }
    return []
  }
  const renderCurrentTabConfigs = () => {
    switch (currentTab) {
      case 1:
        return permitSuspendConfigs()
      case 2:
        return permitAbandonConfigs()
      case 0:
        return permitDrillConfigs()
      default:
        return permitDrillConfigs()
    }
  }
  return (
    <div className="module-container">
      <TopBar title="Permitting" actions={actions} />
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
        selectedRow={selectedRow}
        headerTemplate={
              selectedRow?.length !== 0 && (
            <HeaderTemplate
              title={`${selectedRow.length} Row Selected`}
              actions={actionsHeader('drill-report', 233, userRole(), setShowSupportedDocumentDialog)}
            />
          )
        }
      />
      {showPermitDialog && (
        <UploadPermitDialog
          visible={showPermitDialog}
          onHide={() => setShowPermitDialog(false)}
          title={'Upload Permit to Drill Report'}
          datePlaceholder={'Spud Date'}
          information={information}
          setInformation={setInformation}
          onContinue={() => navigate(`/ams/permitting/drill-report`)}
        />
      )}
      {showSupportedDocumentDialog && (
        <SupportedDocument
          title={'upload supporting documents'}
          visible={showSupportedDocumentDialog}
          onDiscard={() => setShowSupportedDocumentDialog(false)}
          onSaveUpload={() => {}}
        />
      )}
    </div>
  )
}
export default Permit
