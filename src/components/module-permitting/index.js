import { useState } from 'react'
import { Button } from 'react-md'
import Mht from '@target-energysolutions/mht'

import TopBar from 'components/top-bar'
import NavBar from 'components/nav-bar'
import UploadPermitDialog from './upload-permit-dialog'
const Permitting = () => {
  const [currentTab, setCurrentTab] = useState(0)
  const [showPermitDialog, setShowPermitDialog] = useState(false)
  const [information, setInformation] = useState({})
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
      />
      {showPermitDialog && (
        <UploadPermitDialog
          visible={showPermitDialog}
          onHide={() => setShowPermitDialog(false)}
          title={'Upload Permit to Drill Report'}
          datePlaceholder={'Spud Date'}
          information={information}
          setInformation={setInformation}
        />
      )}
    </div>
  )
}
export default Permitting
