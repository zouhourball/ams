import { navigate } from '@reach/router'
import { Button } from 'react-md'
import Mht from '@target-energysolutions/mht'
import { get } from 'lodash-es'
import { useQuery } from 'react-query'

import TopBarDetail from 'components/top-bar-detail'
import useRole from 'libs/hooks/use-role'
import { getDetailOfDailyProductionById } from 'libs/api/api-production'

import {
  // dailyProductionDetailsData,
  dailyProductionDetailsConfigs,
} from '../helpers'

import './style.scss'

const ProductionDetails = () => {
  const role = useRole('production')
  const currentPath = get(location, 'pathname', '/').split('/').pop()

  const { data: dailyData } = useQuery(
    ['getDetailOfDailyProductionById', currentPath],
    currentPath && getDetailOfDailyProductionById,
    {
      refetchOnWindowFocus: false,
    },
  )

  const tableDataListDailyProduction = (get(dailyData, 'values', []) || []).map(
    (el) => {
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
    },
  )
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
        onClick={() => {}}
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
