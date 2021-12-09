import { flatMap } from 'lodash-es'
import { fixNbr } from 'libs/utils'

export function processAffiliateData (raw) {
  if (raw) {
    const { content } = raw
    return (
      content &&
      flatMap(content, (record) => {
        const { metaData, data } = record
        const { month, year, company, block } = metaData
        return flatMap(data, (item) => {
          const { totalUSD, manHoursEstimate, ...rest } = item
          return [
            {
              ...rest,
              block,
              type: 'totalUSD',
              value: totalUSD,
              unit: 'USD',
              month,
              year,
              company,
            },
            {
              ...rest,
              block,
              type: 'manHoursEstimate',
              value: manHoursEstimate,
              unit: 'Hrs',
              month,
              year,
              company,
            },
          ]
        })
      })
    )
  }
}
export function processCostsData (content) {
  if (content.length) {
    return flatMap(content, (record) => {
      const { items, metaData } = record
      const { year, block, company } = metaData
      return flatMap(items, (item) => {
        const { mvalues, ...rest } = item
        const { category } = item
        if (category === 'TOTAL COSTS') {
          const { yvalue } = item
          const typeArr = ['plan', 'actual', 'outlook']
          return typeArr.map((i) => ({
            ...rest,
            type: i,
            value: yvalue[i],
            year,
            block,
            company,
            unit: 'USD',
          }))
        } else {
          return flatMap(mvalues, (monthValue) => {
            const { month, plan, actual } = monthValue
            const base = {
              month,
              year,
              block,
              company,
              unit: 'USD',
            }
            return [
              {
                ...rest,
                type: 'plan',
                value: fixNbr(plan),
                ...base,
              },
              {
                ...rest,
                type: 'actual',
                value: fixNbr(actual),
                ...base,
              },
            ]
          })
        }
      })
    })
  }
}
export function processContractsData (raw) {
  if (raw) {
    const { content } = raw
    return (
      content &&
      flatMap(content, (record) => {
        const { metaData, data } = record
        const { month, year, company, block } = metaData
        return flatMap(data, (item) => {
          const { actualSpent, approvedAmount, ...rest } = item
          return [
            {
              ...rest,
              type: 'approvedAmount',
              value: approvedAmount,
              month,
              year,
              unit: 'USD',
              company,
              block,
            },
            {
              ...rest,
              type: 'actualSpent',
              value: actualSpent,
              month,
              year,
              unit: 'USD',
              company,
              block,
            },
          ]
        })
      })
    )
  }
}

/**
 "metaData": {
      "status": "submitted",
      "year": 2018,
      "company": "Company_2",
      "createdBy": {
          "sub": "CghvcGVyYXRvchIFbG9jYWw",
          "name": "Operator",
          "email": "operator@meerawork.com"
      },
      "createdAt": "Jul 17, 2018 10:17:43 AM",
      "updatedAt": "Jul 17, 2018 10:17:43 AM",
      "approvedBy": {
          "sub": "CghvcGVyYXRvchIFbG9jYWw",
          "name": "Operator",
          "email": "operator@meerawork.com"
      },
      "processInstanceId": "186347",
      "originalFileName": "template_costRecovery_prodLiftingCost (2).xlsx",
      "originalFileId": "5b4dc2111d9a370001dfc978",
      "block": "50119"
  },
 "dataBasedProduction": [
   {
       "month": "January",
       "mogPriceUsd": null,
       "totalProduction": {
           "barrels": "1305111.882",
           "usd": "55180130.358"
       },
       "contractorEntitlement": {
           "costRecovery": {
               "barrels": "522044.753",
               "usd": "22072052.143"
           },
           "profit": {
               "barrels": "156613.426",
               "usd": "6621615.643"
           },
           "total": {
               "barrels": "678658.2",
               "usd": "28693668"
           }
       },
       "governmentEntitlement": {
           "profit": {
               "barrels": "626453.703",
               "usd": "26486462.572"
           }
       }
   },
 ]
 * */

export function processProdData (raw) {
  const { content } = raw
  const valueCategories = {
    totalProduction: 'Total Production',
    contractorEntitlement: 'Contractor Entitlement',
    governmentEntitlement: 'Government Entitlement',
  }

  if (content) {
    return flatMap(
      content,
      ({ dataActualLifting, dataBasedProduction, metaData }) => {
        const { company, year, block } = metaData

        const mapDataItem = (type) => (d) => {
          const { totalProduction } = d
          d.totalProduction = { production: totalProduction }

          return flatMap(Object.keys(valueCategories), (cat) => {
            const valueTypes = Object.keys(d[cat]).filter((v) => v !== 'total')
            return flatMap(valueTypes, (valueType) => {
              const dataTypes = Object.keys(d[cat][valueType])
              return dataTypes.map((dataType) => ({
                valueCategory: valueCategories[cat],
                valueType,
                dataType,
                value: +d[cat][valueType][dataType] || 0,
                month: d.month,
                company,
                block,
                type,
                year,
                unit: dataType.toLowerCase() === 'usd' ? 'USD' : 'BBL',
              }))
            })
          })
        }
        return [
          ...flatMap(dataActualLifting, mapDataItem('Lifting')),
          ...flatMap(dataBasedProduction, mapDataItem('Production')),
        ]
      },
    )
  }
  return []
}
