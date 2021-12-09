import {
  smallCard,
  isCAPEX,
  isOPEX,
  isCost,
  drillPie,
  mc21Pie,
  drillPathCost,
  axisControlledBar,
  is$MM,
  isProd,
  isWell,
  mc41,
  mc21,
  isNFAoNewOil,
  drillPathProd,
  isNFAoNewCond,
  isNFAoNewGas,
  isVolume,
  forceRefresh,
  m42NormalTable,
} from './share'
import {
  configMerge,
  pie,
  card,
  dataFilter,
  toolbox,
  stack,
  vbar,
  title,
  filterByCompanyBlock,
  flattenTransform,
  mapTransform,
  table,
} from 'components/analytics/utils/charts-config-helper'
import { mcDFBySize } from 'components/analytics/utils'
import { creatorMaker } from 'components/analytics/utils/creator-maker'
import {
  planningFypTableConfig,
  formFypDataFormatter,
} from '../processor/table-config'
import { query, and, eq, or } from 'libs/utils/query'

const axisControlFilter = [
  'company',
  'block',
  {
    name: 'groupBy',
    label: 'Group By',
    forConfig: true,
    axisOverride: true,
    items: ['company', 'type', 'year'],
    defaultSelect: ['company'],
    type: 'single',
  },
  {
    name: 'X',
    label: 'X',
    forConfig: true,
    axisOverride: true,
    items: ['year', 'kpiGroup', 'category', 'kpi'],
    defaultSelect: ['year'],
    type: 'single',
  },
]
const bar21 = (filterBy) =>
  mc21(
    'stack',
    null,
    creatorMaker({
      type: 'stack',
      config: {
        sliceByKeys: ['type', 'company', 'year'],
        filterBy,
        groupHandlerName: 'sum-value',
      },
    }),
  )
const mc41Axis = mcDFBySize(4, 1, axisControlFilter)
const mc21Axis = mcDFBySize(2, 1, axisControlFilter)
const isEnA = and(eq('category', 'EXPLORATION & APPRAISAL'), is$MM)
const isDev = and(eq('category', 'DEVELOPMENT'), is$MM)
const isProdMM = and(isProd, is$MM)
const isNonTec = and(eq('category', 'NON-TECHNICAL'), is$MM)
const mc41Bar = (filterBy) =>
  mc41(
    'stack',
    null,
    creatorMaker({
      type: 'stack',
      config: {
        sliceByKeys: ['type', 'kpi', 'year'],
        filterBy,
        groupHandlerName: 'sum-value',
      },
    }),
  )
const objCondIsCapex = { eq: ['kpiGroup', 'CAPEX'] }
const objCondIsOpex = { eq: ['kpiGroup', 'OPEX'] }
const objCondIsVolume = { eq: ['kpiGroup', 'VOLUME'] }
const objCondIsCost = { or: [objCondIsCapex, objCondIsOpex] }

const objCondIs$MM = {
  eq: ['unit', '$MM'],
}
const objCondIsProd = { eq: ['category', 'PRODUCTION'] }
const objCondIsWell = { eq: ['kpiGroup', 'WELLS'] }
const objCondIsEnA = {
  and: [{ eq: ['category', 'EXPLORATION & APPRAISAL'] }, objCondIs$MM],
}
const objCondIsNonTec = {
  and: [{ eq: ['category', 'NON-TECHNICAL'] }, objCondIs$MM],
}
const objCondIsProd$MM = {
  and: [objCondIsProd, objCondIs$MM],
}
const objCondIsNFAOil = { eq: ['kpiName', 'NFA Oil Production'] }
const objCondIsNewOil = { eq: ['kpiName', 'New Oil Production'] }
const objCondIsNFAoNewOil = {
  or: [objCondIsNFAOil, objCondIsNewOil],
}
const objCondIsNFACond = { eq: ['kpiName', 'NFA Condensate Production'] }
const objCondIsNewCond = { eq: ['kpiName', 'New Condensate Production'] }
const objCondIsNFAoNewCond = {
  or: [objCondIsNFACond, objCondIsNewCond],
}
const objCondIsNFAGas = { eq: ['kpiName', 'NFA Gas Production'] }
const objCondIsNewGas = { eq: ['kpiName', 'New Gas Production'] }
const objCondIsNFAoNewGas = {
  or: [objCondIsNFAGas, objCondIsNewGas],
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

const mapWithCardTypeValue = {
  map: {
    split1By: 'type',
    value1Key: 'value',
    unitKey: 'unit',
  },
}
const cardWithMap = card({
  ...mapWithCardTypeValue,
})
const pieWithTotalPlan = pie({
  map: {
    split1By: 'kpiGroup',
    value1Key: 'plan',
  },
})
const drillConfig = () => ({
  interaction: [
    {
      type: 'drill',
      path: ['kpiGroup', 'company', 'block'],
    },
  ],
})
const comCardPinConf = configMerge(
  cardWithMap,
  flattenTransform({
    columns: ['plan', 'actual'],
  }),
  toolbox,
  filterByCompanyBlock,
  numberNdFmt(2),
)
const vBarWithCompanyAndMonth = vbar({
  map: {
    split1By: 'year',
    seriesBy: 'company',
    value1Key: 'plan',
  },
})
const vBarWithStatusCatMonth = stack({
  map: {
    seriesBy: 'type',
    groupBy: 'kpiName',
    splitBy: 'year',
    aggregateValue: 'plan',
  },
  setting: {
    showDataZoomSlider: true,
  },
})
const pieWithKpi = pie({
  map: {
    split1By: 'kpiName',
    value1Key: 'plan',
  },
})
const vBarWithStatusCompMonth = stack({
  map: {
    splitBy: 'year',
    seriesBy: 'type',
    groupBy: 'company',
    aggregateValue: 'plan',
  },
  setting: {
    showDataZoomSlider: true,
  },
})

const pinBaseColunmConfig = [
  {
    name: 'CompanyItem',
    dataKey: 'company',
    width: 100,
    align: 'left',
  },
  {
    name: 'Block',
    dataKey: 'block',
    width: 100,
    align: 'left',
  },
  {
    name: 'category',
    dataKey: 'category',
    width: 150,
    align: 'left',
  },
  {
    name: 'SubCategory',
    dataKey: 'subCategory',
    width: 150,
    align: 'left',
  },
  {
    name: 'KPIGroup',
    dataKey: 'kpiGroup',
    width: 150,
    align: 'left',
  },
  {
    name: 'KPI',
    dataKey: 'kpiName',
    width: 150,
    align: 'left',
  },
  {
    name: 'Unit',
    dataKey: 'unit',
    width: 150,
  },
]

const tableWithTranformAndSetting = table({
  transform: [
    {
      type: 'javascript',
      code: `function transform(data) {
        function extractUniqValue(d, key) {
          let  obj = {}
          return d.reduce((acc, cur) => {
            if(!obj[cur[key]]){
              obj[cur[key]] = 1
              return acc.concat([cur[key]])
            }
            return acc
          }, [])
        }
        function chunk (data, length) {
          const result = []
          let arr = []
          data.forEach((i, ind) => {
            arr.push(i)
            if ( ind % length === length-1) {
              result.push(arr)
              arr = []
            }
          })
          if (arr.length > 0) result.push(arr)
          return result
        }
        const year = extractUniqValue(data, "year")
        const arr = chunk(data, year.length)
        const result = arr.map(array => {
          const obj = Object.assign({}, array[0])
          array.forEach(item => {
            obj[\`\${item.year}-plan\`] = item.plan
          })
          return obj
        })
        return result
      }`,
    },
  ],
  setting: {
    columns: pinBaseColunmConfig,
    columnsConfigsOnData: [
      {
        where: -1,
        extractKey: 'year',
        column: {
          name: '()',
          dataKey: '()-plan',
        },
      },
    ],
    showSearchBar: true,
  },
})

export default [
  {
    title: 'Expenditure-Fyp',
    reportType: 'fyp',
    groups: [
      {
        title: 'Summary',
        layout: 'float',
        charts: [
          smallCard(['type'], query(isCost))(
            'Total Expenditure',
            {
              pinConfig: configMerge(
                title('Total Expenditure'),
                dataFilter(objCondIsCost),
                comCardPinConf,
              ),
            },
            {},
          ),
          smallCard(['type'], query(isCAPEX))(
            'Capex',
            {
              pinConfig: configMerge(
                title('Capex'),
                dataFilter(objCondIsCapex),
                comCardPinConf,
              ),
            },
            {},
          ),
          smallCard(['type'], query(isOPEX))(
            'Opex',
            {
              pinConfig: configMerge(
                title('Opex'),
                dataFilter(objCondIsOpex),
                comCardPinConf,
              ),
            },
            {},
          ),
          drillPie(mc21Pie, query(isCost))(
            'Total Plan',
            {
              ...drillPathCost,
              pinConfig: configMerge(
                title('Total Plan'),
                pieWithTotalPlan,
                toolbox,
                dataFilter(objCondIsCost),
                filterByCompanyBlock,
                drillConfig,
                numberNdFmt(2),
              ),
            },
            {},
          ),
          // sofar, the table can't be pin
          m42NormalTable({
            dataFormatter: formFypDataFormatter,
            columnsConfigOnData: planningFypTableConfig,
            rowsPerPage: 5,
            filterBy: query(isCost),
          })(
            'Expenditure',
            {
              pinConfig: configMerge(
                title('Expenditure'),
                dataFilter(objCondIsCost),
                tableWithTranformAndSetting,
              ),
            },
            {},
          ),
          axisControlledBar(
            ['company', 'year'],
            query(isCost),
            'Total Expenditure on Month',
            mc41Axis,
            {
              pinConfig: configMerge(
                title('Total Expenditure on Month'),
                vBarWithCompanyAndMonth,
                toolbox,
                dataFilter(objCondIsCost),
                filterByCompanyBlock,
                numberNdFmt(3),
              ),
            },
          ),
          axisControlledBar(
            ['company', 'month'],
            query(isEnA),
            'Total Expenditure - E & A',
            mc21Axis,
            {
              pinConfig: configMerge(
                title('Total Expenditure - E & A'),
                vBarWithCompanyAndMonth,
                toolbox,
                dataFilter(objCondIsEnA),
                filterByCompanyBlock,
                numberNdFmt(3),
              ),
            },
          ),
          axisControlledBar(
            ['company', 'month'],
            query(isDev),
            'Total Expenditure - Development',
            mc21Axis,
            {
              pinConfig: configMerge(
                title('Total Expenditure - Development'),
                vBarWithCompanyAndMonth,
                toolbox,
                dataFilter(objCondIsNonTec),
                filterByCompanyBlock,
                numberNdFmt(3),
              ),
            },
          ),
          axisControlledBar(
            ['company', 'month'],
            query(isProdMM),
            'Total Expenditure - Production',
            mc21Axis,
            {
              pinConfig: configMerge(
                title('Total Expenditure - Production'),
                vBarWithCompanyAndMonth,
                toolbox,
                dataFilter(objCondIsProd$MM),
                filterByCompanyBlock,
                numberNdFmt(3),
              ),
            },
          ),
          axisControlledBar(
            ['company', 'month'],
            query(isNonTec),
            'Total Expenditure - Non-technical',
            mc21Axis,
            {
              pinConfig: configMerge(
                title('Total Expenditure - Non-technical'),
                vBarWithCompanyAndMonth,
                toolbox,
                dataFilter(objCondIsNonTec),
                filterByCompanyBlock,
                numberNdFmt(3),
              ),
            },
          ),
        ],
      },
    ],
  },
  {
    title: 'Wells-Fyp',
    reportType: 'fyp',
    groups: [
      {
        title: 'Summary',
        layout: 'float',
        charts: [
          mc41Bar(query(isWell))(
            'Wells Chart',
            {
              pinConfig: configMerge(
                title('Wells Chart'),
                vBarWithStatusCatMonth,
                toolbox,
                mapTransform([{ col: 'type', formula: "'PLAN'" }]),
                dataFilter(objCondIsWell),
                filterByCompanyBlock,
                numberNdFmt(3),
              ),
            },
            {},
          ),
          m42NormalTable({
            dataFormatter: formFypDataFormatter,
            columnsConfigOnData: planningFypTableConfig,
            rowsPerPage: 5,
            filterBy: query(isWell),
          })(
            'Wells',
            {
              pinConfig: configMerge(
                title('Wells'),
                dataFilter(objCondIsWell),
                tableWithTranformAndSetting,
              ),
            },
            {},
          ),
        ],
      },
    ],
  },
  {
    title: 'Production-Fyp',
    reportType: 'fyp',
    groups: [
      {
        title: 'Summary',
        layout: 'float',
        charts: [
          drillPie(mc21Pie, query(isNFAoNewOil))(
            'Oil Production',
            {
              ...drillPathProd,
              pinConfig: configMerge(
                title('Oil Production'),
                dataFilter(objCondIsNFAoNewOil),
                pieWithKpi,
                toolbox,
                filterByCompanyBlock,
                drillConfig,
                numberNdFmt(2),
              ),
            },
            {},
          ),
          drillPie(mc21Pie, query(isNFAoNewCond))(
            'Condensate Production',
            {
              ...drillPathProd,
              pinConfig: configMerge(
                title('Condensate Production'),
                pieWithKpi,
                toolbox,
                dataFilter(objCondIsNFAoNewCond),
                filterByCompanyBlock,
                drillConfig,
                numberNdFmt(2),
              ),
            },
            {},
          ),
          drillPie(mc21Pie, query(isNFAoNewGas))(
            'Gas Production',
            {
              ...drillPathProd,
              pinConfig: configMerge(
                title('Gas Production'),
                pieWithKpi,
                toolbox,
                dataFilter(objCondIsNFAoNewGas),
                filterByCompanyBlock,
                drillConfig,
                numberNdFmt(2),
              ),
            },
            {},
          ),
          drillPie(mc21Pie, query(or(isNFAoNewOil, isNFAoNewCond)))(
            'Oil +  Condensate',
            {
              ...drillPathProd,
              pinConfig: configMerge(
                title('Oil +  Condensate'),
                pieWithKpi,
                toolbox,
                dataFilter({ or: [objCondIsNFAoNewOil, objCondIsNFAoNewCond] }),
                filterByCompanyBlock,
                drillConfig,
                numberNdFmt(2),
              ),
            },
            {},
          ),
          bar21(query(isNFAoNewOil))(
            'Oil - NFA + New',
            {
              ...forceRefresh,
              pinConfig: configMerge(
                title('Oil - NFA + New'),
                mapTransform([{ col: 'type', formula: "'PLAN'" }]),
                dataFilter(objCondIsNFAoNewOil),
                vBarWithStatusCompMonth,
                toolbox,
                filterByCompanyBlock,
                numberNdFmt(3),
              ),
            },
            {},
          ),
          bar21(query(isNFAoNewCond))(
            'Condensate - NFA + New',
            {
              ...forceRefresh,
              pinConfig: configMerge(
                title('Condensate - NFA + New'),
                vBarWithStatusCompMonth,
                toolbox,
                dataFilter(objCondIsNFAoNewCond),
                filterByCompanyBlock,
                numberNdFmt(3),
              ),
            },
            {},
          ),
          bar21(query(isNFAoNewGas))(
            'Gas - NFA + New',
            {
              ...forceRefresh,
              pinConfig: configMerge(
                title('Gas - NFA + New'),
                vBarWithStatusCompMonth,
                toolbox,
                dataFilter(objCondIsNFAoNewGas),
                filterByCompanyBlock,
                numberNdFmt(3),
              ),
            },
            {},
          ),
          bar21(query(or(isNFAoNewOil, isNFAoNewCond)))(
            'Oil+Condensate - NFA + New',
            {
              ...forceRefresh,
              pinConfig: configMerge(
                title('Oil+Condensate - NFA + New'),
                vBarWithStatusCompMonth,
                toolbox,
                dataFilter({ or: [objCondIsNFAoNewOil, objCondIsNFAoNewCond] }),
                filterByCompanyBlock,
                numberNdFmt(3),
              ),
            },
            {},
          ),
          m42NormalTable({
            dataFormatter: formFypDataFormatter,
            columnsConfigOnData: planningFypTableConfig,
            rowsPerPage: 5,
            filterBy: query(and(isProd, isVolume)),
          })(
            'Production Fluids',
            {
              pinConfig: configMerge(
                title('Production Fluids'),
                dataFilter({ and: [objCondIsVolume, objCondIsProd] }),
                tableWithTranformAndSetting,
              ),
            },
            {},
          ),
        ],
      },
    ],
  },
]
