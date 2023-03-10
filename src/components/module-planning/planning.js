import { useState, useMemo, useEffect, useCallback } from 'react'
import { Button, TextField } from 'react-md'

import Mht, {
  setSelectedRow as setSelectedRowAction,
} from '@target-energysolutions/mht'

import { useDispatch, useSelector } from 'react-redux'
import { useMutation, useQuery } from 'react-query'
import { v4 as uuidv4 } from 'uuid'
import moment from 'moment'
import { get } from 'lodash-es'

import TopBar from 'components/top-bar'
import NavBar from 'components/nav-bar'
import UploadReportDialog from 'components/upload-report-dialog'
import HeaderTemplate from 'components/header-template'
import MHTDialog from 'components/mht-dialog'
import SupportedDocument from 'components/supported-document'
import ToastMsg from 'components/toast-msg'
import ConfirmDialog from 'components/confirm-dialog'
import VenueInvite from 'components/venue-invite'
import RightPanelMeeting from './right-panel-meeting'

import documents from 'libs/hooks/documents'
import useRole from 'libs/hooks/use-role'
import {
  downloadTemp,
  downloadOriginalFile,
} from 'libs/api/supporting-document-api'
import {
  // uploadWpbReport,
  // uploadFypReport,
  // uploadBudgetReport,
  uploadReport,
  commitPlanning,
  getListPlanning,
  overridePlanningReport,
  deletePlanning,
  updateReport,
  updatePlanning,
  saveReport,
  updateWpb,
  // updateWpbStatus,
  submitFromDraft,
  getActionsList,
  getMeeting,
  respondToMeeting,
} from 'libs/api/api-planning'
import getOrganizationInfos from 'libs/hooks/get-organization-infos'
import getBlocks from 'libs/hooks/get-blocks'
import {
  configsWpbDialogMht,
  configsFypDialogMht,
  configsBudgetDialogMht,
} from './mht-helper-dialog'
import { buildObjectFromArray } from './utils'

import { addToast } from 'modules/app/actions'

import { planningConfigs, actionsHeader, wpbData, fypData } from './helpers'

import './style.scss'
import DeleteDialog from 'components/delete-dialog'
import getCompanyInfos from 'libs/hooks/get-company-infos'
const Planning = ({ subModule }) => {
  const dispatch = useDispatch()

  const [currentTab, setCurrentTab] = useState(subModule)
  const [showUploadRapportDialog, setShowUploadRapportDialog] = useState(false)
  const [showSupportedDocumentDialog, setShowSupportedDocumentDialog] =
    useState(false)
  const [showUploadMHTDialog, setShowUploadMHTDialog] = useState(false)
  const [dataDisplayedMHT, setDataDisplayedMHT] = useState({})
  const [currentUpload, setCurrentUpload] = useState()
  const [overrideId, setOverrideId] = useState()
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [showRescheduleDialog, setShowRescheduleDialog] = useState(false)
  const [showMeeting, setShowMeeting] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const [page, setPage] = useState(0)
  const [size, setSize] = useState(20)

  const [filesList, setFileList] = useState([])
  const role = useRole('planning')
  const blocks = getBlocks()
  const company = getOrganizationInfos()
  const companyOrg = getCompanyInfos()

  const { addSupportingDocuments } = documents()
  useEffect(() => setSelectedRow([]), [])
  const mapStateToMeInfo = (state) => state?.query?.DEFAULT?.me?.data || null
  const useMe = () => {
    const me = useSelector(mapStateToMeInfo)
    return me
  }
  const me = useMe()

  const selectedRowSelector = useSelector(
    (state) => state?.selectRowsReducers?.selectedRows,
  )
  // const setSelectedRow = (data) => dispatch(setSelectedRowAction(data))

  const { data: listPlanning, refetch: refetchList } = useQuery(
    'getListPlanning',
    () =>
      getListPlanning({
        queryKey: [
          currentTab,
          {
            size,
            page,
          },
        ],
      }),
    {
      refetchOnWindowFocus: false,
      keepPreviousData: true,
    },
  )
  useEffect(() => {
    refetchList()
  }, [currentTab, page])

  /* const { data: membersData, refetch: refetchMembers } = useQuery(
    ['getAllProjectMembers', company?.id],
    getAllProjectMembers,
    {
      refetchOnWindowFocus: false,
    },
  ) */
  const updateWpbStatusToSubmit = useMutation(submitFromDraft, {
    onSuccess: (res) => {
      if (res?.success) {
        refetchList()
        setSelectedRow([])
      }
    },
  })
  // const updateStatusMutation = useMutation(updateWpbStatus, {
  //   onSuccess: (res) => {
  //     if (!res?.error) {
  //       refetchList()
  //       setSelectedRow([])
  //     }
  //   },
  // })
  const updatePlanningMutation = useMutation(updatePlanning, {
    onSuccess: (res) => {
      if (!res?.error) {
        refetchList()
        setSelectedRow([])
      }
    },
  })

  const uploadReportMutate = useMutation(
    uploadReport,

    {
      onSuccess: (res) => {
        if (!res.error) {
          setShowUploadMHTDialog(true)

          setCurrentUpload(res)
          onDisplayMHT(...res)
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

  const commitPlanningMutate = useMutation(
    commitPlanning,

    {
      onSuccess: (res) => {
        if (!res.error) {
          if (res.overrideId && !res.success) {
            setShowConfirmDialog(true)
            setShowUploadRapportDialog(false)
            setShowUploadMHTDialog(false)
            setOverrideId(res?.overrideId)
          } else {
            setShowUploadRapportDialog(false)
            setShowUploadMHTDialog(false)
            refetchList()

            dispatch(
              addToast(
                <ToastMsg
                  text={res.message || 'commited successfully'}
                  type="success"
                />,
                'hide',
              ),
            )
          }
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

  const overridePlanningMutate = useMutation(
    overridePlanningReport,

    {
      onSuccess: (res) => {
        if (!res.error) {
          if (res?.msg === 'saved') {
            refetchList()
            setShowConfirmDialog(false)
            dispatch(
              addToast(
                <ToastMsg
                  text={res.message || 'commited successfully'}
                  type="success"
                />,
                'hide',
              ),
            )
          }
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

  const deletePlanningMutate = useMutation(deletePlanning, {
    onSuccess: (res) => {
      refetchList()

      if (res?.success) {
        setSelectedRow([])
        dispatch(
          addToast(
            <ToastMsg
              text={res.message || 'Deleted successfully'}
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
  const updateWpbMutate = useMutation(updateWpb, {
    onSuccess: (res) => {
      refetchList()

      if (!res.error) {
        setSelectedRow([])
        setShowUploadRapportDialog(false)
        setShowUploadMHTDialog(false)
        dispatch(
          addToast(
            <ToastMsg
              text={res.message || 'Updated successfully'}
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
  const saveReportMutate = useMutation(saveReport, {
    onSuccess: (res) => {
      if (!res.error) {
        refetchList()
        setShowUploadRapportDialog(false)
        setShowUploadMHTDialog(false)
        dispatch(
          addToast(
            <ToastMsg text={res.message || 'success'} type="success" />,
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
  const updateReportMutate = useMutation(updateReport, {
    onSuccess: (res) => {
      if (!res.error) {
        refetchList()
        setShowUploadRapportDialog(false)
        setShowUploadMHTDialog(false)
        dispatch(
          addToast(
            <ToastMsg text={res.message || 'success'} type="success" />,
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
  const respondToMeetingMutation = useMutation(respondToMeeting, {
    onSuccess: (res) => {
      if (!res.error) {
        refetchMeetings()
        dispatch(
          addToast(
            <ToastMsg text={res.message || 'success'} type="success" />,
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
  const handleUploadReport = (body, uuid) => {
    uploadReportMutate.mutate({
      body: {
        block: body?.block,
        company: companyOrg?.company,
        file: body?.file[0],
        processInstanceId: uuid,
        year: moment(body?.referenceDate?.timestamp).format('YYYY'),
      },
      key: subModule,
    })
  }

  const onCommitPLanning = (subModule) => {
    commitPlanningMutate.mutate({
      subModule: subModule,
      body: currentUpload,
    })
  }

  const onOverridePlanning = (subModule, overrideId) => {
    overridePlanningMutate.mutate({
      subModule: subModule,
      overrideId: overrideId,
      body: currentUpload,
    })
  }

  const handleDeletePlanning = (subModule, objectId) => {
    deletePlanningMutate.mutate({
      subModule,
      objectId,
    })
  }
  const handleUpdateWpb = (objectId, data) => {
    updateWpbMutate.mutate({
      objectId,
      body: data,
    })
  }
  const onUpdateReport = (subModule, objectId) => {
    updateReportMutate.mutate({
      subModule: subModule,
      objectId: objectId,
      body: currentUpload,
    })
  }
  const onSaveReport = (subModule) => {
    saveReportMutate.mutate({
      subModule: subModule,
      body: currentUpload,
    })
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
    {
      title: 'Download Template',
      onClick: () => {
        downloadTemp('planning', 'budgetary-report')
      },
    },
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
      case 'wpb':
        return createActionsByCurrentTab(wpbPlanningActionsHelper)
      case 'fyp':
        return createActionsByCurrentTab(fypPlanningActionsHelper)
      case 'budgetary-report':
        return createActionsByCurrentTab(budgetaryPlanningActionsHelper)
      default:
        return null
    }
  }

  const tabsList = [
    {
      linkToNewTab: `/ams/planning/wpb`,
      label: 'Work Program & Budget',
      key: 'wpb',
    },

    {
      linkToNewTab: `/ams/planning/fyp`,
      label: 'Five Year Plan',
      key: 'fyp',
    },
    {
      linkToNewTab: `/ams/planning/budgetary-report`,
      label: 'Budgetary Report',
      key: 'budgetary-report',
    },
  ]

  const tableDataPlanning = (get(listPlanning, 'content', []) || []).map(
    (el) => {
      return {
        id: el?.id,
        processInstanceId: get(el, 'metaData.processInstanceId', ''),
        originalFileId: get(el, 'metaData.originalFileId', ''),
        fileName: get(el, 'metaData.originalFileName', ''),
        company: get(el, 'metaData.company', 'n/a'),
        block: get(el, 'metaData.block', 'n/a'),
        submittedDate: moment(el?.metaData?.createdAt).format('DD MMM, YYYY'),
        submittedBy: get(el, 'metaData.createdBy.name', 'n/a'),
        referenceDate: el?.metaData?.year,
        statusDate: el?.metaData?.updatedAt
          ? moment(el?.metaData?.updatedAt).format('DD MMM, YYYY')
          : moment(el?.metaData?.createdAt).format('DD MMM, YYYY'),
        ...(currentTab === 'wpb' && {
          latestVersion: get(el, 'versions', '[]')[el?.versions?.length - 1],
        }),
        status: get(el, 'metaData.status', 'n/a'),
      }
    },
  )
  const setSelectedRow = (data) => dispatch(setSelectedRowAction(data))
  const selectedRow = selectedRowSelector.map((id) => tableDataPlanning[id])
  const { data: actionsList } = useQuery(
    ['wbpActions', selectedRow[0]?.id, company?.organisationID],
    selectedRow[0] && getActionsList,

    // return array
  )
  const [rowId, setRowId] = useState('')

  const { data: listMeetings, refetch: refetchMeetings } = useQuery(
    ['listMeetings', rowId],
    rowId && getMeeting,
  )
  const renderDialogData = (data) => {
    switch (currentTab) {
      case 'wpb':
        return {
          title: 'Attach Speadsheet',
          optional: 'Attach Supporting Document (Optional)',
          onUpload: () => {
            const uuid = uuidv4()
            handleUploadReport(data, uuid)
            addSupportingDocuments(data?.optionalFiles, uuid)
          },
        }
      case 'fyp':
        return {
          title: 'Attach Speadsheet',
          optional: 'Attach Supporting Document (Optional)',
          onUpload: () => {
            const uuid = uuidv4()
            handleUploadReport(data, uuid)
            addSupportingDocuments(data?.optionalFiles, uuid)
          },
        }
      case 'budgetary-report':
        return {
          title: 'Attach Speadsheet',
          optional: 'Attach Supporting Document (Optional)',
          onUpload: () => {
            const uuid = uuidv4()
            handleUploadReport(data, uuid)
            addSupportingDocuments(data?.optionalFiles, uuid)
          },
        }
      default:
        break
    }
  }

  const closeSupportedDocumentDialog = (resp) => {
    resp &&
      resp[0]?.statusCode === 'OK' &&
      setShowSupportedDocumentDialog(false)
  }
  const handleSupportingDocs = (data) => {
    addSupportingDocuments(
      data,
      selectedRow[0]?.processInstanceId ||
        showSupportedDocumentDialog?.processInstanceId,
      closeSupportedDocumentDialog,
    )
  }

  const onDisplayMHT = (file) => {
    setShowUploadMHTDialog(true)
    setShowUploadRapportDialog(false)
    setDataDisplayedMHT(file)
  }

  const currentYear =
    currentUpload?.categories &&
    currentUpload?.categories[0]?.subCategories[0]?.kpis[0]?.values[0]?.year

  const configsMht = useCallback(() => {
    switch (currentTab) {
      case 'wpb':
        return configsWpbDialogMht()
      case 'budgetary-report':
        return [
          ...configsBudgetDialogMht(),
          ...(uploadReportMutate?.data?.data[0]?.years?.map((el) => ({
            label: el.year + '',
            key: el.year + '',
            width: '200',
            icon: 'mdi mdi-spellcheck',
            type: 'text',
          })) || []),
        ]
      case 'fyp':
        return configsFypDialogMht(currentYear)
      default:
        break
    }
  }, [uploadReportMutate])

  const uploadData = useMemo(() => {
    switch (currentTab) {
      case 'wpb':
        return wpbData(currentUpload) || []
      case 'fyp':
        return fypData(currentUpload) || []
      case 'budgetary-report':
        return (
          (uploadReportMutate?.data?.data || [])?.map((el) => ({
            ...el,
            ...buildObjectFromArray(el.years),
          })) || []
        )
      default:
        break
    }
  }, [uploadReportMutate, currentUpload])

  const UploadSupportedDocumentFromTable = (row) => {
    setShowSupportedDocumentDialog(row)
  }
  const displayMeetingList = (id) => {
    setRowId(id)
    setShowMeeting(id)
  }
  const reportId = useMemo(() => {
    const item = tableDataPlanning.find((i) => i.processInstanceId === rowId)
    if (item) return item.id
  }, [tableDataPlanning, rowId])

  const submitDraft = (subModule, objectId, status) => {
    subModule === 'wpb'
      ? updateWpbStatusToSubmit.mutate({
        objectId,
      })
      : updatePlanningMutation.mutate({
        subModule,
        objectId,
        status,
      })
  }
  // const updateStatus = (objectId, status) => {
  //   updateStatusMutation.mutate({
  //     objectId,
  //     status,
  //   })
  // }
  // const handleStatus = (key) => {
  //   // const roleKey = role.slice(0, -1)
  //   return updateStatus(
  //     selectedRow[0]?.id,
  //     key === 'accept'
  //       ? actionsList?.includes('ENDORSE')
  //         ? `ENDORSE`
  //         : `APPROVE`
  //       : `REJECT`,
  //   )
  // }
  const respondToMeetingHandler = (status, id) => {
    respondToMeetingMutation.mutate(
      {
        id,
        status,
      },
      {
        onSuccess: () => {
          window.open(`${reportId}/meeting/${id}`)
        },
      },
    )
  }
  return (
    <>
      <TopBar
        title="Planning"
        actions={role === 'operator' ? renderActionsByCurrentTab() : null}
        menuItems={() => {
          return [
            {
              key: 1,
              primaryText: 'Delete',
              onClick: () =>
                Promise.all(
                  selectedRow?.map((row) =>
                    handleDeletePlanning(currentTab, row?.id),
                  ),
                ).then(() => {
                  refetchList()
                }),
            },
          ]
        }}
        role={role}
      />

      <NavBar
        tabsList={tabsList}
        activeTab={currentTab}
        setActiveTab={(tab) => {
          setCurrentTab(tab)
          setPage(0)
          setSelectedRow([])
        }}
      />
      {/* actionsList?.length > 0 && selectedRow[0]?.status === 'SUBMITTED' && (
        <div className="btns-section">
          {(actionsList?.includes('ENDORSE') ||
            actionsList?.includes('APPROVE')) && (
            <Button
              id="accept"
              className="top-bar-buttons-list-item-btn"
              flat
              primary
              swapTheming
              onClick={() => handleStatus('accept')}
            >
              {actionsList?.includes('ENDORSE') ? 'Endorse' : 'Approve'}
            </Button>
          )}
          {actionsList?.includes('REJECT') && (
            <Button
              id="reject"
              className="top-bar-buttons-list-item-btn"
              flat
              primary
              swapTheming
              onClick={() => handleStatus('reject')}
            >
              Reject
            </Button>
          )}
        </div>
      ) */}
      <div className="planning-mht">
        <Mht
          configs={planningConfigs(
            UploadSupportedDocumentFromTable,
            currentTab,
            displayMeetingList,
          )}
          tableData={tableDataPlanning}
          hideTotal={false}
          singleSelect={true}
          withFooter
          withSearch={selectedRow?.length === 0}
          commonActions={selectedRow?.length === 0 || selectedRow?.length > 1}
          withChecked
          selectedRow={selectedRow}
          withDownloadCsv
          defaultCsvFileTitle={currentTab}
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
                  currentTab,
                  setShowDeleteDialog,
                  downloadOriginalFile,
                  selectedRow[0]?.originalFileId,
                  selectedRow[0]?.fileName,
                  submitDraft,
                  selectedRow[0]?.status,
                  setShowUploadRapportDialog,
                  actionsList?.length &&
                    actionsList?.includes('CREATE_MEETINGS'),
                  setShowRescheduleDialog,
                )}
              />
            ) : (
              ''
            )
          }
          footerTemplate={
            listPlanning?.totalPages > 1 && (
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
                    v >= listPlanning?.totalPages
                      ? setPage(listPlanning?.totalPages - 1)
                      : setPage(parseInt(v) - 1)
                  }
                  // disabled={status === 'closed'}
                />
                of {listPlanning?.totalPages}
                &nbsp;|&nbsp;Show
                <TextField
                  id="el_num"
                  lineDirection="center"
                  block
                  className="show"
                  value={size}
                  onChange={(v) =>
                    v > listPlanning?.totalElements
                      ? setSize(listPlanning?.totalElements)
                      : setSize(v)
                  }
                  onBlur={() => {
                    refetchList()
                  }}
                />
              </>
            )
          }
        />
      </div>
      <RightPanelMeeting
        onClose={() => setShowMeeting(false)}
        visible={showMeeting}
        meetings={listMeetings?.content}
        reportId={reportId}
        onCreate={() => setShowRescheduleDialog(true)}
        rightToCreateMeeting={actionsList?.includes('CREATE_MEETINGS')}
        respondToMeetingHandler={respondToMeetingHandler}
        me={me}
      />
      {showUploadMHTDialog && (
        <MHTDialog
          headerTemplate={<></>}
          visible={showUploadMHTDialog}
          propsDataTable={uploadData}
          propsConfigs={configsMht()}
          onHide={() => {
            setShowUploadMHTDialog(false)
            setShowUploadRapportDialog(true)
          }}
          onCommit={() => {
            setFileList([...filesList, dataDisplayedMHT])
            selectedRow[0]
              ? onUpdateReport(currentTab, selectedRow[0]?.id)
              : onCommitPLanning(currentTab)
          }}
          onSave={() => {
            onSaveReport(currentTab)
          }}
          onUpdate={() => {
            setFileList([...filesList, dataDisplayedMHT])
            handleUpdateWpb(selectedRow[0]?.id, currentUpload)
          }}
          id={selectedRow[0]?.id}
        />
      )}
      {showUploadRapportDialog && (
        <UploadReportDialog
          setFileList={setFileList}
          filesList={filesList}
          // onDisplayMHT={onDisplayMHT}
          title={renderDialogData().title}
          optional={renderDialogData().optional}
          visible={showUploadRapportDialog}
          blockList={
            Array.isArray(blocks)
              ? blocks?.map((el) => ({
                label: el.block,
                value: el?.block,
              }))
              : []
          }
          onHide={() => {
            setShowUploadRapportDialog(false)
            setFileList([])
          }}
          onSave={(data) => renderDialogData(data).onUpload()}
          // previewData={selectedRow[0]}
          formatDate="year"
          // onUpdate={handleUpdateWpb}
          row={selectedRow[0]}
        />
      )}

      {showConfirmDialog && (
        <ConfirmDialog
          onDiscard={() => setShowConfirmDialog(false)}
          visible={showConfirmDialog}
          handleOverride={() => onOverridePlanning(currentTab, overrideId)}
          message={'Do you confirm override ?'}
          confirmLabel={'Override'}
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
          readOnly={role === 'regulator'}
        />
      )}
      {showRescheduleDialog && (
        <VenueInvite
          onClose
          email={''}
          visible={showRescheduleDialog}
          subject={''}
          id={selectedRow[0]?.id}
          title={'Initiate Meeting'}
          toggle={() => {
            setShowRescheduleDialog(false)
          }}
          members={/* get(membersData, 'data', []) || */ []}
          processInstanceId={selectedRow[0]?.processInstanceId}
          role={role.slice(0, -1)}
        />
      )}
      {showDeleteDialog && (
        <DeleteDialog
          onDiscard={() => setShowDeleteDialog(false)}
          visible={showDeleteDialog}
          title="Confirm delete Proposal "
          text=" Are you sure you want to delete this proposal ? "
          hideDialog={() => setShowDeleteDialog(false)}
          handleDeleteProduction={() =>
            Promise.all(
              selectedRow?.map((row) =>
                handleDeletePlanning(currentTab, row?.id),
              ),
            ).then(() => {
              refetchList()
              setShowDeleteDialog(false)
            })
          }
        />
      )}
    </>
  )
}
export default Planning
