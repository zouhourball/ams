import { fetchJSON } from 'libs/fetch'

const auditUrl = PRODUCT_APP_URL_API

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
      `${auditUrl}/audit-be/api/v1/audit/${queryKey[1]}/action-list`,
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
      `${auditUrl}/audit-be/api/v1/action/${queryKey[1]}/resolution-list`,
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
export const closureReport = ({ body, auditId }) => {
  let res
  try {
    res = fetchJSON(`${auditUrl}/audit-be/api/v1/report/audit/${auditId}`, {
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
export const submitNewAction = ({ body, auditId }) => {
  let res
  try {
    res = fetchJSON(`${auditUrl}/audit-be/api/v1/audit/${auditId}/action`, {
      method: 'POST',
      body: JSON.stringify(body),
    })
  } catch (e) {
    res = { error: e }
  }
  return res
}
export const submitResolutionForAction = ({ body, actionId }) => {
  let res
  try {
    res = fetchJSON(
      `${auditUrl}/audit-be/api/v1/action/${actionId}/resolution`,
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
export const updateEnquiryByGivenResponse = async ({ responseId, status }) => {
  let res
  try {
    res = await fetchJSON(
      `${auditUrl}/audit-be/api/v1/enquiry/response/${responseId}/approval`,
      {
        method: 'POST',
        body: JSON.stringify({ enquiryResponseStatus: status }),
      },
    )
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

export const submitResponses = async ({ id }) => {
  let res
  try {
    res = await fetchJSON(
      `${auditUrl}/audit-be/api/v1/enquiry/response/${id}/submit`,
      {
        method: 'PUT',
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}
export const resolutionApproval = async ({ resolutionId, status }) => {
  let res
  try {
    res = await fetchJSON(
      `${auditUrl}/audit-be/api/v1/resolution/${resolutionId}/approval`,
      {
        method: 'PUT',
        body: JSON.stringify({ resolutionStatus: status }),
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
export const closingAudit = async ({ auditId }) => {
  let res
  try {
    res = await fetchJSON(
      `${auditUrl}/audit-be/api/v1/audit/${auditId}/close`,
      {
        method: 'PUT',
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}

export const getAuditHistory = async ({ queryKey }) => {
  let res
  try {
    res = await fetchJSON(
      `${auditUrl}/audit-be/api/v1/audit/${queryKey[1]}/history`,
      {
        method: 'GET',
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}
