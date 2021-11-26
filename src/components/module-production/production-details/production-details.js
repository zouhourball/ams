import { navigate } from '@reach/router'
import { Button } from 'react-md'
import Mht from '@target-energysolutions/mht'
import { get } from 'lodash-es'
import { useQuery, useMutation } from 'react-query'
import { useDispatch } from 'react-redux'

import { addToast } from 'modules/app/actions'

import useRole from 'libs/hooks/use-role'
import {
  getDetailProductionById,
  updateDailyProduction,
} from 'libs/api/api-production'

import TopBarDetail from 'components/top-bar-detail'
import ToastMsg from 'components/toast-msg'

import { dailyProductionDetailsConfigs } from '../helpers'

import './style.scss'

const ProductionDetails = () => {
  const dispatch = useDispatch()
  const role = useRole('production')
  const prodId = get(location, 'pathname', '/').split('/').reverse()[0]
  const subModule = get(location, 'pathname', '/').split('/').reverse()[1]

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
        navigate('/ams/production')
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
  // --------------
  const onAcknowledge = (subModule, objectId, status) => {
    updateDailyProductionMutation.mutate({
      subModule: subModule,
      objectId: objectId,
      status: status,
    })
  }
  // ---------------
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

  // const tableDataListMonthlyProduction = [{
  //   oilProd: [{ actual: (get(currentUpload, 'production.data', []) || [])[0]?.value[0]?.Actual }, { target: (get(currentUpload, 'production.data', []) || [])[0]?.value[1]?.Target }],
  //   condensateProd: [{ actual: (get(currentUpload, 'production.data', []) || [])[1]?.value[0]?.Actual }, { target: (get(currentUpload, 'production.data', []) || [])[1]?.value[1]?.Target }],
  //   nagProd: [{ actual: (get(currentUpload, 'production.data', []) || [])[2]?.value[0]?.Actual }, { target: (get(currentUpload, 'production.data', []) || [])[2]?.value[1]?.Target }],
  //   agProd: [{ actual: (get(currentUpload, 'production.data', []) || [])[3]?.value[0]?.Actual }, { target: (get(currentUpload, 'production.data', []) || [])[3]?.value[1]?.Target }],
  //   waterProd: [{ actual: (get(currentUpload, 'production.data', []) || [])[4]?.value[0]?.Actual }, { target: (get(currentUpload, 'production.data', []) || [])[4]?.value[1]?.Target }],
  //   waterInj: [{ actual: (get(currentUpload, 'production.data', []) || [])[5]?.value[0]?.Actual }, { target: (get(currentUpload, 'production.data', []) || [])[5]?.value[1]?.Target }],
  //   waterDisposal: [{ actual: (get(currentUpload, 'production.data', []) || [])[6]?.value[0]?.Actual }, { target: (get(currentUpload, 'production.data', []) || [])[6]?.value[1]?.Target }],
  //   flareGasRate: [{ actual: (get(currentUpload, 'production.data', []) || [])[7]?.value[0]?.Actual }, { target: (get(currentUpload, 'production.data', []) || [])[7]?.value[1]?.Target }],

  // }]
  const actions = [
    <Button
      key="1"
      id="viewDoc"
      className="top-bar-buttons-list-item-btn view-doc"
      flat
      swapTheming
      onClick={() => {}}
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
        // navigate(`/ams/production/production-detail`)
      }}
    >
      Download Original File
    </Button>,
    role === 'regulator' && (
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
        onClickBack={() => navigate('/ams/production')}
        actions={actions}
      />
      <Mht
        configs={dailyProductionDetailsConfigs()}
        tableData={tableDataListDailyProduction}
        withSearch
        commonActions
        withSubColumns
        hideTotal={false}
        withFooter
      />
    </div>
  )
}
export default ProductionDetails
