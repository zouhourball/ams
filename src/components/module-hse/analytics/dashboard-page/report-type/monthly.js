import { mc42Table, mcS42StackBar } from './utils/shared'
import { query, eq, and, or } from 'libs/utils/query'
import { extractUniqValue } from 'libs/utils'
import { monthArr } from './utils'
import { creatorMaker } from 'components/analytics/utils/creator-maker'
import {
  getAvePlanActual,
  getAvePlanActualRoutine,
  getAvePlanActualNoRoutine,
} from 'components/module-hse/analytics/dashboard-page/report-type/utils'
import {
  configMerge,
  toolbox,
  title,
  filterByCompanyBlock,
  filterByComBlockBeforeTransform,
  mapTransform,
  dataFilter,
  card,
  formatter,
  table,
} from 'components/analytics/utils/charts-config-helper'
import { chartSizes } from 'components/analytics/utils/consts'
import { makeCharts } from 'components/analytics/utils'
import ChartText from 'components/chart-text'

const mcSize1 = makeCharts([chartSizes.width1, chartSizes.height1])
const cardText = [['company', 'block'], 'card', ChartText]
const mcS1FCard = mcSize1(...cardText)
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

const cardMap = card({
  map: {
    split1By: 'dataStatus',
    value1Key: 'value',
    unitKey: 'unit',
  },
  ...formatter,
  setting: {
    split2Fmt: 'numberFmt',
  },
})

let columnsConfig = [
  {
    name: 'PRODUCTION ITEM',
    dataKey: 'name',
  },
  {
    name: 'DATA STATUS',
    dataKey: 'dataStatus',
  },
]
  .concat(monthArr.map((i) => ({ name: i, dataKey: i })))
  .concat({
    name: 'TOTAL',
    dataKey: 'total',
  })

export default [
  mcS1FCard(
    getAvePlanActual,
    'Average Gas Flared',
    {
      pinConfig: configMerge(
        title('Average Gas Flared'),
        dataFilter({
          eq: ['name', 'GAS FLARED TOTAL'],
        }),
        cardMap,
        filterByCompanyBlock,
      ),
    },
    {},
  ),
  mcS1FCard(
    getAvePlanActualRoutine,
    'Gas Flared Routine',
    {
      pinConfig: configMerge(
        title('Gas Flared Routine'),
        dataFilter({
          eq: ['name', 'GAS FLARED ROUTINE'],
        }),
        cardMap,
        filterByCompanyBlock,
      ),
    },
    {},
  ),
  mcS1FCard(
    getAvePlanActualNoRoutine,
    'Gas Flared Non-Routine',
    {
      pinConfig: configMerge(
        title('Gas Flared Non-Routine'),
        dataFilter({
          eq: ['name', 'GAS FLARED NON-ROUTINE'],
        }),
        cardMap,
        filterByCompanyBlock,
      ),
    },
    {},
  ),
  mcS42StackBar(
    creatorMaker({
      type: 'stack',
      config: {
        sliceByKeys: ['dataStatus', 'name', 'month'],
        filterBy: query(
          or(
            eq('name', 'GAS FLARED NON-ROUTINE'),
            eq('name', 'GAS FLARED ROUTINE'),
          ),
        ),
        groupHandlerName: 'sum-value',
      },
    }),
    'Monthly Flaring Perfomance',
    {
      pinConfig: configMerge(
        title('Monthly Flaring Perfomance'),
        numberNdFmt(3),
        filterByCompanyBlock,
        toolbox,
        dataFilter({
          or: [
            {
              eq: ['name', 'GAS FLARED NON-ROUTINE'],
            },
            {
              eq: ['name', 'GAS FLARED ROUTINE'],
            },
          ],
        }),
        mapTransform([
          {
            col: 'name',
            formula:
              " $name=='GAS FLARED NON-ROUTINE' ? 'Non-Routine':'Routine' ",
          },
        ]),
        {
          type: 'VBarStack',
          setting: {
            value1Fmt: 'numberFmt',
            showLegend: true,
            showDataZoomSlider: true,
          },
          map: {
            seriesBy: 'dataStatus',
            groupBy: 'name',
            splitBy: 'month',
            value1Key: 'value',
          },
        },
      ),
    },
    {},
  ),
  mc42Table(
    {
      dataFormatter: (data) => {
        if (data && data[0] && !data[0].name) {
          return []
        }
        const item = extractUniqValue(data, 'name')
        const dataStatus = extractUniqValue(data, 'dataStatus')
        const generateArr = (dataStatus) => {
          return item.map((i) => {
            const obj = {
              total: 0,
            }
            obj.dataStatus = dataStatus
            obj.name = i
            monthArr.forEach((month) => {
              const currItem = query(
                and(
                  eq('name', i),
                  eq('month', month),
                  eq('dataStatus', dataStatus),
                ),
                data,
              )[0]
              obj[month] = currItem && currItem.value
              obj.total += (currItem && currItem.value) || 0
            })
            return obj
          })
        }
        const arr = []
        dataStatus.forEach((i) => {
          arr.push(generateArr(i))
        })
        const transformData = arr
          .reduce((pre, cur) => pre.concat(cur), [])
          .sort((a, b) => {
            if (a.name < b.name) {
              return 1
            }
            if (a.name > b.name) {
              return -1
            }
            return 0
          })
          .filter(({ name, dataStatus }) => {
            if (name.indexOf('PRODUCTION') !== -1 && dataStatus === 'PLANNED') {
              return false
            }
            return true
          })
        return transformData
      },
      columnsConfig,
    },
    'Monthly Performance Summary ',
    {
      pinConfig: configMerge(
        title('Monthly Performance Summary'),
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
                const stations = uniq(data.map(i => i.name))
                const newArr = []
                const months = [
                  "JAN",
                  "FEB",
                  "MAR",
                  "APR",
                  "MAY",
                  "JUN",
                  "JUL",
                  "AUG",
                  "SEP",
                  "OCT",
                  "NOV",
                  "DEC",
                ]
                stations.forEach(s => {
                  const dataStatus = uniq(data.filter(d => d.name === s).map(i => i.dataStatus))
                  dataStatus.forEach(dataStatus => {
                    let monthObj = {}
                    let total = 0
                    months.forEach(m => {
                      monthObj[m] = data.filter(i =>
                        i.dataStatus === dataStatus && i.name === s && i.month === m).reduce((a,b) => {
                        total += Number(b.value || 0)
                        return a + Number(b.value || 0)
                      }, 0)
                    })
                    newArr.push({
                      name: s,
                      dataStatus,
                      ...monthObj,
                      total,
                    })
                  })
                })
                return newArr
              }`,
            },
          ],
        },
      ),
    },
    {
      exportFileName: 'flaring-monthly',
    },
  ),
]
