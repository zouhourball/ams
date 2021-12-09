import { chartsPageCreator } from 'components/charts-page'
import ChartText from 'components/chart-text'
import { mcDFBySize } from 'components/analytics/utils'
import { creatorMaker } from 'components/analytics/utils/creator-maker'
import { query, eq, and, or } from 'libs/utils/query'
import DataTable from '@target-energysolutions/data-table'
import { groupBy, sumBy } from 'lodash-es'
import { createQTvsVariCreator, createTLvsVariCreator } from './chart-creators'
import './styles.scss'
import { extractUniqValue, fixNbr } from 'libs/utils'
import { getDaysInOneMonth, keepDecimal } from 'libs/utils/math-helper'
import {
  configMerge,
  title,
  pie,
  toolbox,
  vbar,
  line,
  vbarline,
  stack,
  flattenTransform,
  dataFilter,
  table,
  card,
} from 'components/analytics/utils/charts-config-helper'
// import i18n from 'i18n-js'
// import l from 'libs/langs/keys'

const isActualLifting = eq('type', 'actualLifted')
const isCONSUMER = eq('terminalTypes', 'CONSUMER')
const isSm3 = eq('type', 'Sm3 x 103')
const isSUPPLIER = eq('terminalTypes', 'SUPPLIER')
const isRate = eq('type', 'rate')
const isNoRate = or(
  eq('type', 'M95'),
  eq('type', 'M91'),
  eq('type', 'Kerosen'),
  eq('type', 'M98'),
  eq('type', 'GasOil'),
)
const isSUPPLIERandSm3 = and(isSUPPLIER, isSm3)
const isCONSUMERandSm3 = and(isCONSUMER, isSm3)
const mc21 = mcDFBySize(2, 1, ['company'])
const mc41 = mcDFBySize(4, 1, ['company'])

const mc11 = mcDFBySize(1, 1, ['company'])
const mc42 = mcDFBySize(4, 2, ['company'])
const mc21Pie = mc21('pie', null)
const mc11Card = mc11('card', ChartText)
const mc21lineBar = mc21('line-bar', null)
const mc42Table = mc42('table', DataTable)
const editor = () => ({
  editors: [
    {
      section: 'map',
      type: 'exclusive-selector',
      options: [
        {
          exclusiveGroup: 'sp',
          label: 'GroupBy',
          field: 'seriesBy',
          items: ['company', 'year'],
        },
        {
          exclusiveGroup: 'sp',
          label: 'X',
          field: 'split1By',
          items: ['month', 'kpiGroup', 'category', 'kpi'],
        },
      ],
    },
  ],
})

const flattenPPConfig = {
  columns: ['saleQuantityM95', 'saleQuantityM91', 'saleQuantityGasOil'],
  typeColumn: 'type',
  valueColumn: 'value',
}
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

const tableWithSetting = (columns) =>
  table({
    setting: {
      columns,
      showSearchBar: true,
    },
  })

const cardHideLabel = card({
  map: {
    split1By: '-',
    value1Key: 'value',
  },
  setting: {
    hideLabel: true,
  },
})

const barWithDatacompany = vbar({
  map: {
    split1By: 'datacompany',
    value1Key: 'value',
  },
  setting: {
    showLegend: true,
  },
})
const pieWithGover = pie({
  map: {
    split1By: 'governorat',
    value1Key: 'saleQuantityTotal',
  },
  setting: {
    showLegend: true,
  },
})
const pieWithProduct = pie({
  map: {
    split1By: 'type',
    value1Key: 'value',
  },
  setting: {
    showLegend: true,
  },
})
const vBarWithGoverAndProduct = vbar({
  map: {
    seriesBy: 'governorat',
    split1By: 'type',
    value1Key: 'value',
  },
  setting: {
    showLegend: true,
  },
})

const vBarLineSetting = vbarline({
  setting: {
    showDataZoomSlider: true,
    showLegend: true,
    value1Fmt: 'numberFmt',
    lineUnit: 'Variance',
    barUnit: 'Quota',
  },
  formatter: [
    {
      name: 'numberFmt',
      type: 'toFixed',
      params: [0],
    },
  ],
})
const vBarStackMap = stack({
  map: {
    seriesBy: 'company',
    groupBy: 'unit',
    splitBy: 'datacompany',
    value1Key: 'value',
  },
  setting: {
    showLegend: true,
  },
})
const LineWithGover = line({
  map: {
    split1By: 'governorat',
    value1Key: 'rate',
  },
  setting: {
    showLegend: true,
  },
})
const filterByCompanyBlock = () => ({
  filter: {
    type: 'simple',
    definition: [
      {
        type: 'check',
        label: 'company',
        field: 'company',
      },
      {
        type: 'check',
        label: 'block',
        field: 'block',
        filterBy: 'company',
      },
    ],
  },
})
const generateTitleWithHtml = (str, noBracket) => (
  <span>
    {str}
    {noBracket ? null : '('}
    Sm
    <sup className="sup-title">3</sup>x 10
    <sup className="sup-title">3</sup>
    {noBracket ? null : ')'}
  </span>
)
const reduceValue = (data) => data.reduce((a, b) => a + (+b || 0), 0)
const mc21StackBar = mc21(
  'stack',
  null,
  creatorMaker({
    type: 'stack',
    config: {
      filterBy: query(isActualLifting),
      sliceByKeys: ['source', 'company', 'formCompany'],
      groupHandlerName: 'sum-value',
    },
  }),
)
const mc41Bar = mc41('bar', null)
const mc41Line = mc41('line', null)
const mc21Bar = mc21('bar', null)
const calculateNg = (data, type) => {
  const monthArr = extractUniqValue(data, 'month')
  const yearArr = extractUniqValue(data, 'year')
  const days = monthArr
    .map((i) =>
      yearArr.map((y) => getDaysInOneMonth(y, i)).reduce((a, b) => a + b, 0),
    )
    .reduce((a, b) => a + b, 0)
  const isType = eq('type', type)
  const totalOnSpecsGasDelivery = reduceValue(
    query(and(isCONSUMER, isType), data).map((i) => i.value),
  )
  const dailyAverage = totalOnSpecsGasDelivery / days
  const totalSuppliers = reduceValue(
    query(and(isSUPPLIER, isType), data).map((i) => i.value),
  )
  const OGCTotalGasEmission = reduceValue(
    monthArr.map((m) => {
      const curData = query(isType, data).filter((o) => o.month === m)
      return curData && curData[0] ? curData[0].oGCTotalGasEmission : 0
    }),
  )

  const OGCTotalFuelCompressorsConsumptions = reduceValue(
    monthArr.map((m) => {
      const curData = query(isType, data).filter((o) => o.month === m)
      return curData && curData[0]
        ? curData[0].oGCTotalFuelCompressorsConsumptions
        : 0
    }),
  )
  const netDeliveredGas =
    totalSuppliers -
    (totalOnSpecsGasDelivery +
      OGCTotalGasEmission +
      OGCTotalFuelCompressorsConsumptions)
  const netDeliveredGasPercentage = `${keepDecimal(
    (netDeliveredGas / (totalOnSpecsGasDelivery || 1)) * 100,
    2,
  )}%`

  return {
    'Total On-Specs Gas Delivery': keepDecimal(totalOnSpecsGasDelivery, 2),
    'Daily Average': keepDecimal(dailyAverage, 2),
    'Total Supplier': keepDecimal(totalSuppliers, 2),
    'OGC Total Gas Emission': keepDecimal(OGCTotalGasEmission, 2),
    'OGC Total Fuel Compressors Consumptions': keepDecimal(
      OGCTotalFuelCompressorsConsumptions,
      2,
    ),
    'Net Delivered Gas': keepDecimal(netDeliveredGas, 2),
    'Net Delivered Gas %': netDeliveredGasPercentage,
  }
}

const extractUniqValueStr = `function extractUniqValue(d, key) {
  let  obj = {}
  return d.reduce((acc, cur) => {
    if(!obj[cur[key]]){
      obj[cur[key]] = 1
      return acc.concat([cur[key]])
    }
    return acc
  }, [])
}`

const calculateNgStr = `
${extractUniqValueStr}
function getDaysInOneMonth(year, month) {
  const monthNum = mapMonthNameToNumber(month)
  const d = new Date(year, monthNum, 0)
  return d.getDate()
}
function mapMonthNameToNumber(monthName) {
  switch (monthName) {
    case "January":
    case "Jan":
    case "JAN":
      return 1

    case "February":
    case "Feb":
    case "FEB":
      return 2

    case "March":
    case "Mar":
    case "MAR":
      return 3

    case "April":
    case "Apr":
    case "APRIL":
      return 4

    case "May":
    case "MAY":
      return 5

    case "June":
    case "Jun":
    case "JUNE":
      return 6

    case "July":
    case "Jul":
    case "JULY":
      return 7

    case "August":
    case "Aug":
    case "AUGUST":
      return 8

    case "September":
    case "Sep":
    case "SEP":
      return 9

    case "October":
    case "Oct":
    case "OCT":
      return 10

    case "November":
    case "Nov":
    case "NOV":
      return 11

    case "December":
    case "Dec":
    case "DEC":
      return 12

    default:
      return 0
  }
}
function createRound(methodName) {
  const func = Math[methodName]
  return (number, precision) => {
    precision = precision == null ? 0 : (precision >= 0 ? Math.min(precision, 292) : Math.max(precision, -292))
    if (precision) {
      let pair = \`\${number}e\`.split('e')
      const value = func(\`\${pair[0]}e\${+pair[1] + precision}\`)

      pair = \`\${value}e\`.split('e')
      return +\`\${pair[0]}e\${+pair[1] - precision}\`
    }
    return func(number)
  }
}
var round = createRound('round')
function keepDecimal(num, index) {
  const decimals = num.toString().split(".")[1]
  if (decimals && decimals.length > index) {
    return round(num, index)
  }
  return Number(num)
}
var condCreator = predict =>
  curry((extractor, value) => {
    let ext = makeSureItIsAExtractor(extractor)
    return ele => predict(ext(ele), value)
})
function isString(value) {
  const type = typeof value
  return type == 'string' || (type == 'object' && value != null && !Array.isArray(value) && getTag(value) == '[object String]')
}
function property (str) {
  const keyArr = str.split('.')
  return function getVal(data){
    let temp = null
    keyArr.forEach( key=>{
      temp = temp ? temp[key] : data[key]
    })
    return temp
  }
}
var and = (...filterFns) => ele =>
  filterFns.every(filterFn => filterFn(ele))
function makeSureItIsAExtractor(extractor) {
  if (isString(extractor)) {
    return property(extractor)
  } else if (typeof extractor === 'function') {
    return extractor
  }
  throw new Error(\`Unsupported extractor \${extractor}\`)
}
var eq = condCreator((l, r) => l === r)
function curry(fn) {
  var  _argLen = fn.length

  function wrap(...arg) {
      var _args = [].slice.call(arg)
      function act(...argInner) {
          _args = _args.concat([].slice.call(argInner))
          if(_args.length === _argLen) {
            return fn.apply(null, _args)
          }
          return act
      }
      if(_args.length === _argLen) {
              return fn.apply(null, _args)
      }

      act.toString = function() {
        return fn.toString()
      }
      return act
  }
  return wrap
}
var query = curry((filterFn, data) => {
  if (!data || !data.filter) {
    console.warn(\`Filter on non-array\`)
    return []
  }
  return data.filter(filterFn)
})
const isSUPPLIER = eq("terminalTypes", "SUPPLIER")
const isCONSUMER = eq("terminalTypes", "CONSUMER")
const reduceValue = data => data.reduce((a, b) => a + (+b || 0), 0)
const calculateNg = (data, type) => {

  const monthArr = extractUniqValue(data, "month")
  const yearArr = extractUniqValue(data, "year")
  const days = monthArr
    .map(i =>
      yearArr.map(y => getDaysInOneMonth(y, i)).reduce((a, b) => a + b, 0),
    )
    .reduce((a, b) => a + b, 0)

  const isType = eq("unit", type)

  const totalOnSpecsGasDelivery = reduceValue(
    query(and(isCONSUMER, isType), data).map(i => i.value),
  )

  const dailyAverage = totalOnSpecsGasDelivery / days
  const totalSuppliers = reduceValue(
    query(and(isSUPPLIER, isType), data).map(i => i.value),
  )

  const OGCTotalGasEmission = reduceValue(
    monthArr.map(m => {
      const curData = query(isType, data).filter(o => o.month === m)
      return curData && curData[0] ? curData[0].oGCTotalGasEmission : 0
    }),
  )

  const OGCTotalFuelCompressorsConsumptions = reduceValue(
    monthArr.map(m => {
      const curData = query(isType, data).filter(o => o.month === m)
      return curData && curData[0]
        ? curData[0].oGCTotalFuelCompressorsConsumptions
        : 0
    }),
  )
  const netDeliveredGas =
    totalSuppliers -
    (totalOnSpecsGasDelivery +
      OGCTotalGasEmission +
      OGCTotalFuelCompressorsConsumptions)
  const netDeliveredGasPercentage = keepDecimal(
    (netDeliveredGas / (totalOnSpecsGasDelivery || 1)) * 100,
    2,
  )
  return {
    "Total On-Specs Gas Delivery": keepDecimal(totalOnSpecsGasDelivery, 2),
    "Daily Average": keepDecimal(dailyAverage, 2),
    "Total Supplier": keepDecimal(totalSuppliers, 2),
    "OGC Total Gas Emission": keepDecimal(OGCTotalGasEmission, 2),
    "OGC Total Fuel Compressors Consumptions": keepDecimal(
      OGCTotalFuelCompressorsConsumptions,
      2,
    ),
    "Net Delivered Gas": keepDecimal(netDeliveredGas, 2),
    "Net Delivered Gas %": netDeliveredGasPercentage,
  }
}
`

const summaryConfig = [
  {
    name: 'company',
    dataKey: 'formCompany',
  },
  {
    name: 'Quota(MT)',
    dataKey: 'quota',
  },
  {
    groupName: 'Actual Lifting',
    columns: [
      {
        name: 'Source 1',
        dataKey: 'Source 1',
      },
      {
        name: 'Source 2',
        dataKey: 'Source 2',
      },
    ],
  },
  {
    name: 'Total Lifted(MT)',
    dataKey: 'totalLifted',
  },
  {
    name: 'Variance(MT)',
    dataKey: 'variance',
  },
]
const totalComsumersConfig = [
  {
    name: 'Table',
    dataKey: 'name',
  },
  {
    name: generateTitleWithHtml(),
    dataKey: 'Sm3 x 103',
    align: 'right',
  },
  {
    name: 'MJ',
    dataKey: 'MJ',
    align: 'right',
  },
  {
    name: 'MMBTU',
    dataKey: 'MMBTU',
    align: 'right',
  },
]
const totalComsumersConfig2 = [...totalComsumersConfig]
totalComsumersConfig2.splice(1, 1, {
  name: 'Sm^3 x 10^3',
  dataKey: 'Sm3 x 103',
  align: 'right',
})

export const chartsToDraw = [
  {
    title: 'LPG',
    reportType: 'LPG',
    groups: [
      {
        title: 'Summary',
        layout: 'float',
        charts: [
          mc21lineBar(
            createQTvsVariCreator,
            'Quota vs Variance',
            {
              pinConfig: configMerge(
                title('Quota vs Variance'),
                vbarline({
                  map: {
                    split1By: 'datacompany',
                    value1Key: 'quota',
                    value2Key: 'variance',
                  },
                }),
                vBarLineSetting,
                toolbox,
                editor,
                filterByCompanyBlock,
              ),
            },
            {},
          ),
          mc21lineBar(
            createTLvsVariCreator,
            'Total Lifted vs Variance',
            {
              pinConfig: configMerge(
                title('Total Lifted vs Variance'),
                vbarline({
                  map: {
                    split1By: 'datacompany',
                    value1Key: 'totalLifted',
                    value2Key: 'variance',
                  },
                  setting: {
                    showDataZoomSlider: true,
                    showLegend: true,
                    value1Fmt: 'numberFmt',
                    lineUnit: 'Variance',
                    barUnit: 'totalLifted',
                  },
                }),
                toolbox,
                editor,
                filterByCompanyBlock,
                numberNdFmt(0),
              ),
            },
            {},
          ),
          mc21StackBar(
            'Actual Lifting',
            {
              pinConfig: configMerge(
                title('Actual Lifting'),
                vBarStackMap,
                toolbox,
                editor,
                filterByCompanyBlock,
                numberNdFmt(0),
              ),
            },
            {},
          ),
          mc21Bar(
            creatorMaker({
              type: 'bar',
              config: {
                sliceByKeys: ['type', 'formCompany'],
                groupHandlerName: 'sum-value',
                filterBy: query(eq('type', 'totalLifted')),
                zoomInside: true,
              },
            }),
          )(
            'Total Lifting',
            {
              pinConfig: configMerge(
                title('Total Lifting'),
                barWithDatacompany,
                toolbox,
                editor,
                filterByCompanyBlock,
                numberNdFmt(0),
              ),
            },
            {},
          ),
          mc42Table(
            creatorMaker({
              type: 'table',
              config: {
                dataFormatter: (data) => {
                  const groupByData = groupBy(data, (item) => item.formCompany)
                  return Object.keys(groupByData).map((formCompany) => {
                    const dataByFormCompany = groupByData[formCompany]
                    const quotaData = dataByFormCompany.filter(
                      (i) => i.type === 'quota',
                    )
                    const Source1Data = dataByFormCompany.filter(
                      (i) => i.source === 'Source 1',
                    )
                    const Source2Data = dataByFormCompany.filter(
                      (i) => i.source === 'Source 2',
                    )
                    const totalLiftedData = dataByFormCompany.filter(
                      (i) => i.type === 'totalLifted',
                    )
                    const varianceData = dataByFormCompany.filter(
                      (i) => i.type === 'variance',
                    )
                    return {
                      formCompany,
                      quota: sumBy(quotaData, 'value'),
                      'Source 1': fixNbr(sumBy(Source1Data, 'value'), 2),
                      'Source 2': fixNbr(sumBy(Source2Data, 'value'), 2),
                      totalLifted: sumBy(totalLiftedData, 'value'),
                      variance: sumBy(varianceData, 'value'),
                    }
                  })
                },
                rowsPerPage: 7,
                columnsConfig: summaryConfig,
              },
            }),
          )(
            'Summary',
            {
              pinConfig: configMerge(
                title('Summary'),
                tableWithSetting(summaryConfig),
                toolbox,
                filterByCompanyBlock,
                numberNdFmt(3),
                {
                  transform: [
                    {
                      type: 'javascript',
                      code: `
                      function transform(data) {
                        const newData = []
                        data.forEach(i => {
                          if (newData.some(a => a.formCompany === i.formCompany)) {
                            const item = newData.find(
                              a => a.formCompany === i.formCompany,
                            )
                            if (i.unit) {
                              item[i.unit] = i.value
                            } else {
                              item[i.type] = i.value
                            }
                          } else {
                            newData.push({
                              ...i,
                              [i.type]: i.value,
                            })
                          }
                        })
                        return newData
                      }
                      `,
                    },
                  ],
                },
              ),
            },
            {
              exportFileName: 'downstream-lgp-summary',
            },
          ),
        ],
      },
    ],
  },
  {
    title: 'NG',
    reportType: 'NG',
    groups: [
      {
        title: 'Summary',
        layout: 'float',
        charts: [
          mc11Card(
            creatorMaker({
              type: 'card',
              config: {
                filterBy: query(isCONSUMERandSm3),
                groupHandlerName: 'sum-value',
              },
            }),
          )(
            generateTitleWithHtml('Total Consumers'),
            {
              pinConfig: configMerge(
                title('Total Consumers (Sm^3 * 10^3)'),
                dataFilter({
                  and: [
                    {
                      eq: ['terminalTypes', 'CONSUMER'],
                    },
                    {
                      eq: ['unit', 'Sm3 x 103'],
                    },
                  ],
                }),
                cardHideLabel,
                filterByCompanyBlock,
              ),
            },
            {},
          ),
          mc11Card(
            creatorMaker({
              type: 'card',
              config: {
                filterBy: query(isSUPPLIERandSm3),
                groupHandlerName: 'sum-value',
              },
            }),
          )(
            generateTitleWithHtml('Total Suppliers'),
            {
              pinConfig: configMerge(
                title('Total Consumers (Sm^3 * 10^3)'),
                cardHideLabel,
                dataFilter({
                  and: [
                    {
                      eq: ['terminalTypes', 'SUPPLIER'],
                    },
                    {
                      eq: ['unit', 'Sm3 x 103'],
                    },
                  ],
                }),
                filterByCompanyBlock,
              ),
            },
            {},
          ),
          mc21Pie(
            creatorMaker({
              type: 'pie',
              config: {
                sliceByKeys: ['terminalTypes'],
                groupHandlerName: 'sum-value',
                filterBy: query(isSm3),
              },
            }),
          )(
            generateTitleWithHtml('Total Consumers Vs  Total Suppliers'),
            {
              pinConfig: configMerge(
                title('Total Consumers Vs  Total Suppliers'),
                filterByCompanyBlock,
                toolbox,
                pie({
                  map: {
                    split1By: 'terminalTypes',
                    value1Key: 'value',
                  },
                  setting: {
                    showLegend: true,
                  },
                }),
                numberNdFmt(2),
              ),
            },
            {},
          ),
          mc21Bar(
            creatorMaker({
              type: 'bar',
              config: {
                filterBy: query(isCONSUMER),
                groupHandlerName: 'sum-value',
                sliceByKeys: ['type', 'terminalTypes'],
                precision: 0,
              },
            }),
          )(
            'Consumers',
            {
              pinConfig: configMerge(
                title('Consumers'),
                pie({
                  map: {
                    seriesBy: 'unit',
                    split1By: 'terminalTypes',
                    value1Key: 'value',
                  },
                  setting: {
                    showLegend: true,
                  },
                }),
                dataFilter({ eq: ['terminalTypes', 'CONSUMER'] }),
                filterByCompanyBlock,
                toolbox,
                numberNdFmt(0),
              ),
            },
            {},
          ),
          mc21Bar(
            creatorMaker({
              type: 'bar',
              config: {
                filterBy: query(isSUPPLIER),
                groupHandlerName: 'sum-value',
                sliceByKeys: ['type', 'terminalTypes'],
                precision: 0,
              },
            }),
          )(
            'Suppliers',
            {
              pinConfig: configMerge(
                title('Suppliers'),
                pie({
                  map: {
                    seriesBy: 'unit',
                    split1By: 'terminalTypes',
                    value1Key: 'value',
                  },
                  setting: {
                    showLegend: true,
                  },
                }),
                dataFilter({ eq: ['terminalTypes', 'SUPPLIER'] }),
                filterByCompanyBlock,
                toolbox,
                numberNdFmt(0),
              ),
            },
            {},
          ),
          mc11Card(({ data }) => {
            return {
              detail: {
                '': calculateNg(data, 'Sm3 x 103')['Net Delivered Gas'],
              },
              unit: generateTitleWithHtml(null, true),
            }
          })(
            'Net Deliverd Gas',
            {
              pinConfig: configMerge(
                title('Net Deliverd Gas'),
                {
                  transform: [
                    {
                      type: 'javascript',
                      code: `function transform(data) {
                      ${calculateNgStr}
                      return [{
                        value: calculateNg(data, "Sm3 x 103")["Net Delivered Gas"]
                      }]
                    }`,
                    },
                  ],
                },
                cardHideLabel,
                filterByCompanyBlock,
              ),
            },
            {},
          ),
          mc11Card(({ data }) => {
            return {
              detail: {
                '': calculateNg(data, 'Sm3 x 103')['Net Delivered Gas %'],
              },
              unit: '',
            }
          })(
            'Net Deliverd Gas %',
            {
              pinConfig: configMerge(
                title('Net Deliverd Gas %'),
                {
                  transform: [
                    {
                      type: 'javascript',
                      code: `function transform(data) {
                      ${calculateNgStr}
                      return [{
                        value: calculateNg(data, "Sm3 x 103")["Net Delivered Gas %"]
                      }]
                    }`,
                    },
                  ],
                  formatter: [
                    {
                      name: 'add%',
                      type: 'describe',
                      params: [{ after: '%' }],
                    },
                  ],
                  setting: {
                    split2Fmt: 'add%',
                  },
                },
                cardHideLabel,
                filterByCompanyBlock,
              ),
            },
            {},
          ),
          mc42Table(
            creatorMaker({
              type: 'table',
              config: {
                dataFormatter: (data) => {
                  const name = [
                    'Total On-Specs Gas Delivery',
                    'Daily Average',
                    'Total Supplier',
                    'OGC Total Gas Emission',
                    'OGC Total Fuel Compressors Consumptions',
                    'Net Delivered Gas',
                    'Net Delivered Gas %',
                  ]
                  const unitArr = extractUniqValue(data, 'type')
                  const memory = {}
                  const arr = name.map((i) => {
                    const others = unitArr
                      .map((unit) => {
                        if (!memory[unit]) {
                          memory[unit] = calculateNg(data, unit)
                        }
                        return {
                          [unit]: memory[unit][i],
                        }
                      })
                      .reduce((a, b) => ({ ...a, ...b }), {})
                    return {
                      name: i,
                      ...others,
                    }
                  })
                  return arr
                },
                rowsPerPage: 7,
                columnsConfig: totalComsumersConfig,
              },
            }),
          )(
            'Total Consumers',
            {
              pinConfig: configMerge(
                title('Total Consumers'),
                tableWithSetting(totalComsumersConfig2),
                toolbox,
                filterByCompanyBlock,
                {
                  transform: [
                    {
                      type: 'javascript',
                      code: `
                      function transform(data) {
                        ${calculateNgStr}
                        const name = [
                          "Total On-Specs Gas Delivery",
                          "Daily Average",
                          "Total Supplier",
                          "OGC Total Gas Emission",
                          "OGC Total Fuel Compressors Consumptions",
                          "Net Delivered Gas",
                          "Net Delivered Gas %",
                        ]
                        const unitArr = extractUniqValue(data, "unit")
                        const memory = {}
                        const arr = name.map(i => {
                          const others = unitArr
                            .map(unit => {
                              if ( !memory[unit] ){
                                memory[unit] = calculateNg(data, unit)
                              }
                              return {
                                [unit]: memory[unit][i],
                              }
                            })
                            .reduce((a, b) => ({ ...a, ...b }), {})
                          return {
                            name: i,
                            ...others,
                          }
                        })
                        return arr
                      }
                      `,
                    },
                  ],
                },
              ),
            },
            {
              exportFileName: 'downstream-ng-calculationn-summary',
            },
          ),
        ],
      },
    ],
  },
  {
    title: 'PP',
    reportType: 'PP',
    groups: [
      {
        title: 'Summary',
        layout: 'float',
        charts: [
          mc21Pie(
            creatorMaker({
              type: 'pie',
              config: {
                sliceByKeys: ['governorat'],
                groupHandlerName: 'sum-value',
                filterBy: query(isNoRate),
              },
            }),
          )(
            'Total by Governorate(LTR)',
            {
              pinConfig: configMerge(
                title('Total by Governorate(LTR)'),
                pieWithGover,
                toolbox,
                filterByCompanyBlock,
                numberNdFmt(0),
              ),
            },
            {},
          ),
          mc21Pie(
            creatorMaker({
              type: 'pie',
              config: {
                sliceByKeys: ['type'],
                groupHandlerName: 'sum-value',
                filterBy: query(isNoRate),
              },
            }),
          )(
            'Total by types of Product(LTR)',
            {
              pinConfig: configMerge(
                title('Total by types of Product(LTR)'),
                pieWithProduct,
                toolbox,
                flattenTransform(flattenPPConfig),
                filterByCompanyBlock,
                numberNdFmt(0),
              ),
            },
            {},
          ),
          mc41Bar(
            creatorMaker({
              type: 'bar',
              config: {
                sliceByKeys: ['governorat', 'type'],
                groupHandlerName: 'sum-value',
                precision: 0,
                filterBy: query(isNoRate),
                zoomInside: true,
              },
            }),
          )(
            'Governorate/Product type(LTR)',
            {
              pinConfig: configMerge(
                title('Governorate/Product type(LTR)'),
                vBarWithGoverAndProduct,
                flattenTransform(flattenPPConfig),
                toolbox,
                filterByCompanyBlock,
                numberNdFmt(0),
              ),
            },
            {},
          ),
          mc41Line(
            creatorMaker({
              type: 'bar',
              config: {
                sliceByKeys: ['type', 'governorat'],
                groupHandlerName: 'sum-value',
                filterBy: query(isRate),
              },
            }),
          )(
            'Governorat/Rate',
            {
              pinConfig: configMerge(
                title('Governorat/Rate'),
                LineWithGover,
                toolbox,
                filterByCompanyBlock,
                numberNdFmt(0),
              ),
            },
            {},
          ),
        ],
      },
    ],
  },
]

export default chartsPageCreator(chartsToDraw)
