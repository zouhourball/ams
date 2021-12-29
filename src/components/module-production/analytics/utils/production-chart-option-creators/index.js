import {
  generalStackLogic,
  generalGaugeLogic,
  generalStackLogicMonthly,
  generalLineLogic,
} from 'libs/utils/custom-chart-option-creator'
import { query, eq, and, or, not } from 'libs/utils/query'
import { format } from 'date-fns'
import {
  get,
  groupBy,
  property,
  compact,
  values,
  sum as lodashSum,
  uniq,
  map,
} from 'lodash-es'
import moment from 'moment'
import {
  customLineOption,
  customStackOption,
  customGaugeOption,
} from 'libs/echarts-options'
import {
  extractUniqValue,
  sortMonthNames,
  fixNbr,
  newDatePolyfill,
  getDays,
  sortByYearAndMonth,
  getMonths,
} from 'libs/utils'
import { mapDataCvtCreator } from 'components/analytics/utils'
// import i18n from 'i18n-js'
// import l from 'libs/langs/keys'

import './styles.scss'

// import {merge} from 'lodash-es'
/**
   {
    "name": "Gas Injection (MM scf/d)",
    "company": "Daleel",
    "date": 1516233720000,
    "block": "3",
    "DAILY FIELD PRODUCTION": 5
  }
 */

const getCompany = (data) => extractUniqValue(data, 'company')
const getProdType = (data) => extractUniqValue(data, 'name')
const filterByCompany = (company) => query(eq('company', company))
const filterByName = (name) => query(eq('name', name))
const isActual = eq('dataType', 'Actual')
const isTarget = eq('dataType', 'Target')
const isTotal = eq('dataType', 'Total')
const isClosedIn = eq('dataType', 'Closed-In')
export const isWellCountData = or(isTotal, isClosedIn)

export const isMonthlyOil = eq('name', 'OIL PRODN')
export const isMonthlyNAG = eq('name', 'NAG PROD')
export const isMonthlyAG = eq('name', 'AG PROD')
export const isMonthlyWater = eq('name', 'WATER PROD')
export const isMonthlyCondensate = eq('name', 'CONDENSATE PROD')
const isFlareGasRate = eq('name', 'FLARE GAS RATE')
const isFuelGasRate = eq('name', 'FUEL GAS RATE')
const isGasShrinkage = eq('name', 'GAS SHRINKAGE')
const isGasSale = eq('name', 'GAS SALE')
const isGasInj = eq('name', 'GAS INJECTION')
const isWaterInj = eq('name', 'WATER INJ')
const isWaterDisplsal = eq('name', 'WATER DISPOSAL')
const isSUPPLIER = eq('terminalTypes', 'SUPPLIER')
const isCONSUMER = eq('terminalTypes', 'CONSUMER')
const isSm3 = eq('type', 'Sm3 x 103')
export const isSUPPLIERandSm3 = and(isSUPPLIER, isSm3)
export const isCONSUMERandSm3 = and(isCONSUMER, isSm3)

export const isNAGData = eq('name', 'NAG')
export const isOilData = eq('name', 'OIL')
export const isCondensateData = eq('name', 'CONDENSATE')
export const isAGData = eq('name', 'AG')
export const isWaterData = eq('name', 'WATER')
export const gas4andAgNagProd = or(
  and(isMonthlyNAG, isActual),
  and(isMonthlyAG, isActual),
  and(isFlareGasRate, isActual),
  and(isFuelGasRate, isActual),
  and(isGasShrinkage, isActual),
  and(isGasSale, isActual),
  and(isGasInj, isActual),
)
export const waterProdInjDisposalData = or(
  and(isMonthlyWater, isActual),
  and(isWaterInj, isActual),
  and(isWaterDisplsal, isActual),
)
const isNotFromNg = not(eq('cameFrom', 'ng'))
// function lineChart({ xData, option, ...rest }) {
//   return merge(lineChartOption({
//     data: xData,
//     ...rest
//   }), option)
// }
const commonMhtConfig = {
  commonActions: true,
  withSubColumns: false,
  hideTotal: true,
  withFooter: false,
  withDownloadCsv: true,
  withSearch: true,
}
export function config2MhtConfig (configs) {
  return map(configs, (c) => {
    if (c.groupName) {
      return {
        label: c.groupName,
        key: c.groupName,
        type: 'subColumns',
        width: c.columns.length * 150,
        displayInCsv: true,
        columns: map(c.columns, (column) => ({
          label: column.name,
          icon: 'mdi mdi-spellcheck',
          subKey: column.dataKey,
          displayInCsv: true,
          width: 150,
        })),
      }
    } else {
      return {
        width: 150,
        type: 'text',
        displayInCsv: true,
        label: c.name,
        key: c.dataKey,
      }
    }
  })
}
function xDataProccessor (data, params) {
  let groupedData = {}
  let allDate = []
  const startDate = moment((params && params.startDate) || new Date()).format(
    'DD/MM',
  )

  for (let item of data) {
    let date = newDatePolyfill(item.date)

    let dateStr = format(date, 'DD/MM')
    if (!(dateStr in groupedData)) {
      allDate.push(date)
      groupedData[dateStr] = [item]
    } else {
      groupedData[dateStr].push(item)
    }
  }
  allDate.sort((d1, d2) => d1 - d2)
  let groupIndex = allDate.map((date) => format(date, 'DD/MM'))
  return {
    groupedData,
    groupIndex,
    zoomStartValue: startDate,
    xlabels: groupIndex,
  }
}

function xDataProccessorMonthly (data) {
  let groupedData = {}
  let validMonth = []

  for (let item of data) {
    let month = item.month
    if (validMonth.includes(month)) {
      groupedData[month].push(item)
    } else {
      validMonth.push(month)
      groupedData[month] = [item]
    }
  }

  validMonth = sortMonthNames(validMonth)

  return {
    groupedData,
    groupIndex: validMonth,
    xlabels: validMonth,
  }
}
function stackXDataProcessor (data, params) {
  let groupedData = {}
  let allDate = []
  let allWeek = []

  const startDate = (params && params.startDate) || new Date()
  const nowWeekend = moment(startDate).isoWeekday()
  // Compute all weekends date
  const realStartDate =
    nowWeekend === 1 ? startDate : moment(startDate).isoWeekday(8)
  for (let i = 0, count = 6; i <= count; ++i) {
    const realStart = moment(realStartDate).add(i, 'd').format('YYYY-MM-DD')
    const realStartWeek = moment(realStartDate).add(i, 'd').format('ddd')

    allDate.push(realStart)
    allWeek.push(realStartWeek)

    groupedData[realStartWeek] = []
  }
  for (let item of data) {
    let date = moment(item.date).format('YYYY-MM-DD')
    if (allDate.includes(date)) {
      const weekAbbr = moment(item.date).format('ddd')
      groupedData[weekAbbr].push(item)
    }
  }

  return {
    groupedData,
    groupIndex: allWeek,
    xlabels: allWeek,
  }
}

function stackXDataProcessorDaily (data) {
  const groupedData = groupBy(data, property('date'))
  const validDate = extractUniqValue(data, 'date').sort((a, b) => a - b)

  return {
    groupedData,
    groupIndex: validDate,
    xlabels: validDate.map((d) => moment(d).format('DD/MM')),
  }
}

function stackXDataProcessorMonthly (data, params) {
  let groupedData = {}
  let validMonth = []

  for (let item of data) {
    let month = item.month
    if (validMonth.includes(month)) {
      groupedData[month].push(item)
    } else {
      validMonth.push(month)
      groupedData[month] = [item]
    }
  }

  validMonth = sortMonthNames(validMonth)

  return {
    groupedData,
    groupIndex: validMonth,
    xlabels: validMonth,
  }
}

function sum (data, key) {
  return (data || []).reduce(
    (ret, next) => ret + next[key || 'DAILY FIELD PRODUCTION VOLS-Actual'],
    0,
  )
}

function avg (data, sumFunc = sum, denominator = data.length) {
  return data && data.length ? sumFunc(data) / denominator : 0
}

function sumMonthlyData (data) {
  return (data || []).reduce((ret, next) => ret + next.value, 0)
}

export const getLineChartSetting = generalLineLogic({
  seriesType: 'line',
  seriesItems: getCompany,
  sum,
  xDataProccessor,
  optionCreator: customLineOption,
  filter: filterByCompany,
})

export const getLineChartSettingMonthly = generalLineLogic({
  seriesType: 'line',
  seriesItems: getCompany,
  sum: sumMonthlyData,
  xDataProccessor: xDataProccessorMonthly,
  optionCreator: customLineOption,
  filter: filterByCompany,
})

export const getBarDailyChartSetting = generalStackLogic({
  seriesType: 'bar',
  seriesItems: getCompany,
  xDataProccessor: stackXDataProcessorDaily,
  optionCreator: customStackOption,
  filter: filterByCompany,
  stackItems: ['Actual', 'Target'],
})

export const getBarChartSetting = generalStackLogic({
  seriesType: 'bar',
  seriesItems: getCompany,
  xDataProccessor: stackXDataProcessor,
  optionCreator: customStackOption,
  filter: filterByCompany,
  stackItems: ['Actual', 'Target'],
})

export const getBarChartSettingMonthly = generalStackLogicMonthly({
  seriesType: 'bar',
  seriesItems: getCompany,
  xDataProccessor: stackXDataProcessorMonthly,
  optionCreator: customStackOption,
  filter: filterByCompany,
  stackItems: ['Actual', 'Target'],
})

export const getStackChartSettingMonthly = generalStackLogicMonthly({
  seriesType: 'bar',
  seriesItems: getProdType,
  xDataProccessor: stackXDataProcessorMonthly,
  optionCreator: customStackOption,
  filter: filterByCompany,
  stackItems: getCompany,
})

export const getGaugeSetting = generalGaugeLogic({
  seriesType: 'gauge',
  seriesItems: getCompany,
  sum: sumMonthlyData,
  optionCreator: customGaugeOption,
  filter: filterByCompany,
})

function createCreator (filter) {
  return ({ data, ...rest }) => {
    return getLineChartSetting({
      data: filter(data),
      ...rest,
    })
  }
}
function createCreatorMonthly (filter) {
  return ({ data, ...rest }) => {
    return getLineChartSettingMonthly({
      data: filter(data),
      ...rest,
    })
  }
}

function barDailyCreator (filter) {
  return ({ data, ...rest }) => {
    return getBarDailyChartSetting({
      data: filter(data),
      ...rest,
    })
  }
}

function barWeeklyCreator (filter) {
  return ({ data, ...rest }) => {
    return getBarChartSetting({
      data: filter(data),
      ...rest,
    })
  }
}

function barMonthlyCreator (filter) {
  return ({ data, ...rest }) => {
    return getBarChartSettingMonthly({
      data: filter(data),
      ...rest,
    })
  }
}

function createWashlineCreatorMonthly (filter) {
  return ({ data, ...rest }) => {
    const validData = filter(data)
    const unit = get(validData, '[0].unit')
    const companies = getCompany(validData)
    const xAxisLabels = ['Target', ...companies, 'Actual']
    let incomeData = []
    let outcomeData = []
    let sumActual = 0
    let sumTarget = 0

    companies.forEach((company) => {
      let companyData = filterByCompany(company)(validData)
      let totalActual = sumMonthlyData(query(isActual)(companyData))
      let totalTarget = sumMonthlyData(query(isTarget)(companyData))
      let diff = totalTarget - totalActual

      if (diff > 0) {
        outcomeData.push(diff)
        incomeData.push(0)
      } else {
        outcomeData.push(0)
        incomeData.push(-diff)
      }

      sumActual += totalActual
      sumTarget += totalTarget
    })

    return {
      xAxisLabels,
      initValue: sumTarget,
      endValue: sumActual,
      incomeData,
      outcomeData,
      incomeLabel: 'exceeded',
      outcomeLabel: 'behind',
      unit,
      ...rest,
    }
  }
}

function createWashlineCreatorDaily (filter) {
  return ({ data, ...rest }) => {
    const validData = filter(data)
    const companies = getCompany(validData)
    const xAxisLabels = ['Plan', ...companies, 'LE']
    let incomeData = []
    let outcomeData = []
    let sumLE = 0
    let sumTarget = 0
    const unit = get(validData, '[0].unit')

    companies.forEach((company) => {
      let companyData = filterByCompany(company)(validData)
      let totalTarget = sum(companyData, 'DAILY FIELD PRODUCTION VOLS-Target')
      let totalLE = sum(companyData, 'DAILY FIELD PRODUCTION VOLS-LE')
      let diff = totalTarget - totalLE

      if (diff > 0) {
        outcomeData.push(diff)
        incomeData.push(0)
      } else {
        outcomeData.push(0)
        incomeData.push(-diff)
      }

      sumLE += totalLE
      sumTarget += totalTarget
    })

    return {
      xAxisLabels,
      initValue: sumTarget,
      endValue: sumLE,
      incomeData,
      outcomeData,
      incomeLabel: 'exceeded',
      outcomeLabel: 'behind',
      unit,
      ...rest,
    }
  }
}

function createMonthlyList (filter) {
  return ({ data, ...rest }) => {
    const validData = filter(data)
    const columnsConfig = [
      {
        name: 'name',
        dataKey: 'name',
        width: 250,
      },
      {
        name: 'company',
        dataKey: 'company',
        width: 150,
      },
      {
        name: 'block',
        dataKey: 'block',
        width: 150,
      },
      {
        name: 'month',
        dataKey: 'month',
        width: 150,
      },
      {
        name: 'year',
        dataKey: 'year',
        width: 150,
      },
      {
        name: 'unit',
        dataKey: 'unit',
        width: 150,
      },
      {
        name: 'Production',
        dataKey: 'value',
        width: 70,
      },
    ]

    return {
      data: validData,
      columnsConfig,
      hideSearchBar: true,
      rowsPerPage: 5,
      // defaultCsvFileTitle: '',
      configs: config2MhtConfig(columnsConfig),
      tableData: validData,
      ...commonMhtConfig,
    }
  }
}
export const tableWithPinConfig = [
  {
    name: 'Product',
    dataKey: 'hydrocarbon',
    width: 150,
  },
  {
    name: 'company',
    dataKey: 'company',
    width: 150,
  },
  {
    name: 'block',
    dataKey: 'block',
    width: 70,
  },
  {
    name: 'reportDate',
    dataKey: 'reportDate',
    width: 150,
  },
  {
    name: 'UNIT',
    dataKey: 'unit',
    width: 150,
  },
  {
    groupName: 'Production',
    columns: [
      {
        name: 'actual',
        dataKey: 'actual',
      },
      {
        name: 'target',
        dataKey: 'target',
      },
      {
        name: 'Le',
        dataKey: 'le',
      },
    ],
  },
]
export const tableWithMonthlyPinConfig = [
  {
    name: 'Product',
    dataKey: 'name',
  },
  {
    name: 'company',
    dataKey: 'company',
  },
  {
    name: 'block',
    dataKey: 'block',
  },
  {
    name: 'month',
    dataKey: 'month',
  },
  {
    name: 'year',
    dataKey: 'year',
  },
  {
    name: 'unit',
    dataKey: 'unit',
  },
  {
    name: 'value',
    dataKey: 'value',
  },
  {
    name: 'Data Type',
    dataKey: 'type',
  },
]
function createProductionDailyTableCreator () {
  return ({ data }) => {
    const names = uniq(data.map((d) => d.name)).filter((i) => i !== 'WATER')
    const groupedData = groupBy(data, 'date')
    const newData = Object.keys(groupedData).map((day) => {
      const items = groupedData[day]
      const blocks = groupBy(items, (d) => `${d.company}-${d.block}`)
      function calcuTotal (data) {
        return data.reduce(
          (a, b) => a + b['DAILY FIELD PRODUCTION VOLS-Actual'],
          0,
        )
      }
      const details = {}
      Object.keys(blocks).forEach((block) => {
        names.forEach((n) => {
          details[`${block}-${n}`] = calcuTotal(
            blocks[block].filter((i) => i.name === n),
          )
        })
      })
      return {
        displayDate: format(newDatePolyfill(day), 'DD/MM/YYYY'),
        ...details,
        Total: fixNbr(lodashSum(Object.values(details))),
      }
    })
    const longestItem = newData.reduce((a, b) => Object.assign({}, a, b), {})
    const columnsWithoutDate = Object.keys(longestItem).filter(
      (i) => i !== 'displayDate',
    )
    const footer = ['Total', 'avrg'].map((type) => {
      const total = columnsWithoutDate.map((i) => ({
        [i]: fixNbr(newData.reduce((a, b) => a + (b[i] || 0), 0)),
      }))
      const ave = columnsWithoutDate.map((i) => ({
        [i]: fixNbr(
          newData.reduce((a, b) => a + (b[i] || 0), 0) / newData.length,
        ),
      }))
      const rest =
        type === 'Total'
          ? total.reduce((a, b) => Object.assign({}, a, b), {})
          : ave.reduce((a, b) => Object.assign({}, a, b), {})
      return {
        displayDate: type,
        ...rest,
      }
    })
    const getColumnsConfig = (showHighlight) => [
      {
        name: 'Date',
        dataKey: 'displayDate',
        width: 150,
      },
      ...columnsWithoutDate.map((i) => ({
        name: i,
        dataKey: i,
      })),
    ]
    return {
      data: newData.concat(footer),
      getColumnsConfig,
      hideSearchBar: true,
      rowsPerPage: 12,
      configs: config2MhtConfig(getColumnsConfig()),
      tableData: newData.concat(footer),
      ...commonMhtConfig,
    }
  }
}
export const productionMonthlyTableColumnsConfig = [
  {
    name: 'PRODUCT',
    dataKey: 'name',
    width: 150,
  },
  {
    name: 'company',
    dataKey: 'company',
    width: 150,
  },
  {
    name: 'block',
    dataKey: 'block',
    width: 70,
  },
  {
    name: 'month',
    dataKey: 'month',
    width: 150,
  },
  {
    name: 'year',
    dataKey: 'year',
    width: 150,
  },
  {
    name: 'unit',
    dataKey: 'unit',
    width: 150,
  },
  {
    name: 'VALUE',
    dataKey: 'value',
    width: 150,
  },
  {
    name: 'Data Type',
    dataKey: 'dataType',
    width: 150,
  },
]
function createProductionMonthlyTableCreator (filter) {
  return ({ data: srcData }) => {
    let data = srcData
    if (filter) {
      data = filter(srcData)
    }
    return {
      data,
      columnsConfig: productionMonthlyTableColumnsConfig,
      hideSearchBar: true,
      rowsPerPage: 12,
      configs: config2MhtConfig(productionMonthlyTableColumnsConfig),
      tableData: data,
      ...commonMhtConfig,
    }
  }
}

function createDailySummaryCreator (filterMap) {
  return ({ data, ...rest }) => {
    const { groupedData, xlabels, groupIndex } = xDataProccessor(data)
    const seriesItems = Object.keys(filterMap)

    return {
      axisData: xlabels,
      units: extractUniqValue(data, 'unit').map((item) => ({ name: item })),
      detail: seriesItems
        .map((s) => {
          return {
            [s]: {
              data: (groupIndex || xlabels).map((x) => {
                return sum(filterMap[s](groupedData[x]))
              }),
              unit: filterMap[s](data)[0] && filterMap[s](data)[0].unit,
            },
          }
        })
        .reduce((pre, cur) => ({ ...pre, ...cur }), {}),
      zoomInside: true,
    }
  }
}

function createMonthlySummaryCreator (filterMap) {
  return ({ data, ...rest }) => {
    const { groupedData, xlabels, groupIndex } = xDataProccessorMonthly(data)
    const seriesItems = Object.keys(filterMap)
    return {
      axisData: xlabels,
      units: extractUniqValue(data, 'unit')
        .map((item) => ({ name: item }))
        .filter((i) => i.name !== 'COUNT' && i.name)
        .sort((a, b) => {
          const nameA = a.name.toUpperCase()
          const nameB = b.name.toUpperCase()
          if (nameA < nameB) {
            return -1
          }
          if (nameA > nameB) {
            return 1
          }
          return 0
        }),
      detail: seriesItems
        .map((s) => {
          return {
            [s]: {
              data: (groupIndex || xlabels).map((x) => {
                return sumMonthlyData(filterMap[s](groupedData[x]))
              }),
              unit: filterMap[s](data)[0] && filterMap[s](data)[0].unit,
            },
          }
        })
        .reduce((pre, cur) => ({ ...pre, ...cur }), {}),
      zoomInside: true,
    }
  }
}

function createDailyOilSummaryScatterCreator (filterMap) {
  return ({ data, configFilter, ...rest }) => {
    const { y = [], size = [] } = configFilter || {}

    const yFilters = compact(y.map((i) => filterMap[i.name]))
    const sizeFilters = compact(size.map((i) => filterMap[i.name]))
    const queryY = query(or(...yFilters))
    const querySize = query(or(...sizeFilters))
    const yData = queryY(data)
    const filteredData = query(or(...yFilters, ...sizeFilters))(data)

    const groupedByCompany = groupBy(filteredData, property('company'))
    const { xlabels: axisData } = xDataProccessor(filteredData)

    const detail = Object.keys(groupedByCompany)
      .map((k) => {
        const kData = groupedByCompany[k]
        const { groupedData, xlabels } = xDataProccessor(kData)
        const oilData = xlabels.map((x) => sum(queryY(groupedData[x])))
        const condensateData = xlabels.map((x) =>
          sum(querySize(groupedData[x])),
        )
        return {
          [k]: xlabels.map((x, i) => [x, oilData[i], condensateData[i]]),
        }
      })
      .reduce((pre, cur) => ({ ...pre, ...cur }), {})

    let unit = yData[0] && yData[0].unit

    return {
      detail,
      axisData,
      lableX: 'Date',
      lableY: unit,
      lableZ: size[0] && size[0].name,
      zoomInside: true,
    }
  }
}

function createMonthlyOilSummaryScatterCreator (filterMap) {
  return ({ data, configFilter, ...rest }) => {
    const { y = {}, size = {} } = configFilter || {}

    const yFilter = filterMap[(y[0] && y[0].name) || 'Oil']
    const sizeFilter = filterMap[(size[0] && size[0].name) || 'Condensate']
    const filteredData = query(or(yFilter, sizeFilter))(data)
    const yData = query(yFilter)(data)

    const groupedByCompany = groupBy(filteredData, property('company'))
    const { xlabels: axisData } = xDataProccessorMonthly(filteredData)

    const detail = Object.keys(groupedByCompany)
      .map((k) => {
        const kData = groupedByCompany[k]
        const { groupedData, xlabels } = xDataProccessorMonthly(kData)
        const yData = xlabels.map((x) =>
          sumMonthlyData(query(yFilter)(groupedData[x])),
        )
        const sizeData = xlabels.map((x) =>
          sumMonthlyData(query(sizeFilter)(groupedData[x])),
        )
        return {
          [k]: xlabels.map((x, i) => [x, yData[i], sizeData[i]]),
        }
      })
      .reduce((pre, cur) => ({ ...pre, ...cur }), {})

    let unit = yData[0] && yData[0].unit

    return {
      detail,
      axisData,
      lableX: 'Date',
      lableY: unit,
      lableZ: size[0] && size[0].name,
      zoomInside: true,
    }
  }
}

const mapDataConvert = mapDataCvtCreator({
  blockField: 'block',
  valueField: 'DAILY FIELD PRODUCTION VOLS-Actual',
})

const mapDataMonthlyConvert = mapDataCvtCreator({
  blockField: 'block',
  valueField: 'value',
})

function createWaterMongthlyTotal (filter) {
  return ({ data, ...rest }) => {
    const validData = filter(data)
    const companies = getCompany(validData)
    let sumActual = 0
    let sumTarget = 0

    companies.forEach((company) => {
      let companyData = filterByCompany(company)(validData)
      let totalActual = sumMonthlyData(query(isActual)(companyData))
      let totalTarget = sumMonthlyData(query(isTarget)(companyData))

      sumActual += totalActual
      sumTarget += totalTarget
    })

    return {
      detail: {
        actual: sumActual,
        target: sumTarget,
      },
    }
  }
}

function createTimelinePieCreatorMonthlyOverall (filter, categoryNames) {
  return ({ data, ...rest }) => {
    let validData = filter(data)
    const validMonth = sortMonthNames(extractUniqValue(validData, 'month'))
    let timelineData = validMonth.map((month) => {
      return {
        title: { text: '' },
        series: [
          {
            data: categoryNames.map((name) => {
              const sum = sumMonthlyData(
                query(
                  and(
                    eq('month', month),
                    or(eq('name', `${name} PROD`), eq('name', `${name} PRODN`)),
                  ),
                )(validData),
              )
              return { name, value: sum }
            }),
          },
        ],
      }
    })

    // data per company
    const companies = extractUniqValue(validData, 'company')

    let resData = {}
    categoryNames.map((type) => {
      if (!resData[type]) {
        resData[type] = {}
      }
      validMonth.map((month) => {
        if (!resData[type][month]) {
          resData[type][month] = []
        }
        resData[type][month] = companies.map((company) => {
          const sum = sumMonthlyData(
            query(
              and(
                eq('company', company),
                eq('month', month),
                or(eq('name', `${type} PROD`), eq('name', `${type} PRODN`)),
              ),
            )(validData),
          )

          return { name: company, value: sum }
        })
      })
    })

    return {
      categoryNames,
      timelineLables: validMonth,
      legendData: companies,
      data: resData,
      timelineData,
    }
  }
}
function createSummaryAverageCreator (filterMap) {
  return [
    ({ data }) => {
      const days = getDays()
      let unit
      const res = Object.keys(filterMap)
        .map((key) => {
          const filteredData = filterMap[key](data)
          unit = filteredData[0] && filteredData[0].unit
          return {
            [key]: fixNbr(avg(filteredData, undefined, days), 1),
          }
        })
        .reduce((pre, cur) => ({ ...pre, ...cur }), {})
      return { detail: res, unit }
    },
    ({ data }, { dataDrill, drillPath }) => {
      const days = getDays()
      const drillLevel = 1
      // master filter
      const value = dataDrill[drillLevel - 1].toUpperCase()
      const validData = query(eq(drillPath[drillLevel - 1], value))(data)
      const unit = validData[0] && validData[0].unit
      const drillKey = drillPath[drillLevel]
      const newSetNames = extractUniqValue(validData, drillKey)
      const detail = newSetNames.reduce((r, s) => {
        r[s] = avg(query(eq(drillKey, s))(validData), undefined, days)
        return r
      }, {})

      return { detail, unit }
    },
    ({ data }, { dataDrill, drillPath }) => {
      const drillLevel = 2
      const days = getDays()
      // master filter
      const validData = query(
        and(
          eq(
            drillPath[drillLevel - 2],
            dataDrill[drillLevel - 2].toUpperCase(),
          ),
          eq(drillPath[drillLevel - 1], dataDrill[drillLevel - 1]),
        ),
      )(data)
      const unit = validData[0] && validData[0].unit
      const drillKey = drillPath[drillLevel]
      const newSetNames = extractUniqValue(validData, drillKey)
      const detail = newSetNames.reduce((r, s) => {
        r[s] = avg(query(eq(drillKey, s))(validData), undefined, days)
        return r
      }, {})
      return { detail, unit }
    },
  ]
}

function createSummaryAverageTotalCreator (filterMap) {
  return ({ data }) => {
    let unit
    const days = getDays()
    const res = Object.keys(filterMap)
      .map((key) => {
        const filteredData = filterMap[key](data)
        unit = filteredData[0] && filteredData[0].unit
        return {
          [key]: avg(filteredData, undefined, days),
        }
      })
      .reduce((pre, cur) => ({ ...pre, ...cur }), {})
    return {
      detail: {
        Total: fixNbr(lodashSum(values(res)), 1),
      },
      unit,
    }
  }
}

function stackWellCountsMonthlyCreator (filter) {
  return ({ data, ...rest }) => {
    const wellCountData = query(or(isTotal, isClosedIn))(data)
    const { groupedData, xlabels, groupIndex } =
      xDataProccessorMonthly(wellCountData)

    let seriesNames = getProdType(wellCountData)
    let stackNames = ['Total', 'Closed-In']

    let series = []
    stackNames.forEach((stack) => {
      seriesNames.forEach((s) => {
        series.push({
          name: `${s}-${stack}`,
          type: 'bar',
          stack,
          data: (groupIndex || xlabels).map((x) => {
            const filteredData = filter(s)(groupedData[x])
            const retItem = filteredData.find((item) => item.dataType === stack)
            return retItem && retItem.value
          }),
        })
      })
    })
    return {
      unit: 'Wells Count',
      axisData: xlabels,
      series,
    }
  }
}

function createSummaryMonthlyCreator (filterMap) {
  return ({ data, ...rest }) => {
    const { year, month } = getMonths()
    let denominator = 1
    if (year.length && month.length) {
      denominator = year.length * month.length
    }
    let unit
    const res = Object.keys(filterMap)
      .map((key) => {
        const filteredData = filterMap[key](data)
        unit = filteredData[0] && filteredData[0].unit
        return {
          [key]: fixNbr(
            filteredData.reduce((a, b) => a + (+b.value || 0), 0) / denominator,
            1,
          ),
        }
      })
      .reduce((pre, cur) => ({ ...pre, ...cur }), {})
    return { detail: res, unit }
  }
}
function createSummaryAveTotalMonthlyCreator (filterMap) {
  return ({ data, ...rest }) => {
    const { year, month } = getMonths()
    let denominator = 1
    if (year.length && month.length) {
      denominator = year.length * month.length
    }
    let unit
    const res = Object.keys(filterMap)
      .map((key) => {
        const filteredData = filterMap[key](data)
        unit = filteredData[0] && filteredData[0].unit
        return {
          [key]: fixNbr(
            filteredData.reduce((a, b) => a + (+b.value || 0), 0) / denominator,
            1,
          ),
        }
      })
      .reduce((pre, cur) => ({ ...pre, ...cur }), {})
    return {
      detail: {
        Total: lodashSum(values(res)),
      },
      unit,
    }
  }
}

function createSummaryWaterMonthlyCreator () {
  return ({ data, ...rest }) => {
    let prodSum = sumMonthlyData(
      query(and(eq('name', 'WATER PROD'), isActual))(data),
    )
    let injSum = sumMonthlyData(
      query(and(eq('name', 'WATER INJ'), isActual))(data),
    )
    let disposalSum = sumMonthlyData(
      query(and(eq('name', 'WATER DISPOSAL'), isActual))(data),
    )

    return {
      detail: {
        Production: prodSum,
        Injection: injSum,
        Disposal: disposalSum,
      },
    }
  }
}

export const getOilMonthlyLineChartOption = createCreatorMonthly(
  query(and(isMonthlyOil, isActual)),
)
export const getNAGMonthlyLineChartOption = createCreatorMonthly(
  query(and(isMonthlyNAG, isActual)),
)
export const getAGMonthlyLineChartOption = createCreatorMonthly(
  query(and(isMonthlyAG, isActual)),
)
export const getWaterMonthlyLineChartOption = createCreatorMonthly(
  query(and(isMonthlyWater, isActual)),
)
export const getCondensateMonthlyLineChartOption = createCreatorMonthly(
  query(and(isMonthlyCondensate, isActual)),
)

export const getOilDailyWashlineChartOption = createWashlineCreatorDaily(
  query(isOilData),
)
export const getCondensateDailyWashlineChartOption = createWashlineCreatorDaily(
  query(isCondensateData),
)
export const getAGDailyWashlineChartOption = createWashlineCreatorDaily(
  query(isAGData),
)
export const getNAGDailyWashlineChartOption = createWashlineCreatorDaily(
  query(isNAGData),
)

export const getOilMonthlyWashlineChartOption = createWashlineCreatorMonthly(
  query(isMonthlyOil),
)
export const getNAGMonthlyWashlineChartOption = createWashlineCreatorMonthly(
  query(isMonthlyNAG),
)
export const getAGMonthlyWashlineChartOption = createWashlineCreatorMonthly(
  query(isMonthlyAG),
)
export const getWaterMonthlyWashlineChartOption = createWashlineCreatorMonthly(
  query(isMonthlyWater),
)

export const getWaterMonthlyList = createMonthlyList(query(isMonthlyWater))

export const generalMapChartOption = ({ data }) => {
  return {
    mapScroll: false,
    mapName: 'Production Map',
    baseLayerName: 'Bing Road',
    queryData: mapDataConvert(data),
  }
}

export const getWaterMonthlyTotal = createWaterMongthlyTotal(
  query(isMonthlyWater),
)

export const getCondensateMonthlyWashlineChartOption =
  createWashlineCreatorMonthly(query(isMonthlyCondensate))
const createProductionBalance = (filter) => {
  return ({ data, ...rest }) => {
    const xlabels = groupBy(data, (i) => `${i.year}-${i.month}`)
    const seriesNames = ['Production', 'Orpic Delivery', 'Export']
    const axisData = sortByYearAndMonth(Object.keys(xlabels))
    const series = seriesNames.map((s) => {
      let filterFunc
      switch (s) {
        case 'Production':
          filterFunc = (i) =>
            (i.name === 'OIL PRODN' && i.dataType === 'Actual') ||
            (i.name === 'CONDENSATE PROD' && i.dataType === 'Actual')
          break
        case 'Orpic Delivery':
          filterFunc = (i) => i.destination === 'totalGDTORPIC'
          break
        default:
          filterFunc = (i) =>
            i.destination !== 'totalGDTORPIC' && i.cameFrom === 'tracking'
          break
      }

      const common = {
        name: s,
        type: 'bar',
        data: axisData.map((x) => {
          const items = xlabels[x].filter(filterFunc)
          return items.reduce((a, b) => a + b.value, 0)
        }),
      }
      if (s === 'Production') {
        return common
      }
      return {
        ...common,
        stack: 'right',
      }
    })
    return {
      unit: 'bbl/d',
      axisData,
      series,
    }
  }
}
export const getProductionBalance = createProductionBalance(query(isNotFromNg))

export const getOverallProductionMonthlyTimelinePieChartOption =
  createTimelinePieCreatorMonthlyOverall(query(isActual), [
    'OIL',
    'NAG',
    'AG',
    'WATER',
    'CONDENSATE',
  ])
export const getOilMonthlyBarChartOption = barMonthlyCreator(
  query(isMonthlyOil),
)
export const getNAGMonthlyBarChartOption = barMonthlyCreator(
  query(isMonthlyNAG),
)
export const getAGMonthlyBarChartOption = barMonthlyCreator(query(isMonthlyAG))
export const getCondensateMonthlyBarChartOption = barMonthlyCreator(
  query(isMonthlyCondensate),
)
export const getWaterMonthlyBarChartOption = barMonthlyCreator(
  query(isMonthlyWater),
)

export const getGasDailyLineChartOption = createCreator(query(isNAGData))

export const getOilDailyLineChartOption = createCreator(query(isOilData))

export const getCondensateDailyLineChartOption = createCreator(
  query(isCondensateData),
)
export const getAgDailyLineChartOption = createCreator(query(isAGData))

export const getWaterDailyLineChartOption = createCreator(query(isWaterData))

export const getOilDailyBarChartOptionGen = barDailyCreator
export const getOilWeeklyChartOption = barWeeklyCreator(query(isOilData))
export const getGasWeeklyChartOption = barWeeklyCreator(query(isNAGData))
export const getCondensateWeeklyChartOption = barWeeklyCreator(
  query(isCondensateData),
)
export const getAgWeeklyChartOption = barWeeklyCreator(query(isAGData))
export const getWaterWeeklyChartOption = barWeeklyCreator(query(isWaterData))

const isSteamInjectionData = eq('name', 'STEAM INJECTION (bbl/d)')
export const getSteamInjectionDailyLineChartOption = createCreator(
  query(isSteamInjectionData),
)

const isGasInjectionData = eq('name', 'Gas Injection (MM scf/d)')
export const getGasInjectionData = createCreator(query(isGasInjectionData))

export const getOilDailySummayTotal = createSummaryAverageCreator({
  Oil: query(isOilData),
  Condensate: query(isCondensateData),
  Water: query(isWaterData),
})
export const getOilCondAveTotal = createSummaryAverageTotalCreator({
  Oil: query(isOilData),
  Condensate: query(isCondensateData),
})
export const getAgNagAveTotal = createSummaryAverageTotalCreator({
  NAG: query(isNAGData),
  AG: query(isAGData),
})
export const getOilDailySummayTotalGas = createSummaryAverageCreator({
  NAG: query(isNAGData),
  AG: query(isAGData),
})

export const getOilDailyFluidsSummary = createSummaryAverageCreator({
  Oil: query(isOilData),
  Condensate: query(isCondensateData),
})
export const getOilDailyGasSummary = createSummaryAverageCreator({
  NAG: query(isNAGData),
  AG: query(isAGData),
})

export const getDailyProductionData = createProductionDailyTableCreator()

export const getDailySummaryLineBarChart = createDailySummaryCreator({
  AG: query(isAGData),
  Oil: query(isOilData),
  Condensate: query(isCondensateData),
  Water: query(isWaterData),
  NAG: query(isNAGData),
})

export const getDailyChartBubble = createDailyOilSummaryScatterCreator({
  AG: isAGData,
  Oil: isOilData,
  Condensate: isCondensateData,
  Water: isWaterData,
  NAG: isNAGData,
})

export const getFluidsMonthlyFluidsSummary = createSummaryMonthlyCreator({
  Oil: query(and(isMonthlyOil, isActual)),
  Condensate: query(and(isMonthlyCondensate, isActual)),
})

export const getFluidsMonthlyGasSummary = createSummaryMonthlyCreator({
  NAG: query(and(isMonthlyNAG, isActual)),
  AG: query(and(isMonthlyAG, isActual)),
})

export const getWaterMonthlySummary = createSummaryWaterMonthlyCreator()

export const getOilMonthlyTotalBBL = createSummaryMonthlyCreator({
  Oil: query(and(isMonthlyOil, isActual)),
  Condensate: query(and(isMonthlyCondensate, isActual)),
})
export const getOilMonthlyAvgTotalBBL = createSummaryAveTotalMonthlyCreator({
  Oil: query(and(isMonthlyOil, isActual)),
  Condensate: query(and(isMonthlyCondensate, isActual)),
})
export const getOilMonthlyTotalMM = createSummaryMonthlyCreator({
  NAG: query(and(isMonthlyNAG, isActual)),
  AG: query(and(isMonthlyAG, isActual)),
})
export const getOilMonthlyAvgTotalMM = createSummaryAveTotalMonthlyCreator({
  NAG: query(and(isMonthlyNAG, isActual)),
  AG: query(and(isMonthlyAG, isActual)),
})

export const getMonthlySummaryLineBarChart = createMonthlySummaryCreator({
  AG: query(and(isMonthlyAG, isActual)),
  Oil: query(and(isMonthlyOil, isActual)),
  Condensate: query(and(isMonthlyCondensate, isActual)),
  Water: query(and(isMonthlyWater, isActual)),
  NAG: query(and(isMonthlyNAG, isActual)),
})

export const getMonthlyChartBubble = createMonthlyOilSummaryScatterCreator({
  AG: and(isMonthlyAG, isActual),
  Oil: and(isMonthlyOil, isActual),
  Condensate: and(isMonthlyCondensate, isActual),
  Water: and(isMonthlyWater, isActual),
  NAG: and(isMonthlyNAG, isActual),
})

export const generalMonthlyMapChart = ({ data }) => {
  return {
    mapScroll: false,
    mapName: 'Monthly Production Map',
    baseLayerName: 'Bing Road',
    queryData: mapDataMonthlyConvert(query(or(isActual, isTarget))(data)),
  }
}

export const getMonthlyProductionData = createProductionMonthlyTableCreator(
  query(or(isActual, isTarget)),
)

export const getOilMonthlyBarChartOptionGen = barMonthlyCreator

export const getWellCountsStackChart =
  stackWellCountsMonthlyCreator(filterByName)
export const getWellCountsData = createProductionMonthlyTableCreator(
  query(or(isTotal, isClosedIn)),
)
