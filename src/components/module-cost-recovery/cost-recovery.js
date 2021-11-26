import { useState, useMemo } from 'react'
import { Button } from 'react-md'
import Mht from '@target-energysolutions/mht'
import { useQuery, useMutation } from 'react-query'
import moment from 'moment'
import { v4 as uuidv4 } from 'uuid'

import useRole from 'libs/hooks/use-role'
import {
  listCostsCost,
  uploadAnnualCosts,
  commitLoadCostsCost,
  overrideCostsCost,
} from 'libs/api/cost-recovery-api'
import { downloadTemp } from 'libs/api/api-reserves'
import getBlocks from 'libs/hooks/get-blocks'
import documents from 'libs/hooks/documents'

import { configsAnnualCostsDialogMht } from './mht-helper-dialog'
import getOrganizationInfos from 'libs/hooks/get-organization-infos'

import TopBar from 'components/top-bar'
import NavBar from 'components/nav-bar'
import UploadReportDialog from 'components/upload-report-dialog'
import HeaderTemplate from 'components/header-template'
import MHTDialog from 'components/mht-dialog'
import SupportedDocument from 'components/supported-document'
import ConfirmDialog from 'components/confirm-dialog'

import {
  annualCostConfigs,
  contractReportConfigs,
  productionLiftingConfigs,
  transactionConfigs,
  affiliateConfigs,
  facilitiesConfigs,
  annualCostData,
  contractReportData,
  productionLiftingData,
  transactionData,
  affiliateData,
  facilitiesData,
  actionsHeader,
} from './helpers'

const CostRecovery = () => {
  const [currentTab, setCurrentTab] = useState(0)
  const [showUploadRapportDialog, setShowUploadRapportDialog] = useState(false)
  const [showSupportedDocumentDialog, setShowSupportedDocumentDialog] =
    useState(false)
  const [selectedRow, setSelectedRow] = useState([])
  const [showUploadMHTDialog, setShowUploadMHTDialog] = useState(false)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const blockList = getBlocks()

  const company = getOrganizationInfos()

  const [, setDataDisplayedMHT] = useState({})
  const [filesList, setFileList] = useState([])

  const role = useRole('costrecovery')

  const { data: annualListRecovery, refetch: refetchAnnualCosts } = useQuery(
    ['listCostsCost'],
    listCostsCost,
  )
  const { mutate: uploadAnnualCostsExp, data: responseUploadAnnualCost } =
    useMutation(uploadAnnualCosts)
  const { mutate: commitAnnualCostsExp } = useMutation(commitLoadCostsCost)
  const { mutate: overrideAnnualCostsExp } = useMutation(overrideCostsCost)
  const { addSupportingDocuments } = documents()

  const annualCostAndExpenditureActionsHelper = [
    {
      title: 'Upload Annual Cost & Expenditure Report',
      onClick: () => setShowUploadRapportDialog('upload-annual-cost'),
    },
    {
      title: 'Download Template',
      onClick: () => {
        downloadTemp('costRecovery', 'costs')
      },
    },
  ]

  const contractReportsActionsHelper = [
    {
      title: 'Upload Contract Report',
      onClick: () => setShowUploadRapportDialog(true),
    },
    { title: 'Download Template', onClick: () => {} },
  ]

  const productionLiftingActionsHelper = [
    {
      title: 'Upload Production Lifting Report',
      onClick: () => setShowUploadRapportDialog(true),
    },
    {
      title: 'Download Template',
      onClick: () => {
        downloadTemp('costRecovery', 'annual')
      },
    },
  ]

  const transactionReportActionsHelper = [
    {
      title: 'Upload Transaction  Report',
      onClick: () => setShowUploadRapportDialog(true),
    },
    { title: 'Download Template', onClick: () => {} },
  ]

  const affiliateActionsHelper = [
    {
      title: 'Upload Affiliate Report',
      onClick: () => setShowUploadRapportDialog(true),
    },
    { title: 'Download Template', onClick: () => {} },
  ]

  const facilitiesActionsHelper = [
    {
      title: 'Upload facilities Report',
      onClick: () => setShowUploadRapportDialog(true),
    },
    { title: 'Download Template', onClick: () => {} },
  ]

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
        return createActionsByCurrentTab(annualCostAndExpenditureActionsHelper)
      case 1:
        return createActionsByCurrentTab(contractReportsActionsHelper)
      case 2:
        return createActionsByCurrentTab(productionLiftingActionsHelper)
      case 3:
        return createActionsByCurrentTab(transactionReportActionsHelper)
      case 4:
        return createActionsByCurrentTab(affiliateActionsHelper)
      case 5:
        return createActionsByCurrentTab(facilitiesActionsHelper)
      default:
        break
    }
  }

  const tabsList = [
    'Annual Cost and Expenditure',
    'Contract Reports',
    'Production Lifting',
    'Transaction Report',
    'Affiliate',
    'Facilities',
  ]
  const renderCurrentTabData = () => {
    switch (currentTab) {
      case 0:
        return (
          annualListRecovery?.content?.map((el) => ({
            company: el?.metaData?.company,
            block: el?.metaData?.block,
            status: el?.metaData?.status,
            submittedBy: el?.metaData?.createdBy?.name,
            submittedDate: el?.metaData?.createdAt
              ? moment(el?.metaData?.createdAt).format('DD MMM, YYYY')
              : '',
            // referenceDate: el?.metaData?.statusDate,
            id: el?.id,
            processInstanceId: el?.metaData?.processInstanceId,
          })) || []
        )
      case 1:
        return contractReportData
      case 2:
        return productionLiftingData
      case 3:
        return transactionData
      case 4:
        return affiliateData
      case 5:
        return facilitiesData
      default:
        return annualCostData
    }
  }
  const renderCurrentTabConfigs = () => {
    switch (currentTab) {
      case 0:
        return annualCostConfigs()
      case 1:
        return contractReportConfigs()
      case 2:
        return productionLiftingConfigs()
      case 3:
        return transactionConfigs()
      case 4:
        return affiliateConfigs()
      case 5:
        return facilitiesConfigs()
      default:
        return annualCostConfigs()
    }
  }

  const renderDialogData = (data) => {
    switch (currentTab) {
      case 0:
        return {
          title: 'Upload Annual Cost & Expenditure Report',
          optional: 'Attach Supporting Document (Optional)',
          onClick: () => handleUploadAnnualCost(data),
        }
      case 1:
        return {
          title: 'Upload Contract Report',
          optional: 'Attach Supporting Document (Optional)',
          onClick: () => {},
        }
      case 2:
        return {
          title: 'Upload Production Lifting Report',
          optional: 'Attach Supporting Document (Optional)',
          onClick: () => {},
        }
      case 3:
        return {
          title: 'Upload Transaction Report',
          optional: 'Attach Supporting Document (Optional)',
          onClick: () => {},
        }
      case 4:
        return {
          title: 'Upload Affiliate Report',
          optional: 'Attach Supporting Document (Optional)',
          onClick: () => {},
        }
      case 5:
        return {
          title: 'Upload Facilities Report',
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

  const handleUploadAnnualCost = (data) => {
    uploadAnnualCostsExp(
      {
        block: data?.block,
        file: data?.file[0],
        company: company?.name || 'ams-org',
        processInstanceId: uuidv4(),
        year: +data?.referenceDate?.year,
      },
      {
        onSuccess: (res) => {
          if (res?.responseStatus?.success) {
            setShowUploadMHTDialog(true)
          }
        },
      },
    )
  }

  const configsMht = () => {
    switch (showUploadRapportDialog) {
      case 'upload-annual-cost':
        return configsAnnualCostsDialogMht().map((el) =>
          el.key !== 'year'
            ? el
            : {
              ...el,
              label: responseUploadAnnualCost?.metaData?.year,
            },
        )

      default:
        return configsAnnualCostsDialogMht()
    }
  }

  const resAnnualCostData = () => {
    return (
      responseUploadAnnualCost?.data?.items?.map((el) => ({
        category: el?.category,
        subCategory: el?.subCategory,
        group: el?.group,
        uom: el?.uom,
        item: el?.name,
        description: el?.explanation,
        year: [
          {
            approved: el?.qvalues?.map((el) => ({ plan: el?.plan || '' })),
          },
          {
            outlook: el?.qvalues?.map((el) => ({
              outlook: el?.quarter || '',
            })),
          },
          { ytd: el?.qvalues?.map((el) => ({ actual: el?.actual || '' })) },
        ],
      })) || []
    )
  }
  const dataMht = useMemo(() => {
    switch (showUploadRapportDialog) {
      case 'upload-annual-cost':
        return resAnnualCostData()

      default:
        return resAnnualCostData()
    }
  }, [responseUploadAnnualCost])

  const handleSaveCommitAnnualCosts = () => {
    commitAnnualCostsExp(
      {
        items: responseUploadAnnualCost?.data?.items,
        metaData: responseUploadAnnualCost?.data?.metaData,
      },
      {
        onSuccess: (res) => {
          if (res?.success) {
            setShowUploadMHTDialog(null)
            refetchAnnualCosts()
          } else if (res.overrideId && !res.success) {
            setShowConfirmDialog(res.overrideId)
          }
        },
      },
    )
  }

  const closeDialog = (resp) => {
    resp &&
      resp[0]?.statusCode === 'OK' &&
      setShowSupportedDocumentDialog(false)
  }

  const costsSuppDocs = (data) => {
    addSupportingDocuments(data, selectedRow[0]?.processInstanceId, closeDialog)
  }

  const handleSupportingDocs = (data) => {
    switch (currentTab) {
      case 0:
        return costsSuppDocs(data)
      case 1:
        return () => null
      case 2:
        return () => null
      case 3:
        return () => null
      case 4:
        return () => null
      case 5:
        return () => null
      default:
        break
    }
  }

  const overrideCosts = () => {
    overrideAnnualCostsExp(
      {
        body: {
          items: responseUploadAnnualCost?.data?.items,
          metaData: responseUploadAnnualCost?.data?.metaData,
        },
        overrideId: showConfirmDialog,
      },
      {
        onSuccess: (res) => {
          if (res.success) {
            setShowUploadMHTDialog(null)
            setShowConfirmDialog(null)
            refetchAnnualCosts()
          }
        },
      },
    )
  }

  const handleOverride = () => {
    switch (currentTab) {
      case 0:
        return overrideCosts()
      case 1:
        return () => null
      case 2:
        return () => null
      case 3:
        return () => null
      case 4:
        return () => null
      case 5:
        return () => null
      default:
        break
    }
  }

  return (
    <>
      <TopBar
        title="Cost Recovery Reporting"
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
                    'cost-recovery-details',
                    selectedRow[0]?.id,
                    'costs',
                    role,
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
          propsConfigs={configsMht()}
          onHide={() => {
            setShowUploadMHTDialog(false)
            // setShowUploadRapportDialog(true)
          }}
          onSave={() => {
            handleSaveCommitAnnualCosts()
          }}
        />
      )}
      {showUploadRapportDialog && (
        <UploadReportDialog
          setFileList={setFileList}
          filesList={filesList}
          blockList={
            Array.isArray(blockList) && blockList?.length > 0
              ? blockList?.map((el) => ({ label: el?.block, value: el?.block }))
              : ['100']
          }
          onDisplayMHT={onDisplayMHT}
          title={renderDialogData().title}
          optional={renderDialogData().optional}
          visible={showUploadRapportDialog}
          onHide={() => {
            setShowUploadRapportDialog(false)
            setFileList([])
          }}
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
          processInstanceId={selectedRow[0]?.processInstanceId}
          onSaveUpload={(data) => {
            handleSupportingDocs(data)
          }}
        />
      )}

      {showConfirmDialog && (
        <ConfirmDialog
          onDiscard={() => setShowConfirmDialog(false)}
          visible={showConfirmDialog}
          handleOverride={handleOverride}
          message={'Do you override ?'}
        />
      )}
    </>
  )
}
export default CostRecovery
