import { fetchJSON } from 'libs/fetch'

const appUrl = process.env.NODE_ENV === 'production' ? PRODUCT_APP_URL_API : ''
const auditUrl = 'https://api.dev.meeraspace.com'

export const getStateAudit = async ({ queryKey }) => {
  let res
  try {
    res = await fetchJSON(`${auditUrl}/audit-be/api/v1/audit`, {
      method: 'GET',
    })
  } catch (e) {
    res = { error: e }
  }
  return res
}
export const getAuditByID = async ({ queryKey }) => {
  let res
  try {
    res = await fetchJSON(`${auditUrl}/audit-be/api/v1/audit/${queryKey[1]}`, {
      method: 'GET',
    })
  } catch (e) {
    res = { error: e }
  }
  return res
}
export const getEnquiryByID = async ({ queryKey }) => {
  let res
  try {
    res = await fetchJSON(
      `${auditUrl}/audit-be/api/v1/enquiry/${queryKey[1]}`,
      {
        method: 'GET',
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}

export const getEnquiries = async ({ queryKey }) => {
  let res
  try {
    res = await fetchJSON(
      `${auditUrl}/audit-be/api/v1/enquiry/audit/${queryKey[1]}`,
      {
        method: 'GET',
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}
export const getResponses = async ({ queryKey }) => {
  let res
  try {
    res = await fetchJSON(
      `${auditUrl}/audit-be/api/v1/enquiry/${queryKey[1]}/responses`,
      {
        method: 'GET',
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}
export const getActions = async ({ queryKey }) => {
  let res
  try {
    res = await fetchJSON(
      `${auditUrl}/audit-be/api/v1/audit/${queryKey[1]}/action`,
      {
        method: 'GET',
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}
export const getResolutions = async ({ queryKey }) => {
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
    res = fetchJSON(`${auditUrl}/audit-be/api/v1/audit`, {
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
    res = fetchJSON(`${auditUrl}/audit-be/api/v1/audit/${auditId}/workspace`, {
      method: 'POST',
      body: JSON.stringify(body),
    })
  } catch (e) {
    res = { error: e }
  }
  return res
}
export const createEnquiry = ({ body, auditId }) => {
  let res
  try {
    res = fetchJSON(`${auditUrl}/audit-be/api/v1/enquiry/audit/${auditId}`, {
      method: 'POST',
      body: JSON.stringify(body),
    })
  } catch (e) {
    res = { error: e }
  }
  return res
}

export const createResponse = ({ body, enquiryID }) => {
  let res
  try {
    res = fetchJSON(
      `${auditUrl}/audit-be/api/v1/enquiry/${enquiryID}/response`,
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
      `${auditUrl}/audit-be/api/v1/audit/${auditId}/${status}`,
      {
        method: 'PUT',
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}
export const acknowledgeEnquiry = async ({ id, status }) => {
  let res
  try {
    res = await fetchJSON(
      `${auditUrl}/audit-be/api/v1/enquiry/${id}/${status}`,
      {
        method: 'PUT',
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}

export const assignParticipant = async ({ enquiryID, participants }) => {
  let res
  try {
    res = await fetchJSON(
      `${auditUrl}/audit-be/api/v1/enquiry/${enquiryID}/participants`,
      {
        method: 'PUT',
        body: JSON.stringify({ participants }),
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
