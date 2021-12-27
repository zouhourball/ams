import { useState, useMemo, useCallback } from 'react'
import { Button, CircularProgress, SelectField } from 'react-md'
import Mht from '@target-energysolutions/mht'
import { useQuery, useMutation } from 'react-query'
import moment from 'moment'
import { v4 as uuidv4 } from 'uuid'

import useRole from 'libs/hooks/use-role'
import {
  commitLoadAffiliateCost,
  overrideTransactionCost,
  listCostsCost,
  uploadAnnualCosts,
  commitLoadCostsCost,
  overrideCostsCost,
  deleteCosts,
  listContractsCost,
  uploadContracts,
  commitLoadContractsCost,
  overrideContractsCost,
  deleteContracts,
  listProdLiftingCost,
  uploadProdLiftingCost,
  commitLoadProdLiftingCost,
  overrideProdLiftingCost,
  listTransactionCost,
  uploadTransactionCost,
  commitLoadTransactionCost,
  listAffiliateCost,
  uploadAffiliateCost,
  overrideAffiliateCost,
  listFacilitiesCost,
  uploadFacilitiesCost,
  commitLoadFacilitiesCost,
  overrideFacilitiesCost,
  deleteAffiliate,
  deleteFacilities,
  deleteProdLifting,
  deleteTransaction,
} from 'libs/api/cost-recovery-api'
import { downloadTemp } from 'libs/api/supporting-document-api'
import getBlocks from 'libs/hooks/get-blocks'
import documents from 'libs/hooks/documents'

import {
  configsAnnualCostsDialogMht,
  configsContractsCostsDialogMht,
  configsContractsDialogMht,
  transactionConfig,
  affiliateConfig,
} from './mht-helper-dialog'
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
  // annualCostData,
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
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [subSubModule, setSubSubModule] = useState('dataActualLifting')

  const blockList = getBlocks()

  const company = getOrganizationInfos()

  const [, setDataDisplayedMHT] = useState({})
  const [filesList, setFileList] = useState([])

  const role = useRole('costrecovery')

  const { mutate: uploadAnnualCostsExp, data: responseUploadAnnualCost } =
    useMutation(uploadAnnualCosts)
  const { mutate: commitAnnualCostsExp } = useMutation(commitLoadCostsCost)
  const { mutate: overrideAnnualCostsExp } = useMutation(overrideCostsCost)
  const { mutate: deleteAnnualCostsExp } = useMutation(deleteCosts)
  const { mutate: commitContractors } = useMutation(commitLoadContractsCost)
  const { mutate: overrideContractsReport } = useMutation(overrideContractsCost)
  const { mutate: deleteContractsReport } = useMutation(deleteContracts)
  const { mutate: commitProdLifting } = useMutation(commitLoadProdLiftingCost)
  const { mutate: overrideLifting } = useMutation(overrideProdLiftingCost)
  const { mutate: uploadTransaction, data: responseUploadTransaction } =
    useMutation(uploadTransactionCost)
  const { mutate: commitTransaction } = useMutation(commitLoadTransactionCost)
  const { mutate: overrideTransaction } = useMutation(overrideTransactionCost)
  const { mutate: uploadAffiliate, data: responseUploadAffiliate } =
    useMutation(uploadAffiliateCost)
  const { mutate: commitAffiliate } = useMutation(commitLoadAffiliateCost)
  const { mutate: overrideAffiliate } = useMutation(overrideAffiliateCost)
  const { mutate: uploadFacilities, data: responseUploadFacilities } =
    useMutation(uploadFacilitiesCost)
  const { mutate: commitFacilities } = useMutation(commitLoadFacilitiesCost)
  const { mutate: overrideFacilities } = useMutation(overrideFacilitiesCost)

  const { mutate: deleteAffCosts } = useMutation(deleteAffiliate)
  const { mutate: deleteFacilitiesCosts } = useMutation(deleteFacilities)
  const { mutate: deleteProdLift } = useMutation(deleteProdLifting)
  const { mutate: deleteTrans } = useMutation(deleteTransaction)

  const genericApiForMhtData = () => {
    switch (currentTab) {
      case 0:
        return listCostsCost
      case 1:
        return listContractsCost
      case 2:
        return listProdLiftingCost
      case 3:
        return listTransactionCost
      case 4:
        return listAffiliateCost
      case 5:
        return listFacilitiesCost
      default:
        break
    }
  }

  const {
    data: globalMhtData,
    refetch: refetchCurrentData,
    isLoading: loading,
  } = useQuery(
    [`genericApiForMhtData-${currentTab}`, currentTab],
    genericApiForMhtData(),
    {
      refetchOnWindowFocus: false,
      cacheTime: 0,
    },
  )

  const { mutate: uploadContractsCost, data: responseUploadContractCost } =
    useMutation(uploadContracts)

  const { mutate: uploadProdLifting, data: responseUploadProdLift } =
    useMutation(uploadProdLiftingCost)

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
      onClick: () => setShowUploadRapportDialog('upload-contract-report'),
    },
    {
      title: 'Download Template',
      onClick: () => {
        downloadTemp('costRecovery', 'contracts')
      },
    },
  ]

  const productionLiftingActionsHelper = [
    {
      title: 'Upload Production Lifting Report',
      onClick: () => setShowUploadRapportDialog('prod-lifting'),
    },
    {
      title: 'Download Template',
      onClick: () => {
        downloadTemp('costRecovery', 'prodLiftingCost')
      },
    },
  ]

  const transactionReportActionsHelper = [
    {
      title: 'Upload Transaction  Report',
      onClick: () => setShowUploadRapportDialog('transaction'),
    },
    {
      title: 'Download Template',
      onClick: () => {
        downloadTemp('costRecovery', 'transactionCost')
      },
    },
  ]

  const affiliateActionsHelper = [
    {
      title: 'Upload Affiliate Report',
      onClick: () => setShowUploadRapportDialog('affiliate'),
    },
    {
      title: 'Download Template',
      onClick: () => {
        downloadTemp('costRecovery', 'affiliateCost')
      },
    },
  ]

  const facilitiesActionsHelper = [
    {
      title: 'Upload facilities Report',
      onClick: () => setShowUploadRapportDialog('facilities'),
    },
    {
      title: 'Download Template',
      onClick: () => {
        downloadTemp('costRecovery', 'faclitiesCost')
      },
    },
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
    return (
      globalMhtData?.content?.map((el) => ({
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
        originalFileId: el?.metaData?.originalFileId,
      })) || []
    )
  }

  const UploadSupportedDocumentFromTable = (row) => {
    setShowSupportedDocumentDialog(row)
  }

  const renderCurrentTabConfigs = () => {
    switch (currentTab) {
      case 0:
        return annualCostConfigs(UploadSupportedDocumentFromTable)
      case 1:
        return contractReportConfigs(UploadSupportedDocumentFromTable)
      case 2:
        return productionLiftingConfigs(UploadSupportedDocumentFromTable)
      case 3:
        return transactionConfigs(UploadSupportedDocumentFromTable)
      case 4:
        return affiliateConfigs(UploadSupportedDocumentFromTable)
      case 5:
        return facilitiesConfigs(UploadSupportedDocumentFromTable)
      default:
        return annualCostConfigs(UploadSupportedDocumentFromTable)
    }
  }

  const handleUploadProdLifting = (data, processId) => {
    uploadProdLifting(
      {
        block: data?.block,
        file: data?.file[0],
        company: company?.name || 'ams-org',
        processInstanceId: processId,
        year: +data?.referenceDate?.year,
        month: +data?.referenceDate?.month,
      },
      {
        onSuccess: (res) => {
          if (res?.responseStatus?.success) {
            setShowUploadMHTDialog('prod-lifting')
          }
        },
      },
    )
  }

  const handleUploadTransactionCost = (data, processId) => {
    uploadTransaction(
      {
        block: data?.block,
        file: data?.file[0],
        company: company?.name || 'ams-org',
        processInstanceId: processId,
        year: +data?.referenceDate?.year,
        month: +data?.referenceDate?.month,
      },
      {
        onSuccess: (res) => {
          if (res?.responseStatus?.success) {
            setShowUploadMHTDialog('transaction')
          }
        },
      },
    )
  }

  const handleUploadAffiliateCost = (data, processId) => {
    uploadAffiliate(
      {
        block: data?.block,
        file: data?.file[0],
        company: company?.name || 'ams-org',
        processInstanceId: processId,
        year: +data?.referenceDate?.year,
        month: +data?.referenceDate?.month,
      },
      {
        onSuccess: (res) => {
          if (res?.responseStatus?.success) {
            setShowUploadMHTDialog('affiliate')
          }
        },
      },
    )
  }

  const handleUploadFacilitiesCost = (data, processId) => {
    uploadFacilities(
      {
        block: data?.block,
        file: data?.file[0],
        company: company?.name || 'ams-org',
        processInstanceId: processId,
        year: +data?.referenceDate?.year,
      },
      {
        onSuccess: (res) => {
          if (res?.responseStatus?.success) {
            setShowUploadMHTDialog('facilities')
          }
        },
      },
    )
  }

  const renderDialogData = (data) => {
    switch (currentTab) {
      case 0:
        return {
          title: 'Upload Annual Cost & Expenditure Report',
          optional: 'Attach Supporting Document (Optional)',
          onUpload: () => {
            const uuid = uuidv4()
            handleUploadAnnualCost(data, uuid)
            data?.optionalFiles?.length > 0 &&
              addSupportingDocuments(data?.optionalFiles, uuid)
          },
        }
      case 1:
        return {
          title: 'Upload Contract Report',
          optional: 'Attach Supporting Document (Optional)',
          onUpload: () => {
            const uuid = uuidv4()
            handleUploadContractsCost(data, uuid)
            data?.optionalFiles?.length > 0 &&
              addSupportingDocuments(data?.optionalFiles, uuid)
          },
        }
      case 2:
        return {
          title: 'Upload Production Lifting Report',
          optional: 'Attach Supporting Document (Optional)',
          onUpload: () => {
            const uuid = uuidv4()
            handleUploadProdLifting(data, uuid)
            data?.optionalFiles?.length > 0 &&
              addSupportingDocuments(data?.optionalFiles, uuid)
          },
        }
      case 3:
        return {
          title: 'Upload Transaction Report',
          optional: 'Attach Supporting Document (Optional)',
          onUpload: () => {
            const uuid = uuidv4()
            handleUploadTransactionCost(data, uuid)
            data?.optionalFiles?.length > 0 &&
              addSupportingDocuments(data?.optionalFiles, uuid)
          },
        }
      case 4:
        return {
          title: 'Upload Affiliate Report',
          optional: 'Attach Supporting Document (Optional)',
          onUpload: () => {
            const uuid = uuidv4()
            handleUploadAffiliateCost(data, uuid)
            data?.optionalFiles?.length > 0 &&
              addSupportingDocuments(data?.optionalFiles, uuid)
          },
        }
      case 5:
        return {
          title: 'Upload Facilities Report',
          optional: 'Attach Supporting Document (Optional)',
          onUpload: () => {
            const uuid = uuidv4()
            handleUploadFacilitiesCost(data, uuid)
            data?.optionalFiles?.length > 0 &&
              addSupportingDocuments(data?.optionalFiles, uuid)
          },
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

  const handleUploadAnnualCost = (data, uuid) => {
    uploadAnnualCostsExp(
      {
        block: data?.block,
        file: data?.file[0],
        company: company?.name || 'ams-org',
        processInstanceId: uuid,
        year: +data?.referenceDate?.year,
      },
      {
        onSuccess: (res) => {
          if (res?.responseStatus?.success) {
            setShowUploadMHTDialog('upload-annual-cost')
          }
        },
      },
    )
  }
  const handleUploadContractsCost = (data, uuid) => {
    uploadContractsCost(
      {
        block: data?.block,
        file: data?.file[0],
        company: company?.name || 'ams-org',
        processInstanceId: uuid,
        year: +data?.referenceDate?.year,
        month: +data?.referenceDate?.month,
      },
      {
        onSuccess: (res) => {
          if (res?.responseStatus?.success) {
            setShowUploadMHTDialog('upload-contract-report')
          }
        },
      },
    )
  }

  const configsMht = useCallback(() => {
    switch (showUploadMHTDialog) {
      case 'upload-annual-cost':
        return configsAnnualCostsDialogMht().map((el) =>
          el.key !== 'year'
            ? el
            : {
              ...el,
              label: responseUploadAnnualCost?.metaData?.year,
            },
        )
      case 'upload-contract-report':
        return configsContractsDialogMht()
      case 'prod-lifting':
        return configsContractsCostsDialogMht()
      case 'transaction':
        return transactionConfig()
      case 'affiliate':
        return affiliateConfig()
      case 'facilities':
        return (
          (
            Object.entries(responseUploadFacilities?.data?.data[0] || {}) || []
          ).map((el) => ({
            label: el[0],
            key: el[0],
            width: '200',
            icon: 'mdi mdi-spellcheck',
          })) || []
        )

      default:
        return configsAnnualCostsDialogMht()
    }
  }, [showUploadMHTDialog])

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
  const resContractsCostData = () => {
    return responseUploadContractCost?.data?.data || []
  }

  const resProdLiftingData = () => {
    return (
      (responseUploadProdLift?.data &&
        responseUploadProdLift?.data[subSubModule]?.map((el) => ({
          month: el?.month,
          price: el?.mogPriceUsd,
          totalProduction: [
            {
              barrels: el['totalProduction']['barrels'],
            },
            {
              usd: el['totalProduction']['usd'],
            },
          ],
          contractorEntitlement: [
            {
              costRecovery: [
                {
                  barrels:
                    el['contractorEntitlement']['costRecovery']['barrels'],
                },
                { usd: el['contractorEntitlement']['costRecovery']['usd'] },
              ],
            },
            {
              profit: [
                {
                  barrels: el['contractorEntitlement']['profit']['barrels'],
                },
                { usd: el['contractorEntitlement']['profit']['usd'] },
              ],
            },
            {
              total: [
                {
                  barrels: el['contractorEntitlement']['total']['barrels'],
                },
                {
                  usd: el['contractorEntitlement']['total']['usd'],
                },
              ],
            },
          ],
          governmentEntitlement: [
            {
              profit: [
                {
                  barrels: el['governmentEntitlement']['profit']['barrels'],
                },
                { usd: el['governmentEntitlement']['profit']['usd'] },
              ],
            },
          ],
        }))) ||
      []
    )
  }

  const resTransactionData = () => {
    return (
      responseUploadTransaction?.data?.data?.map((el) => ({
        block: el?.block,
        transactionDate: el?.transactionDate,
        transactionReference: el?.transactionReference,
        transactionDescription: el?.transactionDescription,
        transactionExpElement: el?.transactionExpenditure,
        transactionExpDescription: el?.transactionExpenditureDesc,
        project: el?.project,
      })) || []
    )
  }

  const resAffiliateData = () => {
    return (
      responseUploadAffiliate?.data?.data?.map((el) => ({
        nameOfService: el?.nameService,
        budget: el?.budget,
        hourlyRate: el?.hourlyRate,
        granTotal: el?.granTotalUSD,
        manHoursEstimate: el?.manHoursEstimate,
        total: el?.totalUSD,
        specialistsName: el?.specialistsName,
        durationTiming: el?.durationTiming,
        yearsOfExperience: el?.yearsOfExperience,
      })) || []
    )
  }

  const dataMht = useMemo(() => {
    switch (showUploadMHTDialog) {
      case 'upload-annual-cost':
        return resAnnualCostData()
      case 'upload-contract-report':
        return resContractsCostData()
      case 'prod-lifting':
        return resProdLiftingData()
      case 'transaction':
        return resTransactionData()
      case 'affiliate':
        return resAffiliateData()
      case 'facilities':
        return responseUploadFacilities?.data?.data || []

      default:
        return resAnnualCostData()
    }
  }, [
    responseUploadAnnualCost,
    responseUploadContractCost,
    responseUploadProdLift,
    responseUploadTransaction,
    responseUploadAffiliate,
    responseUploadFacilities,
    subSubModule,
  ])

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
            refetchCurrentData()
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
    addSupportingDocuments(
      data,
      selectedRow[0]?.processInstanceId ||
        showSupportedDocumentDialog?.processInstanceId,
      closeDialog,
    )
  }

  const handleSupportingDocs = (data) => {
    switch (currentTab) {
      case 0:
        return costsSuppDocs(data)
      case 1:
        return costsSuppDocs(data)
      case 2:
        return costsSuppDocs(data)
      case 3:
        return costsSuppDocs(data)
      case 4:
        return costsSuppDocs(data)
      case 5:
        return costsSuppDocs(data)
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
            refetchCurrentData()
          }
        },
      },
    )
  }

  const overrideContracts = () => {
    overrideContractsReport(
      {
        body: {
          data: responseUploadContractCost?.data?.data,
          metaData: responseUploadContractCost?.data?.metaData,
        },
        overrideId: showConfirmDialog,
      },
      {
        onSuccess: (res) => {
          if (res.success) {
            setShowUploadMHTDialog(null)
            setShowConfirmDialog(null)
            refetchCurrentData()
          }
        },
      },
    )
  }

  const overrideProdLifting = () => {
    overrideLifting(
      {
        body: responseUploadProdLift?.data,
        overrideId: showConfirmDialog,
      },
      {
        onSuccess: (res) => {
          if (res.success) {
            setShowUploadMHTDialog(null)
            setShowConfirmDialog(null)
            refetchCurrentData()
          }
        },
      },
    )
  }

  const handleOverrideTransaction = () => {
    overrideTransaction(
      {
        body: responseUploadTransaction?.data,
        overrideId: showConfirmDialog,
      },
      {
        onSuccess: (res) => {
          if (res.success) {
            setShowUploadMHTDialog(null)
            setShowConfirmDialog(null)
            refetchCurrentData()
          }
        },
      },
    )
  }

  const handleOverrideAffiliate = () => {
    overrideAffiliate(
      {
        body: responseUploadAffiliate?.data,
        overrideId: showConfirmDialog,
      },
      {
        onSuccess: (res) => {
          if (res.success) {
            setShowUploadMHTDialog(null)
            setShowConfirmDialog(null)
            refetchCurrentData()
          }
        },
      },
    )
  }

  const handleOverrideFacilities = () => {
    overrideFacilities(
      {
        body: {
          data: responseUploadFacilities?.data?.data,
          metaData: responseUploadFacilities?.data?.metaData,
        },
        overrideId: showConfirmDialog,
      },
      {
        onSuccess: (res) => {
          if (res.success) {
            setShowUploadMHTDialog(null)
            setShowConfirmDialog(null)
            refetchCurrentData()
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
        return overrideContracts()
      case 2:
        return overrideProdLifting()
      case 3:
        return handleOverrideTransaction()
      case 4:
        return handleOverrideAffiliate()
      case 5:
        return handleOverrideFacilities()
      default:
        break
    }
  }

  const handleDelete = () => {
    switch (currentTab) {
      case 1:
        deleteContractsReport(
          { objectId: selectedRow[0]?.id },
          {
            onSuccess: (res) => {
              if (res) {
                refetchCurrentData()
                setSelectedRow([])
                setShowDeleteDialog(false)
              }
            },
          },
        )
        break
      case 0:
        deleteAnnualCostsExp(
          { objectId: selectedRow[0]?.id },
          {
            onSuccess: (res) => {
              if (res) {
                refetchCurrentData()
                setSelectedRow([])
                setShowDeleteDialog(false)
              }
            },
          },
        )
        break
      case 2:
        deleteProdLift(
          { objectId: selectedRow[0]?.id },
          {
            onSuccess: (res) => {
              if (res) {
                refetchCurrentData()
                setSelectedRow([])
                setShowDeleteDialog(false)
              }
            },
          },
        )
        break
      case 3:
        deleteTrans(
          { objectId: selectedRow[0]?.id },
          {
            onSuccess: (res) => {
              if (res) {
                refetchCurrentData()
                setSelectedRow([])
                setShowDeleteDialog(false)
              }
            },
          },
        )
        break
      case 4:
        deleteAffCosts(
          { objectId: selectedRow[0]?.id },
          {
            onSuccess: (res) => {
              if (res) {
                refetchCurrentData()
                setSelectedRow([])
                setShowDeleteDialog(false)
              }
            },
          },
        )
        break
      case 5:
        deleteFacilitiesCosts(
          { objectId: selectedRow[0]?.id },
          {
            onSuccess: (res) => {
              if (res) {
                refetchCurrentData()
                setShowDeleteDialog(false)
                setSelectedRow([])
              }
            },
          },
        )
        break
      default:
        break
    }
  }

  const handleSaveCommitContractors = () => {
    commitContractors(
      {
        data: responseUploadContractCost?.data?.data,
        metaData: responseUploadContractCost?.data?.metaData,
      },
      {
        onSuccess: (res) => {
          if (res?.success) {
            setShowUploadMHTDialog(null)
            refetchCurrentData()
          } else if (res.overrideId && !res.success) {
            setShowConfirmDialog(res.overrideId)
          }
        },
      },
    )
  }

  const handleSaveCommitProdLifting = () => {
    commitProdLifting(
      responseUploadProdLift?.data,

      {
        onSuccess: (res) => {
          if (res?.success) {
            setShowUploadMHTDialog(null)
            refetchCurrentData()
          } else if (res.overrideId && !res.success) {
            setShowConfirmDialog(res.overrideId)
          }
        },
      },
    )
  }

  const handleSaveCommitTransaction = () => {
    commitTransaction(
      responseUploadTransaction?.data,

      {
        onSuccess: (res) => {
          if (res?.success) {
            setShowUploadMHTDialog(null)
            refetchCurrentData()
          } else if (res.overrideId && !res.success) {
            setShowConfirmDialog(res.overrideId)
          }
        },
      },
    )
  }

  const handleSaveCommitAffiliate = () => {
    commitAffiliate(
      {
        data: responseUploadAffiliate?.data?.data,
        metaData: responseUploadAffiliate?.data?.metaData,
      },

      {
        onSuccess: (res) => {
          if (res?.success) {
            setShowUploadMHTDialog(null)
            refetchCurrentData()
          } else if (res.overrideId && !res.success) {
            setShowConfirmDialog(res.overrideId)
          }
        },
      },
    )
  }

  const handleSaveCommitFacilities = () => {
    commitFacilities(
      {
        data: responseUploadFacilities?.data?.data,
        metaData: responseUploadFacilities?.data?.metaData,
      },

      {
        onSuccess: (res) => {
          if (res?.success) {
            setShowUploadMHTDialog(null)
            refetchCurrentData()
          } else if (res.overrideId && !res.success) {
            setShowConfirmDialog(res.overrideId)
          }
        },
      },
    )
  }

  const handleCommit = () => {
    switch (currentTab) {
      case 0:
        handleSaveCommitAnnualCosts()
        break
      case 1:
        handleSaveCommitContractors()
        break
      case 2:
        handleSaveCommitProdLifting()
        break
      case 3:
        handleSaveCommitTransaction()
        break
      case 4:
        handleSaveCommitAffiliate()
        break
      case 5:
        handleSaveCommitFacilities()
        break
      default:
        break
    }
  }

  const subKeyRoute = () => {
    switch (currentTab) {
      case 0:
        return 'costs'
      case 1:
        return 'contracts'
      case 2:
        return 'lifting'
      case 3:
        return 'transaction'
      case 4:
        return 'affiliate'
      case 5:
        return 'facilities'
      default:
        return 'costs'
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
          setActiveTab={(tab) => {
            setCurrentTab(tab)
            // setSelectedRow([])
          }}
          onSelectRows={setSelectedRow}
        />
        <div className="subModule--table-wrapper">
          {!loading ? (
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
              headerTemplate={
                selectedRow?.length === 1 && (
                  <HeaderTemplate
                    title={`${selectedRow?.length} Row Selected`}
                    actions={actionsHeader(
                      'cost-recovery-details',
                      selectedRow[0]?.id,
                      subKeyRoute(),
                      role,
                      setShowSupportedDocumentDialog,
                      () => setShowDeleteDialog(true),
                      selectedRow[0],
                    )}
                  />
                )
              }
            />
          ) : (
            <CircularProgress id={`loading-${currentTab}`} />
          )}
        </div>
      </div>
      {showUploadMHTDialog && (
        <MHTDialog
          headerTemplate={
            showUploadMHTDialog === 'prod-lifting' && (
              <SelectField
                id="prod-lifting"
                menuItems={[
                  { label: 'Actual Lifting', value: 'dataActualLifting' },
                  { label: 'Base Production', value: 'dataBasedProduction' },
                ]}
                block
                position={SelectField.Positions.BELOW}
                value={subSubModule}
                onChange={setSubSubModule}
                simplifiedMenu={false}
              />
            )
          }
          visible={showUploadMHTDialog}
          propsDataTable={dataMht}
          propsConfigs={configsMht()}
          onHide={() => {
            setShowUploadMHTDialog(false)
            // setShowUploadRapportDialog(true)
          }}
          onCommit={() => {
            handleCommit()
            // setShowUploadMHTDialog(false)
            // setShowUploadRapportDialog(true)
            // setShowUploadRapportDialog(false)
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
            renderDialogData(data).onUpload()
          }}
        />
      )}
      {showSupportedDocumentDialog && (
        <SupportedDocument
          title={
            role === 'regulator'
              ? 'Supporting Documents'
              : 'Upload supporting documents'
          }
          readOnly={role === 'regulator'}
          visible={showSupportedDocumentDialog}
          onDiscard={() => setShowSupportedDocumentDialog(false)}
          processInstanceId={
            typeof showSupportedDocumentDialog === 'object'
              ? showSupportedDocumentDialog?.processInstanceId
              : selectedRow[0]?.processInstanceId
          }
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
          message={'Do you confirm override ?'}
          confirmLabel={'Override'}
        />
      )}

      {showDeleteDialog && (
        <ConfirmDialog
          onDiscard={() => setShowDeleteDialog(false)}
          visible={showDeleteDialog}
          handleOverride={handleDelete}
          message={'Do you confirm Delete ?'}
          confirmLabel={'Confirm'}
        />
      )}
    </>
  )
}
export default CostRecovery
