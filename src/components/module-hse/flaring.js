import { useState } from 'react'
import { Button } from 'react-md'
import Mht from '@target-energysolutions/mht'

import TopBar from 'components/top-bar'
import NavBar from 'components/nav-bar'
import UploadReportDialog from 'components/upload-report-dialog'

import './style.scss'

const Flaring = () => {
  const [currentTab, setCurrentTab] = useState(0)
  const [showUploadRapportDialog, setShowUploadRapportDialog] = useState(false)
  const annualReportActionsHelper = [
    {
      title: 'Upload Annual Flaring Report',
      onClick: () => setShowUploadRapportDialog(true),
    },
    { title: 'Download Template', onClick: () => {} },
    { title: 'Download Annual Plan Template', onClick: () => {} },
  ]
  const monthlyReportActionsHelper = [
    {
      title: 'Upload Monthly Flaring Report',
      onClick: () => setShowUploadRapportDialog(true),
    },
    { title: 'Download Template', onClick: () => {} },
  ]

  const dailyReportActionsHelper = [
    {
      title: 'Upload Daily Flaring Report',
      onClick: () => setShowUploadRapportDialog(true),
    },
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
        break
      case 2:
        break
      case 0:
      default:
        break
    }
    return []
  }
  const renderDialogData = () => {
    switch (currentTab) {
      case 1:
        return {
          title: 'Upload Monthly Flaring Report',
          optional: 'Attach Supporting Document (Optional)',
          onClick: () => {},
        }
      case 2:
        return {
          title: 'Upload Daily Flaring Report',
          optional: 'Attach Supporting Document (Optional)',
          onClick: () => {},
        }
      case 0:
        return {
          title: 'Upload Annual Flaring Report',
          optional: 'Annual Gas Conservation Plan (Mandatory)',
          onClick: () => {},
        }
      default:
        break
    }
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
    <>
      <TopBar title="Flaring" actions={renderActionsByCurrentTab()} />
      <div className='flaring'>
        <NavBar
          tabsList={tabsList}
          activeTab={currentTab}
          setActiveTab={setCurrentTab}
        />
        <UploadReportDialog />
        <div className='flaring--table-wrapper'>
          <Mht
            configs={renderCurrentTabConfigs()}
            tableData={renderCurrentTabData()}
          />
        </div>
        {showUploadRapportDialog && (
          <UploadReportDialog
            title={renderDialogData().title}
            optional={renderDialogData().optional}
            visible={showUploadRapportDialog}
            onHide={() => setShowUploadRapportDialog(false)}
            onSave={() => renderDialogData().onClick()}
          />
        )}
      </div>
    </>
  )
}
export default Flaring
