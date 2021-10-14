import { useState } from 'react'
import { Button } from 'react-md'
import Mht from '@target-energysolutions/mht'

import TopBar from 'components/top-bar'
import NavBar from 'components/nav-bar'
import UploadReportDialog from 'components/upload-report-dialog'
import HeaderTemplate from 'components/header-template'

import {
  annualReportConfigs,
  annualReportData,
  monthlyReportConfigs,
  monthlyReportData,
  dailyReportData,
  dailyReportConfigs,
  actionsHeader,
} from './helpers'

const Flaring = () => {
  const [currentTab, setCurrentTab] = useState(0)
  const [selectedRow, setSelectedRow] = useState([])

  const annualReportActionsHelper = [
    { title: 'Upload Annual Flaring Report', onClick: () => {} },
    { title: 'Download Template', onClick: () => {} },
    { title: 'Download Annual Plan Template', onClick: () => {} },
  ]
  const monthlyReportActionsHelper = [
    { title: 'Upload Monthly Flaring Report', onClick: () => {} },
    { title: 'Download Template', onClick: () => {} },
  ]

  const dailyReportActionsHelper = [
    { title: 'Upload Daily Flaring Report', onClick: () => {} },
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
        onClick={() => {}}
      >
        {btn?.title}
      </Button>
    ))
  }
  const renderActionsByCurrentTab = () => {
    switch (currentTab) {
      case 1:
        return createActionsByCurrentTab(monthlyReportActionsHelper)
      case 2:
        return createActionsByCurrentTab(dailyReportActionsHelper)
      case 0:
      default:
        return createActionsByCurrentTab(annualReportActionsHelper)
    }
  }

  const tabsList = ['Annual Report', 'Monthly Report', 'Daily Report']
  const renderCurrentTabData = () => {
    switch (currentTab) {
      case 1:
        return monthlyReportData
      case 2:
        return dailyReportData
      case 0:
      default:
        return annualReportData
    }
  }
  const renderCurrentTabConfigs = () => {
    switch (currentTab) {
      case 1:
        return monthlyReportConfigs()
      case 2:
        return dailyReportConfigs()
      case 0:
      default:
        return annualReportConfigs()
    }
  }

  return (
    <div className="module-container">
      <TopBar title="Flaring" actions={renderActionsByCurrentTab()} />
      <NavBar
        tabsList={tabsList}
        activeTab={currentTab}
        setActiveTab={setCurrentTab}
      />

      <UploadReportDialog />
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
            <HeaderTemplate title={`1 Row Selected`} actions={actionsHeader('flaring', 23323)} />
          )
        }
      />
    </div>
  )
}
export default Flaring
