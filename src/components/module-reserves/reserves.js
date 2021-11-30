import { useState, useMemo } from 'react'
import { useMutation, useQuery } from 'react-query'
import { Button, CircularProgress } from 'react-md'
import Mht from '@target-energysolutions/mht'
import { v4 as uuidv4 } from 'uuid'
import moment from 'moment'
import useRole from 'libs/hooks/use-role'

import {
  uploadAnnualReport,
  uploadHistoryAndForecast,
  uploadAnnualResource,
  commitReport,
  getAnnualReport,
  getHistoryAndForecast,
  getAnnualResourceDetail,
} from 'libs/api/api-reserves'
import { downloadTemp } from 'libs/api/supporting-document-api'
import getBlocks from 'libs/hooks/get-blocks'

import documents from 'libs/hooks/documents'

import TopBar from 'components/top-bar'
import NavBar from 'components/nav-bar'
import UploadReportDialog from 'components/upload-report-dialog'
import HeaderTemplate from 'components/header-template'
import MHTDialog from 'components/mht-dialog'
import SupportedDocument from 'components/supported-document'

import {
  annualReservesConfigs,
  historyConfigs,
  annualResourceConfigs,
  actionsHeader,
} from './helpers'

const Reserves = () => {
  const [currentTab, setCurrentTab] = useState(0)
  const [showUploadRapportDialog, setShowUploadRapportDialog] = useState(false)
  const [showSupportedDocumentDialog, setShowSupportedDocumentDialog] =
    useState(false)
  const [selectedRow, setSelectedRow] = useState([])
  // const [showOveride] = useState(true)

  const [showUploadMHTDialog, setShowUploadMHTDialog] = useState(false)
  const [dataDisplayedMHT, setDataDisplayedMHT] = useState({})
  const [filesList, setFileList] = useState({})
  const [loading, setLoading] = useState(false)

  const role = useRole('reserves')

  const { data: listAnnualReserves, refetch: refetchAnnualReserves } = useQuery(
    ['getAnnualReport'],
    getAnnualReport,
  )
  /*, refetch: refetchHistoryAndForecast */
  const { data: listHistoryAndForecast, refetch: refetchHistoryAndForecast } =
    useQuery(['getHistoryAndForecast'], getHistoryAndForecast)
  const {
    data: listAnnualResourceDetail,
    refetch: refetchAnnualResourceDetail,
  } = useQuery(['getAnnualResourceDetail'], getAnnualResourceDetail)

  const {
    mutate: uploadAnnualReportMutate,
    data: uploadAnnualResponse,
    isLoading: annualUploadLoading,
  } = useMutation(uploadAnnualReport)
  const {
    mutate: onUploadHistoryReportMutate,
    data: onUploadHistoryReportResponse,
    isLoading: historyUploadLoading,
  } = useMutation(uploadHistoryAndForecast)
  const {
    mutate: onUploadDetailReportMutate,
    data: onUploadDetailReportResponse,
    isLoading: detailUploadLoading,
  } = useMutation(uploadAnnualResource)
  const blockList = getBlocks()
  const onCommitReportMutate = useMutation(commitReport)

  const { addSupportingDocuments } = documents()

  const resGenReport = () => {
    const resData = uploadAnnualResponse?.data
    return (
      resData?.data?.map((el) => ({
        category: el?.category,
        // item: el.items.map name ,
        // hydroTypes: items.map values
      })) || []
    )
  }
  const dataMht = useMemo(
    () => resGenReport(),

    [uploadAnnualResponse],
  )

  // const onSaveReportMutate = useMutation(saveReport)

  const annualReservesReportingActionsHelper = [
    {
      title: 'Upload Annual Reserves Report',
      onClick: () => setShowUploadRapportDialog(true),
    },
    {
      title: 'Download Template',
      onClick: () => {
        downloadTemp('reserve', 'annual', setLoading)
      },
    },
  ]

  const HistoryAndForecastActionsHelper = [
    {
      title: 'Upload History and Forecast Report',
      onClick: () => setShowUploadRapportDialog(true),
    },
    {
      title: 'Download Template',
      onClick: () => {
        downloadTemp('reserve', 'fyf', setLoading)
      },
    },
  ]

  const AnnualResourceDetailActionsHelper = [
    {
      title: 'Upload Annual Resource Detail Report',
      onClick: () => setShowUploadRapportDialog(true),
    },
    {
      title: 'Download Template',
      onClick: () => {
        downloadTemp('reserve', 'annualResource', setLoading)
      },
    },
  ]
  const closeDialog = (resp) => {
    resp &&
      resp[0]?.statusCode === 'OK' &&
      setShowSupportedDocumentDialog(false)
  }
  const annualReservesReportingSuppDocs = (data) => {
    addSupportingDocuments(
      data,
      selectedRow[0]?.processInstanceId ||
        showSupportedDocumentDialog?.processInstanceId,
      closeDialog,
    )
  }
  const handleSupportingDocs = (data) => {
    switch (currentTab) {
      case 0:
        annualReservesReportingSuppDocs(data)
        break
      case 1:
        annualReservesReportingSuppDocs(data)
        break
      case 2:
        annualReservesReportingSuppDocs(data)
        break
      default:
        break
    }
  }
  // const role = useRole('reserves')

  const createActionsByCurrentTab = (actionsList = []) => {
    return actionsList.map((btn, index) => (
      <Button
        key={`reserves-btn-${index}`}
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
        return createActionsByCurrentTab(annualReservesReportingActionsHelper)
      case 1:
        return createActionsByCurrentTab(HistoryAndForecastActionsHelper)
      case 2:
        return createActionsByCurrentTab(AnnualResourceDetailActionsHelper)
      default:
        break
    }
  }

  const tabsList = [
    'Annual Reserves Reporting',
    'History and Forecast',
    'Annual Resource Detail',
  ]
  const renderCurrentTabData = () => {
    switch (currentTab) {
      case 0:
        return (
          listAnnualReserves?.content?.map((el) => ({
            id: el?.id,
            company: el?.metaData?.company,
            block: el?.metaData?.block,
            submittedDate: el?.metaData?.createdAt
              ? moment(el?.metaData?.createdAt).format('DD MMM YYYY')
              : '',
            submittedBy: el?.metaData?.createdBy?.name,
            referenceDate: el?.metaData?.createdAt
              ? moment(el?.metaData?.createdAt).format('YYYY')
              : '',
            status:
              el?.metaData?.status !== 'ACKNOWLEDGED' && role === 'regulator'
                ? 'New Request'
                : el?.metaData?.status,
            fileId: el?.metaData?.originalFileId,
            fileName: el?.metaData?.originalFileName,
          })) || []
        )
      case 1:
        return (
          listHistoryAndForecast?.content?.map((el) => ({
            id: el?.id,
            company: el?.metaData?.company,
            block: el?.metaData?.block,
            submittedDate: el?.metaData?.createdAt
              ? moment(el?.metaData?.createdAt).format('DD MMM YYYY')
              : '',
            submittedBy: el?.metaData?.createdBy?.name,
            referenceDate: el?.metaData?.createdAt
              ? moment(el?.metaData?.createdAt).format('YYYY')
              : '',
            status:
              el?.metaData?.status !== 'ACKNOWLEDGED' && role === 'regulator'
                ? 'New Request'
                : el?.metaData?.status,
            fileId: el?.metaData?.originalFileId,
            fileName: el?.metaData?.originalFileName,
          })) || []
        )
      case 2:
        return (
          listAnnualResourceDetail?.content?.map((el) => ({
            id: el?.id,
            company: el?.metaData?.company,
            block: el?.metaData?.block,
            submittedDate: el?.metaData?.createdAt
              ? moment(el?.metaData?.createdAt).format('DD MMM YYYY')
              : '',
            submittedBy: el?.metaData?.createdBy?.name,
            referenceDate: el?.metaData?.createdAt
              ? moment(el?.metaData?.createdAt).format('YYYY')
              : '',
            status:
              el?.metaData?.status !== 'ACKNOWLEDGED' && role === 'regulator'
                ? 'New Request'
                : el?.metaData?.status,
            fileId: el?.metaData?.originalFileId,
            fileName: el?.metaData?.originalFileName,
          })) || []
        )
      default:
        return (
          listAnnualResourceDetail?.content?.map((el) => ({
            company: el?.metaData?.company,
            block: el?.metaData?.block,
            submittedDate: el?.metaData?.createdAt
              ? moment(el?.metaData?.createdAt).format('DD MMM YYYY')
              : '',
            submittedBy: el?.metaData?.createdBy?.name,
            referenceDate: el?.metaData?.createdAt
              ? moment(el?.metaData?.createdAt).format('YYYY')
              : '',
            status:
              el?.metaData?.status !== 'ACKNOWLEDGED' && role === 'regulator'
                ? 'New Request'
                : el?.metaData?.status,
          })) || []
        )
    }
  }
  const UploadSupportedDocumentFromTable = (row) => {
    setShowSupportedDocumentDialog(row)
  }

  const renderCurrentTabConfigs = () => {
    switch (currentTab) {
      case 0:
        return annualReservesConfigs(UploadSupportedDocumentFromTable)
      case 1:
        return historyConfigs(UploadSupportedDocumentFromTable)
      case 2:
        return annualResourceConfigs(UploadSupportedDocumentFromTable)
      default:
        return annualReservesConfigs(UploadSupportedDocumentFromTable)
    }
  }
  const renderSectionKey = () => {
    switch (currentTab) {
      case 0:
        return {
          name: 'annual',
          refetch: () => refetchAnnualReserves(),
        }
      case 1:
        return {
          name: 'fyf',
          refetch: () => refetchHistoryAndForecast(),
        }
      case 2:
        return {
          name: 'annualResource',
          refetch: () => getAnnualResourceDetail(),
        }
      default:
        break
    }
  }
  const renderDialogData = (data) => {
    switch (currentTab) {
      case 0:
        return {
          title: 'Upload Annual Reserves Report',
          optional: 'Attach Supporting Document (Optional)',
          onUpload: () => {
            const uuid = uuidv4()
            onAddReport(data, uuid)
            addSupportingDocuments(data?.optionalFiles, uuid)
          },
          onCommit: () =>
            onCommitReport(
              uploadAnnualResponse,
              'annual',
              refetchAnnualReserves,
            ),
        }
      case 1:
        return {
          title: 'Upload History and Forecast Report',
          optional: 'Attach Supporting Document (Optional)',
          onUpload: () => {
            const uuid = uuidv4()
            onUploadHistoryReport(data, uuid)
            addSupportingDocuments(data?.optionalFiles, uuid)
          },
          onCommit: () =>
            onCommitReport(
              onUploadHistoryReportResponse,
              'fyf',
              refetchHistoryAndForecast,
            ),
        }
      case 2:
        return {
          title: 'Upload Monthly Tracking Report',
          optional: 'Attach Supporting Document (Optional)',
          onUpload: () => {
            const uuid = uuidv4()
            onUploadDetailReport(data, uuid)
            addSupportingDocuments(data?.optionalFiles, uuid)
          },
          onCommit: () =>
            onCommitReport(
              onUploadDetailReportResponse,
              'annualResource',
              refetchAnnualResourceDetail,
            ),
        }
      case 3:
        return {
          title: 'Upload Oman Hydrocarbon Report',
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
  const onAddReport = (body, uuid) => {
    uploadAnnualReportMutate(
      {
        body: {
          block: body?.block,
          company: 'ams-org',
          file: body?.filesList,
          processInstanceId: uuid,
          year: '2021',
        },
      },
      {
        onSuccess: (res) => {
          onDisplayMHT(res?.data)
        },
      },
    )
  }
  /* const onSaveReport = (body) => {
    uploadAnnualReportMutate(
      {
        body: {
          block: body?.block,
          company: 'company',
          file: body?.filesList,
          processInstanceId: uuidv4(),
          year: '2021',
        },
      },
      {
        onSuccess: (res) => !res?.error && refetchAnnualReserves(),
      },
    )
  } */
  const onCommitReport = (body, sub, refetch) => {
    // console.log(body, 'uploadAnnualResponse')
    onCommitReportMutate.mutate(
      {
        body: body?.data,
        sub: sub,
      },
      {
        onSuccess: (res) => {
          /* {
            res?.msg === 'exist'  && setDialogVisible(true)
          } */
          return !res?.error && refetch()
        },
      },
    )
  }
  const onUploadHistoryReport = (body, uuid) => {
    onUploadHistoryReportMutate(
      {
        body: {
          block: body?.block,
          company: 'ams-org',
          file: body?.filesList,
          processInstanceId: uuid,
          year: '2021',
        },
      },
      {
        onSuccess: (res) => {
          onDisplayMHT(res?.data)
        },
      },
    )
  }
  const onUploadDetailReport = (body, uuid) => {
    onUploadDetailReportMutate(
      {
        body: {
          block: body?.block,
          company: 'ams-org',
          file: body?.filesList,
          hydrocarbonType: 'GAS',
          processInstanceId: uuid,
          year: '2021',
        },
      },
      {
        onSuccess: (res) => {
          onDisplayMHT(res?.data)
        },
      },
    )
  }
  // console.log(selectedRow, 'selectedRow')
  return (
    <>
      {(loading ||
        annualUploadLoading ||
        historyUploadLoading ||
        detailUploadLoading) && <CircularProgress />}
      <TopBar
        title="Reserve Reporting"
        actions={role === 'operator' ? renderActionsByCurrentTab() : null}
      />
      <div className="subModule">
        <NavBar
          tabsList={tabsList}
          activeTab={currentTab}
          setActiveTab={setCurrentTab}
        />
        <div className="subModule--table-wrapper">
          <Mht
            hideTotal={false}
            singleSelect={true}
            withFooter
            configs={renderCurrentTabConfigs()}
            tableData={renderCurrentTabData()}
            withSearch={selectedRow?.length === 0}
            commonActions={selectedRow?.length === 0}
            onSelectRows={setSelectedRow}
            withChecked
            selectedRow={selectedRow}
            headerTemplate={
              selectedRow?.length === 1 && (
                <HeaderTemplate
                  title={`${selectedRow.length} Row Selected`}
                  actions={actionsHeader(
                    'reserves-details',
                    selectedRow[0],
                    role,
                    setShowSupportedDocumentDialog,
                    setSelectedRow,
                    renderSectionKey(),
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
          propsDataTable={dataMht}
          onHide={() => {
            setShowUploadMHTDialog(false)
            setShowUploadRapportDialog(true)
          }}
          onSave={() => {
            setShowUploadMHTDialog(false)
            setShowUploadRapportDialog(true)
            setFileList(dataDisplayedMHT)
            renderDialogData().onCommit()
            setShowUploadRapportDialog(false)
          }}
        />
      )}

      {showUploadRapportDialog && (
        <UploadReportDialog
          setFileList={setFileList}
          filesList={filesList}
          onDisplayMHT={onDisplayMHT}
          hideDate
          title={renderDialogData().title}
          optional={renderDialogData().optional}
          visible={showUploadRapportDialog}
          onHide={() => {
            setShowUploadRapportDialog(false)
            setFileList({})
          }}
          blockList={
            Array.isArray(blockList)
              ? blockList?.map((el) => ({
                label: el.block,
                value: el?.block,
              }))
              : []
          }
          onSave={(data) => {
            renderDialogData(data).onUpload()
          }}
        />
      )}

      {showSupportedDocumentDialog && (
        <SupportedDocument
          title={'upload supporting documents'}
          visible={showSupportedDocumentDialog}
          onDiscard={() => setShowSupportedDocumentDialog(false)}
          processInstanceId={
            selectedRow[0]?.processInstanceId ||
            showSupportedDocumentDialog?.processInstanceId
          }
          onSaveUpload={(data) => {
            handleSupportingDocs(data)
          }}
        />
      )}
    </>
  )
}
export default Reserves
