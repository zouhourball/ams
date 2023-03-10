import { useState, useEffect } from 'react'
import { Button, TextField } from 'react-md'
import Mht, {
  setSelectedRow as setSelectedRowAction,
} from '@target-energysolutions/mht'
import { useQuery, useMutation } from 'react-query'
import { useDispatch, useSelector } from 'react-redux'
import { v4 as uuidv4 } from 'uuid'
import moment from 'moment'
import { get } from 'lodash-es'

import {
  getListFlaring,
  uploadDailyReport,
  uploadMonthlyReport,
  uploadAnnualForecastReport,
  commitFlaring,
  saveFlaring,
  overrideFlaringReport,
  deleteFlaring,
  updateFlaring,
  deleteAllFlaring,
} from 'libs/api/api-flaring'
import {
  downloadTemp,
  downloadOriginalFile,
  downloadAnnualPlan,
} from 'libs/api/supporting-document-api'
import getBlocks from 'libs/hooks/get-blocks'
// import getOrganizationInfos from 'libs/hooks/get-organization-infos'

import { addToast } from 'modules/app/actions'

import TopBar from 'components/top-bar'
import NavBar from 'components/nav-bar'
import UploadReportDialog from 'components/upload-report-dialog'
import HeaderTemplate from 'components/header-template'
import MHTDialog from 'components/mht-dialog'
import SupportedDocument from 'components/supported-document'
import ToastMsg from 'components/toast-msg'
import ConfirmDialog from 'components/confirm-dialog'

import useRole from 'libs/hooks/use-role'
import documents from 'libs/hooks/documents'

import {
  // annualReportConfigs,
  // monthlyReportConfigs,
  dailyReportConfigs,
  actionsHeaderAnnual,
  actionsHeaderMonthly,
  actionsHeaderDaily,
  flaringDetailsAnnualConfigs,
  flaringDetailsMonthlyConfigs,
  flaringDetailsDailyConfigs,
} from './helpers'

import './style.scss'
import DeleteDialog from 'components/delete-dialog'
import getCompanyInfos from 'libs/hooks/get-company-infos'

const Flaring = () => {
  const dispatch = useDispatch()
  const subModule = get(location, 'pathname', '/').split('/').reverse()[0]

  const [currentTab, setCurrentTab] = useState(subModule)
  const [showUploadRapportDialog, setShowUploadRapportDialog] = useState(false)
  const [showUploadMHTDialog, setShowUploadMHTDialog] = useState(false)
  const [dataDisplayedMHT, setDataDisplayedMHT] = useState({})
  const [filesList, setFileList] = useState([])
  const [showSupportedDocumentDialog, setShowSupportedDocumentDialog] =
    useState(false)
  const [currentUpload, setCurrentUpload] = useState()
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [overrideId, setOverrideId] = useState()
  const [page, setPage] = useState(0)
  const [size, setSize] = useState(20)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const selectedRow = useSelector(
    (state) => state?.selectRowsReducers?.selectedRows,
  )
  const setSelectedRow = (data) => dispatch(setSelectedRowAction(data))
  useEffect(() => {
    setSelectedRow([])
  }, [])
  const blocks = getBlocks()
  // const company = getOrganizationInfos()
  const companyOrg = getCompanyInfos()

  const { addSupportingDocuments } = documents()
  useEffect(() => {
    setPage(0)
  }, [currentTab])
  const { data: listFlaring, refetch: refetchList } = useQuery(
    [
      'getListFlaring',
      currentTab,
      {
        size: size,
        page: page,
      },
    ],
    getListFlaring,
    {
      refetchOnWindowFocus: false,
    },
  )

  const uploadDailyReportMutate = useMutation(
    uploadDailyReport,

    {
      onSuccess: (res) => {
        if (!res.error) {
          setCurrentUpload(res)
          onDisplayMHT(...res.values)
          dispatch(
            addToast(
              <ToastMsg
                text={
                  res.message || 'Daily Flaring report uploaded successfully'
                }
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

  const uploadMonthlyReportMutate = useMutation(
    uploadMonthlyReport,

    {
      onSuccess: (res) => {
        if (!res.error) {
          setCurrentUpload(res)
          onDisplayMHT(...res.values)
          dispatch(
            addToast(
              <ToastMsg
                text={
                  res.message || 'Daily Flaring report uploaded successfully'
                }
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

  const uploadAnnualForecastMutate = useMutation(
    uploadAnnualForecastReport,

    {
      onSuccess: (res) => {
        if (!res.error) {
          setCurrentUpload(res)
          onDisplayMHT(...res.values)
          dispatch(
            addToast(
              <ToastMsg
                text={
                  res.message || 'Daily Flaring report uploaded successfully'
                }
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
  const saveFlaringMutate = useMutation(saveFlaring, {
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
                text={res.message || 'saved successfully'}
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
  })
  const commitFlaringMutate = useMutation(
    commitFlaring,

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

  const overrideFlaringMutate = useMutation(
    overrideFlaringReport,

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
  const updateFlaringMutation = useMutation(updateFlaring, {
    onSuccess: (res) => {
      refetchList()
    },
  })
  const submitDraft = (subModule, objectId) => {
    updateFlaringMutation.mutate({
      subModule: subModule,
      objectId: objectId,
      status: 'SUBMITTED',
    })
  }
  const createYearKeys = (el) => {
    let data = {}
    for (const element of el?.values) {
      data = { ...data, [`year${element?.year}`]: element?.value }
    }
    return data
  }
  const renderCurrentTabDetailsData = () => {
    switch (currentTab) {
      case 'annual-forecast':
        return (get(currentUpload, 'data.data', []) || []).map((el) => {
          return {
            gaz_type: el?.name,
            unit: el?.unit,
            /* ...el?.values?.forEach((element) => {
              return { [`year${element?.year}`]: element?.value }
            }), */
            /* for (const [key, value] of Object.entries(object1)) {
              console.log(`${key}: ${value}`);
            } */
            ...createYearKeys(el),
            /* [`year${el?.values[0]?.year}`]: el?.values[0]?.value,
            [`year${el?.values[1]?.year}`]: el?.values[1]?.value,
            [`year${el?.values[2]?.year}`]: el?.values[2]?.value,
            [`year${el?.values[3]?.year}`]: el?.values[3]?.value,
            [`year${el?.values[4]?.year}`]: el?.values[4]?.value,
            [`year${el?.values[5]?.year}`]: el?.values[5]?.value,
            [`year${el?.values[6]?.year}`]: el?.values[6]?.value,
            [`year${el?.values[7]?.year}`]: el?.values[7]?.value,
            [`year${el?.values[8]?.year}`]: el?.values[8]?.value,
            [`year${el?.values[9]?.year}`]: el?.values[9]?.value, */
          }
        })
      case 'monthly-station':
        return (get(currentUpload, 'data.data', []) || []).map((el) => {
          return {
            flareStation: el?.flareStation,
            latitudeNorthing: el?.latitudeNorthing?.value,
            longitudeEasting: el?.longitudeEasting?.value,
            totalFlaringActuals: el?.totalFlaringActuals?.value,
            routineFlaringActuals: el?.routineFlaringActuals?.value,
            nonRoutineFlaringActuals: el?.nonRoutineFlaringActuals?.value,
            rotuineFlaringPlanned: el?.rotuineFlaringPlanned?.value,
            nonRotuineFlaringPlanned: el?.nonRotuineFlaringPlanned?.value,
            comment: el?.comment,
          }
        })
      case 'daily':
        return (get(currentUpload, 'data.data', []) || []).map((el) => {
          return {
            flareStation: el?.flareStation,
            latitudeNorthing: el?.latitudeNorthing,
            longitudeEasting: el?.longitudeEasting,
            flareAmountTotal: el?.flareAmountTotal?.value,
            routineFlaringAmount: el?.routineFlaringAmount?.value,
            nonroutineFlaringAmount: el?.nonroutineFlaringAmount?.value,
            comment: el?.comment,
          }
        })
      default:
        return null
    }
  }

  const yearsFromReport = currentUpload?.data?.data[0]?.values
  const renderCurrentTabDetailsConfigs = () => {
    switch (currentTab) {
      case 'annual-forecast':
        return flaringDetailsAnnualConfigs(yearsFromReport)
      case 'monthly-station':
        return flaringDetailsMonthlyConfigs
      case 'daily':
        return flaringDetailsDailyConfigs
      default:
        return null
    }
  }
  const handleDeleteFlaring = (id) => {
    // const selectedRows = selectedRow?.map((el) => renderCurrentTabData()[el])
    selectedRow?.length > 0 &&
      deleteFlaring(subModule, id).then((res) => {
        if (res?.success === true) {
          setSelectedRow([])
          setShowDeleteDialog(false)
          dispatch(
            addToast(
              <ToastMsg text={'Successfully deleted'} type="success" />,
              'hide',
            ),
          )
          refetchList()
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
  const onCommitFlaring = (subModule) => {
    commitFlaringMutate.mutate({
      subModule: subModule,
      body: currentUpload?.data,
    })
  }
  const onSaveFlaring = (subModule) => {
    saveFlaringMutate.mutate({
      subModule: subModule,
      body: currentUpload?.data,
    })
  }
  const onOverrideFlaring = (subModule, overrideId) => {
    overrideFlaringMutate.mutate({
      subModule: subModule,
      overrideId: overrideId,
      body: currentUpload?.data,
    })
  }

  const onAddReportByCurrentTab = (body) => {
    let uuid = uuidv4()
    switch (currentTab) {
      case 'daily':
        uploadDailyReportMutate.mutate({
          body: {
            block: body?.block,
            company: companyOrg?.company,
            file: body?.file[0],
            processInstanceId: uuid,
            date: moment(body?.referenceDate?.timestamp).format('YYYY-MM-DD'),
          },
        })
        addSupportingDocuments(body?.optionalFiles, uuid)

        break
      case 'monthly-station':
        uploadMonthlyReportMutate.mutate({
          body: {
            block: body?.block,
            company: companyOrg?.company,
            file: body?.file[0],
            processInstanceId: uuid,
            year: moment(body?.referenceDate?.timestamp).format('YYYY'),
            month: moment(body?.referenceDate?.timestamp).format('MMMM'),
          },
        })
        addSupportingDocuments(body?.optionalFiles, uuid)
        break
      case 'annual-forecast':
        uploadAnnualForecastMutate.mutate({
          body: {
            block: body?.block,
            company: companyOrg?.company,
            file: body?.file[0],
            processInstanceId: uuid,
            year: moment(body?.referenceDate?.timestamp).format('YYYY'),
          },
        })
        addSupportingDocuments(body?.optionalFiles, uuid)
        break
    }
  }

  const tableDataDailyFlaring = (get(listFlaring, 'content', []) || []).map(
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
        statusDate: el?.metaData?.updatedAt
          ? moment(el?.metaData?.updatedAt).format('DD MMM, YYYY')
          : moment(el?.metaData?.createdAt).format('DD MMM, YYYY'),
        referenceDate: moment(el?.metaData?.reportDate).format('DD MMM, YYYY'),
        status: get(el, 'metaData.status', 'n/a'),
      }
    },
  )

  const tableDataMonthlyFlaring = (get(listFlaring, 'content', []) || []).map(
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
        statusDate: el?.metaData?.updatedAt
          ? moment(el?.metaData?.updatedAt).format('DD MMM, YYYY')
          : moment(el?.metaData?.createdAt).format('DD MMM, YYYY'),
        referenceDate: `${el?.metaData?.month} ${el?.metaData?.year}`,
        status: get(el, 'metaData.status', 'n/a'),
      }
    },
  )

  const tableDataAnnualFlaring = (get(listFlaring, 'content', []) || []).map(
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
        referenceDate: get(el, 'metaData.year', 'n/a'),
        statusDate: el?.metaData?.updatedAt
          ? moment(el?.metaData?.updatedAt).format('DD MMM, YYYY')
          : moment(el?.metaData?.createdAt).format('DD MMM, YYYY'),
        status: get(el, 'metaData.status', 'n/a'),
      }
    },
  )

  const renderCurrentTabData = () => {
    switch (currentTab) {
      case 'daily':
        return tableDataDailyFlaring
      case 'monthly-station':
        return tableDataMonthlyFlaring
      case 'annual-forecast':
        return tableDataAnnualFlaring
      default:
        return null
    }
  }

  /* const selectedRow = selectedRowSelector?.map(
    (id) => renderCurrentTabData()[id],
  ) */

  const role = useRole('flaring')

  const annualReportActionsHelper = [
    {
      title: 'Upload Annual Flaring Report',
      onClick: () => setShowUploadRapportDialog(true),
    },
    {
      title: 'Download Template',
      onClick: () => downloadTemp('flaring', 'annualGasFlaringForecast'),
    },
    {
      title: 'Download Annual Plan Template',
      onClick: () => {
        downloadAnnualPlan()
      },
    },
  ]
  const monthlyReportActionsHelper = [
    {
      title: 'Upload Monthly Flaring Report',
      onClick: () => setShowUploadRapportDialog(true),
    },
    {
      title: 'Download Template',
      onClick: () => downloadTemp('flaring', 'monthlyFlaringStation'),
    },
  ]

  const dailyReportActionsHelper = [
    {
      title: 'Upload Daily Flaring Report',
      onClick: () => setShowUploadRapportDialog(true),
    },
    {
      title: 'Download Template',
      onClick: () => downloadTemp('flaring', 'dailyFlaringReport'),
    },
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
      case 'monthly-station':
        return createActionsByCurrentTab(monthlyReportActionsHelper)
      case 'daily':
        return createActionsByCurrentTab(dailyReportActionsHelper)
      case 'annual-forecast':
      default:
        return createActionsByCurrentTab(annualReportActionsHelper)
    }
  }

  const tabsList = [
    {
      linkToNewTab: `/ams/hse/flaring/annual-forecast`,
      label: 'Reduction Roadmap',
      key: 'annual-forecast',
    },

    {
      linkToNewTab: `/ams/hse/flaring/monthly-station`,
      label: 'Monthly Report',
      key: 'monthly-station',
    },
    {
      linkToNewTab: `/ams/hse/flaring/daily`,
      label: 'Daily Report',
      key: 'daily',
    },
  ]

  const renderDialogData = () => {
    switch (currentTab) {
      case 'monthly-station':
        return {
          title: 'Upload Monthly Flaring Report',
          optional: 'Attach Supporting Document (Optional)',
          onClick: () => {},
        }
      case 'daily':
        return {
          title: 'Upload Daily Flaring Report',
          optional: 'Attach Supporting Document (Optional)',
          onClick: () => {},
        }
      case 'annual-forecast':
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
  const actionsHeader = () => {
    switch (currentTab) {
      case 'monthly-station':
        return actionsHeaderMonthly(
          'flaring',
          renderCurrentTabData()[selectedRow[0]]?.id,
          role,
          setShowSupportedDocumentDialog,
          currentTab,
          setShowDeleteDialog,
          downloadOriginalFile,
          renderCurrentTabData()[selectedRow[0]]?.originalFileId,
          renderCurrentTabData()[selectedRow[0]]?.fileName,
          submitDraft,
          renderCurrentTabData()[selectedRow[0]]?.status,
        )
      case 'daily':
        return actionsHeaderDaily(
          'flaring',
          renderCurrentTabData()[selectedRow[0]]?.id,
          role,
          setShowSupportedDocumentDialog,
          currentTab,
          setShowDeleteDialog,
          downloadOriginalFile,
          renderCurrentTabData()[selectedRow[0]]?.originalFileId,
          renderCurrentTabData()[selectedRow[0]]?.fileName,
          submitDraft,
          renderCurrentTabData()[selectedRow[0]]?.status,
        )
      case 'annual-forecast':
      default:
        return actionsHeaderAnnual(
          'flaring',
          renderCurrentTabData()[selectedRow[0]]?.id,
          role,
          setShowSupportedDocumentDialog,
          currentTab,
          setShowDeleteDialog,
          downloadOriginalFile,
          renderCurrentTabData()[selectedRow[0]]?.originalFileId,
          renderCurrentTabData()[selectedRow[0]]?.fileName,
          submitDraft,
          renderCurrentTabData()[selectedRow[0]]?.status,
        )
    }
  }

  const onDisplayMHT = (file) => {
    setShowUploadMHTDialog(true)
    setShowUploadRapportDialog(false)
    setDataDisplayedMHT(file)
  }
  const closeDialog = (resp) => {
    resp &&
      resp[0]?.statusCode === 'OK' &&
      setShowSupportedDocumentDialog(false)
  }

  const flaringSuppDocs = (data) => {
    addSupportingDocuments(
      data,
      renderCurrentTabData()[selectedRow[0]]?.processInstanceId ||
        showSupportedDocumentDialog?.processInstanceId,
      closeDialog,
    )
  }

  const UploadSupportedDocumentFromTable = (row) => {
    setShowSupportedDocumentDialog(row)
  }

  return (
    <>
      <TopBar
        title="Flaring"
        actions={role === 'operator' ? renderActionsByCurrentTab() : null}
        menuItems={() => {
          const ids = selectedRow?.map((el) => renderCurrentTabData()[el]?.id)
          return [
            /* { key: 1, primaryText: 'Edit', onClick: () => null }, */
            {
              key: 1,
              primaryText: 'Delete',
              onClick: () =>
                selectedRow?.length > 0 &&
                deleteAllFlaring(subModule, ids).then((res) => {
                  if (res) {
                    dispatch(
                      addToast(
                        <ToastMsg
                          text={'Successfully deleted'}
                          type="success"
                        />,
                        'hide',
                      ),
                    )
                    refetchList()
                  } else {
                    dispatch(
                      addToast(
                        <ToastMsg text={'Something went wrong'} type="error" />,
                        'hide',
                      ),
                    )
                  }
                }),
              // Promise.all(
              //   selectedRow?.map((row) =>
              //     handleDeleteFlaring(currentTab, row?.id),
              //   ),
              // ).then(() => refetchList()),
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
            configs={dailyReportConfigs(UploadSupportedDocumentFromTable)}
            tableData={renderCurrentTabData() || []}
            hideTotal={false}
            singleSelect={true}
            withFooter
            withSearch={selectedRow?.length === 0}
            commonActions={selectedRow?.length === 0}
            onSelectRows={dispatch(setSelectedRowAction)}
            withChecked
            // selectedRow={selectedRow}
            withDownloadCsv
            defaultCsvFileTitle={subModule}
            headerTemplate={
              selectedRow?.length === 1 && (
                <HeaderTemplate
                  title={`${selectedRow?.length} Row Selected`}
                  actions={actionsHeader()}
                />
              )
            }
            footerTemplate={
              listFlaring?.totalPages > 1 && (
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
                      v >= listFlaring?.totalPages
                        ? setPage(listFlaring?.totalPages - 1)
                        : setPage(parseInt(v) - 1)
                    }
                    // disabled={status === 'closed'}
                  />
                  of {listFlaring?.totalPages}
                  &nbsp;|&nbsp;Show
                  <TextField
                    id="el_num"
                    lineDirection="center"
                    block
                    className="show"
                    value={size}
                    onChange={(v) =>
                      v > listFlaring?.totalElements
                        ? setSize(listFlaring?.totalElements)
                        : setSize(v)
                    }
                  />
                </>
              )
            }
          />
        </div>

        {showUploadMHTDialog && (
          <MHTDialog
            headerTemplate={<></>}
            visible={showUploadMHTDialog}
            onHide={() => {
              setShowUploadMHTDialog(false)
              setShowUploadRapportDialog(true)
            }}
            propsConfigs={renderCurrentTabDetailsConfigs()}
            propsDataTable={renderCurrentTabDetailsData()}
            onCommit={() => {
              setFileList([...filesList, dataDisplayedMHT])
              onCommitFlaring(currentTab)
            }}
            onSave={() => {
              onSaveFlaring(currentTab)
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
            required={renderDialogData().required}
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
            onSave={(data) => {
              onAddReportByCurrentTab(data)
            }}
            formatDate={
              currentTab === 'annual-forecast'
                ? 'year'
                : currentTab === 'monthly-station'
                  ? 'month'
                  : 'day'
            }
          />
        )}

        {showConfirmDialog && (
          <ConfirmDialog
            onDiscard={() => setShowConfirmDialog(false)}
            visible={showConfirmDialog}
            handleOverride={() => onOverrideFlaring(currentTab, overrideId)}
            message={'Do you confirm override ?'}
            confirmLabel={'Override'}
          />
        )}
        {showSupportedDocumentDialog && (
          <SupportedDocument
            title={'upload supported documents'}
            visible={showSupportedDocumentDialog}
            onDiscard={() => setShowSupportedDocumentDialog(false)}
            processInstanceId={
              renderCurrentTabData()[selectedRow[0]]?.processInstanceId ||
              showSupportedDocumentDialog?.processInstanceId
            }
            onSaveUpload={(data) => {
              flaringSuppDocs(data)
            }}
            readOnly={role === 'regulator'}
          />
        )}
        {showDeleteDialog && (
          <DeleteDialog
            onDiscard={() => setShowDeleteDialog(false)}
            visible={showDeleteDialog}
            title="Confirm delete Proposal "
            text=" Are you sure you want to delete this proposal ? "
            hideDialog={() => setShowDeleteDialog(false)}
            handleDeleteProduction={() => handleDeleteFlaring(selectedRow[0])}
          />
        )}
      </div>
    </>
  )
}
export default Flaring

/* eslint-disable */
String.prototype.downloadFile = function () {
  let a = document.createElement('A')
  a.href = this
  a.id = 'hhsgagsgfkopaerj225zef5'
  a.download = this.substr(this.lastIndexOf('/') + 1)
  document.body.appendChild(a)
  a.click()
  document.getElementById('hhsgagsgfkopaerj225zef5').remove()
}
/* eslint-enable */
