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

  const permitToDrillActionsHelper = [
    { title: 'Upload Permit to Drill Report', onClick: () => { setShowPermitDialog(true) } },
  ]

  const permitToSuspendActionsHelper = [
    { title: 'Upload Permit to Suspend Report', onClick: () => { setShowPermitDialog(true) } },
  ]

  const permitToAbandonActionsHelper = [
    { title: 'Upload Permit to Abandon Report', onClick: () => { setShowPermitDialog(true) } },
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
        return createActionsByCurrentTab(permitToDrillActionsHelper)
      case 1:
        return createActionsByCurrentTab(permitToSuspendActionsHelper)
      case 2:
        return createActionsByCurrentTab(permitToAbandonActionsHelper)
      default:
        break
    }
  }

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
      <TopBar title="Permitting" actions={renderActionsByCurrentTab()} />
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
