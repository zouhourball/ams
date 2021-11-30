import { fetchJSON, fetchGeneric } from 'libs/fetch'
import { downloadFromBlob } from 'libs/utils/download-blob'
import { formDataBody } from 'libs/utils/custom-function'

const appUrl = process.env.NODE_ENV === 'production' ? PRODUCT_APP_URL_API : ''

export const uploadAnnualReport = async ({ body }) => {
  let res
  try {
    res = await fetchJSON(`${appUrl}/pulse-be/api/v1/reserve/annual/upload`, {
      method: 'POST',
      isFormData: true,
      body: formDataBody(body),
    })
  } catch (e) {
    res = { error: e }
  }
  return res
}
export const uploadHistoryAndForecast = async ({ body }) => {
  // console.log(body, 'detail api')
  let res
  try {
    res = await fetchJSON(`${appUrl}/pulse-be/api/v1/reserve/fyf/upload`, {
      method: 'POST',
      isFormData: true,
      body: formDataBody(body),
    })
  } catch (e) {
    res = { error: e }
  }
  return res
}
export const uploadAnnualResource = async ({ body }) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v1/reserve/annualResource/upload`,
      {
        method: 'POST',
        isFormData: true,
        body: formDataBody(body),
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}
export const getAnnualReport = async () => {
  let res
  try {
    res = await fetchJSON(`${appUrl}/pulse-be/api/v1/reserve/annual`, {
      method: 'GET',
    })
  } catch (e) {
    res = { error: e }
  }
  return res
}

export const getHistoryAndForecast = async () => {
  let res
  try {
    res = await fetchJSON(`${appUrl}/pulse-be/api/v1/reserve/fyf`, {
      method: 'GET',
    })
  } catch (e) {
    res = { error: e }
  }
  return res
}
export const getAnnualResourceDetail = async () => {
  let res
  try {
    res = await fetchJSON(`${appUrl}/pulse-be/api/v1/reserve/annualResource`, {
      method: 'GET',
    })
  } catch (e) {
    res = { error: e }
  }
  return res
}

export const downloadTemp = async (module, sub, onLoading = () => null) => {
  const url = `${appUrl}/pulse-be/api/v2/files/${module}/${sub}/template/download`
  const apiResponseBlob = await fetchGeneric(url, { method: 'GET' }).then(
    (response) => response.blob(),
    onLoading(true),
  )
  downloadFromBlob(
    apiResponseBlob,
    `template_${module}_${sub}.xlsx` || URL.split('/').reverse()[0],
  )
  onLoading(false)
}

export const commitReport = async ({ body, sub }) => {
  // console.log(body, 'body')
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v1/reserve/${sub}/commit
    `,
      {
        method: 'POST',
        body: JSON.stringify(body),
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}

export const detailReserve = async ({ queryKey }) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v1/reserve/${queryKey[2]}/${queryKey[1]}`,
      {
        method: 'GET',
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}
export const deleteReport = async (objectId, subModule) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v1/reserve/${subModule}/${objectId}`,
      {
        method: 'DELETE',
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}
export const updateReserveReport = async ({ subModule, objectId, status }) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v1/reserve/${subModule}/update?objectId=${objectId}&status=${status}`,
      {
        method: 'PUT',
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}
