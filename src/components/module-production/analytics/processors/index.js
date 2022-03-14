/*
Source:
{
  "content": [
    {
    "id": "6790e8f2-477d-4605-97a9-7563c7a5031b",
    "metaData": {
      "status": "ack",
      "month": null,
      "year": 0,
      "company": "Medco",
      "reportDate": -61345987140000,
      "createdBy": "op_production1",
      "createdAt": 1516531894223,
      "updatedAt": 1516531926684,
      "approvedBy": "mog_production",
      "processInstanceId": null,
      "originalFileName": null,
      "originalFileId": null,
      "block": "56"
    },
    "values": [{
      "name": "OIL (bbl/d)",
      "data": [
        {
          "DAILY FIELD PRODUCTION": [
            {Actual: "1.0"},
            {Target: "6.0"},
            {LE: "11.0"},
          ]
        }
      ]
  }
  ],
  "last": true,
  "totalElements": 4,
  "totalPages": 1,
  "numberOfElements": 4,
  "sort": null,
  "first": true,
  "size": 20,
  "number": 0
}

 rowTemplate:
 {
    "name": "OIL",
    "unit": "bbl/d",
    "company": "Daleel",
    "date": 1516233720000,
    "block": "5",
    "DAILY FIELD PRODUCTION-Actual": 14,
  }
*/
import { flatten, flattenDeep, concat, merge } from 'lodash-es'
import { mapMonthNameToNumber } from 'libs/utils/wpb-data-helper'
import { compareAsc, getDaysInMonth } from 'date-fns'
import { mapDataCvtCreator } from 'components/analytics/utils'
export function processDailyData (data) {
  const { content } = data

  return flatten(
    content.map((report) => {
      const { values, metaData } = report
      const { reportDate, company, block } = metaData
      return values.map((v) => {
        const { name, data, unit } = v
        // basic
        let entry = { name, unit, date: reportDate, company, block }

        // dynamic
        data.forEach((d) =>
          Object.keys(d).forEach((key) =>
            Array.isArray(d[key])
              ? d[key].forEach((v) => {
                let vName = Object.keys(v)[0]
                entry[`${key}-${vName}`] = +v[vName] || 0
              })
              : (entry[key] = d[key]),
          ),
        )
        entry.deferment =
          entry['SCHEDULED DEFERMENT VOLS-Actual'] +
          entry['UNSCHEDULED DEFERMENT VOLS-Actual']
        return entry
      })
    }),
  )
}

export function processHydrocarbonData (data) {
  const { content } = data
  return flattenDeep(
    content.map((report) => {
      const { data } = report
      return data.map((d) => {
        const { yvalues } = d
        return yvalues.map((yValue) => ({
          year: yValue.year,
          value: yValue.value,
          block: d.block,
          company: d.company,
          htype: d.htype,
          stackKey: '',
        }))
      })
    }),
  )
}
export function processGomiData (data) {
  const { monthly, tracking } = data
  const trackingFlatten = flattenDeep(
    tracking.content.map((c) => {
      return (c.gomi || []).map((gomi) => ({
        ...gomi,
        month: c.metaData.month,
        year: c.metaData.year,
      }))
    }),
  ).filter((i) => i && i.value)
  const trackingData = trackingFlatten.map((tracking) => ({
    ...tracking,
    block: tracking.blocks.toString(),
    cameFrom: 'tracking',
  }))
  const monthlyData = monthly.map((m) => ({
    ...m,
    cameFrom: 'monthly',
  }))
  return [...trackingData, ...monthlyData]
}
function generateDs (name) {
  let dataStatus = null
  switch (name) {
    case 'NAG PROD':
    case 'AG PROD':
      dataStatus = 'AG & NAG Production'
      break

    case 'WATER INJ':
    case 'WATER DISPOSAL':
      dataStatus = 'Water others'
      break

    case 'WATER PROD':
      dataStatus = 'Water Production'
      break

    case 'FLARE GAS RATE':
    case 'FUEL GAS RATE':
    case 'GAS SHRINKAGE':
    case 'GAS SALE':
    case 'GAS INJECTION':
      dataStatus = 'Gas others'
      break
    default:
      dataStatus = name
      break
  }
  return dataStatus
}
function generateType (name) {
  if (name === 'AG PROD' || name === 'NAG PROD') return 'AG + NAG'
  if (name === 'WATER INJ') return 'WATER INJECTION'
  return name
}
export const transformGasBalance = {
  transform: [
    {
      type: 'javascript',
      code: `function transform(data) {
        function generateType(name) {
          if (name === "AG PROD" || name === "NAG PROD") return "AG + NAG"
          if (name === "WATER INJ") return "WATER INJECTION"
          return name
        }
        function generateDs(name) {
          let dataStatus = null
          switch (name) {
            case "NAG PROD":
            case "AG PROD":
              dataStatus = "AG & NAG Production"
              break

            case "WATER INJ":
            case "WATER DISPOSAL":
              dataStatus = "Water others"
              break

            case "WATER PROD":
              dataStatus = "Water Production"
              break

            case "FLARE GAS RATE":
            case "FUEL GAS RATE":
            case "GAS SHRINKAGE":
            case "GAS SALE":
              dataStatus = "Gas others"
              break
            default:
              dataStatus = name
              break
          }
          return dataStatus
        }
        return data.map(i => ({
          ...i,
          dataStatus: generateDs(i.name),
          type: generateType(i.name),
        }))
      }`,
    },
  ],
}
const fullObj = {
  block: '',
  cameFrom: '',
  company: '',
  destination: '',
  month: '',
  unit: '',
  value: '',
  year: '',
  name: '',
  oGCTotalFuelCompressorsConsumptions: '',
  oGCTotalGasEmission: '',
  terminalTypes: '',
  type: '',
  dataStatus: '',
  dataType: '',
  monthlyDate: '',
  split1By: '',
  split2By: '',
}
export function processTrackingData (data, ngData, monthlyData) {
  const { content } = data
  const trackingData = flattenDeep(
    content.map((c) => {
      const { data, totalGDTORPIC, metaData } = c
      const { block, company, month, year } = metaData
      const common = {
        block,
        company,
        month,
        year,
        unit: 'bbl/d',
        yearMonth: `${year}-${month}`,
      }
      return data
        .map((d) => {
          return merge({}, fullObj, {
            value: d.volume,
            destination: d.destination,
            ...common,
            cameFrom: 'tracking',
          })
        })
        .concat([
          merge({}, fullObj, {
            value: totalGDTORPIC,
            destination: 'totalGDTORPIC',
            ...common,
            cameFrom: 'tracking',
          }),
        ])
    }),
  )
  const ng = ngData.map((i) => {
    const eachDayInMonth = getDaysInMonth(
      new Date(i.year, mapMonthNameToNumber(i.month) - 1),
    )
    // 3,021,768,377 (Sm3) =3,021,768,377/1000000/No. of Days (May=31)* 35.3832  = 3,449.03 mmscf/d
    return merge({}, fullObj, {
      ...i,
      cameFrom: 'ng',
      block: i.block,
      value: i.value / (28262 * eachDayInMonth),
      split1By: i.terminalTypes,
      split2By: i.name,
      yearMonth: `${i.year}-${i.month}`,
    })
  })
  const monthly = monthlyData.map((i) => {
    return merge({}, fullObj, {
      ...i,
      cameFrom: 'monthly',
      split1By: i.type,
      split2By: i.company,
      yearMonth: `${i.year}-${i.month}`,
    })
  })
  return concat(trackingData, ng, monthly).sort((a, b) => {
    if (!a.yearMonth || !b.yearMonth) return 1
    const [aYear, aMonth] = a.yearMonth.split('-')
    const [bYear, bMonth] = b.yearMonth.split('-')
    if (aYear === bYear) {
      return mapMonthNameToNumber(aMonth) - mapMonthNameToNumber(bMonth)
    } else {
      return aYear - bYear
    }
  })
}
export function processMonthlyData (data) {
  const { content = [] } = data
  return flatten(
    content.map((report) => {
      const { production, metaData, wellCount } = report
      const { month, year, company, block } = metaData
      const monthDataAry = production.data
      const wellCountAry = wellCount.data
      let entry = {
        month,
        year,
        company,
        block,
        monthlyDate: new Date(year, mapMonthNameToNumber(month) - 1, 1),
      }
      return flattenDeep([
        monthDataAry.map((d) => {
          const { name, unit, value } = d
          const base = {
            name,
            unit,
            dataStatus: generateDs(name),
            type: generateType(name),
          }
          return [
            Object.assign({}, entry, {
              dataType: 'Actual',
              value: +value[0]['Actual'] || 0,
              ...base,
            }),
            Object.assign({}, entry, {
              dataType: 'Target',
              value: +value[1]['Target'] || 0,
              ...base,
            }),
          ]
        }),
        wellCountAry.map((d) => {
          const { name, unit, value } = d
          const base = {
            name,
            unit,
            dataStatus: generateDs(name),
            type: generateType(name),
          }
          return [
            Object.assign({}, entry, {
              dataType: 'Total',
              value: +value[0]['Total'] || 0,
              ...base,
            }),
            Object.assign({}, entry, {
              dataType: 'Closed-In',
              value: +value[1]['Closed-In'] || 0,
              ...base,
            }),
          ]
        }),
      ])
    }),
  ).sort((a, b) => compareAsc(a.monthlyDate, b.monthlyDate))
}
export const mapDataConvertor = mapDataCvtCreator({
  blockField: 'block',
  valueField: 'value',
  preprocessor: ({ sourceData }) => {
    const { monthly } = sourceData
    return (monthly || []).filter(
      ({ dataType, name }) => dataType === 'Actual' && name === 'OIL PRODN',
    )
  },
})
