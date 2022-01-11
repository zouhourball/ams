import { fetchJSON } from 'libs/fetch'
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
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v1/reserve/annual?sort=metaData.createdAt,desc`,
      {
        method: 'GET',
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}

export const getHistoryAndForecast = async () => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v1/reserve/fyf?sort=metaData.createdAt,desc`,
      {
        method: 'GET',
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}
export const getAnnualResourceDetail = async () => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v1/reserve/annualResource?sort=metaData.createdAt,desc`,
      {
        method: 'GET',
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
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
export const saveReport = async ({ body, sub }) => {
  let res
  try {
    res = await fetchJSON(`${appUrl}/pulse-be/api/v1/reserve/${sub}/save`, {
      method: 'POST',
      body: JSON.stringify(body),
    })
  } catch (e) {
    res = { error: e }
  }
  return res
}
export const detailReserve = async ({ queryKey }) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v1/reserve/${queryKey[2]}/${queryKey[1]}?sort=metaData.createdAt,desc`,
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
export const overrideReport = async ({ body, overrideId, subModule }) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v1/reserve/${subModule}/override/${overrideId}`,
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
export const updateReserveReport = async ({ subModule, objectId, status }) => {
  let res
  if (subModule === 'fyf') {
    try {
      res = await fetchJSON(
        `${appUrl}/pulse-be/api/v1/reserve/${subModule}/${objectId}?status=${status}`,
        {
          method: 'PUT',
        },
      )
    } catch (e) {
      res = { error: e }
    }
  } else {
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
  }
  return res
}
