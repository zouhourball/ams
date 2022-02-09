import { useMemo, useState } from 'react'
import { navigate } from '@reach/router'
import { Button, SelectField } from 'react-md'
import Mht from '@target-energysolutions/mht'
import { get } from 'lodash-es'
import { useQuery, useMutation } from 'react-query'
import { useDispatch } from 'react-redux'
import moment from 'moment'

import { addToast } from 'modules/app/actions'

import useRole from 'libs/hooks/use-role'
import { downloadOriginalFile } from 'libs/api/supporting-document-api'

import {
  getDetailProductionById,
  updateDailyProduction,
} from 'libs/api/api-production'
import documents from 'libs/hooks/documents'

import TopBarDetail from 'components/top-bar-detail'
import SupportedDocument from 'components/supported-document'
import ToastMsg from 'components/toast-msg'

import {
  dailyProductionDetailsConfigs,
  MonthlyProductionDetailsConfigs,
  MonthlyTrackingDetailsConfigs,
  MonthlyWellCountDetailsConfigs,
  OmanHydrocarbonDetailsConfigs,
} from '../helpers'

import './style.scss'

const ProductionDetails = ({ subModule, productionId }) => {
  const [showSupportedDocumentDialog, setShowSupportedDocumentDialog] =
    useState(false)
  const dispatch = useDispatch()
  const role = useRole('production')
  const [selectFieldValue, setSelectFieldValue] = useState('Monthly Production')

  const { addSupportingDocuments } = documents()

  const { data: productionData, refetch } = useQuery(
    ['getDetailProductionById', subModule, productionId],
    productionId && getDetailProductionById,
  )

  const updateDailyProductionMutation = useMutation(updateDailyProduction, {
    onSuccess: (res) => {
      if (!res.error) {
        navigate(`/ams/production/${subModule}`)
        refetch()
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
  })
  const onAcknowledge = (subModule, objectId, status) => {
    updateDailyProductionMutation.mutate({
      subModule: subModule,
      objectId: objectId,
      status: status,
    })
  }

  const closeDialog = (resp) => {
    resp &&
      resp[0]?.statusCode === 'OK' &&
      setShowSupportedDocumentDialog(false)
  }

  const costsSuppDocs = (data) => {
    addSupportingDocuments(
      data,
      productionData?.metaData?.processInstanceId,
      closeDialog,
    )
  }

  const handleSupportingDocs = (data) => {
    costsSuppDocs(data)
  }

  const detailsData = useMemo(() => {
    switch (subModule) {
      case 'daily':
        return {
          title: 'Daily Production',
          subTitle: 'Block ' + get(productionData, 'metaData.block', ''),
          companyName: get(productionData, 'metaData.company', ''),
          submittedDate: moment(productionData?.metaData?.createdAt).format(
            'DD MMM, YYYY',
          ),
          submittedBy: get(productionData, 'metaData.createdBy.name', ''),
        }
      case 'monthly':
        return {
          title: 'Monthly Report',
          subTitle: 'Block ' + get(productionData, 'metaData.block', ''),
          companyName: get(productionData, 'metaData.company', ''),
          submittedDate: moment(productionData?.metaData?.createdAt).format(
            'DD MMM, YYYY',
          ),
          submittedBy: get(productionData, 'metaData.createdBy.name', ''),
        }
      case 'monthly-tracking':
        return {
          title: 'Daily Report',
          subTitle: 'Block ' + get(productionData, 'metaData.block', ''),
          companyName: get(productionData, 'metaData.company', ''),
          submittedDate: moment(productionData?.metaData?.createdAt).format(
            'DD MMM, YYYY',
          ),
          submittedBy: get(productionData, 'metaData.createdBy.name', ''),
        }
      case 'oman-hydrocarbon':
        return {
          title: 'Oman Hydrocarbon Report',
          subTitle: 'Block ' + get(productionData, 'metaData.block', ''),
          companyName: get(productionData, 'metaData.company', ''),
          submittedDate: moment(productionData?.metaData?.createdAt).format(
            'DD MMM, YYYY',
          ),
          submittedBy: get(productionData, 'metaData.createdBy.name', ''),
        }
      default:
        return null
    }
  })

  const tableDataListDailyProduction = (
    get(productionData, 'values', []) || []
  ).map((el) => {
    return {
      production: [{ item: el?.name }, { uom: el?.unit }],
      dailyField: [
        { actualF: el?.data[0]['DAILY FIELD PRODUCTION VOLS'][0]?.Actual },
        { target: el?.data[0]['DAILY FIELD PRODUCTION VOLS'][1]?.Target },
        { le: el?.data[0]['DAILY FIELD PRODUCTION VOLS'][2]?.LE },
      ],
      scheduled: [
        { actual: el?.data[1]['SCHEDULED DEFERMENT VOLS'][0]?.Actual },
        { actualS: el?.data[1]['SCHEDULED DEFERMENT VOLS'][1]['Actual (%)'] },
        { target: el?.data[1]['SCHEDULED DEFERMENT VOLS'][2]['Target'] },
      ],
      unscheduled: [
        { actual: el?.data[2]['UNSCHEDULED DEFERMENT VOLS'][0]?.Actual },
        { actualS: el?.data[2]['UNSCHEDULED DEFERMENT VOLS'][1]['Actual (%)'] },
        { target: el?.data[2]['UNSCHEDULED DEFERMENT VOLS'][2]['Target'] },
      ],
      majorProduction: el?.data[3]['MAJOR PRODUCTION HIGHLIGHTS/LOWLIGHTS'],
    }
  })

  const monthlyData = [
    {
      oilProd: [
        {
          actual: (get(productionData, 'production.data', []) || [])[0]
            ?.value[0]?.Actual,
        },
        {
          target: (get(productionData, 'production.data', []) || [])[0]
            ?.value[1]?.Target,
        },
      ],
      condensateProd: [
        {
          actual: (get(productionData, 'production.data', []) || [])[1]
            ?.value[0]?.Actual,
        },
        {
          target: (get(productionData, 'production.data', []) || [])[1]
            ?.value[1]?.Target,
        },
      ],
      nagProd: [
        {
          actual: (get(productionData, 'production.data', []) || [])[2]
            ?.value[0]?.Actual,
        },
        {
          target: (get(productionData, 'production.data', []) || [])[2]
            ?.value[1]?.Target,
        },
      ],
      agProd: [
        {
          actual: (get(productionData, 'production.data', []) || [])[3]
            ?.value[0]?.Actual,
        },
        {
          target: (get(productionData, 'production.data', []) || [])[3]
            ?.value[1]?.Target,
        },
      ],
      waterProd: [
        {
          actual: (get(productionData, 'production.data', []) || [])[4]
            ?.value[0]?.Actual,
        },
        {
          target: (get(productionData, 'production.data', []) || [])[4]
            ?.value[1]?.Target,
        },
      ],
      waterInj: [
        {
          actual: (get(productionData, 'production.data', []) || [])[5]
            ?.value[0]?.Actual,
        },
        {
          target: (get(productionData, 'production.data', []) || [])[5]
            ?.value[1]?.Target,
        },
      ],
      waterDisposal: [
        {
          actual: (get(productionData, 'production.data', []) || [])[6]
            ?.value[0]?.Actual,
        },
        {
          target: (get(productionData, 'production.data', []) || [])[6]
            ?.value[1]?.Target,
        },
      ],
      flareGasRate: [
        {
          actual: (get(productionData, 'production.data', []) || [])[7]
            ?.value[0]?.Actual,
        },
        {
          target: (get(productionData, 'production.data', []) || [])[7]
            ?.value[1]?.Target,
        },
      ],
    },
  ]
  const monthlyDataWellCount = [
    {
      oilProducer: [
        {
          total: (get(productionData, 'wellCount.data', []) || [])[0]?.value[0]
            ?.Total,
        },
        {
          closedIn: (get(productionData, 'wellCount.data', []) || [])[0]
            ?.value[1]['Closed-In'],
        },
      ],
      gasProducer: [
        {
          total: (get(productionData, 'wellCount.data', []) || [])[1]?.value[0]
            ?.Total,
        },
        {
          closedIn: (get(productionData, 'wellCount.data', []) || [])[1]
            ?.value[1]['Closed-In'],
        },
      ],
      waterInjector: [
        {
          total: (get(productionData, 'wellCount.data', []) || [])[2]?.value[0]
            ?.Total,
        },
        {
          closedIn: (get(productionData, 'wellCount.data', []) || [])[2]
            ?.value[1]['Closed-In'],
        },
      ],
      steamInjector: [
        {
          total: (get(productionData, 'wellCount.data', []) || [])[3]?.value[0]
            ?.Total,
        },
        {
          closedIn: (get(productionData, 'wellCount.data', []) || [])[3]
            ?.value[1]['Closed-In'],
        },
      ],
      waterSupplier: [
        {
          total: (get(productionData, 'wellCount.data', []) || [])[4]?.value[0]
            ?.Total,
        },
        {
          closedIn: (get(productionData, 'wellCount.data', []) || [])[4]
            ?.value[1]['Target'],
        },
      ],
      waterDisposal: [
        {
          total: (get(productionData, 'wellCount.data', []) || [])[5]?.value[0]
            ?.Actual,
        },
        {
          closedIn: (get(productionData, 'wellCount.data', []) || [])[5]
            ?.value[1]['Target'],
        },
      ],
      others: [
        {
          total: (get(productionData, 'wellCount.data', []) || [])[6]?.value[0]
            ?.Actual,
        },
        {
          closedIn: (get(productionData, 'wellCount.data', []) || [])[6]
            ?.value[1]['Target'],
        },
      ],
    },
  ]

  const monthlyTrackingData = (get(productionData, 'data', []) || []).map(
    (el) => {
      return {
        destination: el?.destination,
        volume: el?.volume,
      }
    },
  )
  const valueEntries = (body) => {
    let values = {}
    for (let i = 0; i < body?.length; i++) {
      values = { ...values, ['year' + i]: body[i]?.value || 0 }
    }
    return values
  }
  let numKeys =
    subModule === 'oman-hydrocarbon'
      ? {
        firstYear: get(productionData, 'data', [])[0]?.yvalues[0]?.year,
        duration: get(productionData, 'data', [])[0]?.yvalues?.length,
      }
      : {}
  const omanHydrocarbonData = (get(productionData, 'data', []) || []).map(
    (el) => {
      return {
        compAndBlock: `${el?.company} - ${el?.block} (${el?.unit})`,

        ...valueEntries(el?.yvalues),
      }
    },
  )
  const renderDetailsDataBySubModule = () => {
    switch (subModule) {
      case 'daily':
        return tableDataListDailyProduction
      case 'monthly':
        return selectFieldValue === 'Monthly Production'
          ? monthlyData
          : monthlyDataWellCount
      case 'monthly-tracking':
        return monthlyTrackingData
      case 'oman-hydrocarbon':
        return omanHydrocarbonData
      default:
        return null
    }
  }

  const renderCurrentTabDetailsConfigs = () => {
    switch (subModule) {
      case 'daily':
        return dailyProductionDetailsConfigs()
      case 'monthly':
        return selectFieldValue === 'Monthly Production'
          ? MonthlyProductionDetailsConfigs()
          : MonthlyWellCountDetailsConfigs()
      case 'monthly-tracking':
        return MonthlyTrackingDetailsConfigs()
      case 'oman-hydrocarbon':
        return OmanHydrocarbonDetailsConfigs(numKeys)
      default:
        return dailyProductionDetailsConfigs()
    }
  }

  const actions = [
    <Button
      key="1"
      id="viewDoc"
      className="top-bar-buttons-list-item-btn view-doc"
      flat
      swapTheming
      onClick={() => {
        setShowSupportedDocumentDialog(true)
      }}
    >
      View documents
    </Button>,
    <Button
      key="2"
      id="edit"
      className="top-bar-buttons-list-item-btn"
      flat
      primary
      swapTheming
      onClick={() => {
        downloadOriginalFile(
          productionData?.metaData?.originalFileId,
          productionData?.metaData?.originalFileName,
        )
      }}
    >
      Download Original File
    </Button>,
    role === 'operator' && productionData?.metaData?.status === 'DRAFT' && (
      <Button
        key="4"
        id="acknowledge"
        className="top-bar-buttons-list-item-btn"
        flat
        primary
        swapTheming
        onClick={() => {
          onAcknowledge(subModule, productionId, 'SUBMITTED')
        }}
      >
        Commit
      </Button>
    ),
    role === 'regulator' &&
      get(productionData, 'metaData.status', '') === 'SUBMITTED' && (
        <>
          <Button
            key="4"
            id="accept"
            className="top-bar-buttons-list-item-btn"
            flat
            primary
            swapTheming
            onClick={() => {
              onAcknowledge(subModule, productionId, 'ACKNOWLEDGED')
            }}
          >
            Acknowledge
          </Button>
        </>
    ),
  ]
  return (
    <div className="production-details">
      <TopBarDetail
        onClickBack={() => navigate(`/ams/production/${subModule}`)}
        actions={actions}
        detailData={detailsData}
      />
      {subModule === 'monthly-tracking' && (
        <div className="average-delivery">
          <div className="average-delivery-label">
            AVERAGE DELIVERY TO ORPIC(BBLS/D):
          </div>
          <div>{productionData?.totalGDTORPIC || 'n/a'}</div>
        </div>
      )}

      <Mht
        configs={renderCurrentTabDetailsConfigs()}
        tableData={renderDetailsDataBySubModule()}
        withSearch
        commonActions
        withSubColumns
        hideTotal={false}
        withFooter
        headerTemplate={
          subModule === 'monthly' ? (
            <SelectField
              id="monthly-prod"
              menuItems={['Monthly Production', 'Monthly Well Counts']}
              block
              position={SelectField.Positions.BELOW}
              value={selectFieldValue}
              onChange={setSelectFieldValue}
              simplifiedMenu={false}
            />
          ) : (
            ''
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
            productionData?.metaData?.processInstanceId ||
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
export default ProductionDetails
