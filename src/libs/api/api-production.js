import { fetchJSON } from 'libs/fetch'

const appUrl = process.env.NODE_ENV === 'production' ? PRODUCT_APP_URL_API : ''

export const getListProduction = async ({ queryKey }) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v1/production/${queryKey[1]}?page=0&size=2000&sort=metaData.createdAt,desc`,
      {
        method: 'GET',
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}
export const getDetailProductionById = async ({ queryKey }) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v1/production/${queryKey[1]}/${queryKey[2]}?sort=metaData.createdAt,desc`,
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
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v1/production/monthly?sort=metaData.createdAt,desc`,
      {
        method: 'GET',
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}
export const getDetailOfMonthlyProductionById = async ({ queryKey }) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v1/production/monthly/${queryKey[1]}?sort=metaData.createdAt,desc`,
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
      `${appUrl}/pulse-be/api/v1/production/monthly-tracking?sort=metaData.createdAt,desc`,
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
      `${appUrl}/pulse-be/api/v1/production/monthly-tracking/${queryKey[1]}?sort=metaData.createdAt,desc`,
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
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v1/config/blocks?sort=metaData.createdAt,desc`,
      {
        method: 'GET',
      },
    )
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

export const uploadMonthlyProductionReport = async ({ body }) => {
  let newBody = new FormData()
  newBody.append('block', body?.block)
  newBody.append('month', body?.month)
  newBody.append('year', body?.year)
  newBody.append('file', body?.file[0])
  newBody.append('processInstanceId', body?.processInstanceId)
  newBody.append('company', body?.company)

  let res
  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v1/production/monthly/upload`,
      {
        method: 'POST',
        isFormData: true,
        body: newBody,
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}

export const uploadMonthlyTrackingProductionReport = async ({ body }) => {
  let newBody = new FormData()
  newBody.append('block', body?.block)
  newBody.append('month', body?.month)
  newBody.append('year', body?.year)
  newBody.append('file', body?.file[0])
  newBody.append('processInstanceId', body?.processInstanceId)
  newBody.append('company', body?.company)

  let res
  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v1/production/monthly-tracking/upload`,
      {
        method: 'POST',
        isFormData: true,
        body: newBody,
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}

export const commitProduction = async ({ subModule, body }) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v1/production/${subModule}/commit`,
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
export const saveProduction = async ({ subModule, body }) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v1/production/${subModule}/save`,
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

export const overrideProductionReport = async ({
  subModule,
  overrideId,
  body,
}) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v1/production/${subModule}/override/${overrideId}`,
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
export const updateDailyProduction = async ({
  subModule,
  objectId,
  status,
}) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v1/production/${subModule}/update?objectId=${objectId}&status=${status}`,
      {
        method: 'PUT',
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}

export const deleteProduction = async (subModule, objectId) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v1/production/${subModule}/${objectId}`,
      {
        method: 'DELETE',
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}

export const deleteAllProduction = async (subModule, selectedRow) => {
  const list = selectedRow?.map((row) => {
    return { permitId: row?.id }
  })
  const deleteAllPromises = list.map((p) =>
    deleteProduction(subModule, p?.permitId),
  )
  await Promise.all(deleteAllPromises)
}
