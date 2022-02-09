import { navigate } from '@reach/router'
import { Button, SelectField } from 'react-md'
import Mht from '@target-energysolutions/mht'
import { useQuery, useMutation } from 'react-query'
import { useMemo, useState } from 'react'
import moment from 'moment'
import { useDispatch } from 'react-redux'
import { addToast } from 'modules/app/actions'

import {
  updateCostsCost,
  updateContractsCost,
  updateProdLiftingCost,
  updateTransactionCost,
  updateAffiliateCost,
  updateFacilitiesCost,
  detailReport,
} from 'libs/api/cost-recovery-api'

import TopBarDetail from 'components/top-bar-detail'
import SupportedDocument from 'components/supported-document'
import ToastMsg from 'components/toast-msg'

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
  const dispatch = useDispatch()

  const subModule = pathname?.split('/')[4]
  const resFn = {
    onSuccess: (res) => {
      if (!res.error) {
        navigate(`/ams/costrecovery/${subModule}`)
        dispatch(
          addToast(
            <ToastMsg text={res.message || 'success'} type="success" />,
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
  }
  const { mutate: acknowledgeAnnualCostsExp } = useMutation(updateCostsCost, {
    ...resFn,
  })
  const { mutate: acknowledgeContracts } = useMutation(updateContractsCost, {
    ...resFn,
  })
  const { mutate: acknowledgeProdLifting } = useMutation(
    updateProdLiftingCost,
    {
      ...resFn,
    },
  )
  const { mutate: acknowledgeTransaction } = useMutation(
    updateTransactionCost,
    {
      ...resFn,
    },
  )
  const { mutate: acknowledgeAffiliateCost } = useMutation(
    updateAffiliateCost,
    {
      ...resFn,
    },
  )
  const { mutate: acknowledgeFacilitiesCost } = useMutation(
    updateFacilitiesCost,
    {
      ...resFn,
    },
  )

  const role = useRole('costrecovery')

  const { addSupportingDocuments } = documents()
  const { data: reportDetail } = useQuery([subModule, detailId], detailReport, {
    refetchOnWindowFocus: false,
  })

  const closeDialog = (resp) => {
    resp &&
      resp[0]?.statusCode === 'OK' &&
      setShowSupportedDocumentDialog(false)
  }

  const costsSuppDocs = (data) => {
    return addSupportingDocuments(
      data,
      reportDetail?.metaData?.processInstanceId,
      closeDialog,
    )
  }

  const handleSupportingDocs = (data) => {
    costsSuppDocs(data)
  }

  const fileDetail = () => {
    return {
      originalFileId: reportDetail?.metaData?.originalFileId,
      originalFileName: reportDetail?.metaData?.originalFileName,
    }
  }
  const costRecoveryDetailsData = useMemo(() => {
    switch (subModule) {
      case 'costs':
        return (
          reportDetail?.items?.map((el) => ({
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
        return reportDetail?.data || []
      case 'prodLifting':
        return (
          (reportDetail &&
            reportDetail[subSubModule]?.map((el) => ({
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
          reportDetail?.data?.map((el) => ({
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
          reportDetail?.data?.map((el) => ({
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
        return reportDetail?.data || []
      default:
        return []
    }
  }, [subModule, subSubModule, reportDetail])

  const detailData = useMemo(() => {
    const data = {
      subTitle: reportDetail?.metaData?.block,
      companyName: reportDetail?.metaData?.company,
      submittedDate: moment(reportDetail?.metaData?.createdAt).format(
        'DD MMM, YYYY',
      ),
      submittedBy: reportDetail?.metaData?.createdBy?.name,
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
      case 'prodLifting':
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
  }, [subModule, reportDetail])

  const handleAcknowledge = (status) => {
    switch (subModule) {
      case 'costs':
        acknowledgeAnnualCostsExp({
          objectId: detailId,
          status,
        })
        break
      case 'contracts':
        acknowledgeContracts({
          objectId: detailId,
          status,
        })
        break
      case 'prodLifting':
        acknowledgeProdLifting({
          objectId: detailId,
          status,
        })
        break
      case 'transaction':
        acknowledgeTransaction({
          objectId: detailId,
          status,
        })
        break
      case 'affiliate':
        acknowledgeAffiliateCost({
          objectId: detailId,
          status,
        })
        break
      case 'facilities':
        acknowledgeFacilitiesCost({
          objectId: detailId,
          status,
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
    role === 'regulator' && reportDetail?.metaData?.status === 'SUBMITTED' && (
      <>
        <Button
          key="4"
          id="accept"
          className="top-bar-buttons-list-item-btn"
          flat
          primary
          swapTheming
          onClick={() => {
            handleAcknowledge('ACKNOWLEDGED')
          }}
        >
          Acknowledge
        </Button>
      </>
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
              label: reportDetail?.metaData?.year,
            },
        )
      case 'contracts':
        return configsContractsDialogMht()
      case 'prodLifting':
        return configsLiftingCostsDialogMht(subSubModule)
      case 'transaction':
        return transactionConfig()
      case 'affiliate':
        return affiliateConfig()
      case 'facilities':
        return (
          (Object.entries(reportDetail?.data[0] || {}) || [])?.map((el) => ({
            label: el[0],
            key: el[0],
            width: '200',
            icon: 'mdi mdi-spellcheck',
          })) || []
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
          subModule === 'prodLifting' && (
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
            reportDetail?.metaData?.processInstanceId ||
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
