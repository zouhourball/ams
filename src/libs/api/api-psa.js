import { fetchJSON } from 'libs/fetch'
import { downloadFromBlob } from 'libs/utils/download-blob'
import { getAccessToken } from 'utils/manageTokens.js'

const appUrl = PRODUCT_APP_URL_API
// const appUrl = 'https://api.dev.meeraspace.com'

export const getCurrentConfiguration = async organizationId => {
  let res = await fetchJSON(
    `${appUrl}/psa/organizations/${organizationId}/configuration`,
    {
      method: 'GET',
    },
  )
  return res
}

export const getAvailableSections = async () => {
  let res = await fetchJSON(`${appUrl}/psa/configuration/sections`, {
    method: 'GET',
  })
  return res
}

export const getAvailableRoles = async () => {
  let res = await fetchJSON(`${appUrl}/psa/configuration/roles`, {
    method: 'GET',
  })
  return res
}

export const addUpdateConfiguration = async (organizationId, data) => {
  let res = await fetchJSON(
    `${appUrl}/psa/organizations/${organizationId}/configuration`,
    {
      method: 'PUT',
      body: JSON.stringify(data),
    },
  )
  return res
}

export const deleteConfiguration = async (organizationId, data) => {
  let res = await fetchJSON(
    `${appUrl}/psa/organizations/${organizationId}/configuration`,
    {
      method: 'DELETE',
      body: JSON.stringify(data),
    },
  )
  return res
}

export const getAgreements = async orgID => {
  let res = await fetchJSON(`${appUrl}/psa/organizations/${orgID}/agreements`, {
    method: 'GET',
  })
  return res
}

export const getAgreementsById = async (orgID, agrId) => {
  let res = await fetchJSON(
    `${appUrl}/psa/organizations/${orgID}/agreements/${agrId}`,
    {
      method: 'GET',
    },
  )
  return res
}

export const getMasterContract = async (orgID, agrId) => {
  let res = await fetchJSON(
    `${appUrl}/psa/organizations/${orgID}/agreements/${agrId}/master_contract`,
    {
      method: 'GET',
    },
  )
  return res
}

export const getAttachments = async (orgID, agrId) => {
  let res = await fetchJSON(
    `${appUrl}/psa/organizations/${orgID}/agreements/${agrId}/attachments`,
    {
      method: 'GET',
    },
  )
  return res
}

export const getParties = async (orgID, agrId) => {
  let res = await fetchJSON(
    `${appUrl}/psa/organizations/${orgID}/agreements/${agrId}/parties`,
    {
      method: 'GET',
    },
  )
  return res
}

export const getBlockDetails = async (orgID, agrId) => {
  let res = await fetchJSON(
    `${appUrl}/psa/organizations/${orgID}/agreements/${agrId}/block_details`,
    {
      method: 'GET',
    },
  )
  return res
}

export const getExplorationCommitment = async (orgID, agrId) => {
  let res = await fetchJSON(
    `${appUrl}/psa/organizations/${orgID}/agreements/${agrId}/exploration_commitement`,
    {
      method: 'GET',
    },
  )
  return res
}

export const getRelinquishments = async (orgID, agrId) => {
  let res = await fetchJSON(
    `${appUrl}/psa/organizations/${orgID}/agreements/${agrId}/relinquishments`,
    {
      method: 'GET',
    },
  )
  return res
}

export const getPolygon = async (orgID, agrId) => {
  let res = await fetchJSON(
    `${appUrl}/psa/organizations/${orgID}/agreements/${agrId}/polygon`,
    {
      method: 'GET',
    },
  )
  return res
}

export const getFiscalTerms = async (orgID, agrId) => {
  let res = await fetchJSON(
    `${appUrl}/psa/organizations/${orgID}/agreements/${agrId}/fiscal_terms`,
    {
      method: 'GET',
    },
  )
  return res
}

export const getObligations = async (orgID, agrId) => {
  let res = await fetchJSON(
    `${appUrl}/psa/organizations/${orgID}/agreements/${agrId}/obligations`,
    {
      method: 'GET',
    },
  )
  return res
}

export const getLegalTerms = async (orgID, agrId) => {
  let res = await fetchJSON(
    `${appUrl}/psa/organizations/${orgID}/agreements/${agrId}/legal_terms`,
    {
      method: 'GET',
    },
  )
  return res
}

export const createRule = async (orgID, params) => {
  let res
  try {
    res = await fetchJSON(`${appUrl}/psa/organizations/${orgID}/agreements`, {
      method: 'POST',
      body: JSON.stringify(params),
    })
  } catch (error) {
    res = {
      error,
    }
  }
  return res
}

export const submitAgreement = async (orgID, data) => {
  let res
  try {
    res = await fetchJSON(`${appUrl}/psa/organizations/${orgID}/agreements`, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  } catch (error) {
    res = {
      error,
    }
  }
  return res
}

export const submitMasterContract = async (
  orgID,
  agrId,
  data,
  amendedAgreement,
) => {
  let params = {
    action: 'SUBMIT',
    data: data,
  }
  if (amendedAgreement) params = { ...params, amend: amendedAgreement }
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/psa/organizations/${orgID}/agreements/${agrId}/master_contract`,
      {
        method: 'POST',
        body: JSON.stringify(params),
      },
    )
  } catch (error) {
    res = {
      error,
    }
  }
  return res
}

export const submitAttachments = async (
  orgID,
  agrId,
  data,
  amendedAgreement,
) => {
  let params = {
    action: 'SUBMIT',
    data: data,
  }
  if (amendedAgreement) params = { ...params, amend: amendedAgreement }

  let res
  try {
    res = await fetchJSON(
      `${appUrl}/psa/organizations/${orgID}/agreements/${agrId}/attachments`,
      {
        method: 'POST',
        body: JSON.stringify(params),
      },
    )
  } catch (error) {
    res = {
      error,
    }
  }
  return res
}

export const submitParties = async (orgID, agrId, data, amendedAgreement) => {
  let params = {
    action: 'SUBMIT',
    data: data,
  }
  if (amendedAgreement) params = { ...params, amend: amendedAgreement }
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/psa/organizations/${orgID}/agreements/${agrId}/parties`,
      {
        method: 'POST',
        body: JSON.stringify(params),
      },
    )
  } catch (error) {
    res = {
      error,
    }
  }
  return res
}

export const submitBlockDetails = async (
  orgID,
  agrId,
  data,
  amendedAgreement,
) => {
  let params = {
    action: 'SUBMIT',
    data: data,
  }
  if (amendedAgreement) params = { ...params, amend: amendedAgreement }

  let res
  try {
    res = await fetchJSON(
      `${appUrl}/psa/organizations/${orgID}/agreements/${agrId}/block_details`,
      {
        method: 'POST',
        body: JSON.stringify(params),
      },
    )
  } catch (error) {
    res = {
      error,
    }
  }
  return res
}

export const submitExplorationCommitment = async (
  orgID,
  agrId,
  data,
  amendedAgreement,
) => {
  let params = {
    action: 'SUBMIT',
    data: data,
  }
  if (amendedAgreement) params = { ...params, amend: amendedAgreement }

  let res
  try {
    res = await fetchJSON(
      `${appUrl}/psa/organizations/${orgID}/agreements/${agrId}/exploration_commitement`,
      {
        method: 'POST',
        body: JSON.stringify(params),
      },
    )
  } catch (error) {
    res = {
      error,
    }
  }
  return res
}

export const submitRelinquishments = async (
  orgID,
  agrId,
  data,
  amendedAgreement,
) => {
  let params = {
    action: 'SUBMIT',
    data: data,
  }
  if (amendedAgreement) params = { ...params, amend: amendedAgreement }

  let res
  try {
    res = await fetchJSON(
      `${appUrl}/psa/organizations/${orgID}/agreements/${agrId}/relinquishments`,
      {
        method: 'POST',
        body: JSON.stringify(params),
      },
    )
  } catch (error) {
    res = {
      error,
    }
  }
  return res
}

export const submitPolygon = async (orgID, agrId, data, amendedAgreement) => {
  let params = {
    action: 'SUBMIT',
    data: data,
  }
  if (amendedAgreement) params = { ...params, amend: amendedAgreement }

  let res
  try {
    res = await fetchJSON(
      `${appUrl}/psa/organizations/${orgID}/agreements/${agrId}/polygon`,
      {
        method: 'POST',
        body: JSON.stringify(params),
      },
    )
  } catch (error) {
    res = {
      error,
    }
  }
  return res
}

export const submitFiscalTerms = async (
  orgID,
  agrId,
  data,
  amendedAgreement,
) => {
  let params = {
    action: 'SUBMIT',
    data: data,
  }
  if (amendedAgreement) params = { ...params, amend: amendedAgreement }

  let res
  try {
    res = await fetchJSON(
      `${appUrl}/psa/organizations/${orgID}/agreements/${agrId}/fiscal_terms`,
      {
        method: 'POST',
        body: JSON.stringify(params),
      },
    )
  } catch (error) {
    res = {
      error,
    }
  }
  return res
}

export const submitObligations = async (
  orgID,
  agrId,
  data,
  amendedAgreement,
) => {
  let params = {
    action: 'SUBMIT',
    data: data,
  }
  if (amendedAgreement) params = { ...params, amend: amendedAgreement }

  let res
  try {
    res = await fetchJSON(
      `${appUrl}/psa/organizations/${orgID}/agreements/${agrId}/obligations`,
      {
        method: 'POST',
        body: JSON.stringify(params),
      },
    )
  } catch (error) {
    res = {
      error,
    }
  }
  return res
}

export const submitLegalTerms = async (
  orgID,
  agrId,
  data,
  amendedAgreement,
) => {
  let params = {
    action: 'SUBMIT',
    data: data,
  }
  if (amendedAgreement) params = { ...params, amend: amendedAgreement }

  let res
  try {
    res = await fetchJSON(
      `${appUrl}/psa/organizations/${orgID}/agreements/${agrId}/legal_terms`,
      {
        method: 'POST',
        body: JSON.stringify(params),
      },
    )
  } catch (error) {
    res = {
      error,
    }
  }
  return res
}

export const updateSectionEntity = async (
  orgID,
  agrId,
  secId,
  status,
  data,
) => {
  let params = {}
  if (status === 'AMEND') {
    params = {
      action: 'AMEND',
      remarks: data,
    }
  } else {
    params = {
      action: 'APPROVE',
    }
  }
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/psa/organizations/${orgID}/agreements/${agrId}/section_entity/${secId}`,
      {
        method: 'PUT',
        body: JSON.stringify(params),
      },
    )
  } catch (error) {
    res = {
      section: secId,
      error,
    }
  }
  return { ...res, section: secId }
}

export const getRoles = async () => {
  let res = await fetchJSON(`${appUrl}/psa/configuration/roles`, {
    method: 'GET',
  })
  return res
}

export const getSections = async () => {
  let res = await fetchJSON(`${appUrl}/psa/configuration/sections`, {
    method: 'GET',
  })
  return res
}

export const getBlocksList = async () => {
  let res = await fetchJSON(`${appUrl}/arm/api/v1/blocks`, {
    method: 'GET',
  })
  return res
}
export const getCompanies = async () => {
  let res = await fetchJSON(`${appUrl}/arm/api/v1/config/companies`, {
    method: 'GET',
  })
  return res
}
export async function fileDownload (URL, fileNameOnDownload) {
  const apiResponseBlob = await fetch(URL, {
    responseType: 'blob',
  }).then(response => response.blob())

  downloadFromBlob(
    apiResponseBlob,
    fileNameOnDownload || URL.split('/').reverse()[0],
  )
}

export async function fileManagerDownload (fileID, fileNameOnDownload) {
  await fileDownload(
    `${appUrl}/fm/download/${fileID}?access_token=${getAccessToken()}`,
    fileNameOnDownload,
  )
}

export const removeAgreementById = async (orgID, agrId) => {
  let res = await fetchJSON(
    `${appUrl}/psa/organizations/${orgID}/agreements/${agrId}`,
    {
      method: 'DELETE',
    },
  )
  return res
}

export const undoDeleteAgreementById = async (orgID, agrId) => {
  let res = await fetchJSON(
    `${appUrl}/psa/organizations/${orgID}/agreements/${agrId}/undo`,
    {
      method: 'PATCH',
    },
  )
  return res
}

export const deleteAgreementById = async (orgID, agrId) => {
  let res = await fetchJSON(
    `${appUrl}/psa/organizations/${orgID}/agreements/${agrId}/archive`,
    {
      method: 'PATCH',
    },
  )
  return res
}

export const getTimelineHistory = async (orgId, agrId) => {
  let res = await fetchJSON(
    `${appUrl}/psa/organizations/${orgId}/agreements/${agrId}/timeline`,
    {
      method: 'GET',
    },
  )
  return res
}

export const getMasterContractHistory = async (orgId, agrId, hisId) => {
  let res = await fetchJSON(
    `${appUrl}/psa/organizations/${orgId}/agreements/${agrId}/timeline/${hisId}/master_contract`,
    {
      method: 'GET',
    },
  )
  return res
}

export const getAttachmentsHistory = async (orgId, agrId, hisId) => {
  let res = await fetchJSON(
    `${appUrl}/psa/organizations/${orgId}/agreements/${agrId}/timeline/${hisId}/attachments`,
    {
      method: 'GET',
    },
  )
  return res
}

export const getPartiesHistory = async (orgId, agrId, hisId) => {
  let res = await fetchJSON(
    `${appUrl}/psa/organizations/${orgId}/agreements/${agrId}/timeline/${hisId}/parties`,
    {
      method: 'GET',
    },
  )
  return res
}
export const getBlockDetailsHistory = async (orgId, agrId, hisId) => {
  let res = await fetchJSON(
    `${appUrl}/psa/organizations/${orgId}/agreements/${agrId}/timeline/${hisId}/block_details`,
    {
      method: 'GET',
    },
  )
  return res
}

export const getExplorationHistory = async (orgId, agrId, hisId) => {
  let res = await fetchJSON(
    `${appUrl}/psa/organizations/${orgId}/agreements/${agrId}/timeline/${hisId}/exploration_commitement`,
    {
      method: 'GET',
    },
  )
  return res
}
export const getRelinquishmentsHistory = async (orgId, agrId, hisId) => {
  let res = await fetchJSON(
    `${appUrl}/psa/organizations/${orgId}/agreements/${agrId}/timeline/${hisId}/relinquishments`,
    {
      method: 'GET',
    },
  )
  return res
}
export const getPolygonHistory = async (orgId, agrId, hisId) => {
  let res = await fetchJSON(
    `${appUrl}/psa/organizations/${orgId}/agreements/${agrId}/timeline/${hisId}/polygon`,
    {
      method: 'GET',
    },
  )
  return res
}
export const getFiscalTermsHistory = async (orgId, agrId, hisId) => {
  let res = await fetchJSON(
    `${appUrl}/psa/organizations/${orgId}/agreements/${agrId}/timeline/${hisId}/fiscal_terms`,
    {
      method: 'GET',
    },
  )
  return res
}
export const getObligationsHistory = async (orgId, agrId, hisId) => {
  let res = await fetchJSON(
    `${appUrl}/psa/organizations/${orgId}/agreements/${agrId}/timeline/${hisId}/obligations`,
    {
      method: 'GET',
    },
  )
  return res
}
export const getLegalTermsHistory = async (orgId, agrId, hisId) => {
  let res = await fetchJSON(
    `${appUrl}/psa/organizations/${orgId}/agreements/${agrId}/timeline/${hisId}/legal_terms`,
    {
      method: 'GET',
    },
  )
  return res
}

export const updateTitle = async (orgId, agrId, content) => {
  let res = await fetchJSON(
    `${appUrl}/psa/organizations/${orgId}/agreements/${agrId}`,
    {
      method: 'PUT',
      body: JSON.stringify(content),
    },
  )
  return res
}
