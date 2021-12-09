import { createAnalytics } from 'components/analytics'
import DashboardPage from './dashboard-page'
import { getCostRecoveryData } from 'libs/api/api-dashboard'
import {
  processProdData,
  processAffiliateData,
  processContractsData,
  processCostsData,
} from './processors'
import { costrecoveryFilters } from 'libs/consts'
import './styles.scss'

export default createAnalytics({
  moduleName: 'costrecovery',
  filter: {
    config: costrecoveryFilters,
  },
  list: [],
  dashboardPage: DashboardPage,
  dataPuller: async () => {
    return {
      PRODUCTION: processProdData({
        content: await getCostRecoveryData('prodLifting'),
      }),
      CONTRACTS: processContractsData({
        content: await getCostRecoveryData('contracts'),
      }),
      AFFILIATE: processAffiliateData({
        content: await getCostRecoveryData('affiliate'),
      }),
      FINANCIALS: processCostsData(await getCostRecoveryData('costs')),
    }
  },
  map: {},
})
