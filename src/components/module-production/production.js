import { useState } from 'react'
import { Button, SelectField, DialogContainer } from 'react-md'
import Mht from '@target-energysolutions/mht'
import { useMutation, useQuery } from 'react-query'
import moment from 'moment'
import { v4 as uuidv4 } from 'uuid'
import { useDispatch } from 'react-redux'
import { get } from 'lodash-es'

import { addToast } from 'modules/app/actions'

import useRole from 'libs/hooks/use-role'
import documents from 'libs/hooks/documents'
import {
  downloadOriginalFile,
  downloadTemp,
} from 'libs/api/supporting-document-api'
import getOrganizationInfos from 'libs/hooks/get-organization-infos'

import ToastMsg from 'components/toast-msg'

import {
  getListProduction,
  uploadDailyProductionReport,
  uploadMonthlyProductionReport,
  uploadMonthlyTrackingProductionReport,
  commitProduction,
  saveProduction,
  overrideProductionReport,
  deleteProduction,
  updateDailyProduction,
} from 'libs/api/api-production'

import TopBar from 'components/top-bar'
import NavBar from 'components/nav-bar'
import UploadReportDialog from 'components/upload-report-dialog'
import HeaderTemplate from 'components/header-template'
import MHTDialog from 'components/mht-dialog'
import SupportedDocument from 'components/supported-document'
import getBlocks from 'libs/hooks/get-blocks'

import {
  dailyProductionConfigs,
  monthlyProductionConfigs,
  monthlyTrackingConfigs,
  omanHydConfigs,
  dailyProductionData,
  actionsHeader,
  dailyProductionDetailsConfigs,
  MonthlyProductionDetailsConfigs,
  MonthlyTrackingDetailsConfigs,
} from './helpers'

const Production = () => {
  const subModule = get(location, 'pathname', '/').split('/').reverse()[0]

  const [currentTab, setCurrentTab] = useState(subModule)
  const [showUploadRapportDialog, setShowUploadRapportDialog] = useState(false)
  const [showSupportedDocumentDialog, setShowSupportedDocumentDialog] =
    useState(false)
  const [selectedRow, setSelectedRow] = useState([])
  const [showUploadMHTDialog, setShowUploadMHTDialog] = useState(false)
  const [overrideDialog, setOverrideDialog] = useState(false)
  const [overrideId, setOverrideId] = useState()
  const [dataDisplayedMHT, setDataDisplayedMHT] = useState({})
  const [filesList, setFileList] = useState([])
  const [selectFieldValue, setSelectFieldValue] = useState('Monthly Production')

  const [currentUpload, setCurrentUpload] = useState()
  const dispatch = useDispatch()

  const company = getOrganizationInfos()
  const role = useRole('production')

  const { addSupportingDocuments } = documents()
  const blocks = getBlocks()
  const uploadDailyReportMutate = useMutation(
    uploadDailyProductionReport,

    {
      onSuccess: (res) => {
        if (!res.error) {
          setCurrentUpload(res)
          onDisplayMHT(...res.values)
          dispatch(
            addToast(
              <ToastMsg
                text={
                  res.message || 'Daily production report uploaded successfully'
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
    uploadMonthlyProductionReport,

    {
      onSuccess: (res) => {
        if (!res.error) {
          setCurrentUpload(res?.uploaded)
          onDisplayMHT(...res.values)
          dispatch(
            addToast(
              <ToastMsg
                text={
                  res.message || 'Daily production report uploaded successfully'
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
                text={res.error?.body?.message || 'something_went_wrong'}
                type="error"
              />,
              'hide',
            ),
          )
        }
      },
    },
  )

  const uploadMonthlyTrackingReportMutate = useMutation(
    uploadMonthlyTrackingProductionReport,

    {
      onSuccess: (res) => {
        if (!res.error) {
          setCurrentUpload(res)
          onDisplayMHT(...res.values)
          dispatch(
            addToast(
              <ToastMsg
                text={
                  res.message || 'Daily production report uploaded successfully'
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
                text={res.error?.body?.message || 'something_went_wrong'}
                type="error"
              />,
              'hide',
            ),
          )
        }
      },
    },
  )
  const saveProductionMutate = useMutation(saveProduction, {
    onSuccess: (res) => {
      if (!res.error) {
        if (res?.msg === 'exist') {
          setOverrideDialog(true)
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
  const commitProductionMutate = useMutation(
    commitProduction,

    {
      onSuccess: (res) => {
        if (!res.error) {
          if (res?.msg === 'exist') {
            setOverrideDialog(true)
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

  const overrideProductionMutate = useMutation(
    overrideProductionReport,

    {
      onSuccess: (res) => {
        if (!res.error) {
          if (res?.msg === 'saved') {
            refetchList()
            setOverrideDialog(false)
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

  const deleteProductionMutate = useMutation(
    deleteProduction,

    {
      onSuccess: (res) => {
        refetchList()

        if (!res.error) {
          // refetchList()
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
    },
  )

  const updateProductionMutation = useMutation(updateDailyProduction, {
    onSuccess: (res) => {
      if (!res.error) {
        refetchList()
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

  const handleDeleteProduction = (subModule, objectId) => {
    deleteProductionMutate.mutate({
      subModule,
      objectId,
    })
  }
  const onCommitProduction = (subModule) => {
    commitProductionMutate.mutate({
      subModule: subModule,
      body: currentUpload,
    })
  }
  const onSaveProduction = (subModule) => {
    saveProductionMutate.mutate({
      subModule: subModule,
      body: currentUpload,
    })
  }
  // subModule, overrideId, body

  const onOverrideProduction = (subModule, overrideId) => {
    overrideProductionMutate.mutate({
      subModule: subModule,
      overrideId: overrideId,
      body: currentUpload,
    })
  }

  const submitDraft = (subModule, objectId) => {
    updateProductionMutation.mutate({
      subModule: subModule,
      objectId: objectId,
      status: 'SUBMITTED',
    })
  }

  const currentSubsubModule = () => {
    switch (selectFieldValue) {
      case 'Monthly Production':
        return 'production'
      case 'Monthly Well Counts':
        return 'wellCount'
      default:
        return ''
    }
  }

  const onAddReportByCurrentTab = (body) => {
    let uuid = uuidv4()
    switch (currentTab) {
      case 'daily':
        uploadDailyReportMutate.mutate({
          body: {
            block: body?.block,
            company: company?.name || 'ams-org',
            file: body?.file,
            processInstanceId: uuid,
            dailyDate: moment(body?.referenceDate).format('YYYY-MM-DD'),
          },
        })
        addSupportingDocuments(body?.optionalFiles, uuid)
        break
      case 'monthly':
        uploadMonthlyReportMutate.mutate({
          body: {
            block: body?.block,
            company: company?.name || 'ams-org',
            file: body?.file,
            processInstanceId: uuid,
            month: moment(body?.referenceDate).format('MMMM'),
            year: moment(body?.referenceDate).format('YYYY'),
          },
        })
        addSupportingDocuments(body?.optionalFiles, uuid)
        break
      case 'monthly-tracking':
        uploadMonthlyTrackingReportMutate.mutate({
          body: {
            block: body?.block,
            company: company?.name || 'ams-org',
            file: body?.file,
            processInstanceId: uuidv4(),
            month: moment(body?.referenceDate).format('MMMM'),
            year: moment(body?.referenceDate).format('YYYY'),
          },
        })
        addSupportingDocuments(body?.optionalFiles, uuid)
        break
    }
  }

  const { data: listDailyProduction, refetch: refetchList } = useQuery(
    ['getListProduction', currentTab],
    getListProduction,
    {
      refetchOnWindowFocus: false,
    },
  )

  const dailyData = (get(currentUpload, 'values', []) || []).map((el) => {
    return {
      production: [{ item: el?.name }, { uom: el?.unit }],
      dailyField: [
        { actualF: el?.data[0]['DAILY FIELD PRODUCTION VOLS'][0]?.Actual },
        { target: el?.data[0]['DAILY FIELD PRODUCTION VOLS'][1]?.Target },
        { le: el?.data[0]['DAILY FIELD PRODUCTION VOLS'][2]?.LE },
      ],
      scheduled: [
        { actual: el?.data[1]['SCHEDULED DEFERMENT VOLS'][0]?.Actual },
        { actualS: el?.data[1]['SCHEDULED DEFERMENT VOLS'][1]['Actual (%)'] },
        { target: el?.data[1]['SCHEDULED DEFERMENT VOLS'][2]['Target'] },
      ],
      unscheduled: [
        { actual: el?.data[2]['UNSCHEDULED DEFERMENT VOLS'][0]?.Actual },
        { actualS: el?.data[2]['UNSCHEDULED DEFERMENT VOLS'][1]['Actual (%)'] },
        { target: el?.data[2]['UNSCHEDULED DEFERMENT VOLS'][2]['Target'] },
      ],
      majorProduction: el?.data[3]['MAJOR PRODUCTION HIGHLIGHTS/LOWLIGHTS'],
    }
  })

  const monthlyData = [
    {
      oilProd: [
        {
          actual: (get(currentUpload, 'production.data', []) || [])[0]?.value[0]
            ?.Actual,
        },
        {
          target: (get(currentUpload, 'production.data', []) || [])[0]?.value[1]
            ?.Target,
        },
      ],
      condensateProd: [
        {
          actual: (get(currentUpload, 'production.data', []) || [])[1]?.value[0]
            ?.Actual,
        },
        {
          target: (get(currentUpload, 'production.data', []) || [])[1]?.value[1]
            ?.Target,
        },
      ],
      nagProd: [
        {
          actual: (get(currentUpload, 'production.data', []) || [])[2]?.value[0]
            ?.Actual,
        },
        {
          target: (get(currentUpload, 'production.data', []) || [])[2]?.value[1]
            ?.Target,
        },
      ],
      agProd: [
        {
          actual: (get(currentUpload, 'production.data', []) || [])[3]?.value[0]
            ?.Actual,
        },
        {
          target: (get(currentUpload, 'production.data', []) || [])[3]?.value[1]
            ?.Target,
        },
      ],
      waterProd: [
        {
          actual: (get(currentUpload, 'production.data', []) || [])[4]?.value[0]
            ?.Actual,
        },
        {
          target: (get(currentUpload, 'production.data', []) || [])[4]?.value[1]
            ?.Target,
        },
      ],
      waterInj: [
        {
          actual: (get(currentUpload, 'production.data', []) || [])[5]?.value[0]
            ?.Actual,
        },
        {
          target: (get(currentUpload, 'production.data', []) || [])[5]?.value[1]
            ?.Target,
        },
      ],
      waterDisposal: [
        {
          actual: (get(currentUpload, 'production.data', []) || [])[6]?.value[0]
            ?.Actual,
        },
        {
          target: (get(currentUpload, 'production.data', []) || [])[6]?.value[1]
            ?.Target,
        },
      ],
      flareGasRate: [
        {
          actual: (get(currentUpload, 'production.data', []) || [])[7]?.value[0]
            ?.Actual,
        },
        {
          target: (get(currentUpload, 'production.data', []) || [])[7]?.value[1]
            ?.Target,
        },
      ],
    },
  ]

  const monthlyTrackingData = (get(currentUpload, 'data', []) || []).map(
    (el) => {
      return {
        destination: el?.destination,
        volume: el?.volume,
      }
    },
  )

  const DailyProductionActionsHelper = [
    {
      title: 'Upload Daily Production Report',
      onClick: () => setShowUploadRapportDialog(true),
    },
    {
      title: 'Download Template',
      onClick: () => downloadTemp('production', 'daily'),
    },
  ]

  const monthlyProductionActionsHelper = [
    {
      title: 'Upload Monthly Production Report',
      onClick: () => setShowUploadRapportDialog(true),
    },
    {
      title: 'Download Template',
      onClick: () => downloadTemp('production', 'monthly'),
    },
  ]

  const monthlyTrackingActionsHelper = [
    {
      title: 'Upload Monthly Tracking Report',
      onClick: () => setShowUploadRapportDialog(true),
    },
    {
      title: 'Download Template',
      onClick: () => downloadTemp('production', 'production-tracking'),
    },
  ]
  const omanHydrocarbonActionsHelper = [
    {
      title: 'Upload Oman Hydrocarbon Report',
      onClick: () => setShowUploadRapportDialog(true),
    },
    { title: 'Download Template', onClick: () => {} },
  ]

  const createActionsByCurrentTab = (actionsList = []) => {
    return actionsList.map((btn, index) => (
      <Button
        key={`production-btn-${index}`}
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
      case 'daily':
        return createActionsByCurrentTab(DailyProductionActionsHelper)
      case 'monthly':
        return createActionsByCurrentTab(monthlyProductionActionsHelper)
      case 'monthly-tracking':
        return createActionsByCurrentTab(monthlyTrackingActionsHelper)
      case 'oman-hydrocarbon':
      default:
        return createActionsByCurrentTab(omanHydrocarbonActionsHelper)
    }
  }

  // const tabsList = [
  //   'Daily Production',
  //   'Monthly Production',
  //   'Monthly Tracking',
  //   'Oman Hydrocarbon',
  // ]
  const tabsList = [
    {
      linkToNewTab: `/ams/production/daily`,
      label: 'Daily Production',
      key: 'daily',
    },

    {
      linkToNewTab: `/ams/production/monthly`,
      label: 'Monthly Production',
      key: 'monthly',
    },
    {
      linkToNewTab: `/ams/production/monthly-tracking`,
      label: 'Monthly Tracking',
      key: 'monthly-tracking',
    },
    {
      linkToNewTab: `/ams/production/oman-hydrocarbon`,
      label: 'Oman Hydrocarbon',
      key: 'oman-hydrocarbon',
    },
  ]
  const tableDataListDailyProduction = (
    get(listDailyProduction, 'content', []) || []
  ).map((el) => {
    return {
      id: el?.id,
      processInstanceId: get(el, 'metaData.processInstanceId', ''),
      originalFileId: get(el, 'metaData.originalFileId', ''),
      fileName: get(el, 'metaData.originalFileName', ''),
      company: get(el, 'metaData.company', 'n/a'),
      block: get(el, 'metaData.block', 'n/a'),
      submittedDate: moment(el?.metaData?.createdAt).format('DD MMM, YYYY'),
      submittedBy: get(el, 'metaData.createdBy.name', 'n/a'),
      referenceDate: moment(el?.metaData?.reportDate).format('DD MMM, YYYY'),
      statusDate: el?.metaData?.updatedAt
        ? moment(el?.metaData?.updatedAt).format('DD MMM, YYYY')
        : moment(el?.metaData?.createdAt).format('DD MMM, YYYY'),
      status: get(el, 'metaData.status', 'n/a'),
    }
  })
  const tableDataListMonthlyProduction = (
    get(listDailyProduction, 'content', []) || []
  ).map((el) => {
    return {
      id: el?.id,
      processInstanceId: get(el, 'metaData.processInstanceId', ''),
      originalFileId: get(el, 'metaData.originalFileId', ''),
      fileName: get(el, 'metaData.originalFileName', ''),
      company: get(el, 'metaData.company', 'n/a'),
      block: get(el, 'metaData.block', 'n/a'),
      submittedDate: moment(el?.metaData?.createdAt).format('DD MMM, YYYY'),
      submittedBy: get(el, 'metaData.createdBy.name', 'n/a'),
      referenceDate: moment(el?.metaData?.reportDate).format('DD MMM, YYYY'),
      statusDate: el?.metaData?.updatedAt
        ? moment(el?.metaData?.updatedAt).format('DD MMM, YYYY')
        : moment(el?.metaData?.createdAt).format('DD MMM, YYYY'),
      status: get(el, 'metaData.status', 'n/a'),
    }
  })

  const tableDataListMonthlyTracking = (
    get(listDailyProduction, 'content', []) || []
  ).map((el) => {
    return {
      id: el?.id,
      processInstanceId: get(el, 'metaData.processInstanceId', ''),
      originalFileId: get(el, 'metaData.originalFileId', ''),
      fileName: get(el, 'metaData.originalFileName', ''),
      company: get(el, 'metaData.company', 'n/a'),
      block: get(el, 'metaData.block', 'n/a'),
      submittedDate: moment(el?.metaData?.createdAt).format('DD MMM, YYYY'),
      submittedBy: get(el, 'metaData.createdBy.name', 'n/a'),
      referenceDate: moment(el?.metaData?.reportDate).format('DD MMM, YYYY'),
      statusDate: el?.metaData?.updatedAt
        ? moment(el?.metaData?.updatedAt).format('DD MMM, YYYY')
        : moment(el?.metaData?.createdAt).format('DD MMM, YYYY'),
      status: get(el, 'metaData.status', 'n/a'),
    }
  })

  const renderCurrentTabData = () => {
    switch (currentTab) {
      case 'daily':
        return tableDataListDailyProduction
      case 'monthly':
        return tableDataListMonthlyProduction
      case 'monthly-tracking':
        return tableDataListMonthlyTracking
      case 'oman-hydrocarbon':
        return []
      default:
        return dailyProductionData
    }
  }
  const UploadSupportedDocumentFromTable = (row) => {
    setShowSupportedDocumentDialog(row)
  }

  const renderCurrentTabConfigs = () => {
    switch (currentTab) {
      case 'daily':
        return dailyProductionConfigs(UploadSupportedDocumentFromTable)
      case 'monthly':
        return monthlyProductionConfigs(UploadSupportedDocumentFromTable)
      case 'monthly-tracking':
        return monthlyTrackingConfigs(UploadSupportedDocumentFromTable)
      case 'oman-hydrocarbon':
        return omanHydConfigs(UploadSupportedDocumentFromTable)
      default:
        return dailyProductionConfigs(UploadSupportedDocumentFromTable)
    }
  }
  const renderCurrentTabDetailsConfigs = () => {
    switch (currentTab) {
      case 'daily':
        return dailyProductionDetailsConfigs()
      case 'monthly':
        return MonthlyProductionDetailsConfigs()
      case 'monthly-tracking':
        return MonthlyTrackingDetailsConfigs()
      case 'oman-hydrocarbon':
        return MonthlyTrackingDetailsConfigs()
      default:
        return dailyProductionDetailsConfigs()
    }
  }
  const renderCurrentTabDetailsData = () => {
    switch (currentTab) {
      case 'daily':
        return dailyData
      case 'monthly':
        return monthlyData
      case 'monthly-tracking':
        return monthlyTrackingData
      case 'oman-hydrocarbon':
        return []
      default:
        return dailyData
    }
  }
  const renderDialogData = () => {
    switch (currentTab) {
      case 'daily':
        return {
          title: 'Upload Daily Production Report',
          optional: 'Attach Supporting Document (Optional)',
          onClick: () => {},
        }
      case 'monthly':
        return {
          title: 'Upload Monthly Production Report',
          optional: 'Attach Supporting Document (Optional)',
          onClick: () => {},
        }
      case 'monthly-tracking':
        return {
          title: 'Upload Monthly Tracking Report',
          optional: 'Attach Supporting Document (Optional)',
          onClick: () => {},
        }
      case 'oman-hydrocarbon':
        return {
          title: 'Upload Oman Hydrocarbon Report',
          optional: 'Attach Supporting Document (Optional)',
          onClick: () => {},
        }
      default:
        break
    }
  }
  const closeDialog = (resp) => {
    resp &&
      resp[0]?.statusCode === 'OK' &&
      setShowSupportedDocumentDialog(false)
  }
  const costsSuppDocs = (data) => {
    addSupportingDocuments(
      data,
      selectedRow[0]?.processInstanceId ||
        showSupportedDocumentDialog?.processInstanceId,
      closeDialog,
    )
  }

  const handleSupportingDocs = (data) => {
    costsSuppDocs(data)
  }

  const onDisplayMHT = (file) => {
    setShowUploadMHTDialog(true)
    setShowUploadRapportDialog(false)
    setDataDisplayedMHT(file)
  }
  return (
    <>
      <TopBar
        title="Production Reporting"
        actions={role === 'operator' ? renderActionsByCurrentTab() : null}
        menuItems={() => {
          return [
            { key: 1, primaryText: 'Edit', onClick: () => null },
            {
              key: 1,
              primaryText: 'Delete',
              onClick: () =>
                Promise.all(
                  selectedRow?.map((row) =>
                    handleDeleteProduction(currentTab, row?.id),
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
          setSelectFieldValue(
            tab === 'monthly'
              ? 'Monthly Production'
              : tab === 2
                ? 'Destination'
                : 'Grid 1',
          )
        }}
        onSelectRows={setSelectedRow}
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
                'production-details',
                selectedRow[0]?.id,
                currentTab,
                currentSubsubModule(),
                role,
                setShowSupportedDocumentDialog,
                selectedRow[0]?.originalFileId,
                downloadOriginalFile,
                handleDeleteProduction,
                selectedRow[0]?.fileName,
                selectedRow[0]?.status,
                submitDraft,
              )}
            />
          ) : currentTab === 'monthly' ? (
            <SelectField
              id="monthly-prod"
              menuItems={
                ['Monthly Production', 'Monthly Well Counts']
                // currentTab === 1
                //   ? ['Monthly Production', 'Monthly Well Counts']
                //   : currentTab === 2
                //     ? ['Destination', 'Average Delivery to ORPIC']
                //     : ['Grid 1', 'Grid 2']
              }
              block
              position={SelectField.Positions.BELOW}
              value={selectFieldValue}
              onChange={setSelectFieldValue}
              simplifiedMenu={false}
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
          propsConfigs={renderCurrentTabDetailsConfigs()}
          propsDataTable={renderCurrentTabDetailsData()}
          onCommit={() => {
            onCommitProduction(currentTab)
            setFileList([...filesList, dataDisplayedMHT])
          }}
          onSave={() => {
            onSaveProduction(currentTab)
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
          onSave={(data) => {
            // renderDialogData().onClick()
            onAddReportByCurrentTab(data)
          }}
          formatDate={currentTab === 'daily' ? 'day' : 'month'}
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
      {overrideDialog && (
        <DialogContainer
          id="override"
          visible={confirm}
          title="Override"
          modal
          actions={[
            {
              children: 'Yes, Override It',
              primary: false,
              flat: true,
              swapTheming: true,
              onClick: () => onOverrideProduction(currentTab, overrideId),
            },
            {
              children: 'No Thanks',
              primary: true,
              flat: true,
              swapTheming: true,
              onClick: () => setOverrideDialog(false),
            },
          ]}
        >
          <p id="override-description" className="md-color--secondary-text">
            This file already exists. Would you like to override it ?
          </p>
        </DialogContainer>
      )}
    </>
  )
}
export default Production
