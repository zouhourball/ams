import { chartsPageCreator } from 'components/charts-page'
import { creatorMaker } from 'components/analytics/utils/creator-maker'
import { query, eq, and, or, includes } from 'libs/utils/query'
import { mapDataCvtCreator } from 'components/analytics/utils'
import {
  columnsConfig1Pand2P,
  formatter1Pand2P,
  columnsHistoryOnData,
  formatterHistory,
} from './table-config'
import {
  configMerge,
  pie,
  drill as drillGen,
  // scatter,
  dataFilter,
  stack,
  filterByCompanyBlock,
  title,
  toolbox,
  formatter,
  // flattenTransform,
  card,
  table as pinTable,
} from 'components/analytics/utils/charts-config-helper'

import {
  drillPie,
  mc41,
  mc42Table,
  mc21Map,
  mc21Pie,
  mc21Washline,
  drill,
  drillBreak,
  smallCard,
} from './utils/shared'
import annualResCharts from './annualRes'

const isOil = eq('hydrocarbonType', 'oil')
const isCondensate = eq('hydrocarbonType', 'condensate')
const isGas = eq('hydrocarbonType', 'gas')
const is1P = eq('reservesReportType', '1P PROVEN RESERVES')
const is2P = eq('reservesReportType', '2P RESERVES (PROVED & PROBABLE)')
const isBreakdown = eq('reservesReportType', 'BLOCK SUMMARY')
const isClosingBalance = or(
  includes('item', 'Closing Balance'),
  includes('item', 'Ending Balance'),
)

const objCondIs1P = {
  eq: ['type', '1P PROVEN RESERVES'],
}
const objCondIs2P = {
  eq: ['type', '2P RESERVES (PROVED & PROBABLE)'],
}
const objCondIsClose = {
  includedIn: ['name', ['Year Closing Balance', 'Year Ending Balance']],
}
const objCondIsOil = {
  eq: ['hydrocarbon', 'OIL'],
}

const genObjCondAndBreakdown = (cond) => ({
  and: [
    cond,
    {
      eq: ['reservesReportType', 'BLOCK SUMMARY'],
    },
  ],
})

const objCondIsCondenstate = {
  eq: ['hydrocarbon', 'CONDENSATE'],
}
const objCondIsGas = {
  eq: ['hydrocarbon', 'GAS'],
}

const mc41Bar = (filterBy) =>
  mc41(
    'stack',
    null,
    creatorMaker({
      type: 'stack',
      config: {
        sliceByKeys: ['currentYear', 'company', 'year'],
        filterBy,
        groupHandlerName: 'sum-value',
      },
    }),
  )

const table = (config) => {
  return mc42Table(
    creatorMaker({
      type: 'table',
      config: { rowsPerPage: 12, ...config },
    }),
  )
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
const pieChart = configMerge(
  drillGen(['company', 'block']),
  filterByCompanyBlock,
  toolbox,
  numberNdFmt(2),
  pie({
    map: {
      split1By: 'company',
      value1Key: 'value',
    },
  }),
)
const pie4DetailedSummaries = configMerge(
  drillGen(['name', 'company', 'block']),
  filterByCompanyBlock,
  toolbox,
  pie({
    map: {
      split1By: 'name',
      value1Key: 'value',
    },
  }),
)
const stackChart = configMerge(
  filterByCompanyBlock,
  toolbox,
  numberNdFmt(2),
  {
    transform: [
      {
        type: 'javascript',
        code: `function transform(data) {
        const newData = []
        for(let i = 0;i< data.length;i++){
          const {hydrocarbon, unit, status, company, block} = data[i]
          const years = ['current', 'previous','forecast']
          for(let y = 0; y< years.length; y++) {
            const text = years[y]
            const base = {
              hydrocarbon, unit, status, company, block
            }
            newData.push({
              ...base,
              year: data[i][text + 'Year'],
              type: '1P PROVEN RESERVES',
              value: data[i][text + '1P']
            }, {
              ...base,
              year: data[i][text+'Year'],
              type: '2P RESERVES (PROVED & PROBABLE)',
              value: data[i][text+'2P']
            })
          }
        }
        return newData
      }`,
      },
    ],
  },
  stack({
    map: {
      // x is year
      seriesBy: 'type',
      groupBy: 'company',
      splitBy: 'year',
      aggregateValue: 'value',
    },
  }),
)
const waslineFor2P = (name, cond, objCond, precision) =>
  mc21Washline(
    creatorMaker({
      type: 'washline',
      config: {
        precision,
        sliceByKeys: ['item'],
        groupHandlerName: 'sum-value',
        filterBy: query(cond),
      },
    }),
    `Reserves 2p ${name}`,
    {
      pinConfig: configMerge(
        {
          type: 'WashLine',
          map: {
            split1By: 'name',
            value1Key: 'value',
          },
        },
        dataFilter({
          and: [
            {
              eq: ['type', '2P RESERVES (PROVED & PROBABLE)'],
            },
            {
              not: {
                includes: ['name', ' Ratio '],
              },
            },
            objCond,
          ],
        }),
        title(`Reserves 2p ${name}`),
      ),
    },
    {},
  )

const calcDetialData = (cond) => {
  const cmp = (l, r) => {
    let lV = `${l.company}${l.block}`
    let rV = `${r.company}${r.block}`
    if (lV < rV) {
      return -1
    } else if (lV > rV) {
      return 1
    }
    return 0
  }
  return (data) => {
    let filtered = query(cond, data)
    const HCIIP = query(includes('item', '(HCIIP)'), filtered).sort(cmp)
    if (!HCIIP.length) {
      return query(cond, data)
    }
    // Ultimate Recovery (UR)
    const UR = query(eq('item', 'Ultimate Recovery (UR)'), filtered).sort(cmp)
    // Cumulative Production (Np)
    const NP = query(includes('item', 'Cumulative Production'), filtered).sort(
      cmp,
    )
    // Expected Reserves (2P)
    const P2 = query(includes('item', '2P Reserves'), filtered).sort(cmp)
    const CR = query(
      includes('item', '2C Contingent Resources'),
      filtered,
    ).sort(cmp)
    // Remaining HCIIP
    const RHCIIP = []
    const len = Math.max(UR.length, NP.length, P2.length, HCIIP.length)
    for (let i = 0; i < len; i++) {
      let ele = UR[i] || NP[i] || P2[i]
      let urv =
        ((NP[i] || {}).value || 0) +
        ((P2[i] || {}).value || 0) +
        ((CR[i] || {}).value || 0)

      RHCIIP.push({
        ...ele,
        item: 'Remaining HCIIP',
        value: ((HCIIP[i] || {}).value || 0) - urv,
      })
    }
    return [...NP, ...P2, ...CR, ...RHCIIP]
  }
}
const mapCard = card({
  map: {
    split1By: 'hydrocarbon',
    value1Key: 'value',
    unitKey: 'unit',
  },
})
const pinCardFilter = (type) =>
  dataFilter({
    and: [
      {
        eq: ['type', type],
      },
      {
        or: [
          { includes: ['name', 'Closing Balance'] },
          { includes: ['name', 'Ending Balance'] },
        ],
      },
    ],
  })

export const chartsToDraw = [
  {
    title: 'Annual Resources',
    reportType: 'annual-resource',
    groups: [
      {
        title: 'Summary',
        layout: 'float',
        charts: annualResCharts,
      },
    ],
  },
  {
    title: 'Annual Reserves',
    reportType: 'reserves',
    groups: [
      {
        title: 'Proven & Probable',
        layout: 'float',
        charts: [
          smallCard(['hydrocarbonType'], query(and(is1P, isClosingBalance)))(
            'Total 1P',
            {
              pinConfig: configMerge(
                title('Total 1P'),
                pinCardFilter('1P PROVEN RESERVES'),
                mapCard,
              ),
            },
            {},
          ),
          smallCard(['hydrocarbonType'], query(and(is2P, isClosingBalance)))(
            'Total 2P',
            {
              pinConfig: configMerge(
                title('Total 2P'),
                pinCardFilter('2P RESERVES (PROVED & PROBABLE)'),
                mapCard,
              ),
            },
            {},
          ),
          waslineFor2P('Oil', and(is2P, isOil), objCondIsOil),
          waslineFor2P(
            'Condensate',
            and(is2P, isCondensate),
            objCondIsCondenstate,
          ),
          waslineFor2P('Oil + Condensate', and(is2P, or(isOil, isCondensate)), {
            or: [objCondIsOil, objCondIsCondenstate],
          }),
          waslineFor2P('Gas', and(is2P, isGas), objCondIsGas, 3),
          drillPie(
            mc21Pie,
            'sum-value',
            query(and(isOil, is1P, isClosingBalance)),
          )(
            '1P Proven - Oil',
            {
              ...drill,
              pinConfig: configMerge(
                pieChart,
                dataFilter({
                  and: [objCondIsOil, objCondIs1P, objCondIsClose],
                }),
                title('1P Proven - Oil'),
              ),
            },
            {},
          ),
          drillPie(
            mc21Pie,
            'sum-value',
            query(and(isOil, is2P, isClosingBalance)),
          )(
            '2P Expected - Oil',
            {
              ...drill,
              pinConfig: configMerge(
                pieChart,
                dataFilter({
                  and: [objCondIsOil, objCondIs2P, objCondIsClose],
                }),
                title('2P Expected - Oil'),
              ),
            },
            {},
          ),
          drillPie(
            mc21Pie,
            'sum-value',
            query(and(isCondensate, is1P, isClosingBalance)),
          )(
            '1P Proven - Condensate',
            {
              ...drill,
              pinConfig: configMerge(
                pieChart,
                dataFilter({
                  and: [objCondIsCondenstate, objCondIs1P, objCondIsClose],
                }),
                title('1P Proven - Condensate'),
              ),
            },
            {},
          ),
          drillPie(
            mc21Pie,
            'sum-value',
            query(and(isCondensate, is2P, isClosingBalance)),
          )(
            '2P Expected - Condensate',
            {
              ...drill,
              pinConfig: configMerge(
                pieChart,
                dataFilter({
                  and: [objCondIsCondenstate, objCondIs2P, objCondIsClose],
                }),
                title('2P Expected - Condensate'),
              ),
            },
            {},
          ),
          drillPie(
            mc21Pie,
            'sum-value',
            query(and(is1P, isGas, isClosingBalance)),
            3,
          )(
            '1P Proven - Gas',
            {
              ...drill,
              pinConfig: configMerge(
                pieChart,
                dataFilter({
                  and: [objCondIsGas, objCondIs1P, objCondIsClose],
                }),
                title('1P Proven - Gas'),
              ),
            },
            {},
          ),
          drillPie(
            mc21Pie,
            'sum-value',
            query(and(is2P, isGas, isClosingBalance)),
            3,
          )(
            '2P Expected - Gas',
            {
              ...drill,
              pinConfig: configMerge(
                pieChart,
                dataFilter({
                  and: [objCondIsGas, objCondIs2P, objCondIsClose],
                }),
                title('2P Expected - Gas'),
              ),
            },
            {},
          ),
          table({
            dataFormatter: formatter1Pand2P,
            columnsConfig: columnsConfig1Pand2P,
            filterBy: query(and(isClosingBalance, or(is1P, is2P))),
          })(
            'ARPR Summary',
            {
              pinConfig: configMerge(
                title('ARPR Summary'),
                pinTable({
                  setting: {
                    columns: [
                      {
                        name: 'COMPANY',
                        dataKey: 'company',
                        width: 120,
                      },
                      {
                        name: 'Block',
                        dataKey: 'block',
                        width: 70,
                      },
                      {
                        groupName: 'Oil(MMstb)',
                        columns: [
                          {
                            name: 'Proved',
                            width: 70,
                            dataKey: 'Oil-Proved',
                          },
                          {
                            name: 'Expected',
                            width: 70,
                            dataKey: 'Oil-Expected',
                          },
                        ],
                      },
                      {
                        groupName: 'Condensate(MMstb)',
                        columns: [
                          {
                            name: 'Proved',
                            width: 70,
                            dataKey: 'Condensate-Proved',
                          },
                          {
                            name: 'Expected',
                            width: 70,
                            dataKey: 'Condensate-Expected',
                          },
                        ],
                      },
                      {
                        groupName: 'Gas(Tscf)',
                        columns: [
                          {
                            name: 'Proved',
                            width: 70,
                            dataKey: 'Gas-Proved',
                          },
                          {
                            name: 'Expected',
                            width: 70,
                            dataKey: 'Gas-Expected',
                          },
                        ],
                      },
                      {
                        groupName: 'Oil+Condensate(MMstb)',
                        columns: [
                          {
                            name: 'Proved',
                            width: 70,
                            dataKey: 'Oil+Condensate-Proved',
                          },
                          {
                            name: 'Expected',
                            width: 70,
                            dataKey: 'Oil+Condensate-Expected',
                          },
                        ],
                      },
                    ],
                    showSearchBar: true,
                  },
                }),
                toolbox,
                {
                  transform: [
                    {
                      type: 'javascript',
                      code: `
                    function transform(data) {
                      if (!data || data.length === 0 ) return []
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
                      const genResItem = (company, block) => ({
                        company,
                        block,
                        "Oil-Proved": 0,
                        "Oil-Expected": 0,
                        "Condensate-Proved": 0,
                        "Condensate-Expected": 0,
                        "Gas-Proved": 0,
                        "Gas-Expected": 0,
                        "Oil+Condensate-Proved": 0,
                        "Oil+Condensate-Expected": 0,
                      })
                      const companyArr = extractUniqValue(data,'company')
                      const resArr = companyArr.map(i => {
                        const obj = data.find(d => d.company === i)
                        return genResItem(obj.company, obj.block)
                      })
                      const total = genResItem('TOTAL', '-')
                      data.forEach(d => {
                        const item = resArr.find(i=> i.company === d.company)
                        const isProved = d.name.toLowerCase().includes('proved')
                        const isGas = d.hydrocarbon === 'Gas'
                        const isOil = d.hydrocarbon === 'Oil'
                        if (isProved) {
                          if(isGas){
                            item['Gas-Proved'] += +d.value
                            total['Gas-Proved'] += +d.value
                          }else{
                            if(isOil){
                              item["Oil-Proved"] += +d.value
                              total["Oil-Proved"] += +d.value
                            }else{
                              item["Condensate-Proved"] += +d.value
                              total["Condensate-Proved"] += +d.value
                            }
                            item["Oil+Condensate-Proved"] += +d.value
                            total["Oil+Condensate-Proved"] += +d.value
                          }
                        }else{
                          if(isGas){
                            item['Gas-Expected'] += +d.value
                            total['Gas-Expected'] += +d.value
                          }else{
                            if(isOil){
                              item["Oil-Expected"] += +d.value
                              total["Oil-Expected"] += +d.value
                            }else{
                              item["Condensate-Expected"] += +d.value
                              total["Condensate-Expected"] += +d.value
                            }
                            item["Oil+Condensate-Expected"] += +d.value
                            total["Oil+Condensate-Expected"] += +d.value
                          }
                        }
                      });
                      resArr.push(total)
                      return resArr
                    }
                    `,
                    },
                  ],
                },
              ),
            },
            {
              exportFileName: 'ARPR Summary',
            },
          ),
        ],
      },
      {
        title: 'Detailed Summaries',
        layout: 'float',
        charts: [
          drillPie(
            mc21Pie,
            'sum-value',
            calcDetialData(and(isOil, isBreakdown)),
            true,
          )(
            'Oil Breakdown',
            {
              ...drillBreak,
              pinConfig: configMerge(
                pie4DetailedSummaries,
                dataFilter(genObjCondAndBreakdown(objCondIsOil)),
                title('Oil'),
              ),
            },
            {},
          ),
          drillPie(
            mc21Pie,
            'sum-value',
            calcDetialData(and(isGas, isBreakdown)),
            3,
          )(
            'Gas Breakdown',
            {
              ...drillBreak,
              pinConfig: configMerge(
                pie4DetailedSummaries,
                dataFilter(genObjCondAndBreakdown(objCondIsGas)),
                title('Gas Breakdown'),
              ),
            },
            {},
          ),
          drillPie(
            mc21Pie,
            'sum-value',
            calcDetialData(and(isCondensate, isBreakdown)),
            true,
          )(
            'Condensate Breakdown',
            {
              ...drillBreak,
              pinConfig: configMerge(
                pie4DetailedSummaries,
                dataFilter(genObjCondAndBreakdown(objCondIsCondenstate)),
                title('Condensate Breakdown'),
              ),
            },
            {},
          ),
          mc21Map(
            creatorMaker({
              type: 'map',
              config: {
                mapName: 'reserves map',
                mapDataConvert: mapDataCvtCreator({
                  blockField: 'block',
                  valueField: 'value',
                }),
                filterBy: query(and(is1P, isClosingBalance)),
              },
            }),
            'Reserves on map 1p',
            {
              pinConfig: configMerge(
                formatter,
                filterByCompanyBlock,
                title('Map'),
                {
                  type: 'GisMap',
                  map: {
                    blockBy: 'block',
                    value1Key: 'value',
                  },
                  setting: {
                    value1Fmt: '.2d',
                  },
                  filter: {
                    type: 'simple',
                    definition: [
                      {
                        type: 'check',
                        label: 'hydrocarbon',
                        field: 'hydrocarbon',
                      },
                    ],
                  },
                },
              ),
            },
            {},
          ),
          // table({
          //   dataFormatter:formatter1Pand2P,
          //   columnsConfig:columnsConfig1Pand2P,
          //   filterBy: query(isBreakdown)
          // })("Reserves Report Data"),
        ],
      },
    ],
  },
  {
    title: 'History & Forecast',
    reportType: 'H & F',
    groups: [
      {
        title: 'History & Forecast',
        layout: 'float',
        charts: [
          mc41Bar(query(and(isOil, is1P)))(
            'Oil-1P PROVEN RESERVES',
            {
              pinConfig: configMerge(
                stackChart,
                dataFilter(objCondIsOil),
                title('Oil-1P PROVEN RESERVES'),
              ),
            },
            {},
          ),
          mc41Bar(query(and(isOil, is2P)))(
            'Oil-2P RESERVES (PROVED & PROBABLE)',
            {
              pinConfig: configMerge(
                stackChart,
                dataFilter(objCondIsOil),
                title('Oil-2P RESERVES (PROVED & PROBABLE)'),
              ),
            },
            {},
          ),
          mc41Bar(query(and(isCondensate, is1P)))(
            'Condensate-1P PROVEN RESERVES',
            {
              pinConfig: configMerge(
                stackChart,
                dataFilter(objCondIsCondenstate),
                title('Condensate-1P PROVEN RESERVES'),
              ),
            },
            {},
          ),
          mc41Bar(query(and(isCondensate, is2P)))(
            'Condensate-2P RESERVES (PROVED & PROBABLE)',
            {
              pinConfig: configMerge(
                stackChart,
                dataFilter(objCondIsCondenstate),
                title('Condensate-2P RESERVES (PROVED & PROBABLE)'),
              ),
            },
            {},
          ),
          mc41Bar(query(and(isGas, is1P)))(
            'Gas-1P PROVEN RESERVES',
            {
              pinConfig: configMerge(
                stackChart,
                dataFilter(objCondIsGas),
                title('History & Forecast - Gas - 1P PROVEN RESERVES'),
              ),
            },
            {},
          ),
          mc41Bar(query(and(isGas, is2P)))(
            'Gas-2P RESERVES (PROVED & PROBABLE)',
            {
              pinConfig: configMerge(
                stackChart,
                dataFilter(objCondIsGas),
                title(
                  'History & Forecast - Gas-2P RESERVES (PROVED & PROBABLE)',
                ),
              ),
            },
            {},
          ),
          table({
            dataFormatter: formatterHistory,
            columnsConfigOnData: columnsHistoryOnData,
          })(
            'History & Forecast',
            {
              // sofar, the table can't pin
              pinConfig: {},
            },
            {
              exportFileName: 'History & Forecast',
            },
          ),
        ],
      },
    ],
  },
]

export default chartsPageCreator(chartsToDraw)
