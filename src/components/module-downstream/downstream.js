import { useState } from 'react'
import { useQuery, useMutation } from 'react-query'
import { Button } from 'react-md'
import Mht from '@target-energysolutions/mht'
import moment from 'moment'
import { v4 as uuidv4 } from 'uuid'
import { downloadTemp } from 'libs/api/api-reserves'

import {
  listLpgDownstreamByLoggedUser,
  listNgDownstreamByLoggedUser,
  listRsDownstreamByLoggedUser,
  uploadLpg,
  uploadNg,
  uploadRs,
  commitLoadDownstreamLpg,
  commitLoadDownstreamNg,
  commitLoadDownstreamRs,
} from 'libs/api/downstream-api'

import TopBar from 'components/top-bar'
import NavBar from 'components/nav-bar'
import UploadReportDialog from 'components/upload-report-dialog'
import HeaderTemplate from 'components/header-template'
// import { userRole } from 'components/shared-hook/get-roles'
import MHTDialog from 'components/mht-dialog'
import SupportedDocument from 'components/supported-document'

import {
  liquefiedPetroleumGasConfigs,
  naturalGasConfigs,
  petroleumProductsConfigs,
  // liquefiedPetroleumGasData,
  // naturalGasData,
  // petroleumProductsData,
  actionsHeader,
} from './helpers'

const Downstream = () => {
  const [currentTab, setCurrentTab] = useState(0)
  const [showUploadRapportDialog, setShowUploadRapportDialog] = useState(false)
  const [showSupportedDocumentDialog, setShowSupportedDocumentDialog] =
    useState(false)
  const [selectedRow, setSelectedRow] = useState([])
  const [showUploadMHTDialog, setShowUploadMHTDialog] = useState(false)
  const [dataDisplayedMHT, setDataDisplayedMHT] = useState({})
  const [filesList, setFileList] = useState([])
  const [commitData, setCommitData] = useState({})

  const { data: listLiquefiedPetroleumGas, refetch: refetchLpgList } = useQuery(
    ['listLpgDownstreamByLoggedUser'],
    listLpgDownstreamByLoggedUser,
  )
  const { data: LisPetroleumProducts, refetch: refetchNgList } = useQuery(
    ['listNgDownstreamByLoggedUser'],
    listNgDownstreamByLoggedUser,
  )
  const { data: ListNaturalGas, refetch: refetchRsList } = useQuery(
    ['listRsDownstreamByLoggedUser'],
    listRsDownstreamByLoggedUser,
  )

  const uploadLpgMutate = useMutation(uploadLpg)
  const uploadNgMutate = useMutation(uploadNg)
  const uploadRsMutate = useMutation(uploadRs)

  const commitLpgMutation = useMutation(commitLoadDownstreamLpg)
  const commitNgMutate = useMutation(commitLoadDownstreamNg)
  const commitRsMutate = useMutation(commitLoadDownstreamRs)

  const liquefiedPetroleumGasActionsHelper = [
    {
      title: 'Attach Spreadsheet',
      onClick: () => setShowUploadRapportDialog(true),
    },
    {
      title: 'Download Template',
      onClick: () => {
        downloadTemp('downstream', 'lpgDownstream')
      },
    },
  ]

  const naturalGasActionsHelper = [
    {
      title: 'Attach Spreadsheet',
      onClick: () => setShowUploadRapportDialog(true),
    },
    {
      title: 'Download Template',
      onClick: () => {
        downloadTemp('downstream', 'ngDownstream')
      },
    },
  ]

  const petroleumProductsActionsHelper = [
    {
      title: 'Attach Spreadsheet',
      onClick: () => setShowUploadRapportDialog(true),
    },
    {
      title: 'Download Template',
      onClick: () => {
        downloadTemp('downstream', 'rsDownstream')
      },
    },
  ]
  const onAddReport = (body) => {
    switch (currentTab) {
      case 0:
        return uploadLpgMutate.mutate(
          {
            body: {
              company: 'company',
              file: body?.file,
              month: moment(body?.referenceDate).format('MMMM'),
              processInstanceId: uuidv4(),
              year: moment(body?.referenceDate).format('YYYY'),
            },
          },
          {
            onSuccess: (res) => {
              if (!res?.error) {
                refetchLpgList()
                setCommitData(res?.data)
                onDisplayMHT(...res.values)
              }
            },
          },
        )
      case 1:
        return uploadNgMutate.mutate(
          {
            body: {
              company: 'company',
              file: body?.file,
              month: moment(body?.referenceDate).format('MMMM'),
              processInstanceId: uuidv4(),
              year: moment(body?.referenceDate).format('YYYY'),
            },
          },
          {
            onSuccess: (res) => !res?.error && refetchNgList(),
          },
        )
      case 2:
        return uploadRsMutate.mutate(
          {
            body: {
              company: 'company',
              file: body?.file,
              month: moment(body?.referenceDate).format('MMMM'),
              processInstanceId: uuidv4(),
              year: moment(body?.referenceDate).format('YYYY'),
            },
          },
          {
            onSuccess: (res) => !res?.error && refetchRsList(),
          },
        )
      default:
        break
    }
  }
  const onCommitRapport = () => {
    switch (currentTab) {
      case 0:
        return commitLpgMutation.mutate(
          {
            body: commitData,
          },
          {
            onSuccess: (res) => {
              if (!res?.error) {
                setShowUploadMHTDialog(false)
                setShowUploadRapportDialog(false)
                // refetchLpgList()
              }
            },
          },
        )
      case 1:
        return commitNgMutate.mutate(
          {
            body: commitData,
          },
          {
            onSuccess: (res) => !res?.error && refetchNgList(),
          },
        )
      case 2:
        return commitRsMutate.mutate(
          {
            body: commitData,
          },
          {
            onSuccess: (res) => !res?.error && refetchRsList(),
          },
        )
      default:
        break
    }
  }

  const createActionsByCurrentTab = (actionsList = []) => {
    return actionsList.map((btn, index) => (
      <Button
        key={`top-bar-btn-${index}`}
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
        return createActionsByCurrentTab(liquefiedPetroleumGasActionsHelper)
      case 1:
        return createActionsByCurrentTab(naturalGasActionsHelper)
      case 2:
        return createActionsByCurrentTab(petroleumProductsActionsHelper)
      default:
        break
    }
  }

  const tabsList = [
    'Liquefied Petroleum Gas (LPG)',
    'Natural Gas (NG)',
    'Petroleum Products',
  ]
  const renderCurrentTabData = () => {
    switch (currentTab) {
      case 0:
        return listLiquefiedPetroleumGas?.content || []
      case 1:
        return ListNaturalGas?.content || []
      case 2:
        return LisPetroleumProducts?.content || []

      default:
        return listLiquefiedPetroleumGas?.content || []
    }
  }
  const renderCurrentTabConfigs = () => {
    switch (currentTab) {
      case 0:
        return liquefiedPetroleumGasConfigs()
      case 1:
        return naturalGasConfigs()
      case 2:
        return petroleumProductsConfigs()

      default:
        return liquefiedPetroleumGasConfigs()
    }
  }

  const renderDialogData = () => {
    switch (currentTab) {
      case 0:
        return {
          title: 'Attach Spreadsheet',
          optional: 'Attach Supporting Document (Optional)',
          onClick: () => {},
        }
      case 1:
        return {
          title: 'Attach Spreadsheet',
          optional: 'Attach Supporting Document (Optional)',
          onClick: () => {},
        }
      case 2:
        return {
          title: 'Attach Spreadsheet',
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
      <TopBar title="Downstream" actions={renderActionsByCurrentTab()} />
      <div className="subModule">
        <NavBar
          tabsList={tabsList}
          activeTab={currentTab}
          setActiveTab={setCurrentTab}
        />
        <div className="subModule--table-wrapper">
          <Mht
            configs={renderCurrentTabConfigs()}
            tableData={renderCurrentTabData()}
            withSearch={selectedRow?.length === 0}
            commonActions={selectedRow?.length === 0}
            onSelectRows={setSelectedRow}
            withChecked
            singleSelect
            hideTotal={false}
            withFooter
            selectedRow={selectedRow}
            headerTemplate={
              selectedRow?.length === 1 && (
                <HeaderTemplate
                  title={`${selectedRow?.length} Row Selected`}
                  actions={actionsHeader(
                    'downstream-details',
                    selectedRow[0]?.id,
                    'regulator',
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
            onCommitRapport()
            // setShowUploadMHTDialog(false)
            // setShowUploadRapportDialog(true)
            setFileList([...filesList, dataDisplayedMHT])
          }}
        />
      )}
      {showUploadRapportDialog && (
        <UploadReportDialog
          setFileList={setFileList}
          filesList={filesList}
          hideBlock
          onDisplayMHT={onDisplayMHT}
          title={renderDialogData().title}
          optional={renderDialogData().optional}
          visible={showUploadRapportDialog}
          onHide={() => {
            setShowUploadRapportDialog(false)
            setFileList([])
          }}
          onSave={(data) => {
            onAddReport(data)
            // renderDialogData().onClick()
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
export default Downstream
