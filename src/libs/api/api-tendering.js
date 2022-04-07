import { fetchJSON } from 'libs/fetch'

const appUrl = process.env.NODE_ENV === 'production' ? PRODUCT_APP_URL_API : ''

export async function getInfos () {
  let res
  try {
    res = await fetchJSON(`${appUrl}/wf/api/v1/info`)
  } catch (e) {
    res = { error: e }
  }
  return res
}

export async function getCompaniesKpi (orgId) {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/tdr/api/v1/proposal/kpis/organizations/${orgId}`,
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}
export async function getAllProposals () {
  let res
  try {
    res = await fetchJSON(`${appUrl}/tdr/api/v1/proposal`)
  } catch (e) {
    res = { error: e }
  }
  return res
}
export async function getAllProposalsByCompany (companyId, organizationID) {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/tdr/api/v1/proposal/company/${companyId}/organizations/${organizationID}`,
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}
export async function submitProposal (params) {
  let res
  try {
    res = await fetchJSON(`${appUrl}/tdr/api/v1/proposal`, {
      method: 'POST',
      body: JSON.stringify(params),
    })
  } catch (e) {
    res = { error: e }
  }
  return res
}

export async function clarifyProposal (id, clarifyComment) {
  let res
  try {
    res = await fetchJSON(`${appUrl}/tdr/api/v1/proposal/${id}/clarify`, {
      method: 'PUT',
      body: JSON.stringify(clarifyComment),
    })
  } catch (e) {
    res = { error: e }
  }
  return res
}

export async function clarifiedProposal (id, params) {
  let res
  try {
    res = await fetchJSON(`${appUrl}/tdr/api/v1/proposal/${id}/clarified`, {
      method: 'PUT',
      body: JSON.stringify(params),
    })
  } catch (e) {
    res = { error: e }
  }
  return res
}

export async function underReviewProposal (id, params) {
  let res
  try {
    res = await fetchJSON(`${appUrl}/tdr/api/v1/proposal/${id}/review`, {
      method: 'PUT',
      body: JSON.stringify(params),
    })
  } catch (e) {
    res = { error: e }
  }
  return res
}

export async function passToAgendaProposal (body) {
  let res
  try {
    res = await fetchJSON(`${appUrl}/tdr/api/v1/proposal/agenda`, {
      method: 'PUT',
      body: JSON.stringify(body),
    })
  } catch (e) {
    res = { error: e }
  }
  return res
}

export async function getMembers (orgID) {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/tdr/api/v1/proposal/tendering-members/organizations/${orgID}`,
      {
        method: 'GET',
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}
export async function approvedProposal (id, params, orgID) {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/tdr/api/v1/proposal/${id}/approved/organizations/${orgID}`,
      {
        method: 'PUT',
        body: JSON.stringify(params),
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}

export async function rejectedProposal (id, comment, orgID) {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/tdr/api/v1/proposal/${id}/rejected/organizations/${orgID}`,
      {
        method: 'PUT',
        body: JSON.stringify(comment),
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}

export async function updateProposal (id, params) {
  let res
  try {
    res = await fetchJSON(`${appUrl}/tdr/api/v1/proposal/${id}`, {
      method: 'PUT',
      body: JSON.stringify(params),
    })
  } catch (e) {
    res = { error: e }
  }
  return res
}

export async function deleteProposal (id) {
  let res
  try {
    res = await fetchJSON(`${appUrl}/tdr/api/v1/proposal/${id}`, {
      method: 'DELETE',
    })
  } catch (error) {
    res = {
      error,
    }
  }
  return res
}

export async function getProposalById (id) {
  let res
  try {
    res = await fetchJSON(`${appUrl}/tdr/api/v1/proposal/${id}`, {
      method: 'GET',
    })
  } catch (error) {
    res = {
      error,
    }
  }
  return res
}

export async function getProposalHistory (id) {
  let res
  try {
    res = await fetchJSON(`${appUrl}/tdr/api/v1/proposal/${id}/history`, {
      method: 'GET',
    })
  } catch (error) {
    res = {
      error,
    }
  }
  return res
}

export async function createMeeting (params) {
  let res
  try {
    res = await fetchJSON(`${PRODUCT_APP_URL_API}/ws-meeting/api/v2/meetings`, {
      method: 'POST',
      body: JSON.stringify(params),
      credentials: 'include',
    })
  } catch (e) {
    res = { error: e }
  }
  return res
}

export async function getMeeting (id) {
  let res
  try {
    res = await fetchJSON(
      `${PRODUCT_APP_URL_API}/ws-meeting/api/v2/meetings/${id}`,
      {
        method: 'GET',
      },
    )
  } catch (error) {
    res = {
      error,
    }
  }
  return res
}

export async function getWorkflowMeetings (
  processInstanceId,
  startDate,
  endDate,
) {
  let res
  try {
    res = await fetchJSON(
      `${PRODUCT_APP_URL_API}/ws-meeting/api/v2/workflows/meetings?processInstanceId=${processInstanceId}`,
      {
        method: 'GET',
        // credentials: 'include',
      },
    )
  } catch (error) {
    res = {
      error,
    }
  }
  return res
}

export async function getMeetings (wspId, startDate, endDate) {
  let res
  try {
    res = await fetchJSON(
      `${PRODUCT_APP_URL_API}/ws-meeting/api/v2/meetings?workspaceIds=${wspId}&date=${startDate}&endDate=${endDate}&size=1000`,
      {
        method: 'GET',
        credentials: 'include',
      },
    )
  } catch (error) {
    res = {
      error,
    }
  }
  return res
}
export const acceptMeeting = async (meetingId) => {
  let res = await fetchJSON(
    `${PRODUCT_APP_URL_API}/ws-meeting/api/v2/meetings/${meetingId}/accept`,
    {
      method: 'PUT',
      credentials: 'include',
    },
  )
  return res
}
export const rejectMeeting = async (meetingId) => {
  let res = await fetchJSON(
    `${PRODUCT_APP_URL_API}/ws-meeting/api/v2/meetings/${meetingId}/reject`,
    {
      method: 'PUT',
      credentials: 'include',
    },
  )
  return res
}

export async function getUserAgenda () {
  let res
  try {
    res = await fetchJSON(`${PRODUCT_APP_URL_API}/tdr/api/v1/agenda/user`, {
      method: 'GET',
    })
  } catch (error) {
    res = {
      error,
    }
  }
  return res
}

export const getBlocksList = async () => {
  let res = await fetchJSON(`${appUrl}/arm/api/v1/blocks`, {
    method: 'GET',
  })
  return res
}
export const getCompanies = async () => {
  let res = await fetchJSON(`${appUrl}/arm/api/v1/companies`, {
    method: 'GET',
  })
  return res
}

export async function getAnnualPlans (page) {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/tdr/api/v1/annualplan?page=${page}&size=50`,
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}

export async function createAnnualPlan (params) {
  const formData = new FormData()
  formData.append('operatorName', params.operatorName)
  formData.append('companyName', params.companyName)
  formData.append('fileUrl', params.fileUrl)
  formData.append('planType', params.planType)
  formData.append('blockNumber', params.blockNumber)
  formData.append('reportingYear', params.reportingYear)
  formData.append('file', params.file)
  formData.append('orgId', params.orgId)
  formData.append('fileName', params.fileName)

  let res
  try {
    res = await fetchJSON(`${appUrl}/tdr/api/v1/annualplan`, {
      method: 'POST',
      body: formData,
      isFormData: true,
    })
  } catch (e) {
    res = { error: e }
  }
  return res
}

export async function deleteAnnualPlan (annualPlanId) {
  let res
  try {
    res = await fetchJSON(`${appUrl}/tdr/api/v1/annualplan/${annualPlanId}`, {
      method: 'DELETE',
    })
  } catch (error) {
    res = {
      error,
    }
  }
  return res
}
export async function getAnnualPlanById (annualPlanId, page) {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/tdr/api/v1/annualplans/${annualPlanId}/rows?page=${page}&size=100`,
      {
        method: 'GET',
      },
    )
  } catch (error) {
    res = {
      error,
    }
  }
  return res
}
export async function acknowledgeAnnualPlan (annualPlanId) {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/tdr/api/v1/annualplan/${annualPlanId}/acknowledge`,
      {
        method: 'PUT',
      },
    )
  } catch (error) {
    res = {
      error,
    }
  }
  return res
}

export const getUploadToken = async () => {
  let res = await fetchJSON(`${appUrl}/tdr/api/v1/meeraStorage/upload_token`, {
    method: 'GET',
  })
  return res
}

export const getDownloadToken = async () => {
  let res = await fetchJSON(
    `${appUrl}/tdr/api/v1/meeraStorage/download_token`,
    {
      method: 'GET',
    },
  )
  return res
}

export async function getProposalByRefNumber (refNumber) {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/tdr/api/v1/proposal/reference?referenceNumber=${refNumber}`,
      {
        method: 'GET',
      },
    )
  } catch (error) {
    res = {
      error,
    }
  }
  return res
}

export async function publishProposal (id, body) {
  let res
  try {
    res = await fetchJSON(`${appUrl}/tdr/api/v1/proposal/${id}/publish`, {
      method: 'PUT',
      body: JSON.stringify(body),
    })
  } catch (error) {
    res = {
      error,
    }
  }
  return res
}

export const getDelegation = async ({ queryKey }) => {
  const res = await fetchJSON(
    `${PRODUCT_APP_URL_PROFILE}/rest/delegation/delegatees`,
    {
      method: 'POST',
      body: JSON.stringify({
        org_id: queryKey[1],
        delegate_user_subject: queryKey[2],
      }),
    },
  )
  return res
}

export async function getAccess (action, subject) {
  const res = await fetchJSON(
    `https://accesscontrol.dev.meeraspace.com/api/verify`,
    {
      method: 'POST',
      body: JSON.stringify({
        action,
        context: '',
        resource: 'target:tendering:proposal:chairman:apis',
        subject,
      }),
    },
  )
  return res
}
