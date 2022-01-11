import { creatorMaker } from 'components/analytics/utils/creator-maker'
import { mcDFBySize } from 'components/analytics/utils'
import ChartText from 'components/chart-text'
// import TableWithColorHighlight from 'components/table-with-color-highlight'
import Mht from '@target-energysolutions/mht'

import { eq, or } from 'libs/utils/query'
// import DataTable from '@target-energysolutions/data-table'

const mc11 = mcDFBySize(1, 1)
export const mc21 = mcDFBySize(2, 1)
const mc42 = mcDFBySize(4, 2)
export const mc41 = mcDFBySize(4, 1)
export const mc21Pie = mc21('pie', null)
const mc11Card = mc11('card', ChartText)
export const mc11Gauge = mc11('gauge', null)
const mc42Table = mc42('table', Mht)
const mc42NormalTable = mc42('table', Mht)
export const smallCard = (sliceByKeys, filterBy) =>
  mc11Card(
    creatorMaker({
      type: 'card',
      config: {
        sliceByKeys,
        filterBy,
        groupHandlerName: 'sum-value',
      },
    }),
  )
export const m42Table = (config) => {
  return mc42Table(
    creatorMaker({
      type: 'table',
      config,
    }),
  )
}
export const m42NormalTable = (config) => {
  return mc42NormalTable(
    creatorMaker({
      type: 'table',
      config,
    }),
  )
}
export const gauge = (sizeMC, sliceByKeys, filterBy) =>
  sizeMC(
    creatorMaker({
      type: 'gauge',
      config: { sliceByKeys, groupHandlerName: 'sum-value', filterBy },
    }),
  )
const bar = (sizeMC, sliceByKeys, filterBy) =>
  sizeMC(
    'bar',
    null,
    creatorMaker({
      type: 'bar',
      config: { sliceByKeys, groupHandlerName: 'sum-value', filterBy },
    }),
  )
export const drillPie = (sizedPie, filterBy) =>
  sizedPie(
    creatorMaker({
      type: 'drillablePie',
      config: { groupHandlerName: 'sum-value', filterBy },
    }),
  )
export const isWell = eq('kpiGroup', 'WELLS')

export const forceRefresh = { refreshOnDataUpdate: true }
export const isVolume = eq('kpiGroup', 'VOLUME')
export const drillPathCost = { drillPath: ['kpiGroup', 'company', 'block'] }
export const isCAPEX = eq('kpiGroup', 'CAPEX')
const getIsProd = (nfaOnew, type) => eq('kpi', `${nfaOnew} ${type} Production`)
export const isNFAoNewOil = or(getIsProd('NFA', 'Oil'), getIsProd('New', 'Oil'))
export const isOPEX = eq('kpiGroup', 'OPEX')
export const is$MM = eq('unit', '$MM')
export const isProd = eq('category', 'PRODUCTION')
export const isCost = or(isCAPEX, isOPEX)
export const drillPathProd = { drillPath: ['kpi', 'company', 'block'] }
export const isNFAoNewCond = or(
  getIsProd('NFA', 'Condensate'),
  getIsProd('New', 'Condensate'),
)
export const isNFAoNewGas = or(getIsProd('NFA', 'Gas'), getIsProd('New', 'Gas'))

export const axisControlledBar = (slicingKey, filter, name, size, props = {}) =>
  bar(size, slicingKey, filter)(
    name,
    { refreshOnDataUpdate: true, ...props },
    {},
  )
