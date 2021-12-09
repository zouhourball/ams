import { mcDFBySize } from 'components/analytics/utils'
import { creatorMaker } from 'components/analytics/utils/creator-maker'
import DataTable from '@target-energysolutions/data-table'
import ChartText from 'components/chart-text'
// import i18n from "i18n-js"
// import l from "libs/langs/keys"
import {
  configMerge,
  title,
  card,
  table,
  mapTransform,
  flattenTransform,
} from 'components/analytics/utils/charts-config-helper'

const mc41 = mcDFBySize(4, 1)
const mc21 = mcDFBySize(2, 1)
const mc41Table = mc41('table', DataTable)
const mc21Card = mc21('card', ChartText)
const cardCreator =
  (titleKeyPairs, unit = '') =>
    ({ data }) => {
      const detail = data.reduce((ret, n) => {
        for (let [t, k] of titleKeyPairs) {
          ret[t] = (ret[t] || 0) + (+n[k] || 0)
        }
        return ret
      }, {})
      return {
        detail,
        unit,
      }
    }

const cardMap = card({
  map: {
    split1By: 'type',
    value1Key: 'value',
    unitKey: 'unit',
  },
})
const columnsConfig = [
  {
    name: 'Material Category',
    dataKey: 'Material Category',
  },
  {
    name: 'Quantity',
    dataKey: 'Quantity',
  },
  {
    name: 'Unit Price (USD)',
    dataKey: 'Unit Price (USD)',
  },
  {
    name: 'Unit Price (USD)',
    dataKey: 'Unit Price (USD)',
  },
  {
    name: 'Quantity Consumed',
    dataKey: 'Count',
  },
]

export const charts = [
  mc21Card(
    cardCreator([
      ['Total', 'Quantity'],
      ['Consumed', 'Count'],
    ]),
  )(
    'Total Quantity vs Quantity Consumed (USD$)',
    {
      pinConfig: configMerge(
        title('Total Quantity vs Quantity Consumed (USD$)'),
        cardMap,
        mapTransform([
          { col: 'Total', formula: '$Quantity' },
          { col: 'Consumed', formula: '$Count' },
        ]),
        flattenTransform({
          columns: ['Total', 'Consumed'],
        }),
      ),
    },
    {},
  ),
  mc21Card(
    cardCreator([
      ['Total', 'Total (USD)'],
      ['Consumed', 'Consumed (USD)'],
    ]),
  )(
    'Total Quantity vs Quantity Consumed (USD$)',
    {
      pinConfig: configMerge(
        title('Total Quantity vs Quantity Consumed (USD$)'),
        cardMap,
        mapTransform([
          { col: 'Total', formula: "$'Total (USD)'" },
          { col: 'Consumed', formula: "$Count * $'Unit Price (USD)'" },
        ]),
        flattenTransform({
          columns: ['Total', 'Consumed'],
        }),
      ),
    },
    {},
  ),

  mc41Table(
    creatorMaker({
      type: 'table',
      config: {
        columnsConfig,
        rowsPerPage: 5,
      },
    }),
  )(
    'Table',
    {
      pinConfig: configMerge(
        title('Table'),
        table({
          setting: {
            columns: columnsConfig,
            showSearchBar: true,
          },
        }),
      ),
    },
    {
      exportFileName: 'inventory-consumption',
    },
  ),
]
export default {
  title: 'CONSUMPTION',
  reportType: 'CONSUMPTION',
  groups: [
    {
      title: 'Consumption',
      layout: 'float',
      charts,
    },
  ],
}
