/*
{
Average Length
:
null
Classification
:
null
Date of Purchase
:
null
Grade
:
null
Inspection Date
:
null
MT Certificate
:
null
Material Category
:
"Drilling"
Material Condition
:
null
"Material Description "
:
"CASING 7", N-80,BTC,26#/ft"
Material Location
:
null
Material Name
:
"S035114016"
Measurement Unit
:
"EA"
Quantity
:
"36"
Remarks
:
null
Sequence No
:
"1"
Serial Number
:
null
Storage Location
:
null
Total (USD)
:
"1260"
Unit Price (USD)
:
"35"
Weight
:
null
block
:
"38264"
company
:
"Company_1"
}
*/

import { flatMap } from 'lodash-es'

export function processConsumptionData (data) {
  const { content } = data
  return flatMap(content, (c) => {
    const {
      metaData: { company },
    } = c
    return flatMap(
      // content.data : []
      c.data,
      (d) => {
        return {
          ...d.data,
          Quantity: +(d.data.Quantity || 0),
          Count: +(d.data.Count || 0),
          'Total (USD)': +d.data['Total (USD)'] || 0,
          'Consumed (USD)':
            (+d.data.Count || 0) * (+d.data['Unit Price (USD)'] || 0),
          'Unit Price (USD)': +(d.data['Unit Price (USD)'] || 0),
          totalElements: data.totalElements,
          company,
        }
      },
    )
  })
}

export function processSurplusData (data) {
  return processConsumptionData(data)
}

export function processBaseData (data) {
  const { content } = data
  return flatMap(
    content.map((c) => {
      const {
        metaData: { company, block, createdAt },
      } = c
      return c.rows.map(({ data }) => ({
        ...data,
        year: new Date(createdAt).getFullYear(),
        unitPrice: +data['Unit Price (USD)'],
        totalPrice: +data['Total (USD)'],
        quantity: +data['Quantity'],
        company,
        block,
      }))
    }),
  )
}
