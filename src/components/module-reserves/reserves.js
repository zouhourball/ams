import { useState } from 'react'
import { useMutation, useQuery } from 'react-query'
import { Button } from 'react-md'
import Mht from '@target-energysolutions/mht'
// import { rolesTab } from 'libs/roles-tab'

import {
  uploadAnnualReport,
  // getBlocks,
  getAnnualReport,
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
  annualReservesData,
  historyData,
  annualResourceData,
  actionsHeader,
} from './helpers'
import { userRole } from 'components/shared-hook/get-roles'

const Reserves = () => {
  const [currentTab, setCurrentTab] = useState(0)
  const [showUploadRapportDialog, setShowUploadRapportDialog] = useState(false)
  const [showSupportedDocumentDialog, setShowSupportedDocumentDialog] =
    useState(false)
  const [selectedRow, setSelectedRow] = useState([])
  const [showUploadMHTDialog, setShowUploadMHTDialog] = useState(false)
  const [dataDisplayedMHT, setDataDisplayedMHT] = useState({})
  const [filesList, setFileList] = useState([])
  const { data: listAnnualReserves, refetch: refetchAnnualReserves } = useQuery(
    ['getAnnualReport'],
    getAnnualReport,
  )

  // const data = useQuery(['blocks'], getBlocks)

  const uploadAnnualReportMutate = useMutation(uploadAnnualReport)

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
        return historyData
      case 2:
        return annualResourceData
      default:
        return annualReservesData
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

  const renderDialogData = () => {
    switch (currentTab) {
      case 0:
        return {
          title: 'Upload Annual Reserves Report',
          optional: 'Attach Supporting Document (Optional)',
          onClick: () => {},
        }
      case 1:
        return {
          title: 'Upload History and Forecast Report',
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
  const onAddReport = (body) => {
    uploadAnnualReportMutate.mutate(
      {
        body: {
          block: body?.block,
          company: 'company',
          file: body?.file,
          processInstanceId: 'id',
          year: '2021',
        },
      },
      {
        onSuccess: (res) => !res?.error && refetchAnnualReserves(),
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
                    userRole(),
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
            setFileList([...filesList, dataDisplayedMHT])
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
            setFileList([])
          }}
          blockList={['1', '2']}
          onSave={(data) => {
            onAddReport(data)
            renderDialogData().onClick()
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
