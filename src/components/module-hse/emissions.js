import { useState } from 'react'
import { Button } from 'react-md'
import Mht from '@target-energysolutions/mht'

import {
  monthlyReportConfigs,
  monthlyReportData,
  actionsHeader,
} from './helpers'

import TopBar from 'components/top-bar'
import NavBar from 'components/nav-bar'
import HeaderTemplate from 'components/header-template'
import UploadReportDialog from 'components/upload-report-dialog'

const Emissions = () => {
  const [currentTab, setCurrentTab] = useState(0)
  const [selectedRow, setSelectedRow] = useState([])
  const [showUploadRapportDialog, setShowUploadRapportDialog] = useState(false)

  const monthlyReportActionsHelper = [
    { title: 'Upload Monthly Emissions Report', onClick: () => {} },
    { title: 'Download Template', onClick: () => {} },
  ]

  const createActionsByCurrentTab = (actionsList = []) => {
    return actionsList.map((btn) => (
      <Button
        key="3"
        id="save"
        className="top-bar-buttons-list-item-btn"
        flat
        primary
        swapTheming
        onClick={() => btn.onClick()}
      >
        {btn?.title}
      </Button>
    ))
  }
  const renderActionsByCurrentTab = () => {
    switch (currentTab) {
      case 1:
        break
      case 2:
        break
      case 0:
        return createActionsByCurrentTab(monthlyReportActionsHelper)
      default:
        break
    }
  }

  const tabsList = ['Monthly Report']
  const renderCurrentTabData = () => {
    switch (currentTab) {
      case 1:
        break
      case 2:
        break
      case 0:
      default:
        return monthlyReportData
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
        return monthlyReportConfigs()
    }
    return []
  }
  return (
    <>
      <TopBar title="Emissions" actions={renderActionsByCurrentTab()} />
      <NavBar
        tabsList={tabsList}
        activeTab={currentTab}
        setActiveTab={setCurrentTab}
      />
      <div className="flaring--table-wrapper">
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
                title={`1 Row Selected`}
                actions={actionsHeader('emissions', 2333)}
              />
            )
          }
        />
      </div>
      {showUploadRapportDialog && (
        <UploadReportDialog
          title={'Upload Monthly Emissions Report'}
          optional={'Attach Supporting Document (Optional)'}
          visible={showUploadRapportDialog}
          onHide={() => setShowUploadRapportDialog(false)}
          onSave={() => {}}
        />
      )}
    </>
  )
}
export default Emissions
