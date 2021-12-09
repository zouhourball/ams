import SideCard from 'components/chart-side-card/series-total'
import {
  gas4andAgNagProd,
  isNAGData,
  waterProdInjDisposalData,
  getOilMonthlyAvgTotalBBL,
  getOilMonthlyAvgTotalMM,
  isOilData,
  isCondensateData,
  isAGData,
  isMonthlyAG,
  isMonthlyCondensate,
  isMonthlyNAG,
  isMonthlyOil,
  getFluidsMonthlyFluidsSummary,
  generalMapChartOption,
  getOilCondAveTotal,
  getOilDailySummayTotal,
  getAgNagAveTotal,
  getOilDailySummayTotalGas,
  getOilDailyFluidsSummary,
  getOilDailyGasSummary,
  getDailyProductionData,
  getOilDailyBarChartOptionGen,
  getDailySummaryLineBarChart,
  getDailyChartBubble,
  getOilMonthlyTotalBBL,
  getProductionBalance,
  getOilMonthlyTotalMM,
  getMonthlySummaryLineBarChart,
  getMonthlyChartBubble,
  generalMonthlyMapChart,
  getMonthlyProductionData,
  getOilMonthlyBarChartOptionGen,
  getWellCountsStackChart,
  getWellCountsData,
  productionMonthlyTableColumnsConfig,
  getFluidsMonthlyGasSummary,
  tableWithPinConfig,
  getOilMonthlyWashlineChartOption,
  getCondensateMonthlyWashlineChartOption,
  getOilDailyWashlineChartOption,
  getCondensateDailyWashlineChartOption,
  getAGDailyWashlineChartOption,
  getNAGDailyWashlineChartOption,
  tableWithMonthlyPinConfig,
  isSUPPLIERandSm3,
  isCONSUMERandSm3,
} from '../utils/production-chart-option-creators'
import ChartText from 'components/chart-text'
import { mcDFBySize, makeCharts } from 'components/analytics/utils'
import DataTable from '@target-energysolutions/data-table'
import { creatorMaker } from 'components/analytics/utils/creator-maker'
import TableWithColorHighlight from './table-with-color-highlight'
import Map from 'components/map'

import { transformGasBalance } from '../processors'
import {
  configMerge,
  vbarline,
  vbar,
  pie,
  hasDatePicker,
  scatter,
  dataFilter,
  formatter,
  stack,
  comparer,
  toolbox,
  flattenTransform,
  title,
  pinWashline,
  table as pinTable,
  card as pinCard,
  mapTransform,
} from 'components/analytics/utils/charts-config-helper'
import { dateFormat } from 'libs/utils'
// import i18n from 'i18n-js'
// import l from 'libs/langs/keys'
import { chartSizes } from 'components/analytics/utils/consts'
import { query, eq, not, or, and } from 'libs/utils/query'

const mc21 = mcDFBySize(2, 1)
const mc21StackBar = mc21('stack', null)
const mc21Bar = mc21('bar', null)
// const mc21Pie = mc21("pie", null)
// const fLine = [["company", "block"], "line", null]
const fLineBar = [['company', 'block'], 'line-bar', null]
const card = [['company', 'block'], 'card', ChartText]
const fPie = [['company', 'block'], 'pie', null]
const fTable = [['company', 'block'], 'table', DataTable]
const fHighlightTable = [
  ['company', 'block', 'name'],
  'table',
  TableWithColorHighlight,
]
const fScatter = (defaultSelect, defaultSize) => [
  [
    'company',
    'block',
    {
      name: 'y',
      label: 'Y',
      forConfig: true,
      items: ['Oil', 'Condensate', 'Water', 'NAG', 'AG'],
      axisOverride: true,
      defaultSelect,
      type: 'single',
    },
    {
      name: 'size',
      label: 'Size',
      forConfig: true,
      items: ['Oil', 'Condensate', 'Water', 'NAG', 'AG'],
      axisOverride: true,
      defaultSelect: defaultSize,
      type: 'single',
    },
  ],
  'scatter',
  null,
]
const fMap = (defaultSelect) => [
  [
    'company',
    'block',
    {
      name: 'name',
      label: ' ',
      defaultSelect,
    },
  ],
  'map',
  Map,
]
const drill = { drillPath: ['name', 'company', 'block'] }
const fBar = [['company', 'block'], 'stack', null]
const washline = [['company', 'block'], 'washline', null]
const mcSize1 = makeCharts([chartSizes.width1, chartSizes.height1])
const mcSize21 = makeCharts([chartSizes.width2, chartSizes.height1])
const mcSize2s1 = makeCharts([chartSizes.width2s, chartSizes.height1])
// const mcSize22 = makeCharts([width2, height2])
const mcSize42 = makeCharts([chartSizes.width4, chartSizes.height2])
// const mcS1Fline = mcSize1(...fLine)
const mcS1Fpie = mcSize21(...fPie)
// const mcS42Fline = mcSize42(...fLine)
const mcS42FMapD = mcSize42(...fMap(['OIL', 'CONDENSATE']))
const mcS42FMapM = mcSize42(...fMap(['OIL PRODN']))
const mcS1FCard = mcSize1(...card)
const mcS21FCard = mcSize21(...card)
const mcS42FTable = mcSize42(...fTable)
const mcS42FHighlightTable = mcSize42(...fHighlightTable)
const mcS21FBar = mcSize21(...fBar)
const mcS21FlineBar = mcSize2s1(...fLineBar)
const mcS21FScatter = mcSize21(...fScatter(['Oil'], ['Condensate']))
const mcS1FScatter = mcSize1(...fScatter(['Oil'], ['Condensate']))
const mcS42FBar = mcSize42(...fBar)
const mc21Washline = mcSize21(...washline)

const isTotal = eq('destination', 'totalGDTORPIC')
const isGasSale = eq('type', 'GAS SALE')
const isActual = eq('dataType', 'Actual')
const isNotTotal = not(isTotal)
const isFromTracking = eq('cameFrom', 'tracking')
const objCondIsNAGData = { eq: ['hydrocarbon', 'NAG'] }
const objCondIsOilData = { eq: ['hydrocarbon', 'OIL'] }
const objCondIsCondensateData = { eq: ['hydrocarbon', 'CONDENSATE'] }
const objCondIsAGData = { eq: ['hydrocarbon', 'AG'] }
const objCondIsWaterData = { eq: ['hydrocarbon', 'WATER'] }
const objCondIsOilProd = { eq: ['name', 'OIL PRODN'] }
const objCondIsCond = { eq: ['name', 'CONDENSATE PROD'] }
const objCondIsMonthlyNag = { eq: ['name', 'NAG PROD'] }
const objCondIsMonthlyAg = { eq: ['name', 'AG PROD'] }
const objCondIsFlareGas = { eq: ['name', 'FLARE GAS RATE'] }
const objCondIsGasShrinkage = { eq: ['name', 'GAS SHRINKAGE'] }
const objCondIsFuelGasRate = { eq: ['name', 'FUEL GAS RATE'] }
const objCondIsGasSale = { eq: ['name', 'GAS SALE'] }
const objCondIsWaterProd = { eq: ['name', 'WATER PROD'] }
const objCondIsWaterInj = { eq: ['name', 'WATER INJ'] }
const objCondIsWaterDisplsal = { eq: ['name', 'WATER DISPOSAL'] }
const objCondGas4andAgNagProd = {
  or: [
    objCondIsMonthlyNag,
    objCondIsMonthlyAg,
    objCondIsFlareGas,
    objCondIsGasShrinkage,
    objCondIsFuelGasRate,
    objCondIsGasSale,
  ],
}
const objCondWaterProdInjDisposalData = {
  or: [objCondIsWaterProd, objCondIsWaterInj, objCondIsWaterDisplsal],
}
const objCondMonthlyLineBarData = {
  or: [
    objCondIsMonthlyAg,
    objCondIsOilProd,
    objCondIsCond,
    objCondIsWaterProd,
    objCondIsMonthlyNag,
  ],
}

const drillConfig = () => ({
  interaction: [
    {
      type: 'drill',
      path: ['hydrocarbon', 'company', 'block'],
    },
  ],
})
const drillConfigMonthly = () => ({
  interaction: [
    {
      type: 'drill',
      path: ['name', 'company', 'block'],
    },
  ],
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
const transformData = (number) => ({
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
const objCondIsDaily = {
  startsWith: ['type', 'DAILY'],
}
const objCondIsDeferment = {
  includes: ['type', 'DEFERMENT'],
}
// const objCondIsDailyProd = {
//   eq: ["type", "DAILY FIELD PRODUCTION VOLS"],
// }

const objCondIsFluids = {
  or: [objCondIsOilData, objCondIsCondensateData, objCondIsWaterData],
}
const objCondIsOilCond = {
  or: [objCondIsOilData, objCondIsCondensateData],
}

const objCondIsOilCondDeferment = {
  and: [
    objCondIsDeferment,
    {
      or: [objCondIsOilData, objCondIsCondensateData],
    },
  ],
}
const objCondIsGas = {
  or: [objCondIsAGData, objCondIsNAGData],
}
const objCondIsGasDeferment = {
  and: [objCondIsDeferment, objCondIsGas],
}
// const objCondIsOilWashlineData = {
//   and: [objCondIsOilData, objCondIsDailyProd],
// }
// const objCondIsCondensateWashlineData = {
//   and: [objCondIsCondensateData, objCondIsDailyProd],
// }
const objCondIsMonthlyOil = {
  eq: ['name', 'OIL PRODN'],
}
const objCondIsMonthlyCond = {
  eq: ['name', 'CONDENSATE PROD'],
}
const monthlyFlattenActualTarget = {
  transform: [
    {
      type: 'flatten-multiple-value',
      properties: ['actual', 'target'],
      discriminator: 'type',
      discriminaotrJoinWith: 'name',
      newProperty: 'value',
    },
  ],
}

const dailyDataFilter = (...cond) =>
  dataFilter({
    and: [objCondIsDaily, ...cond],
  })

const pieWithMap = configMerge(
  pie({
    map: {
      split1By: 'hydrocarbon',
      value1Key: 'actual',
    },
  }),
  toolbox,
  filterByCompanyBlock,
  drillConfig,
)
const pieWithMapMonthly = configMerge(
  pie({
    map: {
      split1By: 'name',
      value1Key: 'actual',
    },
  }),
  toolbox,
  filterByCompanyBlock,
  drillConfigMonthly,
)
// const bar = compose(
//   vbar({
//     map:{
//       seriesBy:'type',
//       value1Key: 'value'
//     }
//   }),
//   toolbox,
//   filterByCompanyBlock
// )
// const flattenTrans = {
//   transform:[{
//     type:'flatten-multiple-value',
//     properties:['actual','target'],
//     discriminator:'type',
//     discriminaotrJoinWith: 'company',
//     newProperty:'value'
//   }]
// }
const scatterTrans = {
  transform: [
    {
      type: 'row-reduce',
      properties: ['reportDate', 'company', 'type', 'hydrocarbon'],
      valueKey: 'actual',
    },
  ],
}
const scatterTransMonthly = {
  transform: [
    {
      type: 'rule',
      rule: {
        map: [
          {
            col: 'type',
            formula: " $name == 'OIL PRODN' ? 'Oil':'Condensate'",
          },
        ],
        split: {
          columns: ['company', 'month'],
          splitColumn: 'type',
          valueColumn: 'actual',
        },
      },
    },
  ],
}
const ATBar = configMerge(
  {
    map: {
      seriesBy: 'type',
      groupBy: 'company',
      splitBy: 'reportDate',
      aggregateValue: 'value',
    },
  },
  {
    transform: [
      {
        type: 'flatten-multiple-value',
        properties: ['actual', 'target'],
        discriminator: 'type',
        discriminaotrJoinWith: 'company',
        newProperty: 'value',
      },
    ],
  },
  toolbox,
  transformData(3),
  filterByCompanyBlock,
)
const ATPureBar = vbar({
  map: {
    split1By: 'month',
    value1Key: 'value',
    seriesBy: 'type',
    split1SortBy: 'month-str',
  },
  transform: [
    {
      type: 'flatten-multiple-value',
      properties: ['actual', 'target'],
      discriminator: 'type',
      discriminaotrJoinWith: 'company',
      newProperty: 'value',
    },
  ],
})
const transformWashline = {
  transform: [
    {
      type: 'javascript',
      code: `function transform(data) {
        const companies = uniq(data.map(i => i.company))
        const newData = []
        companies.forEach(function (company) {
          const companyData = data.filter(d => d.company === company)
          const companyTarget = round(companyData.reduce(function (a, b) {
            return +(a + (+b.target || 0))
          }, 0))
          const companyAcutal = round(companyData.reduce(function (a, b) {
            return +(a + (+b.actual || 0))
          }, 0))
          const value = companyAcutal - companyTarget
          console.log(value,'value')
          const obj = Object.assign({value}, companyData[0])
          newData.push(obj)
        })
        const sumTarget = round(data.reduce((a,b) => +(a + (+b.target || 0)), 0))
        const sumActual = round(data.reduce((a,b) => +(a + (+b.actual || 0)), 0))
        const dataInit = {
          ...data[0],
          company: 'Target',
          value: sumTarget
        }
        const dataEnd = {
          ...data[0],
          company: 'Actual',
          value: sumActual,
        }
        return [dataInit].concat(newData, dataEnd)
      }`,
    },
  ],
}
const transformWashline2 = {
  transform: [
    {
      type: 'javascript',
      code: `function transform(data) {
        const result = []
        let initData = 0
        let endData = 0
        data.forEach(i => {
          if(+i.target){
            result.push({...i, value: (+i.target)})
            initData += (+i.target)
          }
          if(+i.actual){
            result.push({...i, value: (-i.actual)})
            endData += (+i.actual)
          }
        })
        return [{ company: 'Target', value: initData },
          ...result,
          { company: 'Actual', value: endData }]
      }`,
    },
  ],
}
const stackWithBalance = stack({
  map: {
    splitBy: 'month',
    groupBy: 'type',
    seriesBy: 'dataStatus',
    aggregateValue: 'actual',
  },
})
const barlineWithTotalProd = vbarline({
  map: {
    seriesBy: 'name',
    split1By: 'month',
    value1Key: 'actual',
  },
  setting: {
    split1Fmt: 'test',
    barSeries: ['OIL PRODN', 'CONDENSATE PROD', 'WATER PROD'],
    lineSeries: ['AG PROD', 'NAG PROD'],
    lineUnit: 'MM scf/d',
    barUnit: 'bbl/d',
  },
})
const pinWithMonthlyWellCountsStack = stack({
  map: {
    splitBy: 'month',
    groupBy: 'name',
    seriesBy: 'type',
    aggregateValue: 'value',
  },
})

const myScatter = configMerge(
  scatter({
    map: {
      seriesBy: 'company',
      // NOTE: reportDate is a timestamp, it may need to be processed in charts
      split1By: 'reportDate',
      // A name defined in comparer
      split1SortBy: 'dateCmp',
      value1Key: 'hydrocarbon-OIL',
      // NOTE: value2Key may be a array
      value2Key: 'hydrocarbon-CONDENSATE',
    },
    setting: {
      // A name defined in formatter
      split1Fmt: 'DD/MM/YYYY',
    },
  }),
  formatter,
  comparer,
  scatterTrans,
  toolbox,
  filterByCompanyBlock,
)
const myScatterMonthly = configMerge(
  scatter({
    map: {
      seriesBy: 'company',
      // NOTE: reportDate is a timestamp, it may need to be processed in charts
      split1By: 'month',
      // A name defined in comparer
      split1SortBy: 'month-str',
      value1Key: 'Condensate',
      // NOTE: value2Key may be a array
      value2Key: 'Oil',
    },
  }),
  formatter,
  comparer,
  scatterTransMonthly,
  toolbox,
  filterByCompanyBlock,
)
const flattenMapData = flattenTransform({
  columns: ['target', 'actual'],
  typeColumn: 'type',
  valueColumn: 'value',
})
const cardWithTotalAve = pinCard({
  map: {
    split1By: '-',
    value1Key: 'actual',
    value1AggregateType: 'avg',
    unitKey: 'unit',
  },
})
const avgMap = {
  split1By: 'hydrocarbon',
  value1Key: 'actual',
  value1AggregateType: 'avg',
  unitKey: 'unit',
}
const sumMap = {
  split1By: 'hydrocarbon',
  value1Key: 'actual',
  unitKey: 'unit',
}
const cardWithAveFluids = pinCard({
  map: avgMap,
})
const cardWithAveMonthlyFluids = pinCard({
  map: {
    split1By: 'name',
    value1Key: 'actual',
    value1AggregateType: 'avg',
    unitKey: 'unit',
  },
})

const cardWithOilCondDeferment = pinCard({
  map: sumMap,
})
const cardWithDefGas = pinCard({
  map: sumMap,
})
// const washlineWithOilProd = pinWashline({
//   map: {
//     split1By: "company",
//     value1Key: "target",
//   },
// })
const washlineWithMonthlyOilProd = pinWashline({
  map: {
    split1By: 'company',
    value1Key: 'value',
  },
})
const pinWithMonthlyProd = pinTable({
  setting: {
    columns: tableWithMonthlyPinConfig,
  },
})
const cardWithAvgGas = pinCard({
  map: avgMap,
})

export const chartsToDraw = [
  {
    title: 'Daily Production Summary',
    reportType: 'daily',
    showInTitle: ['date.startDate', 'date.endDate'],
    titleFormat: dateFormat,
    groups: [
      {
        title: 'Summary',
        layout: 'float',
        charts: [
          mcS1FCard(
            getAgNagAveTotal,
            'AG + NAG',
            {
              pinConfig: configMerge(
                title('AG + NAG'),
                cardWithTotalAve,
                mapTransform([
                  { col: '-', formula: "'Total'" },
                  { col: 'actual', formula: '$actual * 2' },
                ]),
                dataFilter(objCondIsGas),
                toolbox,
                filterByCompanyBlock,
                hasDatePicker,
              ),
            },
            {},
          ),
          mcS21FCard(
            getOilDailySummayTotal,
            'Average Fluids(bbl/d)',
            {
              pinConfig: configMerge(
                title('Average Fluids(bbl/d)'),
                cardWithAveFluids,
                toolbox,
                dataFilter(objCondIsFluids),
                filterByCompanyBlock,
                hasDatePicker,
              ),
            },
            {},
          ),
          mcS1FCard(
            getOilCondAveTotal,
            'Oil + condensate',
            {
              pinConfig: configMerge(
                title('Oil + condensate'),
                cardWithTotalAve,
                toolbox,
                hasDatePicker,
                mapTransform([
                  { col: '-', formula: "'Total'" },
                  // The sum of the averages of Oil and Condensate = (The averages of the sum of Oil and Condensate) * 2
                  { col: 'actual', formula: '$actual * 2' },
                ]),
                dataFilter(objCondIsOilCond),
                filterByCompanyBlock,
              ),
            },
            {},
          ),
          mcS1FCard(
            getOilDailySummayTotalGas,
            'Average Gas(MM scf/d)',
            {
              pinConfig: configMerge(
                title('Average Gas(MM scf/d)'),
                toolbox,
                cardWithAvgGas,
                hasDatePicker,
                dataFilter(objCondIsGas),
                filterByCompanyBlock,
              ),
            },
            {},
          ),
          mcS1FCard(
            creatorMaker({
              type: 'card',
              config: {
                filterBy: query(or(isAGData, isNAGData)),
                groupHandlerName: 'sum-deferment',
                sliceByKeys: ['name'],
                precision: 1,
              },
            }),
            'NAG & AG Deferment',
            {
              pinConfig: configMerge(
                hasDatePicker,
                title('NAG & AG Deferment'),
                toolbox,
                cardWithDefGas,
                dataFilter(objCondIsGasDeferment),
                filterByCompanyBlock,
              ),
            },
            {},
          ),
          mcS21FCard(
            creatorMaker({
              type: 'card',
              config: {
                filterBy: query(or(isOilData, isCondensateData)),
                groupHandlerName: 'sum-deferment',
                sliceByKeys: ['name'],
                precision: 1,
              },
            }),
            'Oil & Condensate Deferment',
            {
              pinConfig: configMerge(
                hasDatePicker,
                title('Oil & Condensate Deferment'),
                cardWithOilCondDeferment,
                dataFilter(objCondIsOilCondDeferment),
                filterByCompanyBlock,
                toolbox,
              ),
            },
            {},
          ),
          mcS1Fpie(
            getOilDailyFluidsSummary,
            'Average Fluids(bbl/d)',
            {
              ...drill,
              pinConfig: configMerge(
                hasDatePicker,
                title('Average Fluids(bbl/d)'),
                pieWithMap,
                dailyDataFilter(objCondIsFluids),
              ),
            },
            {},
          ),
          mcS1Fpie(
            getOilDailyGasSummary,
            'Average Gas(MM scf/d)',
            {
              ...drill,
              pinConfig: configMerge(
                hasDatePicker,
                title('Average Gas(MM scf/d)'),
                pieWithMap,
                dailyDataFilter(objCondIsGas),
              ),
            },
            {},
          ),
          mcS21FlineBar(
            getDailySummaryLineBarChart,
            'Total Production',
            {
              renderSideCard: () => SideCard,
              pinConfig: configMerge(
                hasDatePicker,
                title('Total Production'),
                toolbar,
                formatter,
                filterByCompanyBlock,
                vbarline({
                  map: {
                    seriesBy: 'hydrocarbon',
                    split1By: 'reportDate',
                    value1Key: 'actual',
                  },
                  setting: {
                    lineSeries: ['NAG', 'AG'],
                    split1Fmt: 'DD/MM/YYYY',
                    barSeries: ['CONDENSATE', 'OIL', 'WATER'],
                  },
                }),
                dailyDataFilter({
                  or: [
                    objCondIsNAGData,
                    objCondIsAGData,
                    objCondIsOilData,
                    objCondIsCondensateData,
                    objCondIsWaterData,
                  ],
                }),
              ),
            },
            {},
          ),
          mcS21FScatter(
            getDailyChartBubble,
            'Oil & Condensate',
            {
              refreshOnDataUpdate: true,
              pinConfig: configMerge(
                hasDatePicker,
                title('Oil & Condensate'),
                myScatter,
                dailyDataFilter({
                  or: [objCondIsCondensateData, objCondIsOilData],
                }),
              ),
            },
            {},
          ),
          mcS42FMapD(
            generalMapChartOption,
            'Production on map',
            {
              pinConfig: configMerge(
                hasDatePicker,
                title('Production on map'),
                dataFilter({
                  eq: ['type', 'DAILY FIELD PRODUCTION VOLS'],
                }),
                filterByCompanyBlock,
                {
                  type: 'GisMap',
                  map: {
                    blockBy: 'block',
                    value1Key: 'actual',
                  },
                  filter: {
                    type: 'simple',
                    definition: [
                      {
                        type: 'check',
                        label: 'Name',
                        field: 'hydrocarbon',
                      },
                    ],
                  },
                },
              ),
            },
            {},
          ),
          mcS42FHighlightTable(
            getDailyProductionData,
            'Production data table',
            {
              pinConfig: configMerge(
                hasDatePicker,
                title('Production data table'),
                pinTable({
                  setting: {
                    columns: tableWithPinConfig,
                    showSearchBar: true,
                  },
                }),
              ),
            },
            {
              exportFileName: 'production-daily',
            },
          ),
          mcS21FBar(
            getOilDailyBarChartOptionGen(query(isOilData)),
            'Oil A/T',
            {
              pinConfig: configMerge(
                hasDatePicker,
                title('Oil A/T'),
                stack(ATBar),
                formatter,
                {
                  setting: {
                    split2Fmt: 'DD/MM/YYYY',
                  },
                },
                dailyDataFilter(objCondIsOilData),
              ),
            },
            {},
          ),
          mcS21FBar(
            getOilDailyBarChartOptionGen(query(isCondensateData)),
            'Condensate A/T',
            {
              pinConfig: configMerge(
                hasDatePicker,
                title('Condensate A/T'),
                stack(ATBar),
                formatter,
                {
                  setting: {
                    split2Fmt: 'DD/MM/YYYY',
                  },
                },
                dailyDataFilter(objCondIsCondensateData),
              ),
            },
            {},
          ),
          mcS21FBar(
            getOilDailyBarChartOptionGen(query(isAGData)),
            'AG A/T',
            {
              pinConfig: configMerge(
                hasDatePicker,
                stack(ATBar),
                formatter,
                {
                  setting: {
                    split2Fmt: 'DD/MM/YYYY',
                  },
                },
                dailyDataFilter(objCondIsAGData),
                title('AG A/T'),
              ),
            },
            {},
          ),
          mcS21FBar(
            getOilDailyBarChartOptionGen(query(isNAGData)),
            'NAG A/T',
            {
              pinConfig: configMerge(
                stack(ATBar),
                hasDatePicker,
                formatter,
                {
                  setting: {
                    split2Fmt: 'DD/MM/YYYY',
                  },
                },
                dailyDataFilter(objCondIsNAGData),
                title('NAG A/T'),
              ),
            },
            {},
          ),
          mc21Washline(
            getOilDailyWashlineChartOption,
            'Oil Production',
            {
              // pinConfig: configMerge(
              //   hasDatePicker,
              //   title("Oil Production"),
              //   dailyDataFilter(objCondIsOilWashlineData),
              //   washlineWithOilProd,
              //   filterByCompanyBlock,
              // ),
            },
            {},
          ),
          mc21Washline(
            getCondensateDailyWashlineChartOption,
            'Condensate Production',
            {
              //   pinConfig: configMerge(
              //     hasDatePicker,
              //     title("Condensate Production"),
              //     dailyDataFilter(objCondIsCondensateWashlineData),
              //     washlineWithOilProd,
              //     filterByCompanyBlock,
              //   ),
            },
            {},
          ),
          mc21Washline(
            getNAGDailyWashlineChartOption,
            'NAG Production',
            {
              // pinConfig: configMerge(
              //   hasDatePicker,
              //   title("NAG Production"),
              //   dailyDataFilter(objCondIsNAGData),
              //   washlineWithOilProd,
              //   filterByCompanyBlock,
              // ),
            },
            {},
          ),
          mc21Washline(
            getAGDailyWashlineChartOption,
            'AG Production',
            {
              // pinConfig: configMerge(
              //   hasDatePicker,
              //   title("AG Production"),
              //   dailyDataFilter(objCondIsAGData),
              //   washlineWithOilProd,
              //   filterByCompanyBlock,
              // ),
            },
            {},
          ),
        ],
      },
    ],
  },
  {
    title: 'Monthly Production Summary',
    reportType: 'monthly',
    titleFormat: dateFormat,
    groups: [
      {
        title: 'Summary',
        layout: 'float',
        charts: [
          mcS1FCard(
            getOilMonthlyTotalBBL,
            'Average Fluids(bbl/d)',
            {
              pinConfig: configMerge(
                title('Average Fluids(bbl/d)'),
                dataFilter({ or: [objCondIsOilProd, objCondIsCond] }),
                cardWithAveMonthlyFluids,
                toolbox,
                filterByCompanyBlock,
              ),
            },
            {},
          ),
          mcS1Fpie(
            getFluidsMonthlyFluidsSummary,
            'Average Fluids(bbl/d)',
            {
              pinConfig: configMerge(
                title('Average Fluids(bbl/d)'),
                pieWithMapMonthly,
                dataFilter({ or: [objCondIsOilProd, objCondIsMonthlyAg] }),
              ),
            },
            {},
          ),
          mcS1Fpie(
            getFluidsMonthlyGasSummary,
            'Average Gas(MM scf/d)',
            {
              pinConfig: configMerge(
                title('Average Gas(MM scf/d)'),
                pieWithMapMonthly,
                dataFilter({ or: [objCondIsMonthlyNag, objCondIsMonthlyAg] }),
              ),
            },
            {},
          ),
          mc21StackBar(
            creatorMaker({
              type: 'stack',
              config: {
                filterBy: query(gas4andAgNagProd),
                sliceByKeys: ['dataStatus', 'type', 'month'],
                groupHandlerName: 'sum-value',
                createSeries: (series) => {
                  const legendData = [
                    'AG + NAG-AG & NAG Production',
                    'FLARE GAS RATE-Gas others',
                    'FUEL GAS RATE-Gas others',
                    'GAS SHRINKAGE-Gas others',
                    'GAS SALE-Gas others',
                    'GAS INJECTION-Gas others',
                  ]
                  return series
                    .filter((i) => legendData.some((l) => l === i.name))
                    .map((i) => {
                      if (i.name.indexOf('-AG & NAG Production') !== -1) {
                        return {
                          ...i,
                          name: 'AG & NAG Production',
                          barGap: 0,
                        }
                      } else if (i.name.indexOf('-Gas others')) {
                        return {
                          ...i,
                          barGap: 0,
                          name: i.name.split('-')[0],
                        }
                      }
                      return i
                    })
                },
              },
            }),
            'Gas Balance',
            {
              pinConfig: configMerge(
                title('Gas Balance'),
                toolbox,
                filterByCompanyBlock,
                dataFilter(objCondGas4andAgNagProd),
                stackWithBalance,
                transformGasBalance,
              ),
            },
            {},
          ),
          mc21StackBar(
            creatorMaker({
              type: 'stack',
              config: {
                filterBy: query(waterProdInjDisposalData),
                sliceByKeys: ['dataStatus', 'type', 'month'],
                groupHandlerName: 'sum-value',
                createSeries: (series) => {
                  const legendData = [
                    'WATER PROD-Water Production',
                    'WATER INJECTION-Water others',
                    'WATER DISPOSAL-Water others',
                  ]
                  return series
                    .filter((i) => legendData.some((l) => l === i.name))
                    .map((i) => {
                      if (i.name.indexOf('-Water Production') !== -1) {
                        return {
                          ...i,
                          barGap: 0,
                          name: 'WATER PRODUCTION',
                        }
                      } else if (i.name.indexOf('-Water others')) {
                        return {
                          ...i,
                          name: i.name.split('-')[0],
                        }
                      }
                      return i
                    })
                },
              },
            }),
            'Water Balance',
            {
              pinConfig: configMerge(
                title('Water Balance'),
                toolbox,
                filterByCompanyBlock,
                dataFilter(objCondWaterProdInjDisposalData),
                stackWithBalance,
                transformGasBalance,
              ),
            },
            {},
          ),
          mcS1FCard(
            getOilMonthlyAvgTotalBBL,
            'Oil + condensate',
            {
              pinConfig: configMerge(
                title('Oil + condensate'),
                cardWithTotalAve,
                toolbox,
                mapTransform([
                  { col: '-', formula: "'Total'" },
                  { col: 'actual', formula: '$actual * 2' },
                ]),
                dataFilter({ or: [objCondIsOilProd, objCondIsCond] }),
                filterByCompanyBlock,
              ),
            },
            {},
          ),
          mcS21FlineBar(
            getMonthlySummaryLineBarChart,
            'Total Production',
            {
              renderSideCard: () => SideCard,
              pinConfig: configMerge(
                title('Total Production'),
                toolbox,
                filterByCompanyBlock,
                dataFilter(objCondMonthlyLineBarData),
                barlineWithTotalProd,
              ),
            },
            {},
          ),
          mcS1FCard(
            getOilMonthlyTotalMM,
            'Average Gas(MM scf/d)',
            {
              pinConfig: configMerge(
                title('Average Gas(MM scf/d)'),
                dataFilter({ or: [objCondIsMonthlyNag, objCondIsMonthlyAg] }),
                cardWithAveMonthlyFluids,
                toolbox,
                filterByCompanyBlock,
              ),
            },
            {},
          ),
          mcS1FCard(
            getOilMonthlyAvgTotalMM,
            'AG + NAG',
            {
              pinConfig: configMerge(
                title('AG + NAG'),
                dataFilter({ or: [objCondIsMonthlyNag, objCondIsMonthlyAg] }),
                cardWithTotalAve,
                mapTransform([
                  { col: '-', formula: "'Total'" },
                  { col: 'actual', formula: '$actual * 2' },
                ]),
                toolbox,
                filterByCompanyBlock,
              ),
            },
            {},
          ),
          mcS1FScatter(
            getMonthlyChartBubble,
            'Oil & Condensate',
            {
              refreshOnDataUpdate: true,
              pinConfig: configMerge(
                // sofar, data missing reportDate, type
                title('Oil & Condensate'),
                myScatterMonthly,
                dataFilter({
                  or: [objCondIsOilProd, objCondIsCond],
                }),
              ),
            },
            {},
          ),
          mcS42FMapM(
            generalMonthlyMapChart,
            'Production on map',
            {
              pinConfig: configMerge(
                filterByCompanyBlock,
                flattenMapData,
                title('Production on map'),
                {
                  type: 'GisMap',
                  map: {
                    blockBy: 'block',
                    value1Key: 'actual',
                  },
                  filter: {
                    type: 'simple',
                    definition: [
                      {
                        type: 'check',
                        label: 'Name',
                        field: 'name',
                      },
                    ],
                  },
                },
              ),
            },
            {},
          ),
          mcS42FTable(
            getMonthlyProductionData,
            'Production data table',
            {
              pinConfig: configMerge(
                title('Production data table'),
                pinWithMonthlyProd,
                formatter,
                flattenMapData,
              ),
            },
            {
              exportFileName: 'production-monthly',
            },
          ),
          mcS21FBar(
            getOilMonthlyBarChartOptionGen(query(isMonthlyOil)),
            'Oil A/T',
            {
              refreshOnDataUpdate: true,
              pinConfig: configMerge(
                title('Oil A/T'),
                ATPureBar,
                dataFilter(objCondIsOilProd),
                toolbox,
                transformData(3),
                filterByCompanyBlock,
              ),
            },
            {},
          ),
          mcS21FBar(
            getOilMonthlyBarChartOptionGen(query(isMonthlyCondensate)),
            'Condensate A/T',
            {
              refreshOnDataUpdate: true,
              pinConfig: configMerge(
                title('Condensate A/T'),
                ATPureBar,
                toolbox,
                transformData(3),
                filterByCompanyBlock,
                objCondIsCond,
              ),
            },
            {},
          ),
          mcS21FBar(
            getOilMonthlyBarChartOptionGen(query(isMonthlyAG)),
            'AG A/T',
            {
              refreshOnDataUpdate: true,
              pinConfig: configMerge(
                title('AG A/T'),
                ATPureBar,
                toolbox,
                transformData(3),
                filterByCompanyBlock,
                objCondIsMonthlyAg,
              ),
            },
            {},
          ),
          mcS21FBar(
            getOilMonthlyBarChartOptionGen(query(isMonthlyNAG)),
            'NAG A/T',
            {
              refreshOnDataUpdate: true,
              pinConfig: configMerge(
                title('NAG A/T'),
                ATPureBar,
                toolbox,
                transformData(3),
                filterByCompanyBlock,
                objCondIsMonthlyNag,
              ),
            },
            {},
          ),
          mcS42FBar(
            getWellCountsStackChart,
            'Well Counts - Total Only',
            {
              pinConfig: configMerge(
                title('Well Counts - Total Only'),
                pinWithMonthlyWellCountsStack,
                filterByCompanyBlock,
                monthlyFlattenActualTarget,
              ),
            },
            {},
          ),
          mcS42FTable(
            getWellCountsData,
            'Well Counts - Table',
            {
              pinConfig: configMerge(
                title('Production data table'),
                dataFilter({
                  includes: ['closed-in', ''],
                }),
                flattenTransform({
                  columns: ['total', 'closed-in'],
                  typeColumn: 'dataType',
                }),
                pinTable({
                  setting: {
                    columns: productionMonthlyTableColumnsConfig,
                    showSearchBar: true,
                  },
                }),
              ),
            },
            {},
          ),
          mc21Washline(
            getOilMonthlyWashlineChartOption,
            'Oil Production Washline',
            {
              pinConfig: configMerge(
                title('Oil Production Washline'),
                dataFilter(objCondIsMonthlyOil),
                washlineWithMonthlyOilProd,
                transformWashline,
                formatter,
                toolbox,
                filterByCompanyBlock,
              ),
            },
            {},
          ),
          mc21Washline(
            getCondensateMonthlyWashlineChartOption,
            'Condensate Production Washline',
            {
              pinConfig: configMerge(
                title('Condensate Production Washline'),
                dataFilter(objCondIsMonthlyCond),
                washlineWithMonthlyOilProd,
                transformWashline2,
                toolbox,
                filterByCompanyBlock,
              ),
            },
            {},
          ),
        ],
      },
    ],
  },
  {
    title: 'Production tracking',
    reportType: 'tracking',
    titleFormat: dateFormat,
    groups: [
      {
        title: 'Summary',
        layout: 'float',
        charts: [
          mcS1FCard(getOilMonthlyAvgTotalBBL, 'Production', {}, {}),
          mcS1FCard(
            creatorMaker({
              type: 'card',
              config: {
                filterBy: query(isTotal),
                groupHandlerName: 'sum-value',
                // unit: 'bbl/d'
              },
            }),
          )('Delivery to ORPIC', {}, {}),
          mcS1FCard(
            creatorMaker({
              type: 'card',
              config: {
                filterBy: query(and(isNotTotal, isFromTracking)),
                groupHandlerName: 'sum-value',
                // unit: "bbl/d",
              },
            }),
          )('Export Volume', {}, {}),
          mcS1FCard(
            creatorMaker({
              type: 'card',
              config: {
                filterBy: query(and(isGasSale, isActual)),
                groupHandlerName: 'sum-value',
                // unit: "bbl/d",
              },
            }),
          )('Gas Sale', {}, {}),
          mc21Bar(
            creatorMaker({
              type: 'bar',
              config: {
                groupHandlerName: 'sum-value',
                sliceByKeys: ['split1By', 'yearMonth'],
                filterBy: query(
                  or(
                    isSUPPLIERandSm3,
                    isCONSUMERandSm3,
                    and(isGasSale, isActual),
                  ),
                ),
                unit: 'MM scf/d',
                useAbbr: false,
              },
            }),
            'Gas Production Tracking Balance',
            {},
            {},
          ),
          mc21Bar(
            creatorMaker({
              type: 'bar',
              config: {
                useAbbr: false,
                sliceByKeys: ['destination', 'yearMonth'],
                filterBy: query(and(isNotTotal, isFromTracking)),
                groupHandlerName: 'sum-value',
                // unit: 'bbl/d'
              },
            }),
            'Export Details',
            {},
            {},
          ),
          mc21StackBar(
            getProductionBalance,
            'Oil Production Tracking Balance',
            {},
            {},
          ),
        ],
      },
    ],
  },
]
