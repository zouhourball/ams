import {
  processDetail,
  costrecoveryFilters as costRecovery,
  downstreamFilters as downstream,
  flaringFilters as flaring,
  inventoryFilters as inventoryManagment,
  permitFilters as permit,
  planningFilters as planning,
  productionFilters as production,
  reservesFilters as Reserves,
} from 'libs/consts'
import { uniq } from 'lodash-es'

function getAllconfigs () {
  return {
    // These key names are bound to processDetail
    costRecovery,
    downstream,
    flaring,
    inventoryManagment,
    permit,
    planning,
    production,
    Reserves,
  }
}

function getReportTypeFieldPair () {
  let reportTypeAndField = []
  let allConfigs = getAllconfigs()
  for (const nowMoudleName of Object.keys(allConfigs)) {
    const nowMoudle = allConfigs[nowMoudleName]
    if (!nowMoudle) return
    for (const nowReportType of Object.keys(nowMoudle)) {
      if (nowMoudle[nowReportType].validForReportType !== undefined) {
        nowMoudle[nowReportType].validForReportType.forEach((r) => {
          reportTypeAndField.push([r, nowMoudle[nowReportType].field])
        })
      } else {
        Object.keys(processDetail[nowMoudleName]).forEach((r) => {
          reportTypeAndField.push([r, nowMoudle[nowReportType].field])
        })
      }
    }
  }
  return reportTypeAndField
}

export function getValidFilterKeys (reportType) {
  let reportTypeAndField = getReportTypeFieldPair()
  return (
    reportTypeAndField &&
    reportTypeAndField.reduce((acc, cur) => {
      if (cur[0] === reportType) {
        return [...acc, cur[1]]
      }
      return acc
    }, [])
  )
}

export function getProcessedFilters (mainFilters, sharedFilters) {
  let accCompanies = []
  let accBlocks = []
  let accFilters = []

  const { companies } = sharedFilters
  const comArr = Object.keys(companies)

  comArr.forEach((i) => {
    accBlocks = accBlocks.concat(companies[i].selectedBlocks)
  })
  accBlocks = uniq(accBlocks)

  comArr.forEach((i) => {
    if (companies[i].selectedBlocks.length !== 0) {
      accCompanies.push(i)
    }
  })

  Object.keys(mainFilters).forEach((i) => {
    if (Array.isArray(mainFilters[i])) {
      if (i === 'year') {
        accFilters.push({
          name: i,
          filterType: 'in',
          values: mainFilters[i].map((y) => +y),
        })
      } else {
        accFilters.push({
          name: i,
          filterType: 'in',
          values: mainFilters[i],
        })
      }
    }
  })

  return {
    company: accCompanies,
    block: accBlocks,
    filters: accFilters,
  }
}
