import { groupBy } from 'lodash-es'
import { extractUniqValue } from 'libs/utils'
import { query, eq, and, or, includes } from 'libs/utils/query'

const isOil = eq('hydrocarbonType', 'oil')
const isCondensate = eq('hydrocarbonType', 'condensate')
const isGas = eq('hydrocarbonType', 'gas')
const is1P = eq('reservesReportType', '1P PROVEN RESERVES')
const is2P = eq('reservesReportType', '2P RESERVES (PROVED & PROBABLE)')
const isClosingBalance = or(
  includes('item', 'Closing Balance'),
  includes('item', 'Ending Balance'),
)
const sum = (data) => +(data || []).reduce((r, i) => r + i.value, 0).toFixed(3)
const sumValue = (arr) => {
  let ret = arr.reduce((prev, curr) => Number(prev) + Number(curr), 0)
  return +ret.toFixed(3)
}
export const formatter1Pand2P = (data) => {
  const blocks = extractUniqValue(data, 'block')
  const arr = blocks.map((block) => {
    const blockData = query(eq('block', block))(data)
    const sample = blockData[0] || {}

    return {
      block,
      company: sample.company,
      'Oil-Proved': sum(query(and(isOil, is1P, isClosingBalance))(blockData)),
      'Oil-Expected': sum(query(and(isOil, is2P, isClosingBalance))(blockData)),
      'Condensate-Proved': sum(
        query(and(isCondensate, is1P, isClosingBalance))(blockData),
      ),
      'Condensate-Expected': sum(
        query(and(isCondensate, is2P, isClosingBalance))(blockData),
      ),
      'Gas-Proved': sum(query(and(isGas, is1P, isClosingBalance))(blockData)),
      'Gas-Expected': sum(query(and(isGas, is2P, isClosingBalance))(blockData)),
      'Oil+Condensate-Proved': sum(
        query(and(or(isOil, isCondensate), is1P, isClosingBalance))(blockData),
      ),
      'Oil+Condensate-Expected': sum(
        query(and(or(isOil, isCondensate), is2P, isClosingBalance))(blockData),
      ),
    }
  })

  return arr.concat({
    company: 'TOTAL',
    block: '',
    'Oil-Proved': sumValue(arr.map((i) => i['Oil-Proved'])),
    'Oil-Expected': sumValue(arr.map((i) => i['Oil-Expected'])),
    'Condensate-Proved': sumValue(arr.map((i) => i['Condensate-Proved'])),
    'Condensate-Expected': sumValue(arr.map((i) => i['Condensate-Expected'])),
    'Gas-Proved': sumValue(arr.map((i) => i['Gas-Proved'])),
    'Gas-Expected': sumValue(arr.map((i) => i['Gas-Expected'])),
    'Oil+Condensate-Proved': sumValue(
      arr.map((i) => i['Oil+Condensate-Proved']),
    ),
    'Oil+Condensate-Expected': sumValue(
      arr.map((i) => i['Oil+Condensate-Expected']),
    ),
  })
}

const make1Pand2PColConfig = (header, subHeaders = ['Proved', 'Expected']) => ({
  groupName: header.name,
  columns: subHeaders.map((type, i) => ({
    name: type,
    width: 70,
    dataKey: `${header.key}-${subHeaders[i]}`,
    render: (data) => {
      return data[`${header.key}-${type}`]
    },
  })),
})

export const columnsConfig1Pand2P = [
  {
    name: 'company',
    dataKey: 'company',
    width: 120,
  },
  {
    name: 'block',
    dataKey: 'block',
    width: 70,
  },
  make1Pand2PColConfig({ key: 'Oil', name: 'Oil(MMstb)' }),
  make1Pand2PColConfig({ key: 'Condensate', name: 'Condensate(MMstb)' }),
  make1Pand2PColConfig({ key: 'Gas', name: 'Gas(Tscf)' }),
  make1Pand2PColConfig({
    key: 'Oil+Condensate',
    name: 'Oil+Condensate(MMstb)',
  }),
]

export const formatterHistory = (data) => {
  const grouped = groupBy(data, (d) => `${d.company}:${d.hydrocarbonType}`)
  // console.log(data, 'data')
  // console.log(grouped, 'grouped')
  return Object.keys(grouped).map((key) => {
    // {2010-1P:[],2010-2P:[] ....}
    const data = groupBy(
      grouped[key],
      (d) =>
        `${d.year}-${
          d.reservesReportType === '1P PROVEN RESERVES' ? '1P' : '2P'
        }`,
    )
    const keys = Object.keys(data)
    let ret = { ...data[keys[0]][0] }
    for (let k of keys) {
      ret[k] = data[k].reduce((acc, ret) => acc + ret.value, 0)
    }
    return ret
  })
}

export const columnsHistoryOnData = (data) => [
  {
    name: 'company',
    dataKey: 'company',
    width: 120,
  },
  {
    name: 'Hydrocarbon',
    dataKey: 'hydrocarbonType',
    width: 120,
  },
  ...extractUniqValue(data, 'year').map(
    (y) => ({
      groupName: y,
      columns: [
        {
          name: '1P',
          dataKey: `${y}-1P`,
        },
        {
          name: '2P',
          dataKey: `${y}-2P`,
        },
      ],
    }),
    // make1Pand2PColConfig(y, showHighlight, ["1P", "2P"]),
  ),
]
