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

import ToastMsg from 'components/toast-msg'

import {
  getListDailyProduction,
  getListMonthlyProduction,
  getListMonthlyTrackingProduction,
  // getListBlocks,
  // uploadDailyFile,
  // downloadTemplate,
  downloadTemp,
  uploadDailyProductionReport,
  uploadMonthlyProductionReport,
  uploadMonthlyTrackingProductionReport,
  commitProduction,
  overrideProductionReport,
} from 'libs/api/api-production'

import TopBar from 'components/top-bar'
import NavBar from 'components/nav-bar'
import UploadReportDialog from 'components/upload-report-dialog'
import HeaderTemplate from 'components/header-template'
import MHTDialog from 'components/mht-dialog'
import SupportedDocument from 'components/supported-document'
// import { userRole } from 'components/shared-hook/get-roles'
import getBlocks from 'libs/hooks/get-blocks'

import {
  dailyProductionConfigs,
  monthlyProductionConfigs,
  monthlyTrackingConfigs,
  omanHydConfigs,
  dailyProductionData,
  // monthlyProductionData,
  // monthlyTrackingData,
  omanHydData,
  actionsHeader,
  dailyProductionDetailsConfigs,
  // dailyProductionDetailsData,
  MonthlyProductionDetailsConfigs,
  MonthlyProductionDetailsData,
  MonthlyTrackingDetailsConfigs,
  // MonthlyTrackingDetailsData,
} from './helpers'

const Production = () => {
  const [currentTab, setCurrentTab] = useState(0)
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
          // setShowUploadRapportDialog(false)
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
            refetchListDaily()
            refetchListMonthly()
            refetchListMonthlyTracking()

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
            refetchListDaily()
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
  const onCommitProduction = (subModule) => {
    commitProductionMutate.mutate({
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

  const subModuleByCurrentTab = () => {
    switch (currentTab) {
      case 0:
        return 'daily'
      case 1:
        return 'monthly'
      case 2:
        return 'monthly-tracking'
      default:
        return ''
    }
  }

  const onAddReportByCurrentTab = (body) => {
    let uuid = uuidv4()
    switch (currentTab) {
      case 0:
        uploadDailyReportMutate.mutate({
          body: {
            block: body?.block,
            company: 'ams-org',
            file: body?.file,
            processInstanceId: uuid,
            dailyDate: moment(body?.referenceDate).format('YYYY-MM-DD'),
          },
        })
        addSupportingDocuments(body?.optionalFiles, uuid)
        break
      case 1:
        uploadMonthlyReportMutate.mutate({
          body: {
            block: body?.block,
            company: 'ams-org',
            file: body?.file,
            processInstanceId: uuid,
            month: moment(body?.referenceDate).format('MMMM'),
            year: moment(body?.referenceDate).format('YYYY'),
          },
        })
        addSupportingDocuments(body?.optionalFiles, uuid)
        break
      case 2:
        uploadMonthlyTrackingReportMutate.mutate({
          body: {
            block: body?.block,
            company: 'ams-org',
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

  const { data: listDailyProduction, refetch: refetchListDaily } = useQuery(
    ['getListDailyProduction'],
    getListDailyProduction,
    {
      refetchOnWindowFocus: false,
    },
  )

  const { data: listMonthlyProduction, refetch: refetchListMonthly } = useQuery(
    ['getListMonthlyProduction'],
    getListMonthlyProduction,
    {
      refetchOnWindowFocus: false,
    },
  )

  const {
    data: listMonthlyTrackingProduction,
    refetch: refetchListMonthlyTracking,
  } = useQuery(
    ['getListMonthlyTrackingProduction'],
    getListMonthlyTrackingProduction,
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
      ],
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

  // const { data: listBlocks } = useQuery(
  //   ['getListBlocks'],
  //   getListBlocks,
  //   {
  //     refetchOnWindowFocus: false,
  //   },
  // )
  // const { data: getDownloadTemplate } = useQuery(
  //   ['downloadTemplate', 'production', 'daily'],
  //   downloadTemplate,
  //   {
  //     refetchOnWindowFocus: false,
  //   },
  // )

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
      case 0:
        return createActionsByCurrentTab(DailyProductionActionsHelper)
      case 1:
        return createActionsByCurrentTab(monthlyProductionActionsHelper)
      case 2:
        return createActionsByCurrentTab(monthlyTrackingActionsHelper)
      case 3:
      default:
        return createActionsByCurrentTab(omanHydrocarbonActionsHelper)
    }
  }

  const tabsList = [
    'Daily Production',
    'Monthly Production',
    'Monthly Tracking',
    'Oman Hydrocarbon',
  ]

  const tableDataListDailyProduction = (
    get(listDailyProduction, 'content', []) || []
  ).map((el) => {
    return {
      id: el?.id,
      company: get(el, 'metaData.company', 'n/a'),
      block: get(el, 'metaData.block', 'n/a'),
      submittedDate: moment(el?.metaData?.createdAt).format('DD MMM, YYYY'),
      submittedBy: get(el, 'metaData.createdBy.name', 'n/a'),
      referenceDate: moment(el?.metaData?.reportDate).format('DD MMM, YYYY'),
      status: get(el, 'metaData.status', 'n/a'),
    }
  })
  const tableDataListMonthlyProduction = (
    get(listMonthlyProduction, 'content', []) || []
  ).map((el) => {
    return {
      id: el?.id,
      company: get(el, 'metaData.company', 'n/a'),
      block: get(el, 'metaData.block', 'n/a'),
      submittedDate: moment(el?.metaData?.createdAt).format('DD MMM, YYYY'),
      submittedBy: get(el, 'metaData.createdBy.name', 'n/a'),
      referenceDate:
        get(el, 'metaData.month', 'n/a') +
        ' , ' +
        get(el, 'metaData.year', 'n/a'),
      status: get(el, 'metaData.status', 'n/a'),
    }
  })

  const tableDataListMonthlyTracking = (
    get(listMonthlyTrackingProduction, 'content', []) || []
  ).map((el) => {
    return {
      id: el?.id,
      company: get(el, 'metaData.company', 'n/a'),
      block: get(el, 'metaData.block', 'n/a'),
      submittedDate: moment(el?.metaData?.createdAt).format('DD MMM, YYYY'),
      submittedBy: get(el, 'metaData.createdBy.name', 'n/a'),
      referenceDate:
        get(el, 'metaData.month', 'n/a') +
        ' , ' +
        get(el, 'metaData.year', 'n/a'),
      status: get(el, 'metaData.status', 'n/a'),
    }
  })

  const renderCurrentTabData = () => {
    switch (currentTab) {
      case 0:
        return tableDataListDailyProduction
      case 1:
        return tableDataListMonthlyProduction
      case 2:
        return tableDataListMonthlyTracking
      case 3:
        return omanHydData
      default:
        return dailyProductionData
    }
  }
  const renderCurrentTabConfigs = () => {
    switch (currentTab) {
      case 0:
        return dailyProductionConfigs()
      case 1:
        return monthlyProductionConfigs()
      case 2:
        return monthlyTrackingConfigs()
      case 3:
        return omanHydConfigs()
      default:
        return dailyProductionConfigs()
    }
  }
  const renderCurrentTabDetailsConfigs = () => {
    switch (currentTab) {
      case 0:
        return dailyProductionDetailsConfigs()
      case 1:
        return MonthlyProductionDetailsConfigs()
      case 2:
        return MonthlyTrackingDetailsConfigs()
      case 3:
        return MonthlyProductionDetailsConfigs()
      default:
        return dailyProductionDetailsConfigs()
    }
  }
  const renderCurrentTabDetailsData = () => {
    switch (currentTab) {
      case 0:
        return dailyData
      case 1:
        return monthlyData
      case 2:
        return monthlyTrackingData
      case 3:
        return MonthlyProductionDetailsData
      default:
        return dailyData
    }
  }
  const renderDialogData = () => {
    switch (currentTab) {
      case 0:
        return {
          title: 'Upload Daily Production Report',
          optional: 'Attach Supporting Document (Optional)',
          onClick: () => {},
        }
      case 1:
        return {
          title: 'Upload Monthly Production Report',
          optional: 'Attach Supporting Document (Optional)',
          onClick: () => {},
        }
      case 2:
        return {
          title: 'Upload Monthly Tracking Report',
          optional: 'Attach Supporting Document (Optional)',
          onClick: () => {},
        }
      case 3:
        return {
          title: 'Upload Oman Hydrocarbon Report',
          optional: 'Attach Supporting Document (Optional)',
          onClick: () => {},
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
        title="Production Reporting"
        actions={role === 'operator' ? renderActionsByCurrentTab() : null}
      />
      <NavBar
        tabsList={tabsList}
        activeTab={currentTab}
        setActiveTab={(tab) => {
          setCurrentTab(tab)
          setSelectFieldValue(
            tab === 1
              ? 'Monthly Production'
              : tab === 2
                ? 'Destination'
                : 'Grid 1',
          )
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
                'production-details',
                selectedRow[0]?.id,
                subModuleByCurrentTab(),
                role,
                setShowSupportedDocumentDialog,
              )}
            />
          ) : currentTab !== 0 ? (
            <SelectField
              id="monthly-prod"
              menuItems={
                currentTab === 1
                  ? ['Monthly Production', 'Monthly Well Counts']
                  : currentTab === 2
                    ? ['Destination', 'Average Delivery to ORPIC']
                    : ['Grid 1', 'Grid 2']
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
          visible={showUploadMHTDialog}
          onHide={() => {
            setShowUploadMHTDialog(false)
            setShowUploadRapportDialog(true)
          }}
          propsConfigs={renderCurrentTabDetailsConfigs()}
          propsDataTable={renderCurrentTabDetailsData()}
          onSave={() => {
            onCommitProduction(subModuleByCurrentTab())
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
          onSave={(data) => {
            // renderDialogData().onClick()
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
              onClick: () =>
                onOverrideProduction(subModuleByCurrentTab(), overrideId),
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
