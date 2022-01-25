import { useState, useMemo, useEffect } from 'react'
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

import documents from 'libs/hooks/documents'
import useRole from 'libs/hooks/use-role'
import {
  downloadTemp,
  downloadOriginalFile,
} from 'libs/api/supporting-document-api'
import {
  uploadWpbReport,
  uploadFypReport,
  commitPlanning,
  getListPlanning,
  overridePlanningReport,
  deletePlanning,
  updateReport,
  updatePlanning,
  saveReport,
} from 'libs/api/api-planning'
import getOrganizationInfos from 'libs/hooks/get-organization-infos'
import getBlocks from 'libs/hooks/get-blocks'
import { configsWpbDialogMht, configsFypDialogMht } from './mht-helper-dialog'

import { addToast } from 'modules/app/actions'

import { planningConfigs, actionsHeader, wpbData, fypData } from './helpers'

const Planning = () => {
  const dispatch = useDispatch()

  const subModule = get(location, 'pathname', '/').split('/').reverse()[0]

  const [currentTab, setCurrentTab] = useState(subModule)
  const [showUploadRapportDialog, setShowUploadRapportDialog] = useState(false)
  const [showSupportedDocumentDialog, setShowSupportedDocumentDialog] =
    useState(false)
  const [showUploadMHTDialog, setShowUploadMHTDialog] = useState(false)
  const [dataDisplayedMHT, setDataDisplayedMHT] = useState({})
  const [currentUpload, setCurrentUpload] = useState()
  const [overrideId, setOverrideId] = useState()
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [page, setPage] = useState(0)
  const [size, setSize] = useState(20)

  const [filesList, setFileList] = useState([])
  const role = useRole('planning')
  const blocks = getBlocks()
  const company = getOrganizationInfos()
  const { addSupportingDocuments } = documents()
  useEffect(() => {
    setSelectedRow([])
  }, [])
  const selectedRowSelector = useSelector(
    (state) => state?.selectRowsReducers?.selectedRows,
  )
  const setSelectedRow = (data) => dispatch(setSelectedRowAction(data))
  // const subModuleByCurrentTab = () => {
  //   switch (currentTab) {
  //     case 0:
  //       return 'wpb'
  //     case 1:
  //       return 'fyp'
  //     case 2:
  //       return ''
  //     default:
  //       return ''
  //   }
  // }

  const { data: listPlanning, refetch: refetchList } = useQuery(
    [
      'getListPlanning',
      currentTab,
      {
        size: size,
        page: page,
      },
    ],
    getListPlanning,
    {
      refetchOnWindowFocus: false,
    },
  )
  const updatePlanningMutation = useMutation(updatePlanning, {
    onSuccess: (res) => {
      refetchList()
    },
  })
  const uploadWpbReportMutate = useMutation(
    uploadWpbReport,

    {
      onSuccess: (res) => {
        if (!res.error) {
          setShowUploadMHTDialog(true)

          setCurrentUpload(res)
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

          setCurrentUpload(res)
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

      if (!res.error) {
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

  const handleUploadWpb = (body, uuid) => {
    uploadWpbReportMutate.mutate({
      body: {
        block: body?.block,
        company: company?.name || 'ams-org',
        file: body?.file[0],
        processInstanceId: uuid,
        year: moment(body?.referenceDate?.timestamp).format('YYYY'),
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
        year: moment(body?.referenceDate?.timestamp).format('YYYY'),
      },
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
      case 'wpb':
        return createActionsByCurrentTab(wpbPlanningActionsHelper)
      case 'fyp':
        return createActionsByCurrentTab(fypPlanningActionsHelper)
      case 'budgetary':
        return createActionsByCurrentTab(budgetaryPlanningActionsHelper)
      default:
        return null
    }
  }

  // const tabsList = [
  //   'Work Program & Budget',
  //   'Five Year Plan',
  //   'Budgetary Report',
  // ]
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
      linkToNewTab: `/ams/planning/budgetary`,
      label: 'Budgetary Report',
      key: 'budgetary',
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
        status: get(el, 'metaData.status', 'n/a'),
      }
    },
  )
  const selectedRow = selectedRowSelector.map((id) => tableDataPlanning[id])

  const renderDialogData = (data) => {
    switch (currentTab) {
      case 'wpb':
        return {
          title: 'Attach Speadsheet',
          optional: 'Attach Supporting Document (Optional)',
          onUpload: () => {
            const uuid = uuidv4()
            handleUploadWpb(data, uuid)
            addSupportingDocuments(data?.optionalFiles, uuid)
          },
        }
      case 'fyp':
        return {
          title: 'Attach Speadsheet',
          optional: 'Attach Supporting Document (Optional)',
          onUpload: () => {
            const uuid = uuidv4()
            handleUploadFyp(data, uuid)
            addSupportingDocuments(data?.optionalFiles, uuid)
          },
        }
      case 'budgetary':
        return {
          title: 'Attach Speadsheet',
          optional: 'Attach Supporting Document (Optional)',
          onUpload: () => {},
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
    currentUpload?.categories[0]?.subCategories[0]?.kpis[0]?.values[0]?.year

  const configsMht = () => {
    switch (currentTab) {
      case 'wpb':
        return configsWpbDialogMht()
      case 'fyp':
        return configsFypDialogMht(currentYear)
      default:
        break
    }
  }
  useMemo(() => {
    setPage(0)
  }, [currentTab])
  const uploadData = useMemo(() => {
    switch (currentTab) {
      case 'wpb':
        return wpbData(currentUpload) || []
      case 'fyp':
        return fypData(currentUpload) || []
      default:
        break
    }
  }, [currentUpload])
  const UploadSupportedDocumentFromTable = (row) => {
    setShowSupportedDocumentDialog(row)
  }
  const submitDraft = (subModule, objectId) => {
    updatePlanningMutation.mutate({
      subModule: subModule,
      objectId: objectId,
      status: 'SUBMITTED',
    })
  }
  return (
    <>
      <TopBar
        title="Planning"
        actions={role === 'operator' ? renderActionsByCurrentTab() : null}
        menuItems={() => {
          return [
            /* { key: 1, primaryText: 'Edit', onClick: () => null }, */
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
      />
      <NavBar
        tabsList={tabsList}
        activeTab={currentTab}
        setActiveTab={(tab) => {
          setCurrentTab(tab)
          setSelectedRow([])
        }}
      />
      <Mht
        configs={planningConfigs(UploadSupportedDocumentFromTable)}
        tableData={tableDataPlanning}
        hideTotal={false}
        singleSelect={true}
        withFooter
        withSearch={selectedRow?.length === 0}
        commonActions={selectedRow?.length === 0 || selectedRow?.length > 1}
        // onSelectRows={setSelectedRow}
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
                handleDeletePlanning,
                downloadOriginalFile,
                selectedRow[0]?.originalFileId,
                setShowUploadRapportDialog,
                selectedRow[0]?.fileName,
                submitDraft,
                selectedRow[0]?.status,
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
              />
            </>
          )
        }
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
          onSave={(data) => renderDialogData(data).onUpload()}
          previewData={selectedRow[0]}
          formatDate="year"
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
    </>
  )
}
export default Planning
