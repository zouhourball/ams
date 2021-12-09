import { flatten, flattenDeep, memoize, chunk, get } from 'lodash-es'
import { groupBy, extractUniqValue, buildExpPrediction as bp } from 'libs/utils'
import { query, eq, and } from 'libs/utils/query'
import { MonthNames } from 'libs/consts'
// import React from 'react'
// import i18n from 'i18n-js'
// import l from 'libs/langs/keys'
export const formDataFormatter = (data) => {
  const yearGroupedData = groupBy('year', data)

  return flattenDeep(
    Object.keys(yearGroupedData).map((y) => {
      const d = yearGroupedData[y]
      const kpiGroupedData = groupBy('kpi', d)
      return Object.keys(kpiGroupedData).map((k) => {
        const kData = kpiGroupedData[k]
        const commonAttr = { ...kData[0] }

        MonthNames.forEach((month) => {
          const isMonth = eq('month', month)
          const status = extractUniqValue(kData, 'dataStatus')
          status.forEach((s) => {
            const sData = query(and(isMonth, eq('dataStatus', s)))(kData)
            commonAttr[`${month}-${s}`] = get(sData, '0.value', 0)
          })
        })
        commonAttr.detail = MonthNames.map((month) => {
          const isMonth = eq('month', month)
          const status = extractUniqValue(kData, 'dataStatus')
          const values = status.map((s) => {
            const sData = query(and(isMonth, eq('dataStatus', s)))(kData)
            return {
              name: s,
              value: (sData && sData[0] && sData[0].value) || 0,
            }
          })

          return {
            month,
            year: y,
            values,
          }
        })
        return commonAttr
      })
    }),
  )
}

const baseConfig = [
  {
    name: 'company',
    dataKey: 'company',
    width: 100,
    align: 'left',
  },
  {
    name: 'block',
    dataKey: 'block',
    width: 100,
    align: 'left',
  },
  {
    name: 'dataStatus',
    dataKey: 'dataStatus',
    width: 120,
    align: 'left',
  },
  {
    name: 'category',
    dataKey: 'category',
    width: 150,
    align: 'left',
  },
  {
    name: 'subCategory',
    dataKey: 'subCategory',
    width: 150,
    align: 'left',
  },
  {
    name: 'kpiGroup',
    dataKey: 'kpiGroup',
    width: 150,
    align: 'left',
  },
  {
    name: 'KPI',
    dataKey: 'kpi',
    width: 150,
    align: 'left',
  },
  {
    name: 'unit',
    dataKey: 'unit',
    width: 150,
  },
]
export const planningTableConfig = (showHighlight) => [
  ...baseConfig,
  {
    name: 'year',
    dataKey: 'year',
    width: 100,
  },
  ...flatten(
    MonthNames.map((m) => ({
      groupName: m,
      columns: ['ACTUAL', 'PLAN'].map((c) => ({
        name: c,
        dataKey: `${m}-${[c]}`,
        ...{
          render (data) {
            const values = data.detail.find((item) => item.month === m).values
            const value = get(
              values.find((item) => item.name === c),
              'value',
              0,
            )
            const planValue = get(
              values.find((item) => item.name === 'PLAN'),
              'value',
              0,
            )
            let color = ''
            if (c === 'ACTUAL' && planValue) {
              if (value < planValue) {
                color = `rgba(255, 205, 210, ${
                  Math.max(0, planValue - value) / planValue
                })`
              } else {
                color = `rgba(105, 240, 174, ${
                  Math.min(planValue, value - planValue) / planValue
                })`
              }
            }
            return (
              <div
                className="ams-production-colored-cell"
                style={{
                  background: showHighlight && color,
                }}
              >
                {value}
              </div>
            )
          },
        },
        width: 70,
      })),
    })),
  ),
]

export const planningFypTableConfig = memoize((data) => {
  const fypConfig = baseConfig.filter((i) => i.dataKey !== 'dataStatus')
  return [
    ...fypConfig,
    ...extractUniqValue(data, 'year').map((y) => ({
      name: y,
      dataKey: `${y}-plan`,
    })),
  ]
})

export const formFypDataFormatter = (data) => {
  const year = extractUniqValue(data, 'year')
  const arr = chunk(data, year.length)
  const result = arr.map((array) => {
    const obj = Object.assign({}, array[0])
    array.forEach((item) => {
      obj[`${item.year}-plan`] = item.value
    })
    return obj
  })
  return result
}
export const tableWithPinConfig = () => {
  return [
    {
      name: 'company',
      dataKey: 'company',
    },
    {
      name: 'block',
      dataKey: 'block',
    },
    {
      name: 'dataStatus',
      dataKey: 'dataStatus',
    },
    {
      name: 'category',
      dataKey: 'category',
    },
    {
      name: 'subCategory',
      dataKey: 'subCategory',
    },
    {
      name: 'kpiGroup',
      dataKey: 'kpiGroup',
    },
    {
      name: 'KPI',
      dataKey: 'kpi',
    },
    {
      name: 'unit',
      dataKey: 'unit',
    },
    {
      name: 'year',
      dataKey: 'year',
    },
  ].concat(
    MonthNames.map((i) => ({
      groupName: i,
      columns: [
        {
          name: 'Actual',
          dateKey: 'actual',
        },
        {
          name: 'Plan',
          dateKey: 'plan',
        },
      ],
    })),
  )
}
export const tableWithColor = () => ({
  colorize: [
    {
      type: 'condition',
      name: 'actual',
      prediction: [bp(`$'actual' < $'plan'`), bp(`$'actual' > $'plan'`)],
      color: ['red', 'green'],
    },
  ],
  colorDescription: [
    {
      color: 'red',
      description: 'red',
    },
    {
      color: 'green',
      description: 'green',
    },
  ],
})
