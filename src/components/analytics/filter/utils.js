import { isArray } from 'lodash-es'
import { and, eq, or, query, includedIn } from 'libs/utils/query'
import { newDatePolyfill } from 'libs/utils'

function dateToNumber (date) {
  // [20,10,1] [19,1,1]
  return date.getYear() * 10000 + date.getMonth() * 100 + date.getDate()
}

function buildCond (field, config, value) {
  let c = config.find((c) => c.field === field)
  if (!c) {
    return eq(field, value)
  }
  switch (c.type) {
    case 'input':
      return eq((d) => `${d[field]}`, value)
    case 'radio':
    case 'check':
    case 'select':
      return includedIn((d) => {
        return `${d[field]}`
      }, value)
    default:
      // eslint-disable-next-line
      console.warn('No matched filter type')
  }
  return eq(field, value)
}

export function filter ({ data, config, sharedFilters, filters }) {
  const { reportType, ...others } = filters
  const { companies, dateRange } = sharedFilters
  const validCond = Object.entries(companies).filter(
    ([, { selectedBlocks }]) => selectedBlocks.length,
  )
  let arr = []
  for (let [company, { selectedBlocks }] of validCond) {
    let cond = (item) => {
      if (selectedBlocks.length === 1 && selectedBlocks[0] == null) {
        return item.company === company
      } else {
        return item.company === company && selectedBlocks.includes(item.block)
      }
    }
    arr.push(cond)
  }
  let cond = or(...arr)
  let reportData = data[reportType]

  if (dateRange) {
    // ignore time, just compare date, map date to a number
    let startDate = dateToNumber(new Date(dateRange.startDate))
    let endDate = dateToNumber(new Date(dateRange.endDate))

    cond = and(cond, (row) => {
      if (row.date) {
        let rowDate = newDatePolyfill(row.date)
        let d = dateToNumber(rowDate)
        return startDate <= d && endDate >= d
      } else {
        return true
      }
    })
  }

  for (let [field, value] of Object.entries(others)) {
    if (isArray(value) && value.length === 0) {
      continue
    }
    cond = and(cond, buildCond(field, config, value))
  }
  return query(cond, reportData)
}
