import { createExtTitledChartsPage } from 'components/analytics/charts-page'
import { chartsToDraw } from '../charts'

export default createExtTitledChartsPage(chartsToDraw, {
  moduleName: 'production',
})
