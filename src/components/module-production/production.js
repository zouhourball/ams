import { useState, useEffect } from 'react'
import { Button, DialogContainer, TextField, SelectField } from 'react-md'
import Mht, { setSelectedRow } from '@target-energysolutions/mht'
import { useMutation, useQuery } from 'react-query'
import moment from 'moment'
import { v4 as uuidv4 } from 'uuid'
import { useSelector, useDispatch } from 'react-redux'
import { get } from 'lodash-es'

import { addToast } from 'modules/app/actions'

import useRole from 'libs/hooks/use-role'
import documents from 'libs/hooks/documents'
import {
  downloadOriginalFile,
  downloadTemp,
} from 'libs/api/supporting-document-api'
// import getOrganizationInfos from 'libs/hooks/get-organization-infos'

import ToastMsg from 'components/toast-msg'

import {
  getListProduction,
  uploadDailyProductionReport,
  uploadMonthlyProductionReport,
  uploadMonthlyTrackingProductionReport,
  uploadOmanHydrocarbonReport,
  commitProduction,
  saveProduction,
  overrideProductionReport,
  deleteProduction,
  updateDailyProduction,
  deleteAllProduction,
} from 'libs/api/api-production'

import TopBar from 'components/top-bar'
import NavBar from 'components/nav-bar'
import UploadReportDialog from 'components/upload-report-dialog'
import HeaderTemplate from 'components/header-template'
import MHTDialog from 'components/mht-dialog'
import SupportedDocument from 'components/supported-document'
import getBlocks from 'libs/hooks/get-blocks'
import DeleteDialog from 'components/delete-dialog'

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

import './style.scss'
import getCompanyInfos from 'libs/hooks/get-company-infos'

const Production = ({ subModule }) => {
  // const subModule = get(location, 'pathname', '/').split('/').reverse()[0]

  const [currentTab, setCurrentTab] = useState(subModule)
  const [showUploadRapportDialog, setShowUploadRapportDialog] = useState(false)
  const [showSupportedDocumentDialog, setShowSupportedDocumentDialog] =
    useState(false)
  // const [selectedRow, setSelectedRow] = useState([])
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showUploadMHTDialog, setShowUploadMHTDialog] = useState(false)
  const [overrideDialog, setOverrideDialog] = useState(false)
  const [overrideId, setOverrideId] = useState()
  const [dataDisplayedMHT, setDataDisplayedMHT] = useState({})
  const [filesList, setFileList] = useState([])
  const [selectFieldValue, setSelectFieldValue] = useState('Monthly Production')
  const [selectedGrid, setSelectedGrid] = useState('data')
  const [page, setPage] = useState(0)
  const [size, setSize] = useState(20)

  const selectedRow = useSelector(
    (state) => state?.selectRowsReducers?.selectedRows,
  )
  const [currentUpload, setCurrentUpload] = useState()
  const dispatch = useDispatch()

  // const company = getOrganizationInfos()
  const companyOrg = getCompanyInfos()

  const role = useRole('production')

  useEffect(() => {
    dispatch(setSelectedRow([]))
  }, [])
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
  const uploadOmanHydrocarbonReportMutate = useMutation(
    uploadOmanHydrocarbonReport,

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

  const renderSelectedItems = () => {
    return (
      selectedRow?.map((el) => ({
        id: renderCurrentTabData()[el]?.id,
      })) || []
    )
  }

  const handleDeleteProduction = (id) => {
    deleteProduction(currentTab, id).then((res) => {
      // debugger
      // if (res === 'sucess') {
      if (res?.success) {
        dispatch(setSelectedRow([]))
        setShowDeleteDialog(false)

        dispatch(
          addToast(
            <ToastMsg text={'Successfully deleted'} type="success" />,
            'hide',
          ),
        )
        refetchList()
      } else {
        refetchList()
        dispatch(
          addToast(
            <ToastMsg text={'Something went wrong'} type="error" />,
            'hide',
          ),
        )
      }
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
    const uuid = uuidv4()
    switch (currentTab) {
      case 'daily':
        uploadDailyReportMutate.mutate({
          body: {
            block: body?.block,
            company: companyOrg?.company,
            file: body?.file,
            processInstanceId: uuid,
            dailyDate: moment(body?.referenceDate?.timestamp).format(
              'YYYY-MM-DD',
            ),
          },
        })
        addSupportingDocuments(body?.optionalFiles, uuid)
        break
      case 'monthly':
        uploadMonthlyReportMutate.mutate({
          body: {
            block: body?.block,
            company: companyOrg?.company,
            file: body?.file,
            processInstanceId: uuid,
            month: moment(body?.referenceDate?.timestamp).format('MMMM'),
            year: moment(body?.referenceDate?.timestamp).format('YYYY'),
          },
        })
        addSupportingDocuments(body?.optionalFiles, uuid)
        break
      case 'monthly-tracking':
        uploadMonthlyTrackingReportMutate.mutate({
          body: {
            block: body?.block,
            company: companyOrg?.company,
            file: body?.file,
            processInstanceId: uuid,
            month: moment(body?.referenceDate?.timestamp).format('MMMM'),
            year: moment(body?.referenceDate?.timestamp).format('YYYY'),
          },
        })
        addSupportingDocuments(body?.optionalFiles, uuid)
        break
      case 'oman-hydrocarbon':
        uploadOmanHydrocarbonReportMutate.mutate({
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

  const { data: listDailyProduction, refetch: refetchList } = useQuery(
    'getListProduction',
    () =>
      getListProduction({
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
    },
  )
  useEffect(() => {
    setPage(0)
    refetchList()
  }, [currentTab])

  useEffect(() => {
    refetchList()
  }, [page])

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
  /* const monthlyDataKeys = [
    'oilProd',
    'condensateProd',
    'nagProd',
    'agProd',
    'waterProd',
    'waterInj',
    'waterDisposal',
    'flareGasRate',
    'fuelGasRate',
    'gasShrink',
    'gasInjection',
    'gasLift',
    'gasSale',
  ] */

  /* get(currentUpload, 'production.data', [])?.map((el, index) => {
    return {
      [monthlyDataKeys[index]]: [
        {
          actual: el?.value[0]?.Actual,
        },
        {
          target: el?.value[1]?.Target,
        },
      ],
    }
  }) */
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

  const monthlyTrackingData = (get(currentUpload, selectedGrid, []) || []).map(
    (el) => {
      return {
        ...(selectedGrid === 'data' && {
          destination: el?.destination,
          volume: el?.volume,
        }),
        ...(selectedGrid === 'gomi' && {
          gomi: el?.value,
          // production: el?.production,
          unit: el?.unit,
          company: el?.company,
          materialTypes: el?.materialTypes.join(', '),
          blocks: el?.blocks.join(', '),
        }),
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
    {
      title: 'Download Template',
      onClick: () => downloadTemp('production', 'oman-hydrocarbon'),
    },
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
    role === 'regulator' && {
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
      referenceDate:
        currentTab === 'daily'
          ? moment(el?.metaData?.reportDate).format('DD MMM, YYYY')
          : `${el?.metaData?.month} ${el?.metaData?.year}`,
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
      referenceDate:
        currentTab === 'daily'
          ? moment(el?.metaData?.reportDate).format('DD MMM, YYYY')
          : `${el?.metaData?.month} ${el?.metaData?.year}`,
      statusDate: el?.metaData?.updatedAt
        ? moment(el?.metaData?.updatedAt).format('DD MMM, YYYY')
        : moment(el?.metaData?.createdAt).format('DD MMM, YYYY'),
      status: get(el, 'metaData.status', 'n/a'),
    }
  })
  const tableOmanHydrocarbon = (
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
        return tableOmanHydrocarbon
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
        return MonthlyTrackingDetailsConfigs(selectedGrid)
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
      renderCurrentTabData()[selectedRow[0]]?.processInstanceId ||
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
    <div className="production-page">
      <TopBar
        title="Production Reporting"
        actions={
          role === 'operator' || currentTab === 'oman-hydrocarbon'
            ? renderActionsByCurrentTab()
            : null
        }
        menuItems={() => {
          const ids = renderSelectedItems()?.map((el) => el?.id)
          return [
            /* { key: 1, primaryText: 'Edit', onClick: () => null }, */
            {
              key: 1,
              primaryText: 'Delete',
              onClick: () =>
                selectedRow?.length > 0 &&
                deleteAllProduction(currentTab, ids).then((res) => {
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
          dispatch(setSelectedRow([]))
          setSelectFieldValue(
            tab === 'monthly'
              ? 'Monthly Production'
              : tab === 2
                ? 'Destination'
                : 'Grid 1',
          )
        }}
        // onSelectRows={setSelectedRow}
      />
      <div className="mht-production">
        <Mht
          configs={renderCurrentTabConfigs()}
          tableData={renderCurrentTabData()}
          hideTotal={false}
          singleSelect={true}
          withFooter
          withSearch={selectedRow?.length === 0}
          commonActions={selectedRow?.length === 0 || selectedRow?.length > 1}
          onSelectRows={dispatch(setSelectedRow)}
          withChecked
          // selectedRow={selectedRow}
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
                  'production-details',
                  renderCurrentTabData()[selectedRow[0]]?.id,
                  currentTab,
                  currentSubsubModule(),
                  role,
                  setShowSupportedDocumentDialog,
                  renderCurrentTabData()[selectedRow[0]]?.originalFileId,
                  downloadOriginalFile,
                  handleDeleteProduction,
                  setShowDeleteDialog,
                  renderCurrentTabData()[selectedRow[0]]?.fileName,
                  renderCurrentTabData()[selectedRow[0]]?.status,
                  submitDraft,
                )}
              />
            ) : (
              <div />
            )
          }
          footerTemplate={
            listDailyProduction?.totalPages > 1 && (
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
                    v >= listDailyProduction?.totalPages
                      ? setPage(listDailyProduction?.totalPages - 1)
                      : setPage(parseInt(v) - 1)
                  }
                  // disabled={status === 'closed'}
                />
                of {listDailyProduction?.totalPages}
                &nbsp;|&nbsp;Show
                <TextField
                  id="el_num"
                  lineDirection="center"
                  block
                  className="show"
                  value={size}
                  onChange={(v) =>
                    v > listDailyProduction?.totalElements
                      ? setSize(listDailyProduction?.totalElements)
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
      {/* title,
  text,
  hideDialog,
  visible,
  handleDeleteProduction, */}

      {showDeleteDialog && (
        <DeleteDialog
          onDiscard={() => setShowDeleteDialog(false)}
          visible={showDeleteDialog}
          title="Confirm delete Proposal "
          text=" Are you sure you want to delete this proposal ? "
          hideDialog={() => setShowDeleteDialog(false)}
          handleDeleteProduction={() =>
            handleDeleteProduction(showDeleteDialog)
          }
        />
      )}

      {showUploadMHTDialog && (
        <MHTDialog
          headerTemplate={
            currentTab === 'monthly-tracking' ? (
              <SelectField
                id="monthly-prod-tracking"
                menuItems={[
                  { label: 'Monthly Tracking', value: 'data' },
                  { label: 'GOMI', value: 'gomi' },
                ]}
                block
                position={SelectField.Positions.BELOW}
                value={selectedGrid}
                onChange={setSelectedGrid}
                simplifiedMenu={false}
              />
            ) : (
              <></>
            )
          }
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
          blockList={
            Array.isArray(blocks)
              ? blocks?.map((el) => ({
                label: el.block,
                value: el?.block,
              }))
              : []
          }
          hideBlock={role === 'regulator'}
          onHide={() => {
            setShowUploadRapportDialog(false)
            setFileList([])
          }}
          onSave={(data) => {
            // renderDialogData().onClick()
            onAddReportByCurrentTab(data)
          }}
          formatDate={
            currentTab === 'daily'
              ? 'day'
              : currentTab === 'oman-hydrocarbon'
                ? 'year'
                : 'month'
          }
        />
      )}

      {showSupportedDocumentDialog && (
        <SupportedDocument
          title={'upload supporting documents'}
          visible={showSupportedDocumentDialog}
          onDiscard={() => setShowSupportedDocumentDialog(false)}
          processInstanceId={
            renderCurrentTabData()[selectedRow[0]]?.processInstanceId ||
            showSupportedDocumentDialog?.processInstanceId
          }
          onSaveUpload={(data) => {
            handleSupportingDocs(data)
          }}
          readOnly={
            role === 'regulator' && !(currentTab === 'oman-hydrocarbon')
          }
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
    </div>
  )
}
export default Production
