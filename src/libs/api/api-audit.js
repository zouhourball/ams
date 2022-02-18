import { fetchJSON } from 'libs/fetch'

const appUrl = process.env.NODE_ENV === 'production' ? PRODUCT_APP_URL_API : ''

export const getStateAudit = async ({ queryKey }) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v2/audits?sort=metaData.createdAt,desc&page=${queryKey[1]?.page}&size=${queryKey[1]?.size}`,
      {
        method: 'GET',
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}
export const getEnquiries = async () => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v2/audits/enquiries?sort=metaData.createdAt,desc`,
      {
        method: 'GET',
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}
export const getResponses = async () => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v2/audits/enquiries/responses?sort=metaData.createdAt,desc`,
      {
        method: 'GET',
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}
export const getActions = async () => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v2/audits/actions?sort=metaData.createdAt,desc`,
      {
        method: 'GET',
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}
export const getResolutions = async () => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v2/audits/actions/resolutions?sort=metaData.createdAt,desc`,
      {
        method: 'GET',
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}

export const submitAudits = ({ body }) => {
  let res
  try {
    res = fetchJSON(`${appUrl}/pulse-be/api/v2/audits`, {
      method: 'POST',
      body: JSON.stringify(body),
    })
  } catch (e) {
    res = { error: e }
  }
  return res
}
export const closureReport = ({ body }) => {
  let res
  try {
    res = fetchJSON(`${appUrl}/pulse-be/api/v2/audits/reports`, {
      method: 'POST',
      body: JSON.stringify(body),
    })
  } catch (e) {
    res = { error: e }
  }
  return res
}

export const createWorkspace = ({ body, auditId }) => {
  let res
  try {
    res = fetchJSON(`${appUrl}/pulse-be/api/v2/audits/${auditId}/workspace`, {
      method: 'POST',
      body: JSON.stringify(body),
    })
  } catch (e) {
    res = { error: e }
  }
  return res
}
export const createEnquiry = ({ body }) => {
  let res
  try {
    res = fetchJSON(`${appUrl}/pulse-be/api/v2/audits/enquiries`, {
      method: 'POST',
      body: JSON.stringify(body),
    })
  } catch (e) {
    res = { error: e }
  }
  return res
}

export const createResponse = ({ body }) => {
  let res
  try {
    res = fetchJSON(`${appUrl}/pulse-be/api/v2/audits/enquiries/responses`, {
      method: 'POST',
      body: JSON.stringify(body),
    })
  } catch (e) {
    res = { error: e }
  }
  return res
}
export const submitNewAction = ({ body }) => {
  let res
  try {
    res = fetchJSON(`${appUrl}/pulse-be/api/v2/audits/actions`, {
      method: 'POST',
      body: JSON.stringify(body),
    })
  } catch (e) {
    res = { error: e }
  }
  return res
}
export const submitResolutionForAction = ({ body }) => {
  let res
  try {
    res = fetchJSON(`${appUrl}/pulse-be/api/v2/audits/actions/resolutions`, {
      method: 'POST',
      body: JSON.stringify(body),
    })
  } catch (e) {
    res = { error: e }
  }
  return res
}

export const updateAudit = async ({ auditId, status }) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v2/audits/${auditId}?status=${status}`,
      {
        method: 'PUT',
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}
export const assignParticipant = async ({ auditId, body }) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v2/audits/enquiries/${auditId}/assignee`,
      {
        method: 'PUT',
        body: JSON.stringify(body),
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}

export const updateEnquiryByGivenResponse = async ({ responseId, status }) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v2/audits/enquiries/status/responses/${responseId}?status=${status}`,
      {
        method: 'PUT',
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}
