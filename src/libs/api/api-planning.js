import { fetchJSON } from 'libs/fetch'
import { formDataBody } from 'libs/utils/custom-function'

const appUrl = process.env.NODE_ENV === 'production' ? PRODUCT_APP_URL_API : ''

export const getListPlanning = async ({ queryKey }) => {
  let res
  try {
    res = await fetchJSON(`${appUrl}/pulse-be/api/v2/planning/${queryKey[1]}`, {
      method: 'GET',
    })
  } catch (e) {
    res = { error: e }
  }
  return res
}

export const uploadWpbReport = async ({ body }) => {
  let res
  try {
    res = await fetchJSON(`${appUrl}/pulse-be/api/v2/planning/wpb/upload`, {
      method: 'POST',
      isFormData: true,
      body: formDataBody(body),
    })
  } catch (e) {
    res = { error: e }
  }
  return res
}

export const uploadFypReport = async ({ body }) => {
  let res
  try {
    res = await fetchJSON(`${appUrl}/pulse-be/api/v2/planning/fyp/upload`, {
      method: 'POST',
      isFormData: true,
      body: formDataBody(body),
    })
  } catch (e) {
    res = { error: e }
  }
  return res
}

export const commitPlanning = async ({ subModule, body }) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v2/planning/${subModule}/commit`,
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

export const overridePlanningReport = async ({
  subModule,
  overrideId,
  body,
}) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v2/planning/${subModule}/override/${overrideId}`,
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

export const getDetailPlanningById = async ({ queryKey }) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v2/planning/${queryKey[1]}/${queryKey[2]}`,
      {
        method: 'GET',
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}

export const updatePlanning = async ({ subModule, objectId, status }) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v2/planning/${subModule}/update?objectId=${objectId}&status=${status}`,
      {
        method: 'PUT',
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}

export const deletePlanning = async ({ subModule, objectId }) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v2/planning/${subModule}/${objectId}`,
      {
        method: 'DELETE',
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}
