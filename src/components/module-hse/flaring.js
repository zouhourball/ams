import { useState } from 'react'
import { Button } from 'react-md'
import Mht from '@target-energysolutions/mht'

import TopBar from 'components/top-bar'
import NavBar from 'components/nav-bar'
import UploadReportDialog from 'components/upload-report-dialog'

const Flaring = () => {
  const [currentTab, setCurrentTab] = useState(0)
  const annualReportActionsHelper = [
    { title: 'Upload Annual Flaring Report', onClick: () => { } },
    { title: 'Download Template', onClick: () => { } },
    { title: 'Download Annual Plan Template', onClick: () => { } },
  ]
  const monthlyReportActionsHelper = [
    { title: 'Upload Monthly Flaring Report', onClick: () => { } },
    { title: 'Download Template', onClick: () => { } },
  ]

  const dailyReportActionsHelper = [
    { title: 'Upload Daily Flaring Report', onClick: () => { } },
    { title: 'Download Template', onClick: () => { } }]
  const createActionsByCurrentTab = (actionsList = []) => {
    return actionsList.map(btn =>
      <Button
        key="3"
        id="save"
        className="top-bar-buttons-list-item-btn"
        flat
        primary
        swapTheming
        onClick={() => {
        }}
      >{btn?.title}
      </Button>
    )
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
      <TopBar title='Flaring' actions={renderActionsByCurrentTab()} />
      <div className='flaring'>
        <NavBar tabsList={tabsList} activeTab={currentTab} setActiveTab={setCurrentTab} />
        <UploadReportDialog />
        <div className='flaring--table-wrapper'>
          <Mht configs={renderCurrentTabConfigs()} tableData={renderCurrentTabData()} />
        </div>
      </div>
    </>
  )
}
export default Flaring
