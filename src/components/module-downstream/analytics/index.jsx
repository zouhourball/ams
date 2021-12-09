import { createAnalytics } from 'components/analytics'
import DashboardPage from './dashboard-page'
import { processData, processRSData, processNGData } from './processors'
import createFilter from 'components/analytics/filter'
import { getDownstreamAnalyticsData } from 'libs/api/api-dashboard'
import { downstreamFilters } from 'libs/consts'
// import i18n from 'i18n-js'
// import l from 'libs/langs/keys'

export default createAnalytics({
  moduleName: 'downstream',
  filter: createFilter('downstream', {
    config: downstreamFilters,
  }),
  // list: [
  //   {
  //     name: 'name',
  //     dataKey: 'name',
  //     width: 250,
  //   },
  //   {
  //     name: 'block',
  //     dataKey: 'block',
  //     width: 150,
  //   },
  //   {
  //     name: 'company',
  //     dataKey: 'company',
  //     width: 150,
  //   },
  //   {
  //     name:'month',
  //     dataKey: 'month',
  //     width: 150,
  //   },
  //   {
  //     name: i18n.t(l.year),
  //     dataKey: 'year',
  //     width: 150,
  //   },
  //   {
  //     name: i18n.t(l.unitLabel),
  //     dataKey: 'unit',
  //     width: 150,
  //   },
  //   {
  //     name: i18n.t(l.tabProduction),
  //     dataKey: 'value',
  //     width: 70,
  //   },
  // ],
  dashboardPage: DashboardPage,
  dataPuller: async (params = {}) => {
    const { id } = params
    const LPG = processData({
      content: await getDownstreamAnalyticsData('lpg', id),
    })
    const NG = processNGData({
      content: await getDownstreamAnalyticsData('ng', id),
    })
    const PP = processRSData({
      content: await getDownstreamAnalyticsData('rs', id),
    })
    return {
      LPG,
      NG,
      PP,
    }
  },
  map: {},
})
