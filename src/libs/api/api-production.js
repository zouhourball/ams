import { fetchJSON, fetchGeneric } from 'libs/fetch'
import { downloadFromBlob } from 'libs/utils/download-blob'

const appUrl =
  process.env.NODE_ENV === 'production'
    ? PRODUCT_APP_URL_API
    : PRODUCT_APP_URL_API

export const getListDailyProduction = async ({ queryKey }) => {
  let res
  try {
    res = await fetchJSON(`${appUrl}/pulse-be/api/v1/production/daily`, {
      method: 'GET',
    })
  } catch (e) {
    res = { error: e }
  }
  return res
}
export const getDetailOfDailyProductionById = async ({ queryKey }) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v1/production/daily/${queryKey[1]}`,
      {
        method: 'GET',
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}

export const getListMonthlyProduction = async ({ queryKey }) => {
  let res
  try {
    res = await fetchJSON(`${appUrl}/pulse-be/api/v1/production/monthly`, {
      method: 'GET',
    })
  } catch (e) {
    res = { error: e }
  }
  return res
}
export const getDetailOfMonthlyProductionById = async ({ queryKey }) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v1/production/monthly/${queryKey[1]}`,
      {
        method: 'GET',
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}

export const getListMonthlyTrackingProduction = async ({ queryKey }) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v1/production/monthly-tracking`,
      {
        method: 'GET',
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}

export const getDetailOfMonthlyTrackingProductionById = async ({
  queryKey,
}) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v1/production/monthly-tracking/${queryKey[1]}`,
      {
        method: 'GET',
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}

export const getListBlocks = async ({ queryKey }) => {
  let res
  try {
    res = await fetchJSON(`${appUrl}/pulse-be/api/v1/config/blocks`, {
      method: 'GET',
    })
  } catch (e) {
    res = { error: e }
  }
  return res
}

const appendFileToForm = (form, file) => {
  form.append('file', file)
  return form
}

export const uploadDailyFile = async (file, block, company, dailyDate) => {
  let res

  const opts = {
    method: 'POST',
    isFormData: true,
    body: appendFileToForm(new FormData(), file),
  }

  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v1/production/daily/upload?block=${block}&company=${company}&dailyDate=${dailyDate}`,
      opts,
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}

export const downloadTemplate = async ({ queryKey }) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v1/${queryKey[1]}/${queryKey[2]}/template/download`,
      {
        method: 'GET',
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}

export const downloadTemp = async (module, sub) => {
  const url = `${appUrl}/pulse-be/api/v1/${module}/${sub}/template/download`
  const apiResponseBlob = await await fetchGeneric(url, { method: 'GET' }).then(
    (response) => response.blob(),
  )
  downloadFromBlob(
    apiResponseBlob,
    `template_${module}_${sub}.xlsx` || URL.split('/').reverse()[0],
  )
}

export const uploadDailyProductionReport = async ({ body }) => {
  let newBody = new FormData()
  newBody.append('block', body?.block)
  newBody.append('dailyDate', body?.dailyDate)
  newBody.append('file', body?.file[0])
  newBody.append('processInstanceId', body?.processInstanceId)
  newBody.append('company', body?.company)

  let res
  try {
    res = await fetchJSON(`${appUrl}/pulse-be/api/v1/production/daily/upload`, {
      method: 'POST',
      isFormData: true,
      body: newBody,
    })
  } catch (e) {
    res = { error: e }
  }
  return res
}
