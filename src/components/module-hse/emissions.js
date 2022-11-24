import { useState } from 'react'
import { Button } from 'react-md'
import Mht from '@target-energysolutions/mht'
// import useRole from 'libs/hooks/use-role'
import getBlocks from 'libs/hooks/get-blocks'
import { useDispatch } from 'react-redux'
import ToastMsg from 'components/toast-msg'
import MHTDialog from 'components/mht-dialog'
import moment from 'moment'
import { uploadHsse } from 'libs/api/hsse-api'
import { useMutation } from 'react-query'
import {
  monthlyReportConfigs,
  monthlyReportData,
  actionsHeaderMonthly,
} from './helpers'
import {
  downloadTemp,
  // downloadOriginalFile,
} from 'libs/api/supporting-document-api'
import TopBar from 'components/top-bar'
import NavBar from 'components/nav-bar'
import HeaderTemplate from 'components/header-template'
import UploadReportDialog from 'components/upload-report-dialog'
import { userRole } from 'components/shared-hook/get-roles'
import { v4 as uuidv4 } from 'uuid'
import documents from 'libs/hooks/documents'
import { addToast } from 'modules/app/actions'
import getOrganizationInfos from 'libs/hooks/get-organization-infos'

const Emissions = () => {
  const dispatch = useDispatch()
  const [currentTab, setCurrentTab] = useState(0)
  const [selectedRow, setSelectedRow] = useState([])
  const [showUploadMHTDialog, setShowUploadMHTDialog] = useState(false)
  const [showUploadRapportDialog, setShowUploadRapportDialog] = useState(false)
  // const role = useRole('flaring')
  const [filesList, setFileList] = useState([])
  const blocks = getBlocks()
  const { addSupportingDocuments } = documents()
  const company = getOrganizationInfos()
  const { mutate, data: uploadDataResponse } = useMutation(uploadHsse, {
    onSuccess: (res) => {
      if (!res.error) {
        setShowUploadMHTDialog(true)
        dispatch(
          addToast(
            <ToastMsg
              text={res.message || 'Report uploaded successfully'}
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
  })

  const monthlyReportActionsHelper = [
    {
      title: 'Upload Monthly Emissions Report',
      onClick: () => setShowUploadRapportDialog(true),
    },
    {
      title: 'Download Template',
      onClick: () => {
        downloadTemp('flaring', 'emissions')
      },
    },
  ]

  const createActionsByCurrentTab = (actionsList = []) => {
    return actionsList.map((btn, index) => (
      <Button
        key={`action-btn-${index}`}
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
      case 0:
        return createActionsByCurrentTab(monthlyReportActionsHelper)
      default:
        break
    }
  }

  const tabsList = ['Monthly Report']
  const renderCurrentTabData = () => {
    switch (currentTab) {
      case 0:
      default:
        return monthlyReportData
    }
  }
  const renderCurrentTabConfigs = () => {
    switch (currentTab) {
      default:
        return monthlyReportConfigs()
    }
  }

  const actionsHeader = () => {
    switch (currentTab) {
      case 0:
      default:
        return actionsHeaderMonthly('emissions', selectedRow[0]?.id, userRole())
    }
  }
  const handleUploadReport = (body, uuid) => {
    mutate({
      body: {
        block: body?.block,
        company: company?.name || 'ams-org',
        file: body?.file[0],
        processInstanceId: uuid,
        year: moment(body?.referenceDate?.timestamp).format('YYYY'),
        month: body?.referenceDate?.month?.toString(),
      },
    })
  }

  const onUpload = (data) => {
    const uuid = uuidv4()
    handleUploadReport(data, uuid)
    addSupportingDocuments(data?.optionalFiles, uuid)
  }
  return (
    <>
      <TopBar title="Emissions" actions={renderActionsByCurrentTab()} />
      <div className="subModule">
        <NavBar
          tabsList={tabsList}
          activeTab={currentTab}
          setActiveTab={setCurrentTab}
          onSelectRows={setSelectedRow}
        />
        <div className="subModule--table-wrapper">
          <Mht
            configs={renderCurrentTabConfigs()}
            tableData={renderCurrentTabData()}
            withSearch={selectedRow?.length === 0}
            commonActions={selectedRow?.length === 0}
            onSelectRows={setSelectedRow}
            withChecked
            hideTotal={false}
            singleSelect
            withFooter
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
          title={'Upload Monthly Emissions Report'}
          optional={'Attach Supporting Document (Optional)'}
          setFileList={setFileList}
          filesList={filesList}
          blockList={
            Array.isArray(blocks)
              ? blocks?.map((el) => ({
                label: el.block,
                value: el?.block,
              }))
              : []
          }
          visible={showUploadRapportDialog}
          onHide={() => {
            setShowUploadRapportDialog(false)
            setFileList([])
          }}
          onSave={onUpload}
          previewData={selectedRow[0]}
          formatDate="month"
        />
      )}
      {showUploadMHTDialog && (
        <MHTDialog
          headerTemplate={<></>}
          visible={showUploadMHTDialog}
          propsDataTable={uploadDataResponse}
          propsConfigs={[]}
          onHide={() => {
            setShowUploadMHTDialog(false)
            setShowUploadRapportDialog(true)
          }}
          onCommit={() => {
            setFileList([...filesList])
          }}
          onSave={() => {}}
        />
      )}
    </>
  )
}
export default Emissions
