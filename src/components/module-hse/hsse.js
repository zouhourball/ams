import { useState, useCallback, useEffect } from 'react'
import { Button } from 'react-md'
import Mht, {
  setSelectedRow as setSelectedRowDispatch,
} from '@target-energysolutions/mht'
import { useQuery, useMutation } from 'react-query'
import { useDispatch } from 'react-redux'
import { v4 as uuidv4 } from 'uuid'
import moment from 'moment'
import { get } from 'lodash-es'

import {
  hsseList,
  uploadHsse,
  commitHsse,
  saveHsse,
  updateHSSE,
  overrideHsse,
  deleteRows,
  deleteRow,
} from 'libs/api/hsse-api'
import {
  downloadTemp,
  downloadOriginalFile,
} from 'libs/api/supporting-document-api'
import getBlocks from 'libs/hooks/get-blocks'
import documents from 'libs/hooks/documents'
import getOrganizationInfos from 'libs/hooks/get-organization-infos'

import { addToast } from 'modules/app/actions'

import TopBar from 'components/top-bar'
import NavBar from 'components/nav-bar'
import ToastMsg from 'components/toast-msg'
import HeaderTemplate from 'components/header-template'
import UploadReportDialog from 'components/upload-report-dialog'
import useRole from 'libs/hooks/use-role'
import MHTDialog from 'components/mht-dialog'
import ConfirmDialog from 'components/confirm-dialog'
import SupportedDocument from 'components/supported-document'
import { buildObjectFromArray } from 'components/module-planning/utils'

import {
  monthlyReportConfigs,
  // monthlyReportData,
  actionsHeader,
  hsseDetailsConfigs,
} from './helpers'

const HSSE = () => {
  const [currentTab, setCurrentTab] = useState(0)
  const [selectedRow, setSelectedRow] = useState([])
  const [filesList, setFileList] = useState([])
  const [showUploadMHTDialog, setShowUploadMHTDialog] = useState(false)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [showSupportedDocumentDialog, setShowSupportedDocumentDialog] =
    useState(false)

  const dispatch = useDispatch()
  const { addSupportingDocuments } = documents()

  const role = useRole('flaring')

  useEffect(() => {
    return () => {
      dispatch(setSelectedRowDispatch([]))
    }
  }, [])

  const [showUploadRapportDialog, setShowUploadRapportDialog] = useState(false)
  const { data: hsseData, refetch: refetchHsse } = useQuery(
    ['hsseList'],
    hsseList,
  )

  const blocks = getBlocks()
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

  const { mutate: commitHSSE } = useMutation(commitHsse)
  const { mutate: saveHSSEMutate } = useMutation(saveHsse)
  const { mutate: updateMutate } = useMutation(updateHSSE)
  const { mutate: overrideMutate } = useMutation(overrideHsse)
  const { mutate: deleteRowMutate } = useMutation(deleteRow)
  const { mutate: deleteRowsMutate } = useMutation(deleteRows)

  const monthlyReportActionsHelper = [
    {
      title: 'Upload Monthly HSSE Report',
      onClick: () => setShowUploadRapportDialog(true),
    },
    {
      title: 'Download Template',
      onClick: () => {
        downloadTemp('flaring', 'hsse')
      },
    },
  ]

  const tabsList = ['Monthly Report']

  const renderCurrentTabData = useCallback(() => {
    if (hsseData) {
      return (hsseData?.content || [])?.map(
        (el) =>
          ({
            ...el?.metaData,
            id: el?.id,
            company: el?.metaData?.company,
            block: el?.metaData?.block,
            submittedDate: el?.metaData?.createdAt
              ? moment(el?.createdAt).format('DD MMM, YYYY')
              : '',
            submittedBy: el?.metaData?.createdBy?.name,
            referenceDate:
              (el?.metaData?.month
                ? moment(el?.metaData?.month).format('MMM') + ','
                : '') + el?.metaData?.year,
            statusDate: el?.metaData?.updatedAt
              ? moment(el?.metaData?.updatedAt).format('DD MMM, YYYY')
              : moment(el?.metaData?.createdAt).format('DD MMM, YYYY'),
            status: get(el, 'metaData.status', 'n/a'),
            fileName: get(el, 'metaData.originalFileName', ''),
          } || []),
      )
    }

    return []
  }, [hsseData])

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

  const mhtDialogData = () => {
    const res = uploadDataResponse?.data?.map((el) => ({
      item: el?.item,
      ...buildObjectFromArray(el.values, 'month'),
      yearEnd: el?.yearEndTarget,
    }))

    return res
  }

  const onCommitHsse = () => {
    commitHSSE(
      { body: uploadDataResponse },
      {
        onSuccess: (res) => {
          if (res) {
            if (res?.success) {
              setShowUploadMHTDialog(null)
              setShowUploadRapportDialog(false)
              refetchHsse()
            } else if (res.overrideId && !res.success) {
              setShowConfirmDialog(res.overrideId)
            }
          }
        },
      },
    )
  }

  const onSaveReport = () => {
    saveHSSEMutate(
      { body: uploadDataResponse },
      {
        onSuccess: (res) => {
          if (!res.error) {
            refetchHsse()
            setShowUploadMHTDialog(false)
            setShowUploadRapportDialog(false)
          }
        },
      },
    )
  }

  const onUpdateReport = (objectId) => {
    updateMutate(
      {
        objectId: objectId,
        status: 'SUBMITTED',
      },
      {
        onSuccess: (res) => {
          if (!res.error) {
            refetchHsse()
            dispatch(setSelectedRowDispatch([]))
            setSelectedRow([])
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
      },
    )
  }

  const handleOverride = () => {
    overrideMutate(
      {
        body: uploadDataResponse,
        overrideId: showConfirmDialog,
      },
      {
        onSuccess: (res) => {
          if (res.success) {
            setShowUploadMHTDialog(null)
            setShowConfirmDialog(null)
            refetchHsse()
          }
        },
      },
    )
  }

  const closeDialog = (resp) => {
    resp &&
      resp[0]?.statusCode === 'OK' &&
      setShowSupportedDocumentDialog(false)
  }

  const handleSupportingDocs = (data) => {
    addSupportingDocuments(
      data,
      selectedRow[0]?.processInstanceId ||
        showSupportedDocumentDialog?.processInstanceId,
      closeDialog,
    )
  }

  const handleDeleteHsse = () => {
    selectedRow?.length === 1
      ? deleteRowMutate(
        { objectId: selectedRow[0]?.id },
        {
          onSuccess: (res) => {
            if (!res.error) {
              refetchHsse()
              dispatch(setSelectedRowDispatch([]))
              setSelectedRow([])
            }
          },
        },
      )
      : deleteRowsMutate(
        {
          objectIds: selectedRow?.map((el) => el.id),
        },
        {
          onSuccess: (res) => {
            if (!res?.error) {
              refetchHsse()
              dispatch(setSelectedRowDispatch([]))
              setSelectedRow([])
            }
          },
        },
      )
  }

  return (
    <>
      <TopBar
        title="HSSE"
        role={role}
        actions={
          role === 'operator' &&
          monthlyReportActionsHelper?.map((btn, index) => (
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
        menuItems={() => {
          return [
            { key: 'hsse', primaryText: 'Delete', onClick: handleDeleteHsse },
          ]
        }}
      />
      <div className="subModule">
        <NavBar
          tabsList={tabsList}
          activeTab={currentTab}
          setActiveTab={setCurrentTab}
          onSelectRows={setSelectedRow}
        />
        <div className="subModule--table-wrapper">
          <Mht
            configs={monthlyReportConfigs(setShowSupportedDocumentDialog)}
            tableData={renderCurrentTabData()}
            hideTotal={false}
            singleSelect={true}
            withFooter
            withSearch={selectedRow?.length === 0}
            commonActions={selectedRow?.length === 0}
            onSelectRows={setSelectedRow}
            withChecked
            headerTemplate={
              selectedRow?.length === 1 && (
                <HeaderTemplate
                  title={`${selectedRow?.length} Row Selected`}
                  actions={actionsHeader(
                    'hsse',
                    selectedRow[0]?.id,
                    role,
                    setShowSupportedDocumentDialog,
                    handleDeleteHsse,
                    downloadOriginalFile,
                    selectedRow[0]?.originalFileId,
                    selectedRow[0]?.fileName,
                    onUpdateReport,
                    selectedRow[0]?.status,
                  )}
                />
              )
            }
          />
        </div>
      </div>
      {showUploadMHTDialog && (
        <MHTDialog
          headerTemplate={<></>}
          visible={showUploadMHTDialog}
          propsDataTable={mhtDialogData()}
          propsConfigs={hsseDetailsConfigs}
          onHide={() => {
            setShowUploadMHTDialog(false)
            setShowUploadRapportDialog(true)
          }}
          onCommit={() => {
            setFileList([...filesList])
            selectedRow[0]
              ? onUpdateReport(currentTab, selectedRow[0]?.id)
              : onCommitHsse()
          }}
          onSave={() => {
            onSaveReport()
          }}
        />
      )}
      {showUploadRapportDialog && (
        <UploadReportDialog
          title={'Upload Monthly HSSE Report'}
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

      {showConfirmDialog && (
        <ConfirmDialog
          onDiscard={() => setShowConfirmDialog(false)}
          visible={showConfirmDialog}
          handleOverride={handleOverride}
          message={'Do you confirm override ?'}
          confirmLabel={'Override'}
        />
      )}

      {showSupportedDocumentDialog && (
        <SupportedDocument
          title={
            role === 'regulator'
              ? 'Supporting Documents'
              : 'Upload supporting documents'
          }
          readOnly={role === 'regulator'}
          visible={showSupportedDocumentDialog}
          onDiscard={() => setShowSupportedDocumentDialog(false)}
          processInstanceId={
            typeof showSupportedDocumentDialog === 'object'
              ? showSupportedDocumentDialog?.processInstanceId
              : selectedRow[0]?.processInstanceId
          }
          onSaveUpload={(data) => {
            handleSupportingDocs(data)
          }}
        />
      )}
    </>
  )
}
export default HSSE
