import { useState } from 'react'
import { Button } from 'react-md'
import Mht from '@target-energysolutions/mht'

import TopBar from 'components/top-bar'
import NavBar from 'components/nav-bar'

import HeaderTemplate from 'components/header-template'
import UploadReportDialog from 'components/upload-report-dialog'
import { userRole } from 'components/shared-hook/get-roles'

import {
  monthlyReportConfigs,
  monthlyReportData,
  actionsHeaderMonthly,
} from './helpers'

const HSSE = () => {
  const [currentTab, setCurrentTab] = useState(0)
  const [selectedRow, setSelectedRow] = useState([])
  const [showUploadRapportDialog, setShowUploadRapportDialog] = useState(false)

  const monthlyReportActionsHelper = [
    {
      title: 'Upload Monthly HSSE Report',
      onClick: () => setShowUploadRapportDialog(true),
    },
    { title: 'Download Template', onClick: () => {} },
  ]

  const createActionsByCurrentTab = (actionsList = []) => {
    return actionsList.map((btn, index) => (
      <Button
        key={`hsse-btn-${index}`}
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
      case 0:
      default:
        return monthlyReportConfigs()
    }
  }
  const actionsHeader = () => {
    switch (currentTab) {
      case 0:
      default:
        return actionsHeaderMonthly('hsse', selectedRow[0]?.id, userRole())
    }
  }
  return (
    <>
      <TopBar title="HSSE" actions={renderActionsByCurrentTab()} />
      <div className="subModule">
        <NavBar
          tabsList={tabsList}
          activeTab={currentTab}
          setActiveTab={setCurrentTab}
        />
        <div className="subModule--table-wrapper">
          <Mht
            configs={renderCurrentTabConfigs()}
            tableData={renderCurrentTabData()}
            hideTotal={false}
            singleSelect={true}
            withFooter
            withSearch={selectedRow?.length === 0}
            commonActions={selectedRow?.length === 0}
            onSelectRows={setSelectedRow}
            withChecked
            selectedRow={selectedRow}
            headerTemplate={
              selectedRow?.length === 1 && (
                <HeaderTemplate
                  title={`${selectedRow?.length} Row Selected`}
                  actions={actionsHeader()}
                />
              )
            }
          />
        </div>
      </div>
      {showUploadRapportDialog && (
        <UploadReportDialog
          title={'Upload Monthly HSSE Report'}
          optional={'Attach Supporting Document (Optional)'}
          visible={showUploadRapportDialog}
          onHide={() => setShowUploadRapportDialog(false)}
          onSave={() => {}}
        />
      )}
    </>
  )
}
export default HSSE
