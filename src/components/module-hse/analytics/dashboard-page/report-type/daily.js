import { query, includedIn, or, eq } from 'libs/utils/query'
import { extractUniqValue } from 'libs/utils'
import {
  midCard2,
  drillPie,
  drillPathFull,
  drillPath,
  makeMap,
  mc21MapDaily,
  mc42Table,
  // cardCreator,
  getTotalFlaringByStationCreator,
  cardAveCreator,
  mcS42StackFilterBar,
} from './utils/shared'
import { calcuValue } from './utils'
import {
  configMerge,
  formatter,
  filterByComBlockBeforeTransform,
  pie,
  drill as drillGen,
  flattenTransform,
  hasDatePicker,
  toolbox,
  title,
  filterByCompanyBlock,
  filterByType,
  card,
  mapTransform,
  table,
} from 'components/analytics/utils/charts-config-helper'

const showLegend = () => ({ setting: { showLegend: true } })
const filterByStation = () => ({
  filter: {
    type: 'simple',
    definition: [
      {
        type: 'check',
        label: 'Station',
        field: 'flareStation',
      },
    ],
  },
})
const typeTransform = flattenTransform({
  columns: ['routineFlaringAmountvalue', 'nonroutineFlaringAmountvalue'],
  typeColumn: 'type',
  valueColumn: 'flaringAmountvalue',
})

const totalFlaringDailyPie = (text) =>
  configMerge(
    title(text),
    toolbox,
    hasDatePicker,
    showLegend,
    filterByCompanyBlock,
    typeTransform,
    formatter,
    {
      setting: {
        value1Fmt: 'numberFmt',
      },
    },
  )

const cardMap = card({
  map: {
    split1By: 'type',
    value1Key: 'value',
    unitKey: 'unit',
  },
  formatter,
  setting: {
    value1Fmt: 'numberFmt',
  },
})

const columnsConfig = [
  {
    name: 'FLARE STATION',
    dataKey: 'station',
  },
  {
    name: 'Total Flare volume',
    dataKey: 'total',
  },
  {
    name: 'Routine Flaring  Volume',
    dataKey: 'routine',
  },
  {
    name: 'Non-routine Flaring  volume',
    dataKey: 'nonroutine',
  },
]

const withoutTotal = includedIn('type', ['routine', 'nonroutine'])

export default [
  drillPie('sum-value', query(withoutTotal))(
    'Flaring Type Overview MMSCF',
    {
      ...drillPathFull,
      pinConfig: configMerge(
        totalFlaringDailyPie('Flaring Type Overview MMSCF'),
        drillGen(['type', 'company', 'flareStation']),
        pie({
          map: {
            split1By: 'type',
            value1Key: 'flaringAmountvalue',
          },
        }),
        mapTransform([
          {
            col: 'type',
            formula:
              " $type=='nonroutineFlaringAmountvalue' ? 'nonroutine' : 'routine' ",
          },
        ]),
      ),
    },
    {},
  ),
  drillPie('sum-value', query(withoutTotal))(
    'Total Flaring Overview MMSCF',
    {
      ...drillPath,
      pinConfig: configMerge(
        totalFlaringDailyPie('Total Flaring Overview MMSCF'),
        drillGen(['company', 'flareStation']),
        pie({
          map: {
            split1By: 'company',
            value1Key: 'flaringAmountvalue',
          },
        }),
      ),
    },
    {},
  ),
  midCard2(
    cardAveCreator(
      [
        ['Routine Flare', 'routine'],
        ['Non Routine', 'nonroutine'],
        ['Total Flare', 'flareTotal'],
      ],
      'MMSCF/D',
    ),
  )(
    'Average Flaring Breakdown',
    {
      pinConfig: configMerge(
        title('Average Flaring Breakdown'),
        hasDatePicker,
        cardMap,
        filterByCompanyBlock,
        mapTransform([
          { col: 'Total Flare', formula: '$flareAmountTotalValue' },
          { col: 'Non Routine', formula: '$nonroutineFlaringAmountvalue' },
          { col: 'Routine Flare', formula: '$routineFlaringAmountvalue' },
          { col: 'unit', formula: "'MMSCF/D'" },
        ]),
        flattenTransform({
          columns: ['Total Flare', 'Routine Flare', 'Non Routine'],
        }),
      ),
    },
    {},
  ),
  makeMap(mc21MapDaily, 'Daily Flaring Map', query(withoutTotal), undefined, {
    pinConfig: configMerge(
      hasDatePicker,
      title('Daily Flaring Map'),
      typeTransform,
      filterByCompanyBlock,
      filterByType,
      {
        type: 'GisMap',
        map: {
          blockBy: 'block',
          value1Key: 'flaringAmountvalue',
        },
      },
    ),
  }),
  mcS42StackFilterBar(
    getTotalFlaringByStationCreator(
      query(or(eq('type', 'routine'), eq('type', 'nonroutine'))),
    ),
    'Total flaring by station',
    {
      pinConfig: configMerge(
        title('Total flaring by station'),
        filterByCompanyBlock,
        filterByStation,
        hasDatePicker,
        toolbox,
        {
          type: 'VBarStack',
          setting: {
            value1Fmt: 'numberFmt',
            split2Fmt: 'DD/MM/YYYY',
            showLegend: true,
            showDataZoomSlider: true,
          },
          ...formatter,
          transform: [
            {
              type: 'javascript',
              code: `function transform(data) {
            const newData = []
            data.forEach((i) => {
              const type = ['routineFlaringAmount','nonroutineFlaringAmount']
              const {
                routineFlaringAmountUnit,
                routineFlaringAmountvalue,
                nonroutineFlaringAmountvalue,
                nonroutineFlaringAmountUnit,
                 ...rest
              } = i
              newData.push(...type.map(t => ({
                ...rest,
                type: t,
                value: i[t+'value'],
                unit: i[t+'Unit'],
              })))
            })
            return newData
          }`,
            },
          ],
          map: {
            seriesBy: 'type',
            groupBy: 'flareStation',
            split2By: 'reportDate',
            value1Key: 'value',
          },
        },
        filterByType,
      ),
    },
    {},
  ),
  mc42Table(
    {
      preprocessor (data) {
        return extractUniqValue(data, 'FLARE STATION').map((s) => ({
          station: s,
          total: calcuValue('flareTotal', s, data),
          routine: calcuValue('routine', s, data),
          nonroutine: calcuValue('nonroutine', s, data),
        }))
      },
      rowsPerPage: 7,
      columnsConfig,
    },
    'DAILY PERFORMANCE SUMMARY',
    {
      pinConfig: configMerge(
        title('DAILY PERFORMANCE SUMMARY'),
        hasDatePicker,
        table({
          setting: {
            columns: columnsConfig,
            showSearchBar: true,
          },
        }),
        toolbox,
        filterByComBlockBeforeTransform,
        {
          transform: [
            {
              type: 'javascript',
              code: `function transform(data) {
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
                  station: s,
                  total: calcuValue("flareAmountTotalValue", s, data),
                  routine: calcuValue("routineFlaringAmountvalue", s, data),
                  nonroutine: calcuValue("nonroutineFlaringAmountvalue", s, data),
                }))
              }`,
            },
          ],
        },
      ),
    },
    {
      exportFileName: 'flaring-daily',
    },
  ),
]
