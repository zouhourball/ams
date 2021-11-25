import { useState } from 'react'
import { useMutation, useQuery } from 'react-query'
import { Button } from 'react-md'
import Mht from '@target-energysolutions/mht'
// import useRole from 'libs/hooks/use-role'

import {
  uploadAnnualReport,
  uploadHistoryAndForecast,
  uploadAnnualResource,
  commitReport,
  // saveReport,
  // getBlocks,
  getAnnualReport,
  getHistoryAndForecast,
  getAnnualResourceDetail,
  downloadTemp,
} from 'libs/api/api-reserves'

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
  const [currentTab, setCurrentTab] = useState(0)
  const [showUploadRapportDialog, setShowUploadRapportDialog] = useState(false)
  const [showSupportedDocumentDialog, setShowSupportedDocumentDialog] =
    useState(false)
  const [selectedRow, setSelectedRow] = useState([])
  const [showUploadMHTDialog, setShowUploadMHTDialog] = useState(false)
  const [dataDisplayedMHT, setDataDisplayedMHT] = useState({})
  const [filesList, setFileList] = useState({})
  const { data: listAnnualReserves, refetch: refetchAnnualReserves } = useQuery(
    ['getAnnualReport'],
    getAnnualReport,
  )
  const { data: listHistoryAndForecast, refetch: refetchHistoryAndForecast } =
    useQuery(['getHistoryAndForecast'], getHistoryAndForecast)
  const {
    data: listAnnualResourceDetail,
    refetch: refetchAnnualResourceDetail,
  } = useQuery(['getAnnualResourceDetail'], getAnnualResourceDetail)
  /*, data: uploadAnnualResponse */
  const { mutate: uploadAnnualReportMutate } = useMutation(uploadAnnualReport)
  const onUploadHistoryReportMutate = useMutation(uploadHistoryAndForecast)
  const onUploadDetailReportMutate = useMutation(uploadAnnualResource)

  const onCommitReportMutate = useMutation(commitReport)
  // const onSaveReportMutate = useMutation(saveReport)

  // const getAnnualReportData = useQuery(['annual'], getAnnualReport)
  /* if (roles) {
    rolesTab.forEach(({ key, roleOp, roleRe, path }) => {
      if (
        roles.includes(`target-subscription-store:${organizationID}:${roleOp}`)
      ) {
        basedRoleSubMenus.push({
          ...subModules.find((sM) => sM.key === key),
          path,
        })
      } else if (roles.includes(roleRe)) {
        basedRoleSubMenus.push({
          ...subModules.find((sM) => sM.key === key),
          path,
        })
      }
    })
  } */
  const annualReservesReportingActionsHelper = [
    {
      title: 'Upload Annual Reserves Report',
      onClick: () => setShowUploadRapportDialog(true),
    },
    {
      title: 'Download Template',
      onClick: () => {
        downloadTemp('reserve', 'annual')
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
          onClick: () => {
            onAddReport(data)
          },
        }
      case 1:
        return {
          title: 'Upload History and Forecast Report',
          optional: 'Attach Supporting Document (Optional)',
          onClick: () => {
            onUploadHistoryReport(data)
          },
        }
      case 2:
        return {
          title: 'Upload Monthly Tracking Report',
          optional: 'Attach Supporting Document (Optional)',
          onClick: () => {
            onUploadDetailReport(data)
          },
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
  const onAddReport = (body) => {
    uploadAnnualReportMutate(
      {
        body: {
          block: body?.block,
          company: 'company',
          file: body?.filesList,
          processInstanceId: 'id',
          year: '2021',
        },
      },
      {
        onSuccess: (res) => {
          onCommitReport(res?.data)
          // console.log(res, 'res')
        },
      },
    )
  }
  // console.log(uploadAnnualResponse, 'uploadAnnualResponse')
  /* const onSaveReport = (body) => {
    uploadAnnualReportMutate(
      {
        body: {
          block: body?.block,
          company: 'company',
          file: body?.filesList,
          processInstanceId: 'id',
          year: '2021',
        },
      },
      {
        onSuccess: (res) => !res?.error && refetchAnnualReserves(),
      },
    )
  } */
  const onCommitReport = (body) => {
    // console.log(body, 'uploadAnnualResponse')
    onCommitReportMutate.mutate(
      {
        body: {
          reserveResource: body,
          processInstanceId: 'id',
        },
      },
      {
        onSuccess: (res) => !res?.error && refetchAnnualReserves(),
      },
    )
  }
  const onUploadHistoryReport = (body) => {
    onUploadHistoryReportMutate.mutate(
      {
        body: {
          block: body?.block,
          company: 'company',
          file: body?.filesList,
          processInstanceId: 'id',
        },
      },
      {
        onSuccess: (res) => !res?.error && refetchHistoryAndForecast(),
      },
    )
  }
  const onUploadDetailReport = (body) => {
    onUploadDetailReportMutate.mutate(
      {
        body: {
          block: body?.block,
          company: 'company',
          file: body?.filesList,
          hydrocarbonType: 'GAS',
          processInstanceId: 'id',
          year: '2021',
        },
      },
      {
        onSuccess: (res) => !res?.error && refetchAnnualResourceDetail(),
      },
    )
  }
  return (
    <>
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
          onHide={() => {
            setShowUploadMHTDialog(false)
            setShowUploadRapportDialog(true)
          }}
          onSave={() => {
            setShowUploadMHTDialog(false)
            setShowUploadRapportDialog(true)
            setFileList(dataDisplayedMHT)
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
          blockList={['1', '2']}
          onSave={(data) => {
            renderDialogData(data).onClick()
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
