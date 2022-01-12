import { navigate } from '@reach/router'
import { Button, SelectField } from 'react-md'
import Mht from '@target-energysolutions/mht'
import { useQuery, useMutation } from 'react-query'
import { useMemo, useState } from 'react'
import moment from 'moment'

import {
  detailCostsCostByLoggedUser,
  updateCostsCost,
  detailContractsCostByLoggedUser,
  updateContractsCost,
  detailProdLiftingCostByLoggedUser,
  updateProdLiftingCost,
  detailTransactionCostByLoggedUser,
  updateTransactionCost,
  detailAffiliateCostByLoggedUser,
  updateAffiliateCost,
  detailFacilitiesCostByLoggedUser,
  updateFacilitiesCost,
} from 'libs/api/cost-recovery-api'

import TopBarDetail from 'components/top-bar-detail'
import SupportedDocument from 'components/supported-document'
import useRole from 'libs/hooks/use-role'
import documents from 'libs/hooks/documents'
import { downloadOriginalFile } from 'libs/api/supporting-document-api'

import { costRecoveryDetailsConfigs } from '../helpers'
import {
  configsLiftingCostsDialogMht,
  transactionConfig,
  affiliateConfig,
  configsContractsDialogMht,
  // facilitiesConfig,
} from '../mht-helper-dialog'

import './style.scss'

const CostRecoveryDetails = ({ location: { pathname }, detailId, subkey }) => {
  const [subSubModule, setSubSubModule] = useState('dataActualLifting')
  const [showSupportedDocumentDialog, setShowSupportedDocumentDialog] =
    useState(false)

  const subModule = pathname?.split('/')[4]
  const { mutate: acknowledgeAnnualCostsExp } = useMutation(updateCostsCost)
  const { mutate: acknowledgeContracts } = useMutation(updateContractsCost)
  const { mutate: acknowledgeProdLifting } = useMutation(updateProdLiftingCost)
  const { mutate: acknowledgeTransaction } = useMutation(updateTransactionCost)
  const { mutate: acknowledgeAffiliateCost } = useMutation(updateAffiliateCost)
  const { mutate: acknowledgeFacilitiesCost } =
    useMutation(updateFacilitiesCost)

  const role = useRole('costrecovery')
  const { addSupportingDocuments } = documents()

  const { data: costsDetail } = useQuery(
    ['detailCostsCostByLoggedUser', detailId],
    subModule === 'costs' && detailCostsCostByLoggedUser,
    {
      refetchOnWindowFocus: false,
    },
  )

  const { data: facilitiesDetail } = useQuery(
    ['detailFacilitiesCostByLoggedUser', detailId],
    subModule === 'facilities' && detailFacilitiesCostByLoggedUser,
    {
      refetchOnWindowFocus: false,
    },
  )

  const { data: affiliateDetail } = useQuery(
    ['detailAffiliateCostByLoggedUser', detailId],
    subModule === 'affiliate' && detailAffiliateCostByLoggedUser,
    {
      refetchOnWindowFocus: false,
    },
  )

  const { data: transactionDetail } = useQuery(
    ['detailTransactionCostByLoggedUser', detailId],
    subModule === 'transaction' && detailTransactionCostByLoggedUser,
    {
      refetchOnWindowFocus: false,
    },
  )

  const { data: prodLiftingDetail } = useQuery(
    ['detailProdLiftingCostByLoggedUser', detailId],
    subModule === 'lifting' && detailProdLiftingCostByLoggedUser,
    {
      refetchOnWindowFocus: false,
    },
  )

  const { data: contractDetail } = useQuery(
    ['detailContractsCostByLoggedUser', detailId],
    subModule === 'contracts' && detailContractsCostByLoggedUser,
    {
      refetchOnWindowFocus: false,
    },
  )

  const closeDialog = (resp) => {
    resp &&
      resp[0]?.statusCode === 'OK' &&
      setShowSupportedDocumentDialog(false)
  }

  const costsSuppDocs = (data) => {
    return addSupportingDocuments(
      data,
      getDetailsKey()?.metaData?.processInstanceId,
      closeDialog,
    )
  }

  const handleSupportingDocs = (data) => {
    costsSuppDocs(data)
  }
  const getDetailsKey = () => {
    switch (subModule) {
      case 'costs':
        return costsDetail
      case 'contracts':
        return contractDetail
      case 'lifting':
        return prodLiftingDetail
      case 'transaction':
        return transactionDetail
      case 'affiliate':
        return affiliateDetail
      case 'facilities':
        return facilitiesDetail
      default:
        break
    }
  }
  const fileDetail = () => {
    return {
      originalFileId: getDetailsKey()?.metaData?.originalFileId,
      originalFileName: getDetailsKey()?.metaData?.originalFileName,
    }
  }
  const costRecoveryDetailsData = useMemo(() => {
    switch (subModule) {
      case 'costs':
        return (
          costsDetail?.items?.map((el) => ({
            category: el?.category,
            subCategory: el?.subCategory,
            uom: el?.uom,
            group: el?.group,
            item: el?.name,
            costDescription: el?.explanation,
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
      case 'contracts':
        return contractDetail?.data || []
      case 'lifting':
        return (
          (prodLiftingDetail &&
            prodLiftingDetail[subSubModule]?.map((el) => ({
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
      case 'transaction':
        return (
          transactionDetail?.data?.map((el) => ({
            block: el?.block,
            transactionDate: el?.transactionDate,
            transactionReference: el?.transactionReference,
            transactionDescription: el?.transactionDescription,
            transactionExpElement: el?.transactionExpenditure,
            transactionExpDescription: el?.transactionExpenditureDesc,
            project: el?.project,
          })) || []
        )
      case 'affiliate':
        return (
          affiliateDetail?.data?.map((el) => ({
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
      case 'facilities':
        return facilitiesDetail?.data || []
      default:
        return []
    }
  }, [
    costsDetail,
    subModule,
    contractDetail,
    prodLiftingDetail,
    subSubModule,
    transactionDetail,
    affiliateDetail,
    facilitiesDetail,
  ])

  const detailData = useMemo(() => {
    const data = {
      subTitle: getDetailsKey()?.metaData?.block,
      companyName: getDetailsKey()?.metaData?.company,
      submittedDate: moment(getDetailsKey()?.metaData?.createdAt).format(
        'DD MMM, YYYY',
      ),
      submittedBy: getDetailsKey()?.metaData?.createdBy?.name,
    }
    switch (subModule) {
      case 'costs':
        return {
          title: 'Annual Cost and Expenditure',
          ...data,
        }
      case 'contracts':
        return {
          title: 'Contracts Reporting',
          ...data,
        }
      case 'lifting':
        return {
          title: 'Production Lifting',
          ...data,
        }
      case 'transaction':
        return {
          title: 'Transaction Report',
          ...data,
        }
      case 'affiliate':
        return {
          title: 'Affiliate',
          ...data,
        }
      case 'facilities':
        return {
          title: 'Facilities',
          ...data,
        }
      default:
        return {}
    }
  }, [
    costsDetail,
    subModule,
    contractDetail,
    prodLiftingDetail,
    transactionDetail,
    affiliateDetail,
    facilitiesDetail,
  ])

  const handleAcknowledge = () => {
    switch (subModule) {
      case 'costs':
        acknowledgeAnnualCostsExp({
          objectId: detailId,
          status: 'ACKNOWLEDGED',
        })
        break
      case 'contracts':
        acknowledgeContracts({
          objectId: detailId,
          status: 'ACKNOWLEDGED',
        })
        break
      case 'lifting':
        acknowledgeProdLifting({
          objectId: detailId,
          status: 'ACKNOWLEDGED',
        })
        break
      case 'transaction':
        acknowledgeTransaction({
          objectId: detailId,
          status: 'ACKNOWLEDGED',
        })
        break
      case 'affiliate':
        acknowledgeAffiliateCost({
          objectId: detailId,
          status: 'ACKNOWLEDGED',
        })
        break
      case 'facilities':
        acknowledgeFacilitiesCost({
          objectId: detailId,
          status: 'ACKNOWLEDGED',
        })
        break
      default:
        break
    }
  }

  const actions = [
    <Button
      key="1"
      id="viewDoc"
      className="top-bar-buttons-list-item-btn view-doc"
      flat
      swapTheming
      onClick={() => setShowSupportedDocumentDialog(true)}
    >
      View documents
    </Button>,
    <Button
      key="2"
      id="edit"
      className="top-bar-buttons-list-item-btn view-doc"
      flat
      primary
      onClick={() => {
        downloadOriginalFile(
          fileDetail()?.originalFileId,
          fileDetail()?.originalFileName,
        )
      }}
    >
      Download Original File
    </Button>,
    role === 'regulator' && (
      <Button
        key="4"
        id="acknowledge"
        className="top-bar-buttons-list-item-btn view-doc"
        flat
        primary
        onClick={() => {
          handleAcknowledge()
        }}
      >
        Acknowledge
      </Button>
    ),
  ]

  const configs = () => {
    switch (subModule) {
      case 'costs':
        return (costRecoveryDetailsConfigs || [])?.map((el) =>
          el.key !== 'year'
            ? el
            : {
              ...el,
              label: costsDetail?.metaData?.year,
            },
        )
      case 'contracts':
        return configsContractsDialogMht()
      case 'lifting':
        return configsLiftingCostsDialogMht()
      case 'transaction':
        return transactionConfig()
      case 'affiliate':
        return affiliateConfig()
      case 'facilities':
        return (
          (Object.entries(facilitiesDetail?.data[0] || {}) || [])?.map(
            (el) => ({
              label: el[0],
              key: el[0],
              width: '200',
              icon: 'mdi mdi-spellcheck',
            }),
          ) || []
        )
      default:
        return []
    }
  }

  return (
    <div className="cost-recovery-details">
      <TopBarDetail
        title={'Annual Cost and Expenditure'}
        onClickBack={() => navigate(`/ams/costrecovery/${subkey}`)}
        actions={actions}
        detailData={detailData}
      />
      <Mht
        configs={configs()}
        tableData={costRecoveryDetailsData}
        withSearch
        commonActions
        withSubColumns
        hideTotal={false}
        withFooter
        headerTemplate={
          subModule === 'lifting' && (
            <SelectField
              id="prod-lifting"
              menuItems={[
                {
                  label: 'Base Production',
                  value: 'dataBasedProduction',
                },
                {
                  label: 'Actual Lifting',
                  value: 'dataActualLifting',
                },
              ]}
              block
              position={SelectField.Positions.BELOW}
              value={subSubModule}
              onChange={setSubSubModule}
              simplifiedMenu={false}
            />
          )
        }
      />
      {showSupportedDocumentDialog && (
        <SupportedDocument
          title={'upload supporting documents'}
          visible={showSupportedDocumentDialog}
          onDiscard={() => setShowSupportedDocumentDialog(false)}
          readOnly={role === 'regulator'}
          processInstanceId={
            getDetailsKey()?.metaData?.processInstanceId ||
            showSupportedDocumentDialog?.processInstanceId
          }
          onSaveUpload={(data) => {
            handleSupportingDocs(data)
          }}
        />
      )}
    </div>
  )
}
export default CostRecoveryDetails
