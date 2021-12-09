import { createAnalytics } from 'components/analytics'
import { getPlanningData } from 'libs/api/api-dashboard'
import converPlanningData, { converFypPlanningData } from './processor'
import { planningFilters } from 'libs/consts'
import DashboardPage from './charts-page'
// import i18n from 'i18n-js'
// import l from 'libs/langs/keys'

export default createAnalytics({
  moduleName: 'planning',
  dashboardPage: DashboardPage,
  filter: {
    config: planningFilters,
    props: {
      filters: {
        reportType: 'wpb',
      },
    },
  },
  async dataPuller (params) {
    const wpb = converPlanningData({
      content: await getPlanningData('wpb', params && params.id),
    })
    const fyp = converFypPlanningData({
      content: await getPlanningData('fyp', params && params.id),
    })
    return { wpb, fyp }
  },
  list: [
    {
      name: 'company',
      dataKey: 'company',
      width: 250,
    },
    {
      name: 'block',
      dataKey: 'block',
      width: 150,
    },
    {
      name: 'kpiGroup',
      dataKey: 'kpiGroup',
      width: 150,
    },
    {
      name: 'dataStatus',
      dataKey: 'dataStatus',
      width: 150,
    },
    {
      name: 'category',
      dataKey: 'category',
      width: 150,
    },
    {
      name: 'subCategory',
      dataKey: 'subCategory',
      width: 150,
    },
    {
      name: 'kpiGroup',
      dataKey: 'kpiGroup',
      width: 150,
    },
    {
      name: 'KPI',
      dataKey: 'kpi',
      width: 150,
    },
    {
      name: 'unit',
      dataKey: 'unit',
      width: 150,
    },
    {
      name: 'year',
      dataKey: 'year',
      width: 70,
    },
    {
      name: 'month',
      dataKey: 'month',
      width: 70,
    },
    {
      name: 'value',
      dataKey: 'value',
      width: 70,
    },
  ],
})
