import {
  createDualAxisChartCreator,
  createGenDualAxisChartCreator,
} from 'components/analytics/utils'
import { query, eq, and } from 'libs/utils/query'
import { groupBy } from 'lodash-es'
import { getMonths } from 'libs/utils'

const isActual = eq('dataStatus', 'ACTUAL')
const isPlan = eq('dataStatus', 'PLANNED')

export const createAPvsLPCreator = createDualAxisChartCreator({
  sliceBy: 'FLARE STATION',
  precision: 0,
  confL: {
    name: 'AP FLARING',
    dataKey: 'value',
    unit: 'MMSCF',
    filterBy: query(eq('type', 'AP FLARING')),
  },
  confR: {
    name: 'LP FLARING',
    dataKey: 'value',
    unit: '',
    filterBy: query(eq('type', 'LP FLARING')),
  },
})

function createSummaryAverageTotalCreator (filterMap, dataFilter) {
  return ({ data }) => {
    let { year, month } = getMonths('flaring-MONTHLY')
    let dataMonths = []

    data.forEach((d) => {
      const yearMonth = `${d.year}-${d.month}`
      if (!dataMonths.includes(yearMonth)) {
        dataMonths.push(yearMonth)
      }
    })
    let totalMonths =
      year.length && month.length
        ? year.length * month.length
        : dataMonths.length
    let unit
    const res = Object.keys(filterMap)
      .map((key) => {
        const filteredData = dataFilter(filterMap[key](data))
        unit = filteredData[0] && filteredData[0].unit
        const totalValue = filteredData.reduce((a, b) => a + b.value || 0, 0)

        return totalMonths
          ? {
            [key]: totalValue / totalMonths,
          }
          : totalValue
      })
      .reduce((pre, cur) => ({ ...pre, ...cur }), {})
    return {
      detail: res,
      unit,
    }
  }
}
const isPlanData = eq('dataStatus', 'PLANNED')
const isActualData = eq('dataStatus', 'ACTUAL')
const nameIsTotal = eq('name', 'GAS FLARED TOTAL')
const planAndActualObj = {
  PLANNED: query(isPlanData),
  ACTUAL: query(isActualData),
}

export const getAvePlanActual = createSummaryAverageTotalCreator(
  planAndActualObj,
  query(nameIsTotal),
)
export const getAvePlanActualRoutine = createSummaryAverageTotalCreator(
  planAndActualObj,
  query(eq('name', 'GAS FLARED ROUTINE')),
)
export const getAvePlanActualNoRoutine = createSummaryAverageTotalCreator(
  planAndActualObj,
  query(eq('name', 'GAS FLARED NON-ROUTINE')),
)

export const calcuValue = (type, station, data) => {
  return query(
    and(eq('type', type), eq('FLARE STATION', station)),
    data,
  ).reduce((r, i) => r + i.value, 0)
}
export const calcuPlanValue = (type, station, data) => {
  return query(
    and(eq('type', type), eq('FLARE STATION', station)),
    data,
  ).reduce((r, i) => Number(r) + Number(i.planValue || 0), 0)
}

export const createRoutevsNonRouteCreator = createDualAxisChartCreator({
  sliceBy: 'FLARE STATION',
  confL: {
    name: 'Routine FLARING',
    dataKey: 'value',
    unit: 'MMSCF/D',
    filterBy: query(eq('type', 'routine')),
  },
  confR: {
    name: 'Non-Routine FLARING',
    dataKey: 'value',
    unit: '',
    filterBy: query(eq('type', 'nonroutine')),
  },
})

export const createTotalvsRoutineCreator = createGenDualAxisChartCreator({
  sliceBy: 'month',
  unitL: 'MMSCF',
  unitR: '',
  series: [
    {
      name: 'Total-Actual',
      dataKey: 'value',
      unit: 'MMSCF',
      filterBy: query(and(eq('name', 'GAS FLARED TOTAL'), isActual)),
    },
    {
      name: 'Total-Planned',
      dataKey: 'value',
      unit: 'MMSCF',
      filterBy: query(and(eq('name', 'GAS FLARED TOTAL'), isPlan)),
    },
    {
      name: 'Routine-Actual',
      dataKey: 'value',
      unit: '',
      filterBy: query(and(eq('name', 'GAS FLARED ROUTINE'), isActual)),
    },
    {
      name: 'Routine-Planned',
      dataKey: 'value',
      unit: '',
      filterBy: query(and(eq('name', 'GAS FLARED ROUTINE'), isPlan)),
    },
  ],
})

export const createExclVsInclCreator = createDualAxisChartCreator({
  sliceBy: 'year',
  precision: 0,
  confL: {
    name: 'Exclude Conservation',
    dataKey: 'value',
    unit: 'MMscf/d',
    filterBy: query(eq('name', 'Gas Flared\n(Excl. Gas Conservation)')),
  },
  confR: {
    name: 'Include Conservation',
    dataKey: 'value',
    unit: '',
    filterBy: query(eq('name', 'Gas Flared\n(Incl. Gas Conservation)')),
  },
})

export const mapData = (data) => {
  return (
    data &&
    data
      .map((i) => ({
        quantity: i.value,
        numberToDisplay: i.value,
        xCoord: +i['LONG/EASTING'],
        yCoord: +i['LAT/NORTHING'],
        text: i['FLARE STATION'],
        unit: i.unit,
      }))
      .filter((i) => i.xCoord && i.yCoord)
  )
}
export const mapCircleData = (data) => {
  const grouped = groupBy(
    data,
    (d) => `${d['LAT/NORTHING']}${d['LONG/EASTING']}`,
  )
  return mapData(
    Object.keys(grouped).map((key) => {
      return grouped[key].reduce(
        ({ value }, b) => {
          return { ...b, value: value + b.value }
        },
        { value: 0 },
      )
    }),
  )
}
export const monthArr = [
  'JAN',
  'FEB',
  'MAR',
  'APR',
  'MAY',
  'JUN',
  'JUL',
  'AUG',
  'SEP',
  'OCT',
  'NOV',
  'DEC',
]
export function genHighlightTableRender ({ colorfulKey, baseKey }) {
  return {
    render: (data) => {
      const actual = Number(data[colorfulKey])
      const target = Number(data[baseKey])
      if (target === 0) {
        return actual
      }
      if (actual < target) {
        const percent = (target - actual) / target
        const alpha = (24 + 76 * percent) / 100
        return (
          <div
            className="ams-production-colored-cell"
            style={{
              background: `rgba(105, 240, 174, ${alpha})`,
            }}
          >
            {actual}
          </div>
        )
      } else {
        const percent = Math.min((actual - target) / target, 1)
        const alpha = (34 + 66 * percent) / 100
        return (
          <div
            className="ams-production-colored-cell"
            style={{
              background: `rgba(255, 205, 210, ${alpha})`,
            }}
          >
            {actual}
          </div>
        )
      }
    },
  }
}
