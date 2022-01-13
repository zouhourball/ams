import { fetchJSON } from 'libs/fetch'
import { formDataBody } from 'libs/utils/custom-function'

const appUrl = process.env.NODE_ENV === 'production' ? PRODUCT_APP_URL_API : ''

export const getListFlaring = async ({ queryKey }) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v2/flaring/${queryKey[1]}?sort=metaData.createdAt,desc&page=0&size=2000`, // daily, monthly-station, annual-forecast
      {
        method: 'GET',
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}

export const uploadDailyReport = async ({ body }) => {
  let res
  try {
    res = await fetchJSON(`${appUrl}/pulse-be/api/v2/flaring/daily/upload`, {
      method: 'POST',
      isFormData: true,
      body: formDataBody(body),
    })
  } catch (e) {
    res = { error: e }
  }
  return res
}

export const uploadMonthlyReport = async ({ body }) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v2/flaring/monthly-station/upload`,
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

export const uploadAnnualForecastReport = async ({ body }) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v2/flaring/annual-forecast/upload`,
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

export const commitFlaring = async ({ subModule, body }) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v2/flaring/${subModule}/commit`,
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
export const saveFlaring = async ({ subModule, body }) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v2/flaring/${subModule}/save`,
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

export const overrideFlaringReport = async ({
  subModule,
  overrideId,
  body,
}) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v2/flaring/${subModule}/override/${overrideId}`,
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

export const getDetailFlaringById = async ({ queryKey }) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v2/flaring/${queryKey[1]}/${queryKey[2]}`,
      {
        method: 'GET',
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}

export const updateFlaring = async ({ subModule, objectId, status }) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v2/flaring/${subModule}/update?objectId=${objectId}&status=${status}`,
      {
        method: 'PUT',
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}

export const deleteFlaring = async (subModule, objectId) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v2/flaring/${subModule}/${objectId}`,
      {
        method: 'DELETE',
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}

export const deleteAllFlaring = async (subModule, selectedRow) => {
  const list = selectedRow?.map((row) => {
    return { selectedId: row?.id }
  })
  const deleteAllPromises = list.map((p) =>
    deleteFlaring(subModule, p?.selectedId),
  )
  let returnValue = []

  await Promise.all(deleteAllPromises)
    .then((values) => {
      returnValue = values
    })
    .catch(() => {
      returnValue = []
    })
  return returnValue
}
