import { chartsPageCreator } from 'components/charts-page'
import { mcDFBySize, mapDataCvtCreator } from 'components/analytics/utils'
import { creatorMaker } from 'components/analytics/utils/creator-maker'

import ChartText from 'components/chart-text'
import Map from 'components/map'
import { createTPvsQuantCreator } from './chart-creators'
import consumption from './consumption'
import surplus from './surplus'
import DataTable from '@target-energysolutions/data-table'
import {
  configMerge,
  pie,
  drill as drillGen,
  toolbox,
  title,
  vbarline,
  filterByCompanyBlock,
  filterByMaterialCategory,
  card,
  table as pinTable,
} from 'components/analytics/utils/charts-config-helper'
// import i18n from 'i18n-js'
// import l from 'libs/langs/keys'

const mc21 = mcDFBySize(2, 1)
const mc42 = mcDFBySize(4, 2)
const mc42FilterByMaterialCategory = mcDFBySize(4, 2, [
  'company',
  'block',
  'Material Category',
])

const mc21Card = mc21('card', ChartText)
const mc21Pie = mc21('pie', null)
const mc42Map = mc42('map', Map)
const mcS42lineBar = mc42FilterByMaterialCategory('line-bar', null)
const mc42Table = mc42('table', DataTable)
const table = (config, title, pinConfig, tableProps) =>
  mc42Table(
    creatorMaker({
      type: 'table',
      config,
    }),
  )(title, pinConfig, tableProps)
const smallCard = (groupHandlerName) =>
  mc21Card(
    creatorMaker({
      type: 'card',
      config: {
        groupHandlerName,
      },
    }),
  )

const drillPath = { drillPath: ['company', 'block'] }
const drillPathCat = { drillPath: ['Material Category', 'company', 'block'] }
const drillPie = (groupHandlerName, postNDProcess, showValue) =>
  mc21Pie(
    creatorMaker({
      type: 'drillablePie',
      config: { groupHandlerName, postNDProcess, showValue },
    }),
  )
const numberNdFmt = (number) => ({
  setting: {
    value1Fmt: 'numberFmt',
  },
  formatter: [
    {
      name: 'numberFmt',
      type: 'toFixed',
      params: [number],
    },
  ],
})
const pieChart = (split1By, value1Key, transform) =>
  configMerge(
    drillGen(['company', 'block']),
    filterByCompanyBlock,
    toolbox,
    numberNdFmt(2),
    pie({
      map: {
        split1By,
        value1Key,
      },
      transform,
    }),
  )
const lineBarChart = configMerge(
  filterByMaterialCategory,
  toolbox,
  vbarline({
    map: {
      split1By: 'Material Category',
      value1Key: 'Unit Price (USD)',
      value2Key: 'Quantity',
    },
    setting: {
      lineUnit: 'No of Items',
      barUnit: 'USD',
    },
  }),
)
const transformPieForTop10 = [
  {
    type: 'rule',
    rule: {
      sort: [
        {
          when: 'data output',
          col: 'Total (USD)',
          direction: 'desc',
        },
      ],
      filters: [
        {
          when: 'data output',
          type: 'formula',
          filter: {
            formula: '$rowNumber <= 10',
          },
        },
      ],
    },
  },
]
const transformPieForTopQuantity10 = [
  {
    type: 'rule',
    rule: {
      sort: [
        {
          when: 'data output',
          col: 'Quantity',
          direction: 'desc',
        },
      ],
      filters: [
        {
          when: 'data output',
          type: 'formula',
          filter: {
            formula: '$rowNumber <= 10',
          },
        },
      ],
    },
  },
]
const mapConfig = {
  type: 'GisMap',
  map: {
    blockBy: 'block',
    value1Key: 'Total (USD)',
  },
}

const columnsConfig1 = [
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
    name: 'Total (USD)',
    dataKey: 'Total (USD)',
  },
  {
    name: 'Applicable Rate of Depreciation',
    dataKey: 'Applicable Rate of Depreciation',
  },
]

const columnsConfig2 = [
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
    name: 'Total (USD)',
    dataKey: 'Total (USD)',
  },
  {
    name: 'Book Value (USD)',
    dataKey: 'Book Value (USD)',
  },
]

const mapCardSumBy = (key) =>
  card({
    map: {
      split1By: '-',
      value1Key: key,
    },
    setting: {
      hideLabel: true,
    },
  })

const chartsToDraw = [
  {
    title: 'INVENTORY SUBMISSION',
    reportType: 'BASE',
    groups: [
      {
        title: 'Base Inventory',
        layout: 'float',
        charts: [
          smallCard('sum-totalPrice')(
            'Total inventory value USD$',
            {
              pinConfig: configMerge(
                title('Base Inventory'),
                mapCardSumBy('Total (USD)'),
              ),
            },
            {},
          ),
          smallCard('sum-quantity')(
            'Total inventory Quantity',
            {
              pinConfig: configMerge(
                title('Total inventory Quantity'),
                mapCardSumBy('Quantity'),
              ),
            },
            {},
          ),
          drillPie('sum-quantity', ({ keys, data, unit }) => {
            const TOP_N = 10
            function storeNode (topN, index, value) {
              for (let i = Math.min(topN.length - 1, TOP_N - 2); i >= -1; i--) {
                if (!topN[i]) topN.unshift({ index, value })
                else if (topN[i].value > value) {
                  topN.splice(i, 0, { index, value })
                  return
                }
              }
            }

            const topN = []
            for (let i = 0; i < data.length; i++) {
              if (!topN[TOP_N - 1] || topN[TOP_N - 1].value < data[i]) {
                storeNode(topN, i, data[i])
              }
            }
            const trimmed = topN.slice(0, TOP_N)
            return {
              keys: [trimmed.map((i) => keys[0][i.index])],
              data: trimmed.map((i) => data[i.index]),
              unit,
            }
          })(
            'Top 10 Total Quantity',
            {
              ...drillPathCat,
              pinConfig: configMerge(
                title('Top 10 Total Quantity'),
                pieChart(
                  'Material Category',
                  'Quantity',
                  transformPieForTopQuantity10,
                ),
              ),
            },
            {},
          ),
          drillPie('sum-totalPrice', ({ keys, data, unit }) => {
            const TOP_N = 10
            function storeNode (topN, index, value) {
              for (let i = Math.min(topN.length - 1, TOP_N - 2); i >= -1; i--) {
                if (!topN[i]) topN.unshift({ index, value })
                else if (topN[i].value > value) {
                  topN.splice(i, 0, { index, value })
                  return
                }
              }
            }

            const topN = []
            for (let i = 0; i < data.length; i++) {
              if (!topN[TOP_N - 1] || topN[TOP_N - 1].value < data[i]) {
                storeNode(topN, i, data[i])
              }
            }
            const trimmed = topN.slice(0, TOP_N)
            return {
              keys: [trimmed.map((i) => keys[0][i.index])],
              data: trimmed.map((i) => data[i.index]),
              unit,
            }
          })(
            'Top 10 Total Price',
            {
              ...drillPathCat,
              pinConfig: configMerge(
                title('Top 10 Total Price'),
                pieChart(
                  'Material Category',
                  'Total (USD)',
                  transformPieForTop10,
                ),
              ),
            },
            {},
          ),
          drillPie('sum-totalPrice')(
            'Total inventory Value USD$',
            {
              ...drillPath,
              pinConfig: configMerge(
                pieChart('company', 'Total (USD)'),
                title('Total inventory Value USD$'),
              ),
            },
            {},
          ),
          mc42Map(
            creatorMaker({
              type: 'map',
              config: {
                mapName: 'inventory map',
                mapDataConvert: mapDataCvtCreator({
                  blockField: 'block',
                  valueField: 'totalPrice',
                }),
              },
            }),
            'Total Value Per Block',
            {
              pinConfig: configMerge(
                mapConfig,
                filterByCompanyBlock,
                title('Total Value Per Block'),
              ),
            },
            {},
          ),
          mcS42lineBar(
            createTPvsQuantCreator,
            'Total Value (USD) by Material Category',
            {
              pinConfig: configMerge(
                lineBarChart,
                title('Total Value (USD) by Material Category'),
              ),
            },
            {},
          ),
        ],
      },
    ],
  },
  consumption,
  surplus,
  {
    title: 'TRANSFER',
    reportType: 'TRANSFER',
    groups: [
      {
        title: 'Transfer Inventory',
        layout: 'float',
        charts: [
          smallCard('sum-Quantity')(
            'Total Quantity transferred',
            {
              pinConfig: configMerge(
                title('Total Quantity transferred'),
                mapCardSumBy('Quantity'),
              ),
            },
            {},
          ),
          smallCard('sum-Unit Price (USD)')(
            'Total Quantity transferred(unit price)',
            {
              pinConfig: configMerge(
                title('Total Quantity transferred(unit price)'),
                mapCardSumBy('Unit Price (USD)'),
              ),
            },
            {},
          ),
          mc42Map(
            creatorMaker({
              type: 'map',
              config: {
                mapName: 'inventory map',
                mapDataConvert: mapDataCvtCreator({
                  blockField: 'block',
                  valueField: 'totalPrice',
                }),
              },
            }),
            'Total Value Per Block',
            {
              pinConfig: configMerge(
                mapConfig,
                filterByCompanyBlock,
                title('Total Value Per Block'),
              ),
            },
            {},
          ),
          table(
            {
              columnsConfig: columnsConfig1,
            },
            'Transfer Summary',
            {
              pinConfig: configMerge(
                title('Transfer Summary'),
                pinTable({
                  setting: {
                    columns: columnsConfig1,
                    showSearchBar: true,
                  },
                }),
              ),
            },
            {
              exportFileName: 'inventory-transfer',
            },
          ),
        ],
      },
    ],
  },
  {
    title: 'DISPOSAL',
    reportType: 'DISPOSAL',
    groups: [
      {
        title: 'Disposal Inventory',
        layout: 'float',
        charts: [
          smallCard('sum-Quantity')(
            'Total Quantity Disposed (Value)',
            {
              pinConfig: configMerge(
                title('Total Quantity Disposed (Value)'),
                mapCardSumBy('Quantity'),
              ),
            },
            {},
          ),
          smallCard('sum-Unit Price(USD)')(
            'Total Quantity Disposed (Unit price  USD$))',
            {
              pinConfig: configMerge(
                title('Total Quantity Disposed (Unit price  USD$))'),
                mapCardSumBy('Unit Price (USD)'),
              ),
            },
            {},
          ),
          mc42Map(
            creatorMaker({
              type: 'map',
              config: {
                mapName: 'inventory map',
                mapDataConvert: mapDataCvtCreator({
                  blockField: 'block',
                  valueField: 'totalPrice',
                }),
              },
            }),
            'Total Value Per Block',
            {
              pinConfig: configMerge(
                mapConfig,
                filterByCompanyBlock,
                title('Total Value Per Block'),
              ),
            },
            {},
          ),
          table(
            {
              columnsConfig: columnsConfig2,
            },
            'Disposal Summary',
            {
              pinConfig: configMerge(
                title('Disposal Summary'),
                pinTable({
                  setting: {
                    columns: columnsConfig2,
                    showSearchBar: true,
                  },
                }),
              ),
            },
            {
              exportFileName: 'disposal',
            },
          ),
        ],
      },
    ],
  },
]
export default chartsPageCreator(chartsToDraw)
