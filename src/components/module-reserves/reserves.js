import { useState, useMemo, useEffect } from 'react'
import { useMutation, useQuery } from 'react-query'
import { Button, CircularProgress, DialogContainer, TextField } from 'react-md'

import Mht, {
  setSelectedRow as setSelectedRowAction,
} from '@target-energysolutions/mht'

import { useDispatch, useSelector } from 'react-redux'
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
  overrideReport,
  saveReport,
  updateReserveReport,
  deleteAll,
  deleteReport,
} from 'libs/api/api-reserves'
import { downloadTemp } from 'libs/api/supporting-document-api'
import getBlocks from 'libs/hooks/get-blocks'

import documents from 'libs/hooks/documents'
import getOrganizationInfos from 'libs/hooks/get-organization-infos'
import { addToast } from 'modules/app/actions'

import TopBar from 'components/top-bar'
import NavBar from 'components/nav-bar'
import UploadReportDialog from 'components/upload-report-dialog'
import HeaderTemplate from 'components/header-template'
import MHTDialog from 'components/mht-dialog'
import SupportedDocument from 'components/supported-document'
import ToastMsg from 'components/toast-msg'

import {
  annualReservesConfigs,
  historyConfigs,
  annualResourceConfigs,
  actionsHeader,
  annualData,
  fyfData,
  annualResource,
  annualReservesDetailsConfigs,
} from './helpers'
import DeleteDialog from 'components/delete-dialog'

const Reserves = ({ subkey, row, section, setRow }) => {
  const dispatch = useDispatch()

  const [currentTab, setCurrentTab] = useState(
    subkey === 'annual' ? 0 : subkey === 'fyf' ? 1 : 2,
  )
  const [currentUpload, setCurrentUpload] = useState()
  const [showUploadRapportDialog, setShowUploadRapportDialog] = useState(false)
  const [showSupportedDocumentDialog, setShowSupportedDocumentDialog] =
    useState(false)
  const [overrideDialog, setDialogOverride] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const [showUploadMHTDialog, setShowUploadMHTDialog] = useState(false)
  const [dataDisplayedMHT, setDataDisplayedMHT] = useState({})
  const [filesList, setFileList] = useState({})
  const [loading, setLoading] = useState(false)
  const [overrideId, setOverrideId] = useState()
  const [page, setPage] = useState(0)
  const [size, setSize] = useState(20)
  // const [commitedDialog, setCommitedDialog] = useState(false)
  const selectedRowSelector = useSelector(
    (state) => state?.selectRowsReducers?.selectedRows,
  )

  const setSelectedRow = (data) => dispatch(setSelectedRowAction(data))
  const UploadSupportedDocumentFromTable = (row) => {
    setShowSupportedDocumentDialog(row)
  }
  const role = useRole('reserves')
  const company = getOrganizationInfos()

  const { data: listAnnualReserves, refetch: refetchAnnualReserves } = useQuery(
    [
      'getAnnualReport',
      {
        queryKey: [
          {
            size,
            page,
          },
        ],
      },
    ],
    () =>
      getAnnualReport({
        queryKey: [
          {
            size,
            page,
          },
        ],
      }),
  )
  const { data: listHistoryAndForecast, refetch: refetchHistoryAndForecast } =
    useQuery('getHistoryAndForecast', () =>
      getHistoryAndForecast({
        queryKey: [
          {
            size,
            page,
          },
        ],
      }),
    )
  const {
    data: listAnnualResourceDetail,
    refetch: refetchAnnualResourceDetail,
  } = useQuery('getAnnualResourceDetail', () =>
    getAnnualResourceDetail({
      queryKey: [
        {
          size: size,
          page: page,
        },
      ],
    }),
  )

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
  const { mutate: onOverrideReportMutate } = useMutation(overrideReport)
  const blockList = getBlocks()
  const onCommitReportMutate = useMutation(commitReport)
  const onSaveReportMutate = useMutation(saveReport)

  const { addSupportingDocuments } = documents()

  const dataMht = useMemo(() => {
    switch (currentTab) {
      case 0:
        return annualData(uploadAnnualResponse?.data) || []
      case 1:
        return fyfData(onUploadHistoryReportResponse?.data) || []
      case 2:
        return annualResource(onUploadDetailReportResponse?.data) || []
      default:
        break
    }
  }, [
    uploadAnnualResponse,
    onUploadHistoryReportResponse,
    onUploadDetailReportResponse,
  ])

  // const onSaveReportMutate = useMutation(saveReport)
  const handleDeleteProduction = () => {
    deleteReport(showDeleteDialog, renderSectionKey().name).then((res) => {
      if (res?.success) {
        setSelectedRow([])
        setShowDeleteDialog(false)
        dispatch(
          addToast(
            <ToastMsg text={'Successfully deleted'} type="success" />,
            'hide',
          ),
        )

        return section?.refetch()
      } else {
        dispatch(
          addToast(
            <ToastMsg text={'Something went wrong'} type="error" />,
            'hide',
          ),
        )
      }
    })
  }
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
    annualReservesReportingSuppDocs(data)
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
            processInstanceId: el?.metaData?.processInstanceId,
            id: el?.id,
            company: el?.metaData?.company,
            block: el?.metaData?.block,
            submittedDate: el?.metaData?.createdAt
              ? moment(el?.metaData?.createdAt).format('DD MMM YYYY')
              : '',
            submittedBy: el?.metaData?.createdBy?.name,
            statusDate: el?.metaData?.updatedAt
              ? moment(el?.metaData?.updatedAt).format('DD MMM, YYYY')
              : moment(el?.metaData?.createdAt).format('DD MMM, YYYY'),
            referenceDate: el?.metaData?.year,
            status:
              el?.metaData?.status === 'SUBMITTED' && role === 'regulator'
                ? 'New Request'
                : el?.metaData?.status,
            fileId: el?.metaData?.originalFileId,
            fileName: el?.metaData?.originalFileName,
          })) || []
        )
      case 1:
        return (
          listHistoryAndForecast?.content?.map((el) => ({
            processInstanceId: el?.metaData?.processInstanceId,
            id: el?.id,
            company: el?.metaData?.company,
            block: el?.metaData?.block,
            submittedDate: el?.metaData?.createdAt
              ? moment(el?.metaData?.createdAt).format('DD MMM YYYY')
              : '',
            submittedBy: el?.metaData?.createdBy?.name,
            statusDate: el?.metaData?.updatedAt
              ? moment(el?.metaData?.updatedAt).format('DD MMM, YYYY')
              : moment(el?.metaData?.createdAt).format('DD MMM, YYYY'),
            referenceDate: el?.metaData?.year,
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
            processInstanceId: el?.metaData?.processInstanceId,
            id: el?.id,
            company: el?.metaData?.company,
            block: el?.metaData?.block,
            submittedDate: el?.metaData?.createdAt
              ? moment(el?.metaData?.createdAt).format('DD MMM YYYY')
              : '',
            submittedBy: el?.metaData?.createdBy?.name,
            statusDate: el?.metaData?.updatedAt
              ? moment(el?.metaData?.updatedAt).format('DD MMM, YYYY')
              : moment(el?.metaData?.createdAt).format('DD MMM, YYYY'),
            referenceDate: el?.metaData?.year,
            status:
              el?.metaData?.status !== 'ACKNOWLEDGED' && role === 'regulator'
                ? 'New Request'
                : el?.metaData?.status,
            fileId: el?.metaData?.originalFileId,
            fileName: el?.metaData?.originalFileName,
            productType: el?.metaData?.hydrocarbonType
              ? el?.metaData?.hydrocarbonType?.charAt(0) +
                el?.metaData?.hydrocarbonType?.toLowerCase().slice(1)
              : '',
          })) || []
        )
      default:
        return (
          listAnnualResourceDetail?.content?.map((el) => ({
            processInstanceId: el?.metaData?.processInstanceId,
            company: el?.metaData?.company,
            block: el?.metaData?.block,
            submittedDate: el?.metaData?.createdAt
              ? moment(el?.metaData?.createdAt).format('DD MMM YYYY')
              : '',
            submittedBy: el?.metaData?.createdBy?.name,
            statusDate: el?.metaData?.updatedAt
              ? moment(el?.metaData?.updatedAt).format('DD MMM, YYYY')
              : moment(el?.metaData?.createdAt).format('DD MMM, YYYY'),
            referenceDate: el?.metaData?.year,
            status:
              el?.metaData?.status !== 'ACKNOWLEDGED' && role === 'regulator'
                ? 'New Request'
                : el?.metaData?.status,
          })) || []
        )
    }
  }

  const selectedRow = selectedRowSelector.map(
    (id) => renderCurrentTabData()[id],
  )
  useEffect(() => {
    setSelectedRow([])
  }, [])
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
          totalElements: listAnnualReserves?.totalElements,
          totalPages: listAnnualReserves?.totalPages,
        }
      case 1:
        return {
          name: 'fyf',
          refetch: () => refetchHistoryAndForecast(),
          totalElements: listHistoryAndForecast?.totalElements,
          totalPages: listHistoryAndForecast?.totalPages,
        }
      case 2:
        return {
          name: 'annualResource',
          refetch: () => getAnnualResourceDetail(),
          totalElements: listAnnualResourceDetail?.totalElements,
          totalPages: listAnnualResourceDetail?.totalPages,
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
          onSave: () =>
            onSaveReport(uploadAnnualResponse, 'annual', refetchAnnualReserves),
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
          onSave: () =>
            onSaveReport(
              onUploadHistoryReportResponse,
              'fyf',
              refetchHistoryAndForecast,
            ),
        }
      case 2:
        return {
          title: 'Upload ARPR ( Resource) Details',
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
          onSave: () =>
            onSaveReport(
              onUploadDetailReportResponse,
              'annualResource',
              refetchAnnualResourceDetail,
            ),
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
          company: company?.name,
          file: body?.filesList,
          processInstanceId: uuid,
          year: moment(body?.referenceDate?.timestamp).format('YYYY'),
        },
      },
      {
        onSuccess: (res) => {
          onDisplayMHT(res?.data)
          setCurrentUpload(res)
        },
      },
    )
  }
  const updateReserveMutation = useMutation(updateReserveReport, {
    onSuccess: (res) => {
      renderSectionKey().refetch()
    },
  })
  const submitDraft = (subModule, objectId) => {
    updateReserveMutation.mutate({
      subModule: subModule,
      objectId: objectId,
      status: 'SUBMITTED',
    })
  }
  const onSaveReport = (body, sub, refetch) => {
    onSaveReportMutate.mutate(
      {
        body: body?.data,
        sub: sub,
      },
      {
        onSuccess: (res) => {
          if (res?.msg === 'commited') {
            // setCommitedDialog(true)
          }
          refetch()
        },
      },
    )
  }
  const onCommitReport = (body, sub, refetch) => {
    onCommitReportMutate.mutate(
      {
        body: body?.data,
        sub: sub,
      },
      {
        onSuccess: (res) => {
          if (res?.msg === 'exist') {
            setDialogOverride(true)
            setShowUploadRapportDialog(false)
            setShowUploadMHTDialog(false)
            setOverrideId(res?.overrideId)
          }

          return res?.success && refetch()
        },
      },
    )
  }
  const onUploadHistoryReport = (body, uuid) => {
    onUploadHistoryReportMutate(
      {
        body: {
          block: body?.block,
          company: company?.name,
          file: body?.filesList,
          processInstanceId: uuid,
          // year: moment(body?.referenceDate?.timestamp).format('YYYY'),
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
          company: company?.name,
          file: body?.filesList,
          hydrocarbonType: body?.hydrocarbonType.toUpperCase(),
          processInstanceId: uuid,
          year: moment(body?.referenceDate?.timestamp).format('YYYY'),
        },
      },
      {
        onSuccess: (res) => {
          onDisplayMHT(res?.data)
        },
      },
    )
  }
  const onOverrideReport = (subModule, overrideId) => {
    onOverrideReportMutate(
      {
        subModule: subModule,
        overrideId: overrideId,
        body: currentUpload?.data,
      },
      {
        onSuccess: () => {
          setDialogOverride(false)
        },
      },
    )
  }
  useEffect(() => {
    setPage(0)
  }, [currentTab])
  return (
    <>
      {(loading ||
        annualUploadLoading ||
        historyUploadLoading ||
        detailUploadLoading) && <CircularProgress />}
      <TopBar
        title="Reserve Reporting"
        // currentView={currentView}
        actions={role === 'operator' ? renderActionsByCurrentTab() : null}
        // onViewChange={setCurrentView}
        menuItems={() => {
          const ids = selectedRow?.map((el) => el?.id)
          return [
            /* { key: 1, primaryText: 'Edit', onClick: () => null }, */
            {
              key: 1,
              primaryText: 'Delete',
              onClick: () =>
                deleteAll(ids, renderSectionKey()?.name).then((res) => {
                  dispatch(
                    addToast(
                      <ToastMsg text={'Successfully deleted'} type="success" />,
                      'hide',
                    ),
                  )
                  renderSectionKey().refetch()
                }),
            },
          ]
        }}
        role={role}
      />
      <div className="subModule">
        <NavBar
          tabsList={tabsList}
          activeTab={currentTab}
          setActiveTab={(tab) => {
            setCurrentTab(tab)
            setSelectedRow([])
          }}
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
            // onSelectRows={setSelectedRow}
            withChecked
            withDownloadCsv
            defaultCsvFileTitle={renderSectionKey()?.name}
            selectedRow={selectedRow}
            footerTemplate={
              renderSectionKey()?.totalPages > 1 && (
                <>
                  &nbsp;|&nbsp;Page
                  <TextField
                    id="page_num"
                    lineDirection="center"
                    block
                    type={'number'}
                    className="page"
                    value={page + 1}
                    onChange={(v) =>
                      v >= renderSectionKey()?.totalPages
                        ? setPage(renderSectionKey()?.totalPages - 1)
                        : setPage(parseInt(v) - 1)
                    }
                    // disabled={status === 'closed'}
                  />
                  of {renderSectionKey()?.totalPages}
                  &nbsp;|&nbsp;Show
                  <TextField
                    id="el_num"
                    lineDirection="center"
                    block
                    className="show"
                    value={size}
                    onChange={(v) =>
                      v > renderSectionKey()?.totalElements
                        ? setSize(renderSectionKey()?.totalElements)
                        : setSize(v)
                    }
                    onBlur={() => {
                      currentTab === 0 && refetchAnnualReserves()
                      currentTab === 1 && refetchHistoryAndForecast()
                      currentTab === 2 && refetchAnnualResourceDetail()
                    }}
                  />
                </>
              )
            }
            headerTemplate={
              (selectedRow?.length === 1 && (
                <HeaderTemplate
                  title={`${selectedRow.length} Row Selected`}
                  actions={actionsHeader(
                    'reserves-details',
                    selectedRow[0],
                    role,
                    setShowSupportedDocumentDialog,
                    renderSectionKey(),
                    submitDraft,
                    setShowDeleteDialog,
                  )}
                />
              )) || <div />
            }
          />
        </div>
      </div>
      {showUploadMHTDialog && (
        <MHTDialog
          visible={showUploadMHTDialog}
          propsDataTable={dataMht}
          propsConfigs={annualReservesDetailsConfigs(
            renderSectionKey()?.name,
            dataMht[0]?.currentY,
          )}
          onHide={() => {
            setShowUploadMHTDialog(false)
            setShowUploadRapportDialog(true)
          }}
          onSave={() => {
            setShowUploadMHTDialog(false)
            // setShowUploadRapportDialog(true)
            setFileList(dataDisplayedMHT)
            renderDialogData().onSave()
            setShowUploadRapportDialog(false)
          }}
          onCommit={() => {
            setShowUploadMHTDialog(false)
            setFileList(dataDisplayedMHT)
            renderDialogData().onCommit()
            setShowUploadRapportDialog(false)
          }}
          headerTemplate={<div />}
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
          productType={currentTab === 2 ? ['Oil', 'Gas', 'Condensate'] : null}
          onSave={(data) => {
            renderDialogData(data).onUpload()
          }}
          formatDate={'year'}
          hideDate={currentTab === 1}
        />
      )}

      {showSupportedDocumentDialog && (
        <SupportedDocument
          title={'upload supporting documents'}
          visible={showSupportedDocumentDialog}
          onDiscard={() => setShowSupportedDocumentDialog(false)}
          readOnly={role === 'regulator'}
          processInstanceId={
            selectedRow[0]?.processInstanceId ||
            showSupportedDocumentDialog?.processInstanceId
          }
          onSaveUpload={(data) => {
            handleSupportingDocs(data)
          }}
        />
      )}
      {overrideDialog && (
        <DialogContainer
          visible={overrideDialog}
          title="Override"
          modal
          actions={[
            {
              children: 'Yes, Override It',
              primary: false,
              flat: true,
              swapTheming: true,
              onClick: () => {
                onOverrideReport(renderSectionKey().name, overrideId)
              },
            },
            {
              children: 'No Thanks',
              primary: true,
              flat: true,
              swapTheming: true,
              onClick: () => setDialogOverride(false),
            },
          ]}
        >
          <p className="md-color--secondary-text">
            This file already exists. Would you like to override it ?
          </p>
        </DialogContainer>
      )}

      {showDeleteDialog && (
        <DeleteDialog
          onDiscard={() => setShowDeleteDialog(false)}
          visible={showDeleteDialog}
          title="Confirm delete Proposal "
          text=" Are you sure you want to delete this proposal ? "
          hideDialog={() => setShowDeleteDialog(false)}
          handleDeleteProduction={() => handleDeleteProduction()}
        />
      )}
    </>
  )
}
export default Reserves
