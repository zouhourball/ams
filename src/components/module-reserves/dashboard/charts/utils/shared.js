import { creatorMaker } from 'components/analytics/utils/creator-maker'
import { mcDFBySize, mapDataCvtCreator } from 'components/analytics/utils'
import ChartText from 'components/chart-text'
import Map from 'components/map'
import Mht from '@target-energysolutions/mht'
// import DataTable from '@target-energysolutions/data-table'

const mc21MoreFilters = mcDFBySize(2, 1, [
  'company',
  'block',
  { name: 'hydrocarbonType', defaultSelect: ['oil'] },
])

export const mc11 = mcDFBySize(1, 1)
export const mc21 = mcDFBySize(2, 1)
export const mc41 = mcDFBySize(4, 1)
export const mc42 = mcDFBySize(4, 2)
export const mc42Table = mc42('table', Mht)
export const mc21Map = mc21MoreFilters('map', Map)
export const mc11Pie = mc11('pie', null)
export const mc21Pie = mc21('pie', null)
export const mc42Pie = mc42('pie', null)
export const mc21Card = mc21('card', ChartText)
export const mc21Washline = mc21MoreFilters('washline', null)

export const drill = { drillPath: ['company', 'block'] }
export const drillBreak = { drillPath: ['item', 'company', 'block'] }

export const drillPie = (sizedPie, groupHandlerName, filterBy, precision) =>
  sizedPie(
    creatorMaker({
      type: 'drillablePie',
      config: { groupHandlerName, filterBy, precision },
    }),
  )

export const smallCard = (sliceByKeys, filterBy) =>
  mc21Card(
    creatorMaker({
      type: 'card',
      config: {
        sliceByKeys,
        filterBy,
        precision: 3,
        groupHandlerName: 'sum-value',
      },
    }),
  )

export const table = (config, title, pinConfig, tableProps) => {
  return mc42(
    'table',
    Mht,
    creatorMaker({
      type: 'table',
      config,
    }),
    title,
    pinConfig,
    tableProps,
  )
}
export const mcMapAnnualResource = mcDFBySize(4, 2, [
  'company',
  'block',
  {
    name: 'type',
    label: 'Type',
    items: ['p1Total', 'p2Total', 'p3', 'contingentC1'],
    defaultSelect: ['p1Total'],
  },
])('map', Map)
export const makeMap = (mapSizer, mapName, filterBy, pinConfig) =>
  mapSizer(
    creatorMaker({
      type: 'map',
      config: {
        filterBy,
        mapName,
        mapDataConvert: mapDataCvtCreator({
          blockField: 'block',
          valueField: 'value',
        }),
        props: {
          selectedLayers: ['circle'],
        },
      },
    }),
    mapName,
    pinConfig,
    {},
  )
