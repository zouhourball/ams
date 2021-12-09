import {
  drillPie,
  mc21Pie,
  table,
  makeMap,
  mcMapAnnualResource,
} from './utils/shared'
import { query, eq, or, and } from 'libs/utils/query'
import {
  configMerge,
  pie,
  drill as drillGen,
  filterByCompanyBlock,
  toolbox,
  title,
  flattenTransform,
  filterByType,
  formatter,
  dataFilter,
  table as pinTable,
} from 'components/analytics/utils/charts-config-helper'
import { round } from 'lodash-es'
export const drillPath = [
  'country',
  'type',
  'company',
  'block',
  'field',
  'formation',
]

const isOil = eq('hydrocarbonType', 'OIL')
const isCondensate = eq('hydrocarbonType', 'CONDENSATE')
const isGas = eq('hydrocarbonType', 'GAS')
const hydTypeIsOil = {
  eq: ['hydrocarbonType', 'OIL'],
}
const hydTypeIsCond = {
  eq: ['hydrocarbonType', 'CONDENSATE'],
}
const hydTypeIsGas = {
  eq: ['hydrocarbonType', 'GAS'],
}
const is1P = or(eq('type', '1P Developed'), eq('type', '1P Undeveloped'))
const is1POil = and(is1P, isOil)
const is1PCond = and(is1P, isCondensate)
const is1PGas = and(is1P, isGas)
const is2P = or(eq('type', '2P Developed'), eq('type', '2P Undeveloped'))
const is2POil = and(is2P, isOil)
const is2PCond = and(is2P, isCondensate)
const is2PGas = and(is2P, isGas)
const isCumulativeProd = eq('type', 'Cumulative Production')
const isCR = eq('type', 'CR')
const isRemainingHciip = eq('type', 'Remaining HCIIP')
const isSummary = or(isCumulativeProd, is2P, isCR, isRemainingHciip)
const isOilSummary = and(isOil, isSummary)
const isCondSummary = and(isCondensate, isSummary)
const isGasSummary = and(isGas, isSummary)
// TODO: this `cr` and `Remaining HCIIP` would not work as this is frontend handled, need a solution here

const is3P = eq('type', '3P')
const isP1Total = eq('type', 'p1Total')
const isP2Total = eq('type', 'p2Total')
const isContingent = or(
  eq('type', 'C1 contingent'),
  eq('type', 'C2 contingent'),
  eq('type', 'C3 contingent'),
)
const isContingentOrP1P2P3 = or(
  eq('type', 'C1 contingent'),
  isP1Total,
  isP2Total,
  is3P,
)
const transformSummaryData = {
  transform: [
    {
      type: 'javascript',
      code: `function transform(data) {
      const newData = []
      for(let i = 0; i < data.length; i++ ){
        const item = data[i]
        const {company, block, year, cluster, field, group,
          formation, member, hydrocarbonType
        } = item
        const types = [
          'cumulativeProduction', 'p2Undeveloped',
          'p2Developed', 'cr', 'remainingHCIIP'
        ]
        const unit = hydrocarbonType === "GAS" ? "Tscf" : "MMstb"
        const base = {
          company,
          block,
          year,
          cluster,
          field,
          group,
          formation,
          member,
          unit,
          hydrocarbonType,
          country: 'TOTAL'
        }
        const itemData = types.map(t => {
          switch (t) {
            case 'cr':
              return {
                ...base,
                type: "cr",
                value: Number(item.ContingentC1)+ Number(item.ContingentC2),
              }
              case 'remainingHCIIP':
              return {
                ...base,
                type: "remainingHCIIP",
                value: Number(item.hciip) - (
                  Number(item.cumulativeProduction) + Number(item.p2Total) +
                  Number(item.ContingentC1) + Number(item.ContingentC2)
                  ),
              }
            default:
              return {
                ...base,
                type: t,
                value: item[t]
              }
          }
        })
        newData.push(...itemData)
      }
      return newData
    }`,
    },
  ],
}
const transform2PData = {
  transform: [
    {
      type: 'javascript',
      code: `function transform(data) {
      const newData = []
      for(let i = 0; i < data.length; i++ ){
        const item = data[i]
        const {company, block, year, cluster, field, group,
          formation, member, hydrocarbonType
        } = item
        const types = [
          'p2Undeveloped', 'p2Developed',
        ]
        const unit = hydrocarbonType === "GAS" ? "Tscf" : "MMstb"
        const base = {
          company,
          block,
          year,
          cluster,
          field,
          group,
          formation,
          member,
          unit,
          hydrocarbonType,
          country: 'TOTAL'
        }
        const itemData = types.map(t => ({
          ...base,
          type: t,
          value: item[t]
        }))
        newData.push(...itemData)
      }
      return newData
    }`,
    },
  ],
}
const transform1PData = {
  transform: [
    {
      type: 'javascript',
      code: `function transform(data) {
      const newData = []
      for(let i = 0; i < data.length; i++ ){
        const item = data[i]
        const {company, block, year, cluster, field, group,
          formation, member, hydrocarbonType
        } = item
        // TODO: unit is fake.may need backend.
        const types = [
          'p1Undeveloped', 'p1Developed',
        ]
        const unit = hydrocarbonType === "GAS" ? "Tscf" : "MMstb"
        const base = {
          company,
          block,
          year,
          cluster,
          field,
          group,
          formation,
          member,
          unit,
          hydrocarbonType,
          country: 'TOTAL'
        }
        const itemData = types.map(t => ({
          ...base,
          type: t,
          value: item[t]
        }))
        newData.push(...itemData)
      }
      return newData
    }`,
    },
  ],
}
const pieChart = (drill, dataFilterObj, transformData) =>
  configMerge(
    drill,
    toolbox,
    filterByCompanyBlock,
    dataFilterObj ? dataFilter(dataFilterObj) : {},
    transformData,
    formatter,
    pie({
      setting: {
        value1Fmt: 'numberFmt',
      },
      map: {
        split1By: 'country',
        value1Key: 'value',
      },
    }),
  )
const mapsFlatten = flattenTransform({
  columns: ['p1Total', 'p2Total', '3P', 'ContingentC1'],
  typeColumn: 'type',
  valueColumn: 'value',
})

const pieChartConfig = (filter, name, dataFilter, transformData) =>
  drillPie(
    mc21Pie,
    'sum-value',
    query(filter),
    true,
  )(
    name,
    {
      drillPath,
      pinConfig: configMerge(
        pieChart(drillGen(drillPath), dataFilter, transformData),
        title(name),
      ),
    },
    {},
  )
const pinColumnsConfig = [
  {
    name: 'Cluster',
    dataKey: 'cluster',
  },
  {
    groupName: '1P',
    columns: [
      {
        name: 'Developed',
        dataKey: 'p1Developed',
      },
      {
        name: 'Undeveloped',
        dataKey: 'p1Undeveloped',
      },
      {
        name: 'Total',
        dataKey: 'p1Total',
      },
    ],
  },
  {
    groupName: '2P',
    columns: [
      {
        name: 'Developed',
        dataKey: 'p2Developed',
      },
      {
        name: 'Undeveloped',
        dataKey: 'p2Undeveloped',
      },
      {
        name: 'Total',
        dataKey: 'p2Total',
      },
    ],
  },
  {
    name: '3P',
    dataKey: 'p3',
  },
  {
    groupName: 'Contingent',
    columns: [
      {
        name: 'C1',
        dataKey: 'ContingentC1',
      },
      {
        name: 'C2',
        dataKey: 'ContingentC2',
      },
      {
        name: 'C3',
        dataKey: 'ContingentC3',
      },
    ],
  },
]
export default [
  pieChartConfig(is1POil, 'Proved Reserve Oil', hydTypeIsOil, transform1PData),
  pieChartConfig(
    is1PCond,
    'Proved Reserve Condensate',
    hydTypeIsCond,
    transform1PData,
  ),
  pieChartConfig(is1PGas, 'Proved Reserve Gas', hydTypeIsGas, transform1PData),
  pieChartConfig(is2POil, '2P Reserve Oil', hydTypeIsOil, transform2PData),
  pieChartConfig(
    is2PCond,
    '2P Reserve Condensate',
    hydTypeIsCond,
    transform2PData,
  ),
  pieChartConfig(is2PGas, '2P Reserve Gas', hydTypeIsGas, transform2PData),
  pieChartConfig(
    isOilSummary,
    'Oil Summary',
    hydTypeIsOil,
    transformSummaryData,
  ),
  pieChartConfig(
    isCondSummary,
    'Condensate Summary',
    hydTypeIsCond,
    transformSummaryData,
  ),
  pieChartConfig(
    isGasSummary,
    'Gas Summary',
    hydTypeIsGas,
    transformSummaryData,
  ),
  drillPie(
    mc21Pie,
    'sum-value',
    query(isContingent),
    true,
  )(
    'Contingent Resources',
    {
      drillPath,
      // pinConfig: configMerge(
      //   pieChart(drillGen(["company", "block"]), typeIsContingent),
      //   title("Contingent Resources"),
      // ),
    },
    {},
  ),
  drillPie(
    mc21Pie,
    'sum-value',
    query(is3P),
    true,
  )(
    '3P',
    {
      drillPath,
      // pinConfig: configMerge(pieChart(drillGen(drillPath), ['p3']), title('3P')),
    },
    {},
  ),
  table(
    {
      dataFormatter: (data) => {
        const arr = []
        data.forEach((d) => {
          const item = arr.find((i) => i.cluster === d.cluster)
          if (item) {
            item[d.type] = round(d.value + (item[d.type] ? item[d.type] : 0), 2)
          } else {
            arr.push({
              ...d,
              [d.type]: round(d.value, 2),
            })
          }
        })
        return arr
      },
      columnsConfig: [
        {
          name: 'Cluster',
          dataKey: 'cluster',
        },
        {
          groupName: '1P',
          columns: [
            {
              name: 'Developed',
              dataKey: '1P Developed',
            },
            {
              name: 'Undeveloped',
              dataKey: '1P Undeveloped',
            },
            {
              name: 'Total',
              dataKey: 'p1Total',
            },
          ],
        },
        {
          groupName: '2P',
          columns: [
            {
              name: 'Developed',
              dataKey: '2P Developed',
            },
            {
              name: 'Undeveloped',
              dataKey: '2P Undeveloped',
            },
            {
              name: 'Total',
              dataKey: 'p2Total',
            },
          ],
        },
        {
          name: '3P',
          dataKey: '3P',
        },
        {
          groupName: 'Contingent',
          columns: [
            {
              name: 'C1',
              dataKey: 'C1 contingent',
            },
            {
              name: 'C2',
              dataKey: 'C2 contingent',
            },
            {
              name: 'C3',
              dataKey: 'C3 contingent',
            },
          ],
        },
      ],
    },
    'Annual Resource',
    {
      pinConfig: configMerge(
        title('Annual Resource'),
        pinTable({
          setting: {
            columns: pinColumnsConfig,
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
                  const accumulator = (d1, d2, keys) => {
                    keys.forEach(key=>{
                      d1[key] += +d2[key]
                    })
                  }
                  const clusterArr = extractUniqValue(data, 'cluster')
                  const resArr = clusterArr.map(i => (
                    { ...data[0],
                      cluster: i,
                      ContingentC1: 0,
                      ContingentC2: 0,
                      ContingentC3: 0,
                      p1Developed: 0,
                      p1Undeveloped: 0,
                      p1Total: 0,
                      p2Developed: 0,
                      p2Undeveloped: 0,
                      p2Total: 0,
                      p3: 0,
                    }
                  ))
                  const keysArr = [
                    'ContingentC1',
                    'ContingentC2',
                    'ContingentC3',
                    'p1Developed',
                    'p1Undeveloped',
                    'p1Total',
                    'p2Developed',
                    'p2Undeveloped',
                    'p2Total',
                    'p3',
                  ]
                  data.forEach( d => {
                    const item = resArr.find(i => i.cluster === d.cluster)
                    accumulator(item, d, keysArr)
                  })
                  return resArr
                }
              `,
            },
          ],
        },
      ),
    },
    {
      exportFileName: 'annual res',
    },
  ),
  makeMap(mcMapAnnualResource, 'Map', query(isContingentOrP1P2P3), {
    pinConfig: configMerge(
      mapsFlatten,
      filterByCompanyBlock,
      filterByType,
      formatter,
      title('Reserces on map 1p'),
      {
        type: 'GisMap',
        map: {
          blockBy: 'block',
          value1Key: 'value',
        },
        setting: {
          value1Fmt: '.2d',
        },
      },
    ),
  }),
]
