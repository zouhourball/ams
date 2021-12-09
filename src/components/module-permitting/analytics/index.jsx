import { createAnalytics } from 'components/analytics'
import { getPermittingData } from 'libs/api/api-dashboard'
import DashboardPage from './dashboard-page'
import { processData, mapDataConvertor } from './processors'
import './styles.scss'

// import i18n from 'i18n-js'
// import l from 'libs/langs/keys'

export default createAnalytics({
  moduleName: 'permit',
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
  dashboardPage: DashboardPage,
  dataPuller: async (params = {}) => {
    return processData({ content: await getPermittingData(params.id) })
  },
  map: {
    dataConvertor: mapDataConvertor,
  },
})
