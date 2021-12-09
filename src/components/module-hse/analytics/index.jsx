import { createAnalytics } from 'components/analytics'
import { getFlaringData } from 'libs/api/api-dashboard'
import DashboardPage from './dashboard-page'
import {
  processMonStation,
  processDaily,
  processMonthly,
  processAnnForecast,
} from './processors'
import { flaringFilters } from 'libs/consts'
import './styles.scss'
// import i18n from "i18n-js"
// import l from "libs/langs/keys"

export default createAnalytics({
  moduleName: 'flaring',
  filter: {
    config: flaringFilters,
  },
  // list: [
  //   {
  //     name: i18n.t(l.item),
  //     dataKey: "name",
  //     width: 250,
  //   },
  //   {
  //     name: i18n.t(l.block),
  //     dataKey: "block",
  //     width: 150,
  //   },
  //   {
  //     name: i18n.t(l.companyItem),
  //     dataKey: "company",
  //     width: 150,
  //   },
  //   {
  //     name: i18n.t(l.year),
  //     dataKey: "year",
  //     width: 150,
  //   },
  //   {
  //     name: i18n.t(l.unitLabel),
  //     dataKey: "unit",
  //     width: 150,
  //   },
  //   {
  //     name: i18n.t(l.amount),
  //     dataKey: "value",
  //     width: 150,
  //   },
  // ],
  dashboardPage: DashboardPage,
  dataPuller: async (params = {}) => {
    const { id } = params
    const daily = processDaily({ content: await getFlaringData('daily', id) })
    const monthly = processMonthly({
      content: await getFlaringData('monthly', id),
    })
    const monthlyStation = processMonStation({
      content: await getFlaringData('monthly-station', id),
    })
    const annualForecast = processAnnForecast({
      content: await getFlaringData('annual-forecast', id),
    })
    return {
      'MONTHLY STATION': monthlyStation,
      DAILY: daily,
      MONTHLY: monthly,
      'ANNUAL FORECAST': annualForecast,
    }
  },
  map: {},
})
