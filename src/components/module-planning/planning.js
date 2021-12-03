import { useState } from 'react'
import { Button } from 'react-md'
import Mht from '@target-energysolutions/mht'
import { useMutation } from 'react-query'
import { useDispatch } from 'react-redux'
import { v4 as uuidv4 } from 'uuid'
import moment from 'moment'

import TopBar from 'components/top-bar'
import NavBar from 'components/nav-bar'
import UploadReportDialog from 'components/upload-report-dialog'
import HeaderTemplate from 'components/header-template'
import MHTDialog from 'components/mht-dialog'
import SupportedDocument from 'components/supported-document'
import ToastMsg from 'components/toast-msg'

import useRole from 'libs/hooks/use-role'
import { downloadTemp } from 'libs/api/supporting-document-api'
import { uploadWpbReport, uploadFypReport } from 'libs/api/api-planning'
import getOrganizationInfos from 'libs/hooks/get-organization-infos'
import getBlocks from 'libs/hooks/get-blocks'

import { addToast } from 'modules/app/actions'

import {
  wpbPlanningConfigs,
  fypPlanningConfigs,
  budgetaryPlanningConfigs,
  dailyProductionData,
  monthlyProductionData,
  monthlyTrackingData,
  actionsHeader,
} from './helpers'

const Planning = () => {
  const dispatch = useDispatch()

  const [currentTab, setCurrentTab] = useState(0)
  const [showUploadRapportDialog, setShowUploadRapportDialog] = useState(false)
  const [showSupportedDocumentDialog, setShowSupportedDocumentDialog] =
    useState(false)
  const [selectedRow, setSelectedRow] = useState([])
  const [showUploadMHTDialog, setShowUploadMHTDialog] = useState(false)
  const [dataDisplayedMHT, setDataDisplayedMHT] = useState({})
  // const [currentUpload, setCurrentUpload] = useState()

  const [filesList, setFileList] = useState([])
  const role = useRole('planning')
  const blocks = getBlocks()
  const company = getOrganizationInfos()

  const uploadWpbReportMutate = useMutation(
    uploadWpbReport,

    {
      onSuccess: (res) => {
        if (!res.error) {
          setShowUploadMHTDialog(true)

          // setCurrentUpload(res)
          onDisplayMHT(...res)
          dispatch(
            addToast(
              <ToastMsg
                text={res.message || 'Wpb report uploaded successfully'}
                type="success"
              />,
              'hide',
            ),
          )
        } else {
          dispatch(
            addToast(
              <ToastMsg
                text={res.error?.body?.message || 'Something went wrong'}
                type="error"
              />,
              'hide',
            ),
          )
        }
      },
    },
  )

  const uploadFypReportMutate = useMutation(
    uploadFypReport,

    {
      onSuccess: (res) => {
        if (!res.error) {
          setShowUploadMHTDialog(true)

          // setCurrentUpload(res)
          onDisplayMHT(...res)
          dispatch(
            addToast(
              <ToastMsg
                text={res.message || 'Wpb report uploaded successfully'}
                type="success"
              />,
              'hide',
            ),
          )
        } else {
          dispatch(
            addToast(
              <ToastMsg
                text={res.error?.body?.message || 'Something went wrong'}
                type="error"
              />,
              'hide',
            ),
          )
        }
      },
    },
  )

  const handleUploadWpb = (body, uuid) => {
    uploadWpbReportMutate.mutate({
      body: {
        block: body?.block,
        company: company?.name || 'ams-org',
        file: body?.file[0],
        processInstanceId: uuid,
        year: moment(body?.referenceDate).format('YYYY'),
      },
    })
  }

  const handleUploadFyp = (body, uuid) => {
    uploadFypReportMutate.mutate({
      body: {
        block: body?.block,
        company: company?.name || 'ams-org',
        file: body?.file[0],
        processInstanceId: uuid,
        year: moment(body?.referenceDate).format('YYYY'),
      },
    })
  }
  const onAddReportByCurrentTab = (body) => {
    let uuid = uuidv4()
    switch (currentTab) {
      case 0:
        handleUploadWpb(body, uuid)
        break
      case 1:
        handleUploadFyp(body, uuid)
        break
      case 2:
        break
    }
  }

  const wpbPlanningActionsHelper = [
    {
      title: 'Attach Speadsheet',
      onClick: () => setShowUploadRapportDialog(true),
    },
    {
      title: 'Download Template',
      onClick: () => downloadTemp('planning', 'wpb'),
    },
  ]

  const fypPlanningActionsHelper = [
    {
      title: 'Attach Speadsheet',
      onClick: () => setShowUploadRapportDialog(true),
    },
    {
      title: 'Download Template',
      onClick: () => downloadTemp('planning', 'fyp'),
    },
  ]

  const budgetaryPlanningActionsHelper = [
    {
      title: 'Attach Speadsheet',
      onClick: () => setShowUploadRapportDialog(true),
    },
    { title: 'Download Template', onClick: () => {} },
  ]

  const createActionsByCurrentTab = (actionsList = []) => {
    return actionsList.map((btn, index) => (
      <Button
        key={`planning-btn-${index}`}
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
        return createActionsByCurrentTab(wpbPlanningActionsHelper)
      case 1:
        return createActionsByCurrentTab(fypPlanningActionsHelper)
      case 2:
        return createActionsByCurrentTab(budgetaryPlanningActionsHelper)
      case 3:
      default:
        return null
    }
  }

  const tabsList = [
    'Work Program & Budget',
    'Five Year Plan',
    'Budgetary Report',
  ]

  const renderCurrentTabData = () => {
    switch (currentTab) {
      case 0:
        return dailyProductionData
      case 1:
        return monthlyProductionData
      case 2:
        return monthlyTrackingData
      default:
        return null
    }
  }
  const renderCurrentTabConfigs = () => {
    switch (currentTab) {
      case 0:
        return wpbPlanningConfigs()
      case 1:
        return fypPlanningConfigs()
      case 2:
        return budgetaryPlanningConfigs()
      default:
        return null
    }
  }

  const renderDialogData = (data) => {
    switch (currentTab) {
      case 0:
        return {
          title: 'Attach Speadsheet',
          optional: 'Attach Supporting Document (Optional)',
          onUpload: () => {
            const uuid = uuidv4()
            handleUploadWpb(data, uuid)
          },
        }
      case 1:
        return {
          title: 'Attach Speadsheet',
          optional: 'Attach Supporting Document (Optional)',
          onUpload: () => {
            const uuid = uuidv4()
            handleUploadFyp(data, uuid)
          },
        }
      case 2:
        return {
          title: 'Attach Speadsheet',
          optional: 'Attach Supporting Document (Optional)',
          onUpload: () => {},
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
      <TopBar
        title="Planning"
        actions={role === 'operator' ? renderActionsByCurrentTab() : null}
      />
      <NavBar
        tabsList={tabsList}
        activeTab={currentTab}
        setActiveTab={(tab) => {
          setCurrentTab(tab)
          // setSelectedRow([])
        }}
      />
      <Mht
        configs={renderCurrentTabConfigs()}
        tableData={renderCurrentTabData()}
        hideTotal={false}
        singleSelect={true}
        withFooter
        withSearch={selectedRow?.length === 0}
        commonActions={selectedRow?.length === 0 || selectedRow?.length > 1}
        onSelectRows={setSelectedRow}
        withChecked
        selectedRow={selectedRow}
        headerTemplate={
          selectedRow?.length === 1 ? (
            <HeaderTemplate
              title={
                selectedRow?.length === 1
                  ? `1 Row Selected`
                  : `${selectedRow?.length} Rows selected`
              }
              actions={actionsHeader(
                'planning-details',
                selectedRow[0]?.id,
                role,
                setShowSupportedDocumentDialog,
              )}
            />
          ) : (
            ''
          )
        }
      />
      {showUploadMHTDialog && (
        <MHTDialog
          headerTemplate={<></>}
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
          blockList={blocks?.map((el) => ({
            label: el?.block,
            value: el?.block,
          }))}
          onHide={() => {
            setShowUploadRapportDialog(false)
            setFileList([])
          }}
          // onSave={(data) => renderDialogData(data).onUpload()}
          onSave={(data) => {
            onAddReportByCurrentTab(data)
          }}
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
export default Planning
