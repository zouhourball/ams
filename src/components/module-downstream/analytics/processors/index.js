import { mapDataCvtCreator } from 'components/analytics/utils'
import { flatMap, capitalize } from 'lodash-es'
import { MonthNames } from 'libs/consts'
import { fixNbr, mapMonthNameToNumber } from 'libs/utils'

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

export const mapDataConvertor = mapDataCvtCreator({
  blockField: 'block',
  valueField: 'value',
  preprocessor: ({ sourceData }) => {
    return sourceData
  },
})

export function processNGData (raw) {
  if (raw) {
    const { content } = raw
    return (
      content &&
      flatMap(content, (record) => {
        const { metaData, data } = record
        const { year, company, block, month } = metaData
        const monthIndex = mapMonthNameToNumber(month)
        return flatMap(data, (record) => {
          const { listOnSpecGas, terminalTypes } = record
          return listOnSpecGas
            .filter((row) => mapMonthNameToNumber(row.month) === monthIndex)
            .map(({ unit, ...rest }) => {
              return {
                ...rest,
                month: MonthNames[monthIndex - 1],
                unit: 'sm³ x 10³',
                type: unit,
                year,
                company,
                block: block || company,
                terminalTypes,
              }
            })
        })
      })
    )
  }
}
export function processRSData (raw) {
  if (raw) {
    const { content } = raw
    return (
      content &&
      flatMap(content, (record) => {
        const { metaData, data } = record
        const { month, year, company, category } = metaData
        if (category !== 'Retail Sales') return []
        const base = {
          month: MonthNames[mapMonthNameToNumber(capitalize(month)) - 1],
          year,
          company,
          unit: 'LTR',
        }
        return flatMap(data, (item) => {
          const { governorat, dataGov } = item
          return flatMap(dataGov, (item) => {
            const {
              saleQuantityM95,
              saleQuantityM91,
              saleQuantityKerosen,
              saleQuantityM98,
              saleQuantityGasOil,
              rate,
              ...rest
            } = item

            return [
              {
                ...rest,
                type: 'M95',
                value: saleQuantityM95,
                governorat,
                ...base,
              },
              {
                ...rest,
                type: 'M91',
                value: saleQuantityM91,
                governorat,
                ...base,
              },
              {
                ...rest,
                type: 'Kerosen',
                value: saleQuantityKerosen,
                governorat,
                ...base,
              },
              {
                ...rest,
                type: 'M98',
                value: saleQuantityM98,
                governorat,
                ...base,
              },
              {
                ...rest,
                type: 'GasOil',
                value: saleQuantityGasOil,
                governorat,
                ...base,
              },
              {
                ...rest,
                type: 'rate',
                value: rate,
                governorat,
                ...base,
              },
            ]
          })
        })
      })
    )
  }
}

export function processData (raw) {
  if (raw) {
    const { content } = raw
    const unit = 'MT'
    return (
      content &&
      flatMap(content, (record) => {
        const { metaData, data } = record
        const { month, year, company } = metaData
        const valueTypes = ['quota', 'totalLifted', 'variance']
        return flatMap(data, (d) => {
          const { actualLifted, company: formCompany } = d
          const base = {
            month: MonthNames[mapMonthNameToNumber(capitalize(month)) - 1],
            year,
            company,
            formCompany,
          }
          return valueTypes
            .map((type) => ({
              ...base,
              type,
              unit,
              value: fixNbr(d[type], 0),
            }))
            .concat([
              {
                ...base,
                type: 'actualLifted',
                source: actualLifted[0].unit,
                unit,
                value: +actualLifted[0].value,
              },
              {
                ...base,
                type: 'actualLifted',
                source: actualLifted[1].unit,
                unit,
                value: +actualLifted[1].value,
              },
            ])
        })
      })
    )
  } else return null
}
