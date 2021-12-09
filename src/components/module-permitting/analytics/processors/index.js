import { mapDataCvtCreator } from 'components/analytics/utils'
import { findIndex, get } from 'lodash-es'
import { format } from 'libs/langs/date'
import { fixNbr } from 'libs/utils'
import { MonthNames } from 'libs/consts'
export const wellObjective2Text = {
  oildevelopment: 'Oil Development',
  waterinjector: 'Water Injector',
  oilappraisal: 'Oil Appraisal',
  gasdevelopment: 'Gas Development',
  other: 'Other',
  oilexploration: 'Oil Exploration',
  steaminjector: 'Steam Injector',
  gasexploration: 'Gas Exploration',
  gasappraisal: 'Gas Appraisal',
}
export const mapDataConvertor = mapDataCvtCreator({
  blockField: 'block',
  valueField: 'value',
  preprocessor: ({ sourceData }) => {
    return sourceData
  },
})

export function processData (raw) {
  let res = []

  const { content } = raw
  content.forEach((entry) => {
    const { metaData, data } = entry
    const {
      company,
      block,
      createdAt,
      permitType,
      status,
      createdBy,
      referenceDate,
    } = metaData
    const submittedBy = createdBy.name
    const wellType = (data[findIndex(data, { id: 'wellType' })] || {}).value
    const onShoreOffShore = (
      data[findIndex(data, { id: 'onShoreOffShore' })] || {}
    ).value
    const wellName = get(data[findIndex(data, { id: 'wellName' })], 'value')
    const fieldName = get(data[findIndex(data, { id: 'fieldName' })], 'value')
    const wellObjectiveKey = get(
      data[findIndex(data, { id: 'wellObjective' })],
      'value',
      '',
    )
      .toLowerCase()
      .replace(' ', '')

    const wellObjective = wellObjective2Text[wellObjectiveKey]
    const aFECost =
      fixNbr((data[findIndex(data, { id: 'aFECost' })] || {}).value) ||
      fixNbr((data[findIndex(data, { id: 'abandonmentCost' })] || {}).value) ||
      fixNbr((data[findIndex(data, { id: 'suspensionCost' })] || {}).value) ||
      0
    const appliedDateFormatted = format(createdAt)
    const month =
      appliedDateFormatted === 'Invalid Date'
        ? null
        : MonthNames[Number(appliedDateFormatted.split('/')[1]) - 1]

    res.push({
      company,
      block,
      month,
      onShoreOffShore,
      wellName,
      fieldName,
      appliedDateFormatted,
      date: referenceDate,
      permitType,
      status,
      submittedBy,
      wellType,
      wellObjective,
      value: 1,
      aFECost,
      unit: 'MM$',
    })
  })

  return res
}
