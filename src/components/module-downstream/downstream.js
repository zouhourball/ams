import { useState, useMemo } from 'react'
import { useQuery, useMutation } from 'react-query'
import { Button, DialogContainer } from 'react-md'
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
  overrideDownstreamLpg,
  overrideDownstreamNg,
  overrideDownstreamRs,
  deleteLpg,
  deleteNg,
  deleteRs,
} from 'libs/api/downstream-api'

import documents from 'libs/hooks/documents'
import useRole from 'libs/hooks/use-role'
import { downloadOriginalFile } from 'libs/api/supporting-document-api'

import TopBar from 'components/top-bar'
import NavBar from 'components/nav-bar'
import UploadReportDialog from 'components/upload-report-dialog'
import HeaderTemplate from 'components/header-template'
// import { userRole } from 'components/shared-hook/get-roles'
import MHTDialog from 'components/mht-dialog'
import SupportedDocument from 'components/supported-document'
import getOrganizationInfos from 'libs/hooks/get-organization-infos'

import {
  liquefiedPetroleumGasConfigs,
  naturalGasConfigs,
  petroleumProductsConfigs,
  // liquefiedPetroleumGasData,
  // naturalGasData,
  // petroleumProductsData,
  actionsHeader,
} from './helpers'
import {
  configsLpgDialogMht,
  configsRsDialogMht,
  configsNgDialogMht,
} from './mht-helper-dialog'

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
  const [overrideDialog, setOverrideDialog] = useState(false)
  const [overrideId, setOverrideId] = useState()

  const { addSupportingDocuments } = documents()
  const company = getOrganizationInfos()
  const role = useRole('downstream')

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

  const { mutate: uploadLpgMutate, data: responseUploadLpg } =
    useMutation(uploadLpg)
  const { mutate: uploadNgMutate, data: responseUploadNg } =
    useMutation(uploadNg)
  const { mutate: uploadRsMutate, data: responseUploadRs } =
    useMutation(uploadRs)
  const commitLpgMutation = useMutation(commitLoadDownstreamLpg)
  const commitNgMutate = useMutation(commitLoadDownstreamNg)
  const commitRsMutate = useMutation(commitLoadDownstreamRs)

  const overrideLpgMutation = useMutation(overrideDownstreamLpg)
  const overrideNgMutation = useMutation(overrideDownstreamNg)
  const overrideRsMutation = useMutation(overrideDownstreamRs)

  const deleteLpgMutation = useMutation(deleteLpg)
  const deleteNgMutation = useMutation(deleteNg)
  const deleteRsMutation = useMutation(deleteRs)

  // const commitNgMutate = useMutation(commitLoadDownstreamNg)
  // const commitRsMutate = useMutation(commitLoadDownstreamRs)

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
  const closeDialog = (resp) => {
    resp &&
      resp[0]?.statusCode === 'OK' &&
      setShowSupportedDocumentDialog(false)
  }
  const downstreamSuppDocs = (data) => {
    addSupportingDocuments(
      data,
      selectedRow[0]?.processInstanceId ||
        showSupportedDocumentDialog?.processInstanceId,
      closeDialog,
    )
  }

  const handleSupportingDocs = (data) => {
    downstreamSuppDocs(data)
  }

  const onAddReport = (body) => {
    switch (currentTab) {
      case 0:
        return uploadLpgMutate(
          {
            body: {
              company: company?.name || 'ams-org',
              file: body?.file[0],
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
        return uploadNgMutate(
          {
            body: {
              company: company?.name || 'ams-org',
              file: body?.file[0],
              month: moment(body?.referenceDate).format('MMMM'),
              processInstanceId: uuidv4(),
              year: moment(body?.referenceDate).format('YYYY'),
            },
          },
          {
            onSuccess: (res) => {
              if (!res?.error) {
                refetchNgList()
                setCommitData(res?.data)
                onDisplayMHT(...res.values)
              }
            },
          },
        )
      case 2:
        return uploadRsMutate(
          {
            body: {
              company: company?.name || 'ams-org',
              file: body?.file[0],
              month: moment(body?.referenceDate).format('MMMM'),
              processInstanceId: uuidv4(),
              year: moment(body?.referenceDate).format('YYYY'),
              category: body?.type,
            },
          },
          {
            onSuccess: (res) => {
              if (!res?.error) {
                refetchRsList()
                setCommitData(res?.data)
                onDisplayMHT(...res.values)
              }
            },
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
                if (res?.msg === 'exist') {
                  setOverrideDialog(true)
                  setShowUploadMHTDialog(false)
                  setShowUploadRapportDialog(false)
                  setOverrideId(res?.overrideId)
                } else {
                  setShowUploadRapportDialog(false)
                  setShowUploadMHTDialog(false)
                  refetchLpgList()
                }
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
            onSuccess: (res) => {
              if (!res?.error) {
                if (res?.msg === 'exist') {
                  setOverrideDialog(true)
                  setShowUploadMHTDialog(false)
                  setShowUploadRapportDialog(false)
                  setOverrideId(res?.overrideId)
                } else {
                  setShowUploadRapportDialog(false)
                  setShowUploadMHTDialog(false)
                  refetchNgList()
                }
              }
            },
          },
        )
      case 2:
        return commitRsMutate.mutate(
          {
            body: commitData,
          },
          {
            onSuccess: (res) => {
              if (!res?.error) {
                if (res?.msg === 'exist') {
                  setOverrideDialog(true)
                  setShowUploadMHTDialog(false)
                  setShowUploadRapportDialog(false)
                  setOverrideId(res?.overrideId)
                } else {
                  setShowUploadRapportDialog(false)
                  setShowUploadMHTDialog(false)
                  refetchRsList()
                }
              }
            },
          },
        )
      default:
        break
    }
  }

  const onOverrideDownstream = (overrideId) => {
    switch (currentTab) {
      case 0:
        return overrideLpgMutation.mutate(
          {
            body: commitData,
            overrideId: overrideId,
          },
          {
            onSuccess: (res) => {
              if (!res?.error) {
                if (res?.msg === 'saved') {
                  setOverrideDialog(false)
                  refetchLpgList()
                }
              }
            },
          },
        )
      case 1:
        return overrideNgMutation.mutate(
          {
            body: commitData,
            overrideId: overrideId,
          },
          {
            onSuccess: (res) => {
              if (!res?.error) {
                setOverrideDialog(false)
                refetchNgList()
              }
            },
          },
        )
      case 2:
        return overrideRsMutation.mutate(
          {
            body: commitData,
            overrideId: overrideId,
          },
          {
            onSuccess: (res) => {
              if (!res?.error) {
                setOverrideDialog(false)
                refetchRsList()
              }
            },
          },
        )
      default:
        break
    }
  }
  const handleDeleteDownstream = () => {
    switch (currentTab) {
      case 0:
        return deleteLpgMutation.mutate(
          {
            objectId: selectedRow[0]?.id,
          },
          {
            onSuccess: (res) => {
              refetchLpgList()
            },
          },
        )
      case 1:
        return deleteNgMutation.mutate(
          {
            objectId: selectedRow[0]?.id,
          },
          {
            onSuccess: (res) => {
              refetchNgList()
            },
          },
        )
      case 2:
        return deleteRsMutation.mutate(
          {
            objectId: selectedRow[0]?.id,
          },
          {
            onSuccess: (res) => {
              refetchRsList()
            },
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
        return (
          listLiquefiedPetroleumGas?.content?.map((el) => ({
            id: el?.id,
            originalFileId: el?.metaData?.originalFileId,
            company: el?.metaData?.company,
            submittedDate: el?.metaData?.createdAt,
            submittedBy: el?.metaData?.createdBy?.name,
            statusDate: el?.metaData?.year,
            status: el?.metaData?.status,
            processInstanceId: el?.metaData?.processInstanceId,
          })) || []
        )
      case 1:
        return (
          LisPetroleumProducts?.content?.map((el) => ({
            id: el?.id,
            originalFileId: el?.metaData?.originalFileId,
            company: el?.metaData?.company,
            submittedDate: el?.metaData?.createdAt,
            submittedBy: el?.metaData?.createdBy?.name,
            statusDate: el?.metaData?.year,
            status: el?.metaData?.status,
            processInstanceId: el?.metaData?.processInstanceId,
          })) || []
        )
      case 2:
        return (
          ListNaturalGas?.content?.map((el) => ({
            id: el?.id,
            originalFileId: el?.metaData?.originalFileId,
            company: el?.metaData?.company,
            submittedDate: el?.metaData?.createdAt,
            submittedBy: el?.metaData?.createdBy?.name,
            statusDate: el?.metaData?.year,
            category: el?.metaData?.category,
            status: el?.metaData?.status,
            processInstanceId: el?.metaData?.processInstanceId,
          })) || []
        )
      default:
        return (
          listLiquefiedPetroleumGas?.content?.map((el) => ({
            id: el?.id,
            originalFileId: el?.metaData?.originalFileId,
            company: el?.metaData?.company,
            submittedDate: el?.metaData?.createdAt,
            submittedBy: el?.metaData?.createdBy?.name,
            statusDate: el?.metaData?.year,
            status: el?.metaData?.status,
            processInstanceId: el?.metaData?.processInstanceId,
          })) || []
        )
    }
  }
  const UploadSupportedDocumentFromTable = (row) => {
    setShowSupportedDocumentDialog(row)
  }
  const renderCurrentTabConfigs = () => {
    switch (currentTab) {
      case 0:
        return liquefiedPetroleumGasConfigs(UploadSupportedDocumentFromTable)
      case 1:
        return naturalGasConfigs(UploadSupportedDocumentFromTable)
      case 2:
        return petroleumProductsConfigs(UploadSupportedDocumentFromTable)

      default:
        return liquefiedPetroleumGasConfigs(UploadSupportedDocumentFromTable)
    }
  }

  const downstreamRespData = () => {
    switch (currentTab) {
      case 0:
        return (
          responseUploadLpg?.data?.data?.map((el) => ({
            company: el?.company,
            quota: el?.quota,
            lifting: el?.actualLifted?.map((source) => ({
              source1: source[0]?.value,
              source2: source[1]?.value,
            })),
            total: el?.totalLifted,
            remarks: el?.remarks,
            variance: el?.variance,
          })) || []
        )
      case 1:
        return (
          responseUploadNg?.data?.data?.map((el) => ({
            terminalType: el?.terminalTypes,
            consumerSupplier: el?.nameTerminal,
            January: [
              { jGD: el?.listOnSpecGas[0]?.value },
              { jCG: el?.listOnSpecGas[1]?.value },
              { jSG: el?.listOnSpecGas[2]?.value },
            ],
            February: [
              { fGD: el?.listOnSpecGas[3]?.value },
              { fCG: el?.listOnSpecGas[4]?.value },
              { fSG: el?.listOnSpecGas[5]?.value },
            ],
            March: [
              { mGD: el?.listOnSpecGas[6]?.value },
              { mCG: el?.listOnSpecGas[7]?.value },
              { mSG: el?.listOnSpecGas[8]?.value },
            ],
            April: [
              { aGD: el?.listOnSpecGas[9]?.value },
              { aCG: el?.listOnSpecGas[10]?.value },
              { aSG: el?.listOnSpecGas[11]?.value },
            ],
            May: [
              { myGD: el?.listOnSpecGas[12]?.value },
              { myCG: el?.listOnSpecGas[13]?.value },
              { mySG: el?.listOnSpecGas[14]?.value },
            ],
            June: [
              { jGD: el?.listOnSpecGas[15]?.value },
              { jCG: el?.listOnSpecGas[16]?.value },
              { jSG: el?.listOnSpecGas[17]?.value },
            ],
            July: [
              { juGD: el?.listOnSpecGas[18]?.value },
              { juCG: el?.listOnSpecGas[19]?.value },
              { juSG: el?.listOnSpecGas[20]?.value },
            ],
            August: [
              { auGD: el?.listOnSpecGas[21]?.value },
              { auCG: el?.listOnSpecGas[22]?.value },
              { auSG: el?.listOnSpecGas[23]?.value },
            ],
            September: [
              { sGD: el?.listOnSpecGas[24]?.value },
              { sCG: el?.listOnSpecGas[25]?.value },
              { sSG: el?.listOnSpecGas[26]?.value },
            ],
            October: [
              { oGD: el?.listOnSpecGas[27]?.value },
              { oCG: el?.listOnSpecGas[28]?.value },
              { oSG: el?.listOnSpecGas[29]?.value },
            ],
            November: [
              { nGD: el?.listOnSpecGas[30]?.value },
              { nCG: el?.listOnSpecGas[31]?.value },
              { nSG: el?.listOnSpecGas[32]?.value },
            ],
            December: [
              { dGD: el?.listOnSpecGas[33]?.value },
              { dCG: el?.listOnSpecGas[34]?.value },
              { dSG: el?.listOnSpecGas[35]?.value },
            ],
          })) || []
        )
      case 2:
        return (
          responseUploadRs?.data?.data[0]?.dataGov?.map((el) => ({
            gov: el?.wiliyat,
            sn: el?.stationNumber,
            product: [
              { m95: el?.saleQuantityM95 },
              { m91: el?.saleQuantityM91 },
              { kerosen: el?.saleQuantityKerosen },
              { jet: el?.saleQuantityJet },
              { gas: el?.saleQuantityGasOil },
              { m98: el?.saleQuantityM98 },

              { totalProduct: el?.saleQuantityTotal },
            ],
          })) || []
        )

      default:
    }
  }
  const configsMht = () => {
    switch (currentTab) {
      case 0:
        return configsLpgDialogMht()
      case 1:
        return configsNgDialogMht()
      case 2:
        return configsRsDialogMht()
      default:
        return configsLpgDialogMht()
    }
  }
  const dataMht = useMemo(() => {
    switch (currentTab) {
      case 0:
        return downstreamRespData()
      case 1:
        return downstreamRespData()
      case 2:
        return downstreamRespData()

      default:
        return downstreamRespData()
    }
  }, [responseUploadLpg, responseUploadNg, responseUploadRs])

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
  const subModule = () => {
    switch (currentTab) {
      case 0:
        return 'lpg'
      case 1:
        return 'ng'
      case 2:
        return 'rs'
      default:
        break
    }
  }
  return (
    <>
      <TopBar
        title="Downstream"
        actions={role === 'operator' ? renderActionsByCurrentTab() : []}
      />
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
                    subModule(),

                    role,
                    setShowSupportedDocumentDialog,
                    handleDeleteDownstream,
                    selectedRow[0]?.originalFileId,
                    downloadOriginalFile,
                  )}
                />
              )
            }
          />
        </div>
      </div>
      {showUploadMHTDialog && (
        <MHTDialog
          headerTemplate={<div></div>}
          visible={showUploadMHTDialog}
          onHide={() => {
            setShowUploadMHTDialog(false)
            setShowUploadRapportDialog(true)
          }}
          propsDataTable={dataMht}
          propsConfigs={configsMht()}
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
          ReportingType={currentTab === 2}
          TypeList={['commercial']}
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
          processInstanceId={
            selectedRow[0]?.processInstanceId ||
            showSupportedDocumentDialog?.processInstanceId
          }
          onSaveUpload={(data) => {
            handleSupportingDocs(data)
          }}
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
              onClick: () => onOverrideDownstream(overrideId),
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
export default Downstream
