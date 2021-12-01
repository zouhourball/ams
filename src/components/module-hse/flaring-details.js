import { Button } from 'react-md'
import { navigate } from '@reach/router'
import Mht from '@target-energysolutions/mht'
import { get } from 'lodash-es'
import { useMutation, useQuery } from 'react-query'
import { useDispatch } from 'react-redux'

import TopBarDetail from 'components/top-bar-detail'
import ToastMsg from 'components/toast-msg'

import { updateFlaring, getDetailFlaringById } from 'libs/api/api-flaring'
import useRole from 'libs/hooks/use-role'

import { addToast } from 'modules/app/actions'

import {
  flaringDetailsAnnualConfigs,
  flaringDetailsDailyConfigs,
  flaringDetailsMonthlyConfigs,
} from './helpers'

const FlaringDetails = () => {
  const dispatch = useDispatch()

  const role = useRole('flaring')

  const subModule = get(location, 'pathname', '/').split('/').reverse()[0]
  const objectId = get(location, 'pathname', '/').split('/').reverse()[1]

  const { data: flaringData } = useQuery(
    ['getDetailFlaringById', subModule, objectId],
    objectId && getDetailFlaringById,
    {
      refetchOnWindowFocus: false,
    },
  )
  const updateFlaringMutation = useMutation(updateFlaring, {
    onSuccess: (res) => {
      if (!res.error) {
        navigate('/ams/hse/flaring')
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
    updateFlaringMutation.mutate({
      subModule: subModule,
      objectId: objectId,
      status: status,
    })
  }

  const renderDetailsDataBySubModule = () => {
    switch (subModule) {
      case 'annual-forecast':
        return (get(flaringData, 'data', []) || []).map((el) => {
          return {
            gaz_type: el?.name,
            unit: el?.unit,
            year2017: el?.values[0]?.value,
            year2018: el?.values[1]?.value,
            year2019: el?.values[2]?.value,
            year2020: el?.values[3]?.value,
            year2021: el?.values[4]?.value,
            year2022: el?.values[5]?.value,
            year2023: el?.values[6]?.value,
            year2024: el?.values[7]?.value,
            year2025: el?.values[8]?.value,
            year2026: el?.values[9]?.value,
          }
        })
      case 'monthly-station':
        return (get(flaringData, 'data', []) || []).map((el) => {
          return {
            flareStation: el?.flareStation,
            latitudeNorthing: el?.latitudeNorthing?.value,
            longitudeEasting: el?.longitudeEasting?.value,
            totalFlaringActuals: el?.totalFlaringActuals?.value,
            routineFlaringActuals: el?.routineFlaringActuals?.value,
            nonRoutineFlaringActuals: el?.nonRoutineFlaringActuals?.value,
            rotuineFlaringPlanned: el?.rotuineFlaringPlanned?.value,
            nonRotuineFlaringPlanned: el?.nonRotuineFlaringPlanned?.value,
            comment: el?.comment,
          }
        })
      case 'daily':
        return (get(flaringData, 'data', []) || []).map((el) => {
          return {
            flareStation: el?.flareStation,
            latitudeNorthing: el?.latitudeNorthing,
            longitudeEasting: el?.longitudeEasting,
            flareAmountTotal: el?.flareAmountTotal?.value,
            routineFlaringAmount: el?.routineFlaringAmount?.value,
            nonroutineFlaringAmount: el?.nonroutineFlaringAmount?.value,
            comment: el?.comment,
          }
        })
      default:
        return null
    }
  }

  const renderDetailsConfigsBySubModule = () => {
    switch (subModule) {
      case 'annual-forecast':
        return flaringDetailsAnnualConfigs
      case 'monthly-station':
        return flaringDetailsMonthlyConfigs
      case 'daily':
        return flaringDetailsDailyConfigs
      default:
        return null
    }
  }

  // ---------------
  const actions = [
    <Button
      key="1"
      id="save"
      className="top-bar-detail-buttons-list-item-btn"
      flat
      primary
      swapTheming
      onClick={() => {}}
    >
      Download Annual Plan
    </Button>,
    <Button
      key="2"
      id="save"
      className="top-bar-detail-buttons-list-item-btn"
      flat
      primary
      swapTheming
      onClick={() => {}}
    >
      View Documents
    </Button>,
    <Button
      key="3"
      id="save"
      className="top-bar-detail-buttons-list-item-btn"
      flat
      primary
      swapTheming
      onClick={() => {}}
    >
      Download Original File
    </Button>,
    role === 'regulator' &&
      get(flaringData, 'metaData.status', '') !== 'ACKNOWLEDGED' && (
      <Button
        key="4"
        id="acknowledge"
        className="top-bar-detail-buttons-list-item-btn"
        flat
        primary
        swapTheming
        onClick={() => {
          onAcknowledge(subModule, objectId, 'ACKNOWLEDGED')
        }}
      >
          Acknowledge
      </Button>
    ),
  ]
  return (
    <div className="details-container">
      <TopBarDetail
        onClickBack={() => navigate('/ams/hse/flaring')}
        actions={actions}
      />
      <Mht
        configs={renderDetailsConfigsBySubModule()}
        tableData={renderDetailsDataBySubModule()}
        withSearch
        commonActions
        hideTotal={false}
        withFooter
      />
    </div>
  )
}

export default FlaringDetails
