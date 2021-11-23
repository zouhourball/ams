import { useState } from 'react'
import { Button } from 'react-md'
import Mht from '@target-energysolutions/mht'

import TopBar from 'components/top-bar'
import NavBar from 'components/nav-bar'
import UploadReportDialog from 'components/upload-report-dialog'
import HeaderTemplate from 'components/header-template'
// import { userRole } from 'components/shared-hook/get-roles'
import MHTDialog from 'components/mht-dialog'
import SupportedDocument from 'components/supported-document'

import {
  liquefiedPetroleumGasConfigs,
  naturalGasConfigs,
  petroleumProductsConfigs,
  liquefiedPetroleumGasData,
  naturalGasData,
  petroleumProductsData,
  actionsHeader,
} from './helpers'

const Downstream = () => {
  const [currentTab, setCurrentTab] = useState(0)
  const [showUploadRapportDialog, setShowUploadRapportDialog] = useState(false)
  const [showSupportedDocumentDialog, setShowSupportedDocumentDialog] =
    useState(false)
  const [selectedRow, setSelectedRow] = useState([])
  const [showUploadMHTDialog, setShowUploadMHTDialog] = useState(false)
  const [dataDisplayedMHT, setDataDisplayedMHT] = useState({})
  const [filesList, setFileList] = useState([])

  const liquefiedPetroleumGasActionsHelper = [
    {
      title: 'Attach Spreadsheet',
      onClick: () => setShowUploadRapportDialog(true),
    },
    { title: 'Download Template', onClick: () => {} },
  ]

  const naturalGasActionsHelper = [
    {
      title: 'Attach Spreadsheet',
      onClick: () => setShowUploadRapportDialog(true),
    },
    { title: 'Download Template', onClick: () => {} },
  ]

  const petroleumProductsActionsHelper = [
    {
      title: 'Attach Spreadsheet',
      onClick: () => setShowUploadRapportDialog(true),
    },
    { title: 'Download Template', onClick: () => {} },
  ]

  const createActionsByCurrentTab = (actionsList = []) => {
    return actionsList.map((btn, index) => (
      <Button
        key={`top-bar-btn-${index}`}
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
        return createActionsByCurrentTab(liquefiedPetroleumGasActionsHelper)
      case 1:
        return createActionsByCurrentTab(naturalGasActionsHelper)
      case 2:
        return createActionsByCurrentTab(petroleumProductsActionsHelper)
      default:
        break
    }
  }

  const tabsList = [
    'Liquefied Petroleum Gas (LPG)',
    'Natural Gas (NG)',
    'Petroleum Products',
  ]
  const renderCurrentTabData = () => {
    switch (currentTab) {
      case 0:
        return liquefiedPetroleumGasData
      case 1:
        return naturalGasData
      case 2:
        return petroleumProductsData

      default:
        return liquefiedPetroleumGasData
    }
  }
  const renderCurrentTabConfigs = () => {
    switch (currentTab) {
      case 0:
        return liquefiedPetroleumGasConfigs()
      case 1:
        return naturalGasConfigs()
      case 2:
        return petroleumProductsConfigs()

      default:
        return liquefiedPetroleumGasConfigs()
    }
  }

  const renderDialogData = () => {
    switch (currentTab) {
      case 0:
        return {
          title: 'Attach Spreadsheet',
          optional: 'Attach Supporting Document (Optional)',
          onClick: () => {},
        }
      case 1:
        return {
          title: 'Attach Spreadsheet',
          optional: 'Attach Supporting Document (Optional)',
          onClick: () => {},
        }
      case 2:
        return {
          title: 'Attach Spreadsheet',
          optional: 'Attach Supporting Document (Optional)',
          onClick: () => {},
        }

      default:
        break
    }
  }

  const onDisplayMHT = (file) => {
    setShowUploadMHTDialog(true)
    setShowUploadRapportDialog(false)
    setDataDisplayedMHT(file)
  }
  return (
    <>
      <TopBar title="Downstream" actions={renderActionsByCurrentTab()} />
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
            withSearch={selectedRow?.length === 0}
            commonActions={selectedRow?.length === 0}
            onSelectRows={setSelectedRow}
            withChecked
            singleSelect
            hideTotal={false}
            withFooter
            selectedRow={selectedRow}
            headerTemplate={
              selectedRow?.length === 1 && (
                <HeaderTemplate
                  title={`${selectedRow?.length} Row Selected`}
                  actions={actionsHeader(
                    'downstream-details',
                    selectedRow[0]?.id,
                    'regulator',
                    setShowSupportedDocumentDialog,
                  )}
                />
              )
            }
          />
        </div>
      </div>
      {showUploadMHTDialog && (
        <MHTDialog
          visible={showUploadMHTDialog}
          onHide={() => {
            setShowUploadMHTDialog(false)
            setShowUploadRapportDialog(true)
          }}
          onSave={() => {
            setShowUploadMHTDialog(false)
            setShowUploadRapportDialog(true)
            setFileList([...filesList, dataDisplayedMHT])
          }}
        />
      )}
      {showUploadRapportDialog && (
        <UploadReportDialog
          setFileList={setFileList}
          filesList={filesList}
          onDisplayMHT={onDisplayMHT}
          title={renderDialogData().title}
          optional={renderDialogData().optional}
          visible={showUploadRapportDialog}
          onHide={() => {
            setShowUploadRapportDialog(false)
            setFileList([])
          }}
          onSave={() => renderDialogData().onClick()}
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
    </>
  )
}
export default Downstream
