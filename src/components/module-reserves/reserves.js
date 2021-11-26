import { useState, useMemo } from 'react'
import { useMutation, useQuery } from 'react-query'
import { Button, CircularProgress } from 'react-md'
import Mht from '@target-energysolutions/mht'
import { useSelector } from 'react-redux'
import { v4 as uuidv4 } from 'uuid'
// import useRole from 'libs/hooks/use-role'

import {
  uploadAnnualReport,
  uploadHistoryAndForecast,
  uploadAnnualResource,
  commitReport,
  getAnnualReport,
  getHistoryAndForecast,
  getAnnualResourceDetail,
  downloadTemp,
} from 'libs/api/api-reserves'
import { getBlockByOrgId } from 'libs/api/configurator-api'

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
  // annualReservesData,
  // historyData,
  // annualResourceData,
  actionsHeader,
} from './helpers'

const Reserves = () => {
  const organizationID = useSelector(({ shell }) => shell?.organizationId)
  const [currentTab, setCurrentTab] = useState(0)
  const [showUploadRapportDialog, setShowUploadRapportDialog] = useState(false)
  const [showSupportedDocumentDialog, setShowSupportedDocumentDialog] =
    useState(false)
  const [selectedRow, setSelectedRow] = useState([])
  const [showUploadMHTDialog, setShowUploadMHTDialog] = useState(false)
  const [dataDisplayedMHT, setDataDisplayedMHT] = useState({})
  const [filesList, setFileList] = useState({})
  const [loading, setLoading] = useState(false)
  // const [dialog, setDialogVisible] = useState(false)
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
  const { data: blockList } = useQuery(
    ['getBlockByOrgId', organizationID],
    organizationID && getBlockByOrgId,
  )
  const onCommitReportMutate = useMutation(commitReport)

  const resAnnualReport = () => {
    return (
      uploadAnnualResponse?.data?.items?.map((el) => ({
        category: el?.category,
        subCategory: el?.subCategory,
        group: el?.group,
        uom: el?.uom,
        item: el?.name,
        description: el?.explanation,
      })) || []
    )
  }
  const dataMht = useMemo(
    () => resAnnualReport(),

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
        downloadTemp('reserve', 'fyf')
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
        downloadTemp('reserve', 'annualResource')
      },
    },
  ]
  // const role = useRole('reserves')
  // console.log(role, 'role')

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
        return listAnnualReserves?.content || []
      case 1:
        return listHistoryAndForecast?.content || []
      case 2:
        return listAnnualResourceDetail?.content || []
      default:
        return listAnnualResourceDetail?.content || []
    }
  }

  const renderCurrentTabConfigs = () => {
    switch (currentTab) {
      case 0:
        return annualReservesConfigs()
      case 1:
        return historyConfigs()
      case 2:
        return annualResourceConfigs()
      default:
        return annualReservesConfigs()
    }
  }

  const renderDialogData = (data) => {
    switch (currentTab) {
      case 0:
        return {
          title: 'Upload Annual Reserves Report',
          optional: 'Attach Supporting Document (Optional)',
          onUpload: () => {
            onAddReport(data)
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
            onUploadHistoryReport(data)
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
            onUploadDetailReport(data)
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
  const onAddReport = (body) => {
    uploadAnnualReportMutate(
      {
        body: {
          block: body?.block,
          company: 'ams-org',
          file: body?.filesList,
          processInstanceId: uuidv4(),
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
  const onUploadHistoryReport = (body) => {
    onUploadHistoryReportMutate(
      {
        body: {
          block: body?.block,
          company: 'ams-org',
          file: body?.filesList,
          processInstanceId: uuidv4(),
        },
      },
      {
        onSuccess: (res) => {
          onDisplayMHT(res?.data)
        },
      },
    )
  }
  const onUploadDetailReport = (body) => {
    onUploadDetailReportMutate(
      {
        body: {
          block: body?.block,
          company: 'ams-org',
          file: body?.filesList,
          hydrocarbonType: 'GAS',
          processInstanceId: uuidv4(),
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
  return (
    <>
      {/*    <DialogContainer
        id="import-report-dialog"
        className="upload-report-dialog"
        visible={true}
        onHide={() => {}}
        // title={title}
        actions={[]}
      >
</DialogContainer> */}
      {(loading ||
        annualUploadLoading ||
        historyUploadLoading ||
        detailUploadLoading) && <CircularProgress />}
      <TopBar title="Reserve Reporting" actions={renderActionsByCurrentTab()} />
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
                    selectedRow[0]?.id,
                    setShowSupportedDocumentDialog,
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
            blockList?.map((el) => ({
              label: el.block,
              value: el?.block,
            })) || []
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
          onSaveUpload={() => {}}
        />
      )}
    </>
  )
}
export default Reserves
