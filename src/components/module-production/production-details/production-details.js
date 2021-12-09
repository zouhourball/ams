import { useMemo, useState } from 'react'
import { navigate } from '@reach/router'
import { Button } from 'react-md'
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

import TopBarDetail from 'components/top-bar-detail'
import SupportedDocument from 'components/supported-document'
import ToastMsg from 'components/toast-msg'

import {
  dailyProductionDetailsConfigs,
  MonthlyProductionDetailsConfigs,
  MonthlyTrackingDetailsConfigs,
  MonthlyWellCountDetailsConfigs,
} from '../helpers'

import './style.scss'

const ProductionDetails = () => {
  const [showSupportedDocumentDialog, setShowSupportedDocumentDialog] =
    useState(false)
  const dispatch = useDispatch()
  const role = useRole('production')

  const subModule = get(location, 'pathname', '/').split('/').reverse()[0]
  const subSubModule =
    subModule === 'monthly'
      ? get(location, 'pathname', '/').split('/').reverse()[1]
      : ''
  const prodId =
    subModule === 'monthly'
      ? get(location, 'pathname', '/').split('/').reverse()[2]
      : get(location, 'pathname', '/').split('/').reverse()[1]

  const { data: productionData } = useQuery(
    ['getDetailProductionById', subModule, prodId],
    prodId && getDetailProductionById,
    {
      refetchOnWindowFocus: false,
    },
  )

  const updateDailyProductionMutation = useMutation(updateDailyProduction, {
    onSuccess: (res) => {
      if (!res.error) {
        navigate(`/ams/production/${subModule}`)
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

  const detailsData = useMemo(() => {
    switch (subModule) {
      case 'daily':
        return {
          title: 'Annual Report',
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
      case 'Oman Hydrocarbon':
        return null
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
      ],
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

  const renderDetailsDataBySubModule = () => {
    switch (subModule) {
      case 'daily':
        return tableDataListDailyProduction
      case 'monthly':
        return subSubModule === 'production'
          ? monthlyData
          : monthlyDataWellCount
      case 'monthly-tracking':
        return monthlyTrackingData
      case 'Oman Hydrocarbon':
        return null
      default:
        return null
    }
  }

  const renderCurrentTabDetailsConfigs = () => {
    switch (subModule) {
      case 'daily':
        return dailyProductionDetailsConfigs()
      case 'monthly':
        return subSubModule === 'production'
          ? MonthlyProductionDetailsConfigs()
          : MonthlyWellCountDetailsConfigs()
      case 'monthly-tracking':
        return MonthlyTrackingDetailsConfigs()
      case 'Oman Hydrocarbon':
        return MonthlyProductionDetailsConfigs()
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
          `template_production_${subModule}`,
        )
      }}
    >
      Download Original File
    </Button>,
    role === 'regulator' &&
      get(productionData, 'metaData.status', '') !== 'ACKNOWLEDGED' && (
      <Button
        key="3"
        id="acknowledge"
        className="top-bar-buttons-list-item-btn"
        flat
        primary
        swapTheming
        onClick={() => {
          onAcknowledge(subModule, prodId, 'ACKNOWLEDGED')
        }}
      >
          Acknowledge
      </Button>
    ),
  ]
  return (
    <div className="details-container">
      <TopBarDetail
        onClickBack={() => navigate(`/ams/production/${subModule}`)}
        actions={actions}
        detailData={detailsData}
      />
      <Mht
        configs={renderCurrentTabDetailsConfigs()}
        tableData={renderDetailsDataBySubModule()}
        withSearch
        commonActions
        withSubColumns
        hideTotal={false}
        withFooter
      />
      {showSupportedDocumentDialog && (
        <SupportedDocument
          title={'upload supporting documents'}
          visible={showSupportedDocumentDialog}
          onDiscard={() => setShowSupportedDocumentDialog(false)}
          readOnly
          processInstanceId={
            productionData?.metaData?.processInstanceId ||
            showSupportedDocumentDialog?.processInstanceId
          }
          // onSaveUpload={(data) => {
          //   handleSupportingDocs(data)
          // }
          // }
        />
      )}
    </div>
  )
}
export default ProductionDetails
