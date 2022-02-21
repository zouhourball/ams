import { createAnalytics } from 'components/analytics'
import createFilter from 'components/analytics/filter'
import ChartsPage from './charts-page'
import {
  getProductionData,
  getProductionTrackingData,
  getDownstreamAnalyticsData,
} from 'libs/api/api-dashboard'
import { processNGData } from 'components/module-downstream/analytics/processors'
import {
  processDailyData,
  processMonthlyData,
  mapDataConvertor,
  processTrackingData,
  processHydrocarbonData,
} from './processors'
import { productionFilters } from 'libs/consts'
// import i18n from 'i18n-js'
// import l from 'libs/langs/keys'

export default createAnalytics({
  moduleName: 'production',
  filter: createFilter('production', {
    config: productionFilters,
  }),
  list: [
    {
      name: 'name',
      dataKey: 'name',
      width: 250,
    },
    {
      name: 'block',
      dataKey: 'block',
      width: 150,
    },
    {
      name: 'company',
      dataKey: 'company',
      width: 150,
    },
    {
      name: 'month',
      dataKey: 'month',
      width: 150,
    },
    {
      name: 'year',
      dataKey: 'year',
      width: 150,
    },
    {
      name: 'unit',
      dataKey: 'unit',
      width: 150,
    },
    {
      name: 'value',
      dataKey: 'value',
      width: 70,
    },
  ],
  dashboardPage: ChartsPage,
  dataPuller: async (params = {}) => {
    const { id } = params
    const rawDaily = { content: await getProductionData('daily', id) }
    const rawMonthly = { content: await getProductionData('monthly', id) }
    const rawTracking = {
      content: await getProductionTrackingData(),
    }
    const hydrocarbon = {
      content: await getProductionData('oman-hydrocarbon', id),
    }
    const NG = processNGData({
      content: await getDownstreamAnalyticsData('ng', id),
    })
    const monthly = processMonthlyData(rawMonthly)
    const tracking = processTrackingData(rawTracking, NG, monthly)
    // console.log(tracking, 'tarcking')
    return {
      daily: processDailyData(rawDaily),
      monthly,
      tracking,
      hydrocarbon: processHydrocarbonData(hydrocarbon),
    }
  },
  map: {
    dataConvertor: mapDataConvertor,
  },
})
