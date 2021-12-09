import { flatMap, curry } from 'lodash-es'
import { MonthNames } from 'libs/consts'
import { newDatePolyfill } from 'libs/utils'
import { format, compareAsc } from 'date-fns'
/*
{
  "content":[
    {
      "id": "5ae0720fb2b19700014c06e7",
      "metaData": {
        "status": "submitted",
        "month": "January",
        "year": 2018,
        "company": "PDO",
        "reportDate": null,
        "createdBy": {
            "sub": "CgxvcGVyYXRvcl9wZG8SBWxvY2Fs",
            "name": "Pdo Operator",
            "email": "operator_pdo@yopmail.com"
        },
        "createdAt": 1525178899463,
        "updatedAt": 1525178899570,
        "approvedBy": {
            "sub": "CgxvcGVyYXRvcl9wZG8SBWxvY2Fs",
            "name": "Pdo Operator",
            "email": "operator_pdo@yopmail.com"
        },
        "processInstanceId": "270776",
        "originalFileName": "04. MONTHLY STATION FLARING.xlsx",
        "originalFileId": "5ae86203b2b19700014c0813",
        "block": "6",
        "category": null
      },
      "data": [
        {
          "flareStation": "FAHUD",
          "latitudeNorthing": {
              "unit": "UTM",
              "value": 2466026
          },
          "longitudeEasting": {
              "unit": "UTM",
              "value": 448273
          },
          "lpFlaringActuals": {
              "unit": "MMSCF",
              "value": 283
          },
          "apFlaringActuals": {
              "unit": "MMSCF",
              "value": 31
          },
          "totalFlaringActuals": {
              "unit": "MMSCF",
              "value": 314
          },
          "routineFlaringActuals": {
              "unit": "MMSCF",
              "value": null
          },
          "nonRoutineFlaringActuals": {
              "unit": "MMSCF",
              "value": null
          },
          "totalFlaringPlanned": {
              "unit": "MMSCF",
              "value": null
          },
          "rotuineFlaringPlanned": {
              "unit": "MMSCF",
              "value": null
          },
          "nonRotuineFlaringPlanned": {
              "unit": "MMSCF",
              "value": null
          },
          "comment": null
        }
      ]
    }
  ]
}
*/

/*
[
  {
    year: 2017,
    month: "January",
    company: "PDO",
    "FLARE STATION": "FAHUD",
    "LAT/NORTHING": 2466026,
    "LONG/EASTING": 448273,
    "type": "LP FLARING",
    value: 223,
  }
]
* */
const createStationData = ({
  flareStation,
  latitudeNorthing,
  longitudeEasting,
}) => ({
  'FLARE STATION': flareStation,
  'LAT/NORTHING': latitudeNorthing.value,
  'LONG/EASTING': longitudeEasting.value,
})

const unwrapCommon = (handler) => (raw) => {
  if (raw) {
    const { content } = raw
    return (
      content &&
      flatMap(content, (record) => {
        const { metaData, data } = record
        const { month, year, company, block, status } = metaData

        const baseData = {
          month,
          year,
          company,
          block,
        }
        const isAchived = status === 'ARCHIVED'
        return isAchived ? [] : flatMap(data, curry(handler)(baseData))
      })
    )
  } else return []
}

const unwrapDailyCommon = (handler) => (raw) => {
  if (raw) {
    const { content } = raw
    return (
      content &&
      flatMap(content, (record) => {
        const { metaData, data } = record
        const { reportDate, company, block, status } = metaData
        let date = newDatePolyfill(reportDate)
        const baseData = {
          date,
          month: MonthNames[date.getMonth()],
          year: date.getFullYear(),
          company,
          block,
        }
        const isAchived = status === 'ARCHIVED'
        return isAchived ? [] : flatMap(data, curry(handler)(baseData))
      }).sort((a, b) => compareAsc(a.date, b.date))
    )
  } else return []
}

export const processMonthly = unwrapCommon((baseData, data) => {
  const { name, unit, values, dataStatus } = data
  const comData = {
    ...baseData,
    dataStatus,
    name,
    unit,
  }

  return (values || []).map(({ month, value }) => ({
    ...comData,
    month,
    value,
  }))
})

export const processAnnForecast = unwrapCommon((baseData, data) => {
  const { name, values, unit } = data
  const comData = {
    ...baseData,
    name,
    unit,
  }
  return (values || []).map(({ year, value }) => ({
    ...comData,
    year,
    value,
  }))
})

export const processDaily = unwrapDailyCommon((baseData, data) => {
  const toExtract = [
    'routineFlaringAmount',
    'nonroutineFlaringAmount',
    'flareAmountTotal',
  ]
  const comData = {
    ...baseData,
    'FLARE STATION': data.flareStation,
    'LAT/NORTHING': data.latitudeNorthing,
    'LONG/EASTING': data.longitudeEasting,
    comment: data.comment,
  }
  return toExtract.map((i) => ({
    ...comData,
    type: i.replace('Amount', '').replace(/flaring/i, ''),
    value: data[i].value,
    unit: data[i].unit === 'MMSCF/D' ? 'MMSCF' : data[i].unit,
    dateText: format(baseData.date, 'DD/MM/YYYY'),
  }))
})

export const processMonStation = unwrapCommon((baseData, data) => {
  const {
    routineFlaringActuals,
    rotuineFlaringPlanned,
    nonRotuineFlaringPlanned,
    nonRoutineFlaringActuals,
    lpFlaringActuals,
    apFlaringActuals,
    totalFlaringActuals,
    totalFlaringPlanned,
    comment,
  } = data
  const comData = {
    ...baseData,
    ...createStationData(data),
    unit: 'MMSCF',
    comment,
  }

  return [
    {
      ...comData,
      type: 'Non-Routine',
      value: nonRoutineFlaringActuals.value,
      type2: 'AP FLARING',
      value2: apFlaringActuals.value,
      planValue: nonRotuineFlaringPlanned.value,
    },
    {
      ...comData,
      type: 'Routine',
      value: routineFlaringActuals.value,
      type2: 'LP FLARING',
      value2: lpFlaringActuals.value,
      planValue: rotuineFlaringPlanned.value,
    },
    {
      ...comData,
      type: 'Total',
      value: totalFlaringActuals.value,
      planValue: totalFlaringPlanned.value,
    },
  ]
})
