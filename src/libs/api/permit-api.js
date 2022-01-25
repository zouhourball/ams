import { fetchJSON } from 'libs/fetch'

const appUrl =
  process.env.NODE_ENV === 'production'
    ? PRODUCT_APP_URL_API
    : PRODUCT_APP_URL_API

export const addPermit = async ({ body }) => {
  // body={
  //   "statement": "string"
  // }
  let res
  try {
    res = await fetchJSON(`${appUrl}/pulse-be/api/v1/permit/add`, {
      method: 'POST',
      body: JSON.stringify(body),
    })
  } catch (e) {
    res = { error: e }
  }
  return res
}

export const findAllPermits = async ({ queryKey }) => {
  // orgId = 1, priorityId = 2
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v1/permit/analytics?sort=metaData.createdAt,desc`,
      {
        method: 'GET',
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}

export const checkPermit = async ({ body }) => {
  // body={
  //   "statement": "string"
  // }
  let res
  try {
    res = await fetchJSON(`${appUrl}/pulse-be/api/v1/permit/check`, {
      method: 'POST',
      body: JSON.stringify(body),
    })
  } catch (e) {
    res = { error: e }
  }
  return res
}

export const deletePermit = async (objectId) => {
  let res
  try {
    res = await fetchJSON(`${appUrl}/pulse-be/api/v1/permit/${objectId}`, {
      method: 'DELETE',
    })
  } catch (e) {
    res = { error: e }
  }
  return res
}

export const deleteAll = async (objectIds) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v1/permit/?objectIds=${objectIds}`,
      {
        method: 'DELETE',
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}

export const listPermitsByLoggedUser = async ({ queryKey }) => {
  // orgId = 1, priorityId = 2
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v1/permit/list?query=metaData.permitType==${queryKey[1]?.permitType}&sort=metaData.createdAt,desc&page=${queryKey[2]?.page}&size=${queryKey[2]?.size}`,
      {
        method: 'GET',
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}
export const savePermit = async ({ body }) => {
  // body={
  //   "statement": "string"
  // }
  let res
  try {
    res = await fetchJSON(`${appUrl}/pulse-be/api/v1/permit/save`, {
      method: 'POST',
      body: JSON.stringify(body),
    })
  } catch (e) {
    res = { error: e }
  }
  return res
}

export const updatePermit = async ({ id, status }) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v1/permit/update?id=${id}&status=${status}`,
      {
        method: 'PUT',
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}
export const getPermitDetail = async ({ queryKey }) => {
  // orgId = 1, priorityId = 2
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v1/permit/${queryKey[1]}/${queryKey[2]}?sort=metaData.createdAt,desc`,
      {
        method: 'GET',
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}
