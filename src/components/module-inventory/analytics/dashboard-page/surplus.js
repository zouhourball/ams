import { mcDFBySize } from 'components/analytics/utils'
import { creatorMaker } from 'components/analytics/utils/creator-maker'
// import DataTable from '@target-energysolutions/data-table'
import ChartText from 'components/chart-text'
import Mht from '@target-energysolutions/mht'

// import i18n from "i18n-js"
// import l from "libs/langs/keys"

import {
  configMerge,
  title,
  card,
  table,
} from 'components/analytics/utils/charts-config-helper'

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
    name: 'Total (USD)',
    dataKey: 'Total (USD)',
  },
  {
    name: 'Quantity Consumed',
    dataKey: 'Count',
  },
]

const mc41 = mcDFBySize(4, 1)
const mc21 = mcDFBySize(2, 1)
const mc41Table = mc41('table', Mht)
const mc21Card = mc21('card', ChartText)
export default {
  title: 'SURPLUS DECLARATION',
  reportType: 'SURPLUS',
  groups: [
    {
      title: 'Surplus',
      layout: 'float',
      charts: [
        mc21Card(
          creatorMaker({
            type: 'card',
            config: {
              groupHandlerName: 'sum-Count',
            },
          }),
          'Total Quantity Surplus',
          {
            pinConfig: configMerge(
              title('Total Quantity Surplus'),
              card({
                map: {
                  split1By: '-',
                  value1Key: 'Count',
                },
              }),
              {
                setting: {
                  hideLabel: true,
                },
              },
            ),
          },
          {},
        ),
        mc21Card(
          creatorMaker({
            type: 'card',
            config: {
              unit: 'usd',
              groupHandlerName: 'sum-Total (USD)',
            },
          }),
          'Total (USD)',
          {
            pinConfig: configMerge(
              title('Total (USD)'),
              card({
                map: {
                  split1By: '-',
                  value1Key: 'Total (USD)',
                },
              }),
              {
                setting: {
                  hideLabel: true,
                },
              },
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
          'Surplus Summary',
          {
            pinConfig: configMerge(
              title('Surplus Summary'),
              table({
                setting: {
                  columns: columnsConfig,
                  showSearchBar: true,
                },
              }),
            ),
          },
          {
            exportFileName: 'inventory-surplus',
          },
        ),
      ],
    },
  ],
}
