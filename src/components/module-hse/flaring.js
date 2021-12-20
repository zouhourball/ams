import { useState } from 'react'
import { Button } from 'react-md'
import Mht from '@target-energysolutions/mht'
import { useQuery, useMutation } from 'react-query'
import { useDispatch } from 'react-redux'
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
} from 'libs/api/api-flaring'
import {
  downloadTemp,
  downloadOriginalFile,
} from 'libs/api/supporting-document-api'
import getBlocks from 'libs/hooks/get-blocks'
import getOrganizationInfos from 'libs/hooks/get-organization-infos'

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
  const [selectedRow, setSelectedRow] = useState([])
  const [currentUpload, setCurrentUpload] = useState()
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [overrideId, setOverrideId] = useState()

  const blocks = getBlocks()
  const company = getOrganizationInfos()
  const { addSupportingDocuments } = documents()

  const { data: listFlaring, refetch: refetchList } = useQuery(
    ['getListFlaring', currentTab],
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

  const deleteFlaringMutate = useMutation(deleteFlaring, {
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
  })
  const renderCurrentTabDetailsData = () => {
    switch (currentTab) {
      case 'annual-forecast':
        return (get(currentUpload, 'data.data', []) || []).map((el) => {
          return {
            gaz_type: el?.name,
            unit: el?.unit,
            year2017: el?.values[0]?.value,
            year2018: el?.values[1]?.value,
            year2019: el?.values[2]?.value,
            year2020: el?.values[3]?.value,
            year2021: el?.values[4]?.value,
            year2022: el?.values[5]?.value,
            year2023: el?.values[6]?.value,
            year2024: el?.values[7]?.value,
            year2025: el?.values[8]?.value,
            year2026: el?.values[9]?.value,
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

  const renderCurrentTabDetailsConfigs = () => {
    switch (currentTab) {
      case 'annual-forecast':
        return flaringDetailsAnnualConfigs
      case 'monthly-station':
        return flaringDetailsMonthlyConfigs
      case 'daily':
        return flaringDetailsDailyConfigs
      default:
        return null
    }
  }

  const handleDeleteFlaring = (subModule, objectId) => {
    deleteFlaringMutate.mutate({
      subModule,
      objectId,
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
            company: company?.name || 'ams-org',
            file: body?.file[0],
            processInstanceId: uuid,
            date: moment(body?.referenceDate).format('YYYY-MM-DD'),
          },
        })
        break
      case 'monthly-station':
        uploadMonthlyReportMutate.mutate({
          body: {
            block: body?.block,
            company: company?.name || 'ams-org',
            file: body?.file[0],
            processInstanceId: uuid,
            year: moment(body?.referenceDate).format('YYYY'),
            month: moment(body?.referenceDate).format('MMMM'),
          },
        })
        break
      case 'annual-forecast':
        uploadAnnualForecastMutate.mutate({
          body: {
            block: body?.block,
            company: company?.name || 'ams-org',
            file: body?.file[0],
            processInstanceId: uuid,
            year: moment(body?.referenceDate).format('YYYY'),
          },
        })
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
        referenceDate: get(el, 'metaData.year', 'n/a'),
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
    { title: 'Download Annual Plan Template', onClick: () => {} },
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
      label: 'Annual Report',
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
          selectedRow[0]?.id,
          role,
          setShowSupportedDocumentDialog,
          currentTab,
          handleDeleteFlaring,
          downloadOriginalFile,
          selectedRow[0]?.originalFileId,
          selectedRow[0]?.fileName,
        )
      case 'daily':
        return actionsHeaderDaily(
          'flaring',
          selectedRow[0]?.id,
          role,
          setShowSupportedDocumentDialog,
          currentTab,
          handleDeleteFlaring,
          downloadOriginalFile,
          selectedRow[0]?.originalFileId,
          selectedRow[0]?.fileName,
        )
      case 'annual-forecast':
      default:
        return actionsHeaderAnnual(
          'flaring',
          selectedRow[0]?.id,
          role,
          setShowSupportedDocumentDialog,
          currentTab,
          handleDeleteFlaring,
          downloadOriginalFile,
          selectedRow[0]?.originalFileId,
          selectedRow[0]?.fileName,
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
      selectedRow[0]?.processInstanceId ||
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
      />
      <div className="subModule">
        <NavBar
          tabsList={tabsList}
          activeTab={currentTab}
          setActiveTab={setCurrentTab}
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
            onSelectRows={setSelectedRow}
            withChecked
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
            blockList={blocks?.map((el) => ({
              label: el?.block,
              value: el?.block,
            }))}
            onHide={() => {
              setShowUploadRapportDialog(false)
              setFileList([])
            }}
            onSave={(data) => {
              onAddReportByCurrentTab(data)
            }}
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
              selectedRow[0]?.processInstanceId ||
              showSupportedDocumentDialog?.processInstanceId
            }
            onSaveUpload={(data) => {
              flaringSuppDocs(data)
            }}
          />
        )}
      </div>
    </>
  )
}
export default Flaring
