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
// template APIs
export const getTemplates = async () => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v2/regulations/C%20:%20Reporting%20Templates/MOG-S03-WELLS%20&%20DRILLING%20MANAGEMENT?excludeLinksFeeds=true`,
      {
        method: 'GET',
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}
export const getReportsByTemplate = async ({ body }) => {
  let res
  /*
    "textSearch": "",
    "filters": [],
    "companies": [],
    "blocks": []
  */
  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v2/regulations/5c20856b7da63300013678c5/links/query?page=0&size=20`,
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
export const addReportForSelectedTemplate = async ({ body, templateId }) => {
  let res

  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v2/regulations/${templateId}/links`,
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
export const addTemplate = async (body) => {
  let res

  try {
    res = await fetchJSON(`${appUrl}/pulse-be/api/v2/regulations`, {
      method: 'POST',
      body: JSON.stringify(body),
    })
  } catch (e) {
    res = { error: e }
  }
  return res
}
export const deleteRegulations = async (objectIds) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v2/regulations?objectIds=${objectIds}`,
      {
        method: 'DELETE',
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}
