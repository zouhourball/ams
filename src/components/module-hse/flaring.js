import { useState } from 'react'
import { Button } from 'react-md'
import Mht from '@target-energysolutions/mht'

import TopBar from 'components/top-bar'
import NavBar from 'components/nav-bar'
import UploadReportDialog from 'components/upload-report-dialog'
import HeaderTemplate from 'components/header-template'
import MHTDialog from 'components/mht-dialog'
import SupportedDocument from 'components/supported-document'

import { userRole } from 'components/shared-hook/get-roles'

import {
  annualReportConfigs,
  annualReportData,
  monthlyReportConfigs,
  monthlyReportData,
  dailyReportData,
  dailyReportConfigs,
  actionsHeaderAnnual,
  actionsHeaderMonthly,
  actionsHeaderDaily,
} from './helpers'

import './style.scss'

const Flaring = () => {
  const [currentTab, setCurrentTab] = useState(0)
  const [showUploadRapportDialog, setShowUploadRapportDialog] = useState(false)
  const [showUploadMHTDialog, setShowUploadMHTDialog] = useState(false)
  const [dataDisplayedMHT, setDataDisplayedMHT] = useState({})
  const [filesList, setFileList] = useState([])
  const [showSupportedDocumentDialog, setShowSupportedDocumentDialog] = useState(false)
  const [selectedRow, setSelectedRow] = useState([])

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
    return actionsList.map((btn, index) => (
      <Button
        key={`flaring-btn-${index}`}
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
        return monthlyReportData
      case 2:
        return dailyReportData
      case 0:
      default:
        return annualReportData
    }
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
          optional: `Annual Gas Conservation Plan (Mandatory)`,
          required: true,
          onClick: () => {},
        }
      default:
        break
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

  const actionsHeader = () => {
    switch (currentTab) {
      case 1:
        return actionsHeaderMonthly('flaring', selectedRow[0]?.id, userRole(), setShowSupportedDocumentDialog)
      case 2:
        return actionsHeaderDaily('flaring', selectedRow[0]?.id, userRole(), setShowSupportedDocumentDialog)
      case 0:
      default:
        return actionsHeaderAnnual('flaring', selectedRow[0]?.id, userRole(), setShowSupportedDocumentDialog)
    }
  }

  const onDisplayMHT = (file) => {
    setShowUploadMHTDialog(true)
    setShowUploadRapportDialog(false)
    setDataDisplayedMHT(file)
  }

  return (
    <>
      <TopBar
        title="Flaring"
        actions={userRole() === 'operator' ? renderActionsByCurrentTab() : null}
      />
      <div className="flaring">
        <NavBar
          tabsList={tabsList}
          activeTab={currentTab}
          setActiveTab={setCurrentTab}
        />
        <div className="flaring--table-wrapper">
          <Mht
            configs={renderCurrentTabConfigs()}
            tableData={renderCurrentTabData()}
            hideTotal={false}
            withFooter
            withSearch={selectedRow?.length === 0}
            commonActions={selectedRow?.length === 0 || selectedRow?.length > 1}
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

        {showUploadMHTDialog &&
        <MHTDialog
          visible={showUploadMHTDialog}
          onHide={() => {
            setShowUploadMHTDialog(false)
            setShowUploadRapportDialog(true)
          }
          }
          onSave ={() => {
            setShowUploadMHTDialog(false)
            setShowUploadRapportDialog(true)
            setFileList([...filesList, dataDisplayedMHT])
          }}
        />}

        {showUploadRapportDialog && (
          <UploadReportDialog
            setFileList={setFileList}
            filesList={filesList}
            onDisplayMHT={onDisplayMHT}
            title={renderDialogData().title}
            optional={renderDialogData().optional}
            required={renderDialogData().required}
            visible={showUploadRapportDialog}
            onHide={() => {
              setShowUploadRapportDialog(false)
              setFileList([])
            }}
            onSave={() => {
              renderDialogData().onClick()
              setFileList([])
            }}
          />
        )}
        {showSupportedDocumentDialog && (
          <SupportedDocument
            title={'upload supported documents'}
            visible={showSupportedDocumentDialog}
            onDiscard={() => setShowSupportedDocumentDialog(false)}
            onSaveUpload={() => {}}
          />
        )}
      </div>
    </>
  )
}
export default Flaring
