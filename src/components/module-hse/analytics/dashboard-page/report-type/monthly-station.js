import { query, includedIn } from 'libs/utils/query'
import { calcuValue, calcuPlanValue, genHighlightTableRender } from './utils'
import { extractUniqValue } from 'libs/utils'
import produce from 'immer'
import { get, memoize, isArray } from 'lodash-es'
import { creatorMaker } from 'components/analytics/utils/creator-maker'

import {
  mc21MapMonStation,
  midCard,
  drillPie,
  drillPathFull,
  drillPath,
  makeMap,
  mc42HighlightTable,
  mcS42BarFilter,
  mc21Pie,
  getTotalFlaringCreator,
} from './utils/shared'

import {
  configMerge,
  pie,
  drill as drillGen,
  flattenTransform,
  mapTransform,
  toolbox,
  title,
  filterByCompanyBlock,
  filterByType,
  card,
  stack,
  table,
  monthComparer,
  formatter,
  simpleFilter,
} from 'components/analytics/utils/charts-config-helper'

const keyNameTransform = mapTransform([
  { col: 'Non-Routine', formula: '$nonRoutineFlaringActualsValue' },
  { col: 'Routine', formula: '$routineFlaringActualsValue' },
  { col: 'Total', formula: '$totalFlaringActualsValue' },
  { col: 'unit', formula: "'MMSCF'" },
])

const typeTransform = flattenTransform({
  columns: ['Routine', 'Non-Routine', 'Total'],
  typeColumn: 'type',
  valueColumn: 'flaringActualsValue',
})

const commonPinConfig = configMerge(toolbox, filterByCompanyBlock, formatter)

const cardMap = card({
  map: {
    split1By: 'type',
    value1Key: 'flaringActualsValue',
    unitKey: 'unit',
  },
})

const withoutTotal = includedIn('type', ['Routine', 'Non-Routine'])
const getColumnsConfig = memoize((showHighlight) => [
  {
    name: 'FLARE STATION',
    width: 80,
    dataKey: 'FLARE STATION',
  },
  {
    groupName: 'Routine Flaring',
    columns: [
      {
        name: 'Actual',
        dataKey: 'LP FLARING',
        ...(showHighlight
          ? genHighlightTableRender({
            colorfulKey: 'LP FLARING',
            baseKey: 'lpPlan',
          })
          : {}),
      },
      {
        name: 'Plan',
        dataKey: 'lpPlan',
      },
    ],
  },
  {
    groupName: 'Non-Routine Flaring',
    columns: [
      {
        name: 'Actual',
        dataKey: 'AP FLARING',
        ...(showHighlight
          ? genHighlightTableRender({
            colorfulKey: 'AP FLARING',
            baseKey: 'apPlan',
          })
          : {}),
      },
      {
        name: 'Plan',
        dataKey: 'apPlan',
      },
    ],
  },
  {
    groupName: 'TOTAL FLARING',
    columns: [
      {
        name: 'Actual',
        dataKey: 'Total',
        ...(showHighlight
          ? genHighlightTableRender({
            colorfulKey: 'Total',
            baseKey: 'totalPlan',
          })
          : {}),
      },
      {
        name: 'Plan',
        dataKey: 'totalPlan',
      },
    ],
  },
])
const columns = [
  {
    name: 'FLARE STATION',
    dataKey: 'FLARE STATION',
  },
  {
    groupName: 'Routine Flaring',
    columns: [
      {
        name: 'Actual',
        dataKey: 'LP FLARING',
      },
      {
        name: 'Plan',
        dataKey: 'lpPlan',
      },
    ],
  },
  {
    groupName: 'Non-Routine Flaring',
    columns: [
      {
        name: 'Actual',
        dataKey: 'AP FLARING',
      },
      {
        name: 'Plan',
        dataKey: 'apPlan',
      },
    ],
  },
  {
    groupName: 'TOTAL FLARING',
    columns: [
      {
        name: 'Actual',
        dataKey: 'Total',
      },
      {
        name: 'Plan',
        dataKey: 'totalPlan',
      },
    ],
  },
]
const postNDProcess = ({ keys, data, unit }) => {
  if (get(keys, '0.0') === 'Routine') {
    return {
      keys: produce(keys, (draft) => {
        if (isArray(draft[0])) draft[0].reverse()
      }),
      data: produce(data, (draft) => {
        if (isArray(draft)) draft.reverse()
      }),
      unit,
    }
  }
  return { keys, data, unit }
}

export default [
  midCard(['type'])(
    'Flaring Type Overview',
    {
      pinConfig: configMerge(
        title('Flaring Type Overview'),
        cardMap,
        commonPinConfig,
        keyNameTransform,
        typeTransform,
        {
          setting: {
            showLegend: true,
            split2Fmt: 'numberFmt',
          },
        },
      ),
    },
    {},
  ),
  mc21Pie(
    creatorMaker({
      type: 'drillablePie',
      config: {
        filterBy: query(withoutTotal),
        groupHandlerName: 'sum-value',
        postNDProcess,
      },
    }),
  )(
    'Flaring Type Overview',
    {
      ...drillPathFull,
      pinConfig: configMerge(
        title('Flaring Type Overview'),
        drillGen(['type', 'company', 'flareStation']),
        pie({
          map: {
            split1By: 'type',
            value1Key: 'flaringActualsValue',
          },
        }),
        keyNameTransform,
        typeTransform,
        commonPinConfig,
      ),
    },
    {},
  ),
  drillPie('sum-value', query(withoutTotal))(
    'Total Flaring Overview',
    {
      ...drillPath,
      pinConfig: configMerge(
        title('Total Flaring'),
        drillGen(['company', 'flareStation']),
        pie({
          map: {
            split1By: 'company',
            value1Key: 'flaringActualsValue',
            unitKey: 'unit',
          },
        }),
        keyNameTransform,
        typeTransform,
        commonPinConfig,
      ),
    },
    {},
  ),
  makeMap(mc21MapMonStation, 'Flaring', query(withoutTotal), undefined, {
    pinConfig: configMerge(
      keyNameTransform,
      typeTransform,
      title('Flaring'),
      filterByType,
      commonPinConfig,
      {
        type: 'GisMap',
        map: {
          blockBy: 'block',
          value1Key: 'flaringActualsValue',
          unitKey: 'unit',
        },
      },
    ),
  }),
  mcS42BarFilter(
    getTotalFlaringCreator(query(withoutTotal)),
    'Total Flaring',
    {
      pinConfig: configMerge(
        title('Total Flaring'),
        keyNameTransform,
        typeTransform,
        commonPinConfig,
        simpleFilter([
          {
            label: 'Station',
            field: 'flareStation',
            type: 'check',
          },
        ]),
        monthComparer,
        stack({
          map: {
            seriesBy: 'routineFlaringActualsUnit',
            groupBy: 'type',
            splitBy: 'month',
            value1Key: 'flaringActualsValue',
            unitKey: 'unit',
            splitSortBy: 'month-str',
          },
        }),
      ),
    },
    {},
  ),
  mc42HighlightTable(
    {
      dataFormatter: (data) => {
        const TransferredDate = data.map((d) => ({
          ...d,
          type: d.type2,
          value: d.value,
        }))
        return extractUniqValue(TransferredDate, 'FLARE STATION').map((s) => ({
          'FLARE STATION': s,
          'LP FLARING': calcuValue('LP FLARING', s, TransferredDate).toFixed(2),
          'AP FLARING': calcuValue('AP FLARING', s, TransferredDate).toFixed(2),
          lpPlan: calcuPlanValue('LP FLARING', s, TransferredDate).toFixed(2),
          apPlan: calcuPlanValue('AP FLARING', s, TransferredDate).toFixed(2),
          Total: calcuValue('Total', s, data).toFixed(2),
          totalPlan: calcuPlanValue('Total', s, data).toFixed(2),
        }))
      },
      getColumnsConfig,
    },
    'MONTHLY STATION PERFORMANCE SUMMARY ',
    {
      pinConfig: configMerge(
        title('DAILY PERFORMANCE SUMMARY'),
        table({
          setting: {
            columns,
            showSearchBar: true,
          },
        }),
        commonPinConfig,
        {
          transform: [
            {
              type: 'javascript',
              code: `
              function transform(data) {
                function extractUniqValue(d, key) {
                  let  obj = {}
                  return d.reduce((acc, cur) => {
                    if(!obj[cur.flareStation]){
                      obj[cur.flareStation] = 1
                      return acc.concat([cur.flareStation])
                    }
                    return acc
                  }, [])
                }
                function calcuValue( type, station, d){
                  return d.reduce(( acc, cur ) => {
                    if ( cur.flareStation === station ){
                      return acc + (cur[type] || 0)
                    }
                    return acc
                  }, 0)
                }
                return extractUniqValue(data, "flareStation").map(s => ({
                  "FLARE STATION" : s,
                  Total: calcuValue("totalFlaringActualsValue", s, data),
                  "LP FLARING": calcuValue("lpFlaringActualsValue", s, data),
                  "AP FLARING": calcuValue("apFlaringActualsValue", s, data),
                }))
              }
              `,
            },
          ],
        },
      ),
    },
    {
      exportFileName: 'flaring-monthly-station',
    },
  ),
]
