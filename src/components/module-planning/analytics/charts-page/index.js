import { chartsPageCreator } from 'components/charts-page'
import { query, eq, or, and } from 'libs/utils/query'
import { mcDFBySize } from 'components/analytics/utils'
import { creatorMaker } from 'components/analytics/utils/creator-maker'
import 'components/table-with-color-highlight/styles.scss'
import {
  planningTableConfig,
  formDataFormatter,
} from '../processor/table-config'
import {
  configMerge,
  pie,
  card,
  table as tableWith,
  dataFilter,
  toolbox,
  stack,
  vbar,
  title,
  gauge as gaugeWith,
  filterByCompanyBlock,
} from 'components/analytics/utils/charts-config-helper'

import fypDashboard from './fyp-dashboard'
import {
  smallCard,
  isCAPEX,
  gauge,
  isOPEX,
  mc11Gauge,
  isCost,
  drillPie,
  mc21Pie,
  drillPathCost,
  axisControlledBar,
  isProd,
  m42Table,
  mc41,
} from './share'

const isWell = eq('kpiGroup', 'WELLS')
const isVolume = eq('kpiGroup', 'VOLUME')
const isActual = eq('dataStatus', 'ACTUAL')
const isPlan = eq('dataStatus', 'PLAN')
const isActualCost = and(isActual, isCost)
const isPlanCost = and(isPlan, isCost)
const is$MM = eq('unit', '$MM')
const isEnA = and(eq('category', 'EXPLORATION & APPRAISAL'), isActual, is$MM)
const isDev = and(eq('category', 'DEVELOPMENT'), isActual, is$MM)
const isProdActual = and(isActual, isProd, is$MM)
const isNonTec = and(eq('category', 'NON-TECHNICAL'), isActual, is$MM)
const getIsProd = (nfaOnew, type) => eq('kpi', `${nfaOnew} ${type} Production`)
const isNFAoNewOil = or(getIsProd('NFA', 'Oil'), getIsProd('New', 'Oil'))
const isNFAoNewCond = or(
  getIsProd('NFA', 'Condensate'),
  getIsProd('New', 'Condensate'),
)
const isNFAoNewGas = or(getIsProd('NFA', 'Gas'), getIsProd('New', 'Gas'))

const axisControlFilter = [
  'company',
  'block',
  {
    name: 'groupBy',
    label: 'Group By',
    forConfig: true,
    axisOverride: true,
    items: ['company', 'dataStatus', 'year'],
    defaultSelect: ['company'],
    type: 'single',
  },
  {
    name: 'X',
    label: 'X',
    forConfig: true,
    axisOverride: true,
    items: ['month', 'kpiGroup', 'category', 'kpi'],
    defaultSelect: ['month'],
    type: 'single',
  },
]
const drillPathProd = { drillPath: ['kpi', 'company', 'block'] }
const forceRefresh = { refreshOnDataUpdate: true }

const mc21 = mcDFBySize(2, 1)
const mc21Axis = mcDFBySize(2, 1, axisControlFilter)
const mc41Axis = mcDFBySize(4, 1, axisControlFilter)
const bar21 = (filterBy) =>
  mc21(
    'stack',
    null,
    creatorMaker({
      type: 'stack',
      config: {
        sliceByKeys: ['dataStatus', 'company', 'month'],
        filterBy,
        groupHandlerName: 'sum-value',
      },
    }),
  )
const objCondIsCapex = { eq: ['kpiGroup', 'CAPEX'] }
const objCondIsOpex = { eq: ['kpiGroup', 'OPEX'] }
const objCondIsActual = {
  eq: ['dataStatus', 'ACTUAL'],
}
const objCondIs$MM = {
  eq: ['unit', '$MM'],
}
const objCondIsEnA = {
  and: [
    {
      eq: ['category', 'EXPLORATION & APPRAISAL'],
    },
    objCondIs$MM,
  ],
}
const objCondIsWell = { eq: ['kpiGroup', 'WELLS'] }

const objCondIsNFAOil = { eq: ['kpiName', 'NFA Oil Production'] }
const objCondIsNewOil = { eq: ['kpiName', 'New Oil Production'] }
const objCondIsNFAGas = { eq: ['kpiName', 'NFA Gas Production'] }
const objCondIsNewGas = { eq: ['kpiName', 'New Gas Production'] }
const objCondIsNFACond = { eq: ['kpiName', 'NFA Condensate Production'] }
const objCondIsNewCond = { eq: ['kpiName', 'New Condensate Production'] }

const objCondIsCost = { or: [objCondIsCapex, objCondIsOpex] }
const objCondIsNFAoNewOil = {
  or: [objCondIsNFAOil, objCondIsNewOil],
}
const objCondIsNFAoNewGas = {
  or: [objCondIsNFAGas, objCondIsNewGas],
}
const objCondIsNFAoNewCond = {
  or: [objCondIsNFACond, objCondIsNewCond],
}
const objCondIsProd = {
  eq: ['category', 'PRODUCTION'],
  ...objCondIsActual,
  ...objCondIs$MM,
}
const objCondIsDev = {
  eq: ['category', 'DEVELOPMENT'],
  ...objCondIsActual,
  ...objCondIs$MM,
}
const objCondIsNonTec = {
  eq: ['category', 'NON-TECHNICAL'],
  ...objCondIsActual,
  ...objCondIs$MM,
}

const flattenTrans = {
  transform: [
    {
      type: 'flatten-multiple-value',
      properties: ['actual', 'plan'],
      discriminator: 'type',
      newProperty: 'value',
    },
  ],
}

const pieWithTotalCosts = pie({
  map: {
    split1By: 'kpiGroup',
    value1Key: 'actual',
  },
})
const pieWithTotalPlan = pie({
  map: {
    split1By: 'kpiGroup',
    value1Key: 'plan',
  },
})

const pieWithKpi = pie({
  map: {
    split1By: 'kpiName',
    value1Key: 'actual',
  },
})
const mapWithTypeValue = {
  map: {
    split1By: 'type',
    value1Key: 'value',
  },
}
const mapWithCardTypeValue = {
  map: {
    split1By: 'type',
    value1Key: 'value',
    unitKey: 'unit',
  },
}
const gaugeWithMap = gaugeWith({
  ...flattenTrans,
  ...mapWithTypeValue,
})

const cardWithMap = card({
  ...flattenTrans,
  ...mapWithCardTypeValue,
})

const vBarWithCompanyAndMonth = vbar({
  map: {
    split1By: 'month',
    value1Key: ['actual'],
    seriesBy: 'company',
  },
})
const vBarWithStatusCatMonth = stack({
  ...flattenTrans,
  map: {
    splitBy: 'month',
    groupBy: 'subCategory',
    seriesBy: 'type',
    aggregateValue: 'value',
  },
})

const vBarWithStatusAndMonth = vbar({
  map: {
    split1By: 'month',
    value1Key: 'actual',
    seriesBy: 'company',
  },
})
const vBarWithStatusCompMonth = vbar({
  ...flattenTrans,
  map: {
    split1By: 'month',
    value1Key: 'value',
    seriesBy: 'type',
  },
})

// number n-digit format
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
const drillConfig = () => ({
  interaction: [
    {
      type: 'drill',
      path: ['kpiGroup', 'company', 'block'],
    },
  ],
})

const mc41Bar = (filterBy) =>
  mc41(
    'stack',
    null,
    creatorMaker({
      type: 'stack',
      config: {
        sliceByKeys: ['dataStatus', 'kpi', 'month'],
        filterBy,
        groupHandlerName: 'sum-value',
      },
    }),
  )

const pinColumnsConfig = [
  {
    name: 'COMPANY',
    dataKey: 'company',
    width: 100,
    align: 'left',
    index: 0,
  },
  {
    name: 'Block',
    dataKey: 'block',
    width: 100,
    align: 'left',
    index: 1,
  },
  {
    name: 'DATA STATUS',
    dataKey: 'status',
    width: 120,
    align: 'left',
    index: 2,
  },
  {
    name: 'Category',
    dataKey: 'category',
    width: 150,
    align: 'left',
    index: 3,
  },
  {
    name: 'Sub Category',
    dataKey: 'subCategory',
    width: 150,
    align: 'left',
    index: 4,
  },
  {
    name: 'KPI Group',
    dataKey: 'kpiGroup',
    width: 150,
    align: 'left',
    index: 5,
  },
  {
    name: 'KPI',
    dataKey: 'kpiName',
    width: 150,
    align: 'left',
    index: 6,
  },
  {
    name: 'UNIT',
    dataKey: 'unit',
    width: 150,
    index: 7,
  },
  {
    name: 'YEAR',
    dataKey: 'year',
    width: 100,
    index: 8,
  },
  {
    groupName: 'January',
    columns: [
      {
        name: 'ACTUAL',
        dataKey: 'JAN-ACTUAL',
        width: 70,
        index: 0,
      },
      {
        name: 'PLAN',
        dataKey: 'JAN-PLAN',
        width: 70,
        index: 1,
      },
    ],
    index: 9,
  },
  {
    groupName: 'February',
    columns: [
      {
        name: 'ACTUAL',
        dataKey: 'FEB-ACTUAL',
        width: 70,
        index: 0,
      },
      {
        name: 'PLAN',
        dataKey: 'FEB-PLAN',
        width: 70,
        index: 1,
      },
    ],
    index: 10,
  },
  {
    groupName: 'March',
    columns: [
      {
        name: 'ACTUAL',
        dataKey: 'MAR-ACTUAL',
        width: 70,
        index: 0,
      },
      {
        name: 'PLAN',
        dataKey: 'MAR-PLAN',
        width: 70,
        index: 1,
      },
    ],
    index: 11,
  },
  {
    groupName: 'April',
    columns: [
      {
        name: 'ACTUAL',
        dataKey: 'APR-ACTUAL',
        width: 70,
        index: 0,
      },
      {
        name: 'PLAN',
        dataKey: 'APR-PLAN',
        width: 70,
        index: 1,
      },
    ],
    index: 12,
  },
  {
    groupName: 'May',
    columns: [
      {
        name: 'ACTUAL',
        dataKey: 'MAY-ACTUAL',
        width: 70,
        index: 0,
      },
      {
        name: 'PLAN',
        dataKey: 'MAY-PLAN',
        width: 70,
        index: 1,
      },
    ],
    index: 13,
  },
  {
    groupName: 'June',
    columns: [
      {
        name: 'ACTUAL',
        dataKey: 'JUN-ACTUAL',
        width: 70,
        index: 0,
      },
      {
        name: 'PLAN',
        dataKey: 'JUN-PLAN',
        width: 70,
        index: 1,
      },
    ],
    index: 14,
  },
  {
    groupName: 'July',
    columns: [
      {
        name: 'ACTUAL',
        dataKey: 'JUL-ACTUAL',
        width: 70,
        index: 0,
      },
      {
        name: 'PLAN',
        dataKey: 'JUL-PLAN',
        width: 70,
        index: 1,
      },
    ],
    index: 15,
  },
  {
    groupName: 'August',
    columns: [
      {
        name: 'ACTUAL',
        dataKey: 'AUG-ACTUAL',
        width: 70,
        index: 0,
      },
      {
        name: 'PLAN',
        dataKey: 'AUG-PLAN',
        width: 70,
        index: 1,
      },
    ],
    index: 16,
  },
  {
    groupName: 'September',
    columns: [
      {
        name: 'ACTUAL',
        dataKey: 'SEP-ACTUAL',
        width: 70,
        index: 0,
      },
      {
        name: 'PLAN',
        dataKey: 'SEP-PLAN',
        width: 70,
        index: 1,
      },
    ],
    index: 17,
  },
  {
    groupName: 'October',
    columns: [
      {
        name: 'ACTUAL',
        dataKey: 'OCT-ACTUAL',
        width: 70,
        index: 0,
      },
      {
        name: 'PLAN',
        dataKey: 'OCT-PLAN',
        width: 70,
        index: 1,
      },
    ],
    index: 18,
  },
  {
    groupName: 'November',
    columns: [
      {
        name: 'ACTUAL',
        dataKey: 'NOV-ACTUAL',
        width: 70,
        index: 0,
      },
      {
        name: 'PLAN',
        dataKey: 'NOV-PLAN',
        width: 70,
        index: 1,
      },
    ],
    index: 19,
  },
  {
    groupName: 'December',
    columns: [
      {
        name: 'ACTUAL',
        dataKey: 'DEC-ACTUAL',
        width: 70,
        index: 0,
      },
      {
        name: 'PLAN',
        dataKey: 'DEC-PLAN',
        width: 70,
        index: 1,
      },
    ],
    index: 20,
  },
]

const transformStr = `
function transform (data) {
  function groupBy(key, data) {
    return data.reduce((r, i) => {
      if (!r[i[key]]) {
        r[i[key]] = []
      }
      r[i[key]].push(i)
      return r
    }, {})
  }
  function flatten (arr) {
    const res = []
    if (Array.isArray(arr)){
      arr.map(i => {
          if (Array.isArray(i)) {
            res.push(...i)
          }else{
            res.push(i)
          }
        }
      )
    }
    return res
  }
  function flattenDeep(arr, deep = 2) {
    let res = flatten(arr)
    let deep2 = deep -1
    for(let i = deep2; i > 0; i--){
      res = flatten(res)
    }
    return res
  }
  const MonthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ].map(i => i.slice(0,3).toUpperCase())
  const newData = data.map(i => ({...i}))
  const yearGroupedData = groupBy("year", newData)
  return flattenDeep(
    Object.keys(yearGroupedData).map(y => {
      const d = yearGroupedData[y]
      const kpiGroupedData = groupBy("kpiName", d)
      return Object.keys(kpiGroupedData).map(k => {
        const kData = kpiGroupedData[k]
        const commonAttr = kData[0]

        MonthNames.forEach(month => {
          const mData = kData.filter(i => i.month === month)
          commonAttr[\`\${month}-ACTUAL\`] = (mData && mData[0] && mData[0].actual) || 0
          commonAttr[\`\${month}-PLAN\`] = (mData && mData[0] && mData[0].plan) || 0
        })
        return commonAttr
      })
    }),
  )
}
`
const comTablePinConf = configMerge(
  filterByCompanyBlock,
  tableWith({
    setting: {
      columns: pinColumnsConfig,
      showSearchBar: true,
    },
  }),
  {
    transform: [
      {
        type: 'javascript',
        code: transformStr,
      },
    ],
  },
)

const chartsToDraw = [
  {
    title: 'Expenditure',
    reportType: 'wpb',
    groups: [
      {
        title: 'Summary',
        layout: 'float',
        charts: [
          smallCard(['dataStatus'], query(isCost))(
            'Total Expenditure',
            {
              pinConfig: configMerge(
                title('Total Expenditure'),
                cardWithMap,
                toolbox,
                dataFilter(objCondIsCost),
                filterByCompanyBlock,
                numberNdFmt(2),
              ),
            },
            {},
          ),
          smallCard(['dataStatus'], query(isCAPEX))(
            'Capex',
            {
              pinConfig: configMerge(
                title('Capex'),
                cardWithMap,
                toolbox,
                dataFilter(objCondIsCapex),
                filterByCompanyBlock,
                numberNdFmt(2),
              ),
            },
            {},
          ),
          smallCard(['dataStatus'], query(isOPEX))(
            'Opex',
            {
              pinConfig: configMerge(
                title('Opex'),
                cardWithMap,
                toolbox,
                dataFilter(objCondIsOpex),
                filterByCompanyBlock,
                numberNdFmt(2),
              ),
            },
            {},
          ),
          gauge(mc11Gauge, ['dataStatus'], query(isCost))(
            'Total Expenditure',
            {
              ...forceRefresh,
              pinConfig: configMerge(
                title('Total Expenditure'),
                gaugeWithMap,
                toolbox,
                dataFilter(objCondIsCost),
                filterByCompanyBlock,
                numberNdFmt(2),
              ),
            },
            {},
          ),
          gauge(mc11Gauge, ['dataStatus'], query(isCAPEX))(
            'Capex',
            {
              ...forceRefresh,
              pinConfig: configMerge(
                title('Capex'),
                gaugeWithMap,
                toolbox,
                dataFilter(objCondIsCapex),
                filterByCompanyBlock,
                numberNdFmt(2),
              ),
            },
            {},
          ),
          gauge(mc11Gauge, ['dataStatus'], query(isOPEX))(
            'Opex',
            {
              ...forceRefresh,
              pinConfig: configMerge(
                title('Opex'),
                gaugeWithMap,
                toolbox,
                dataFilter(objCondIsOpex),
                filterByCompanyBlock,
                numberNdFmt(2),
              ),
            },
            {},
          ),
          drillPie(mc21Pie, query(isActualCost))(
            'Total Costs',
            {
              ...drillPathCost,
              pinConfig: configMerge(
                title('Total Costs'),
                pieWithTotalCosts,
                toolbox,
                dataFilter(objCondIsCost),
                filterByCompanyBlock,
                drillConfig,
                numberNdFmt(2),
              ),
            },
            {},
          ),
          drillPie(mc21Pie, query(isPlanCost))(
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
          m42Table({
            dataFormatter: formDataFormatter,
            getColumnsConfig: planningTableConfig,
            rowsPerPage: 5,
            filterBy: query(isCost),
          })(
            'Expenditure',
            {
              pinConfig: configMerge(
                title('Expenditure'),
                dataFilter(objCondIsCost),
                comTablePinConf,
              ),
            },
            {},
          ),
          axisControlledBar(
            ['company', 'month'],
            query(isActualCost),
            'Total Expenditure on Month',
            mc41Axis,
            {
              pinConfig: configMerge(
                title('Total Expenditure on Month'),
                vBarWithCompanyAndMonth,
                toolbox,
                dataFilter(objCondIsCost),
                filterByCompanyBlock,
                editor,
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
                vBarWithStatusAndMonth,
                toolbox,
                dataFilter(objCondIsEnA),
                filterByCompanyBlock,
                editor,
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
                vBarWithStatusAndMonth,
                toolbox,
                dataFilter(objCondIsDev),
                filterByCompanyBlock,
                editor,
                numberNdFmt(3),
              ),
            },
          ),
          axisControlledBar(
            ['company', 'month'],
            query(isProdActual),
            'Total Expenditure - Production',
            mc21Axis,
            {
              pinConfig: configMerge(
                title('Total Expenditure - Production'),
                vBarWithStatusAndMonth,
                toolbox,
                dataFilter(objCondIsProd),
                filterByCompanyBlock,
                editor,
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
                vBarWithStatusAndMonth,
                toolbox,
                dataFilter(objCondIsNonTec),
                filterByCompanyBlock,
                editor,
                numberNdFmt(3),
              ),
            },
          ),
        ],
      },
    ],
  },
  {
    title: 'Wells',
    reportType: 'wpb',
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
                dataFilter(objCondIsWell),
                filterByCompanyBlock,
                numberNdFmt(3),
              ),
            },
            {},
          ),
          m42Table({
            dataFormatter: formDataFormatter,
            rowsPerPage: 5,
            getColumnsConfig: planningTableConfig,
            filterBy: query(isWell),
          })(
            'Wells',
            {
              pinConfig: configMerge(
                title('Wells'),
                comTablePinConf,
                dataFilter({
                  eq: ['kpiGroup', 'WELLS'],
                }),
              ),
            },
            {},
          ),
        ],
      },
    ],
  },
  {
    title: 'Production',
    reportType: 'wpb',
    groups: [
      {
        title: 'Summary',
        layout: 'float',
        charts: [
          drillPie(mc21Pie, query(and(isActual, isNFAoNewOil)))(
            'Oil Production',
            {
              ...drillPathProd,
              pinConfig: configMerge(
                title('Oil Production'),
                pieWithKpi,
                toolbox,
                dataFilter(objCondIsNFAoNewOil),
                filterByCompanyBlock,
                drillConfig,
                numberNdFmt(2),
              ),
            },
            {},
          ),
          drillPie(mc21Pie, query(and(isActual, isNFAoNewCond)))(
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
          drillPie(mc21Pie, query(and(isActual, isNFAoNewGas)))(
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
          drillPie(
            mc21Pie,
            query(and(isActual, or(isNFAoNewOil, isNFAoNewCond))),
          )(
            'Oil +  Condensate',
            {
              ...drillPathProd,
              pinConfig: configMerge(
                title('Oil +  Condensate'),
                pieWithKpi(),
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
                vBarWithStatusCompMonth,
                toolbox,
                dataFilter(objCondIsNFAoNewOil),
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
          m42Table({
            dataFormatter: formDataFormatter,
            rowsPerPage: 5,
            getColumnsConfig: planningTableConfig,
            filterBy: query(and(isProd, isVolume)),
          })(
            'Production Fluids',
            {
              pinConfig: configMerge(
                title('Production Fluids'),
                dataFilter({
                  and: [
                    { eq: ['category', 'PRODUCTION'] },
                    { eq: ['kpiGroup', 'VOLUME'] },
                  ],
                }),
                comTablePinConf,
              ),
            },
            {},
          ),
        ],
      },
    ],
  },
  ...fypDashboard,
]

export default chartsPageCreator(chartsToDraw)
