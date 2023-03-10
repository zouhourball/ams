import { fetchJSON } from 'libs/fetch'
import { formDataBody } from 'libs/utils/custom-function'

const appUrl = process.env.NODE_ENV === 'production' ? PRODUCT_APP_URL_API : ''

// affiliate

export const findAllAffiliateByUserCompanyAccess = async ({ queryKey }) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v2/costRecovery/affiliate/list/analytics?sort=metaData.createdAt,desc`,
      {
        method: 'GET',
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}

export const updateAffiliateCost = async ({ status, objectId }) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v2/costRecovery/affiliate/update?status=${status}&objectId=${objectId}`,
      {
        method: 'PUT',
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}

// Contracts

export const findAllContractsByUserCompanyAccess = async ({ queryKey }) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v2/costRecovery/contracts/list/analytics?sort=metaData.createdAt,desc`,
      {
        method: 'GET',
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}

export const updateContractsCost = async ({ status, objectId }) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v2/costRecovery/contracts/update?status=${status}&objectId=${objectId}`,
      {
        method: 'PUT',
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}

// Facilities

export const findAllFacilitiesByUserCompanyAccess = async ({ queryKey }) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v2/costRecovery/facilities/list/analytics?sort=metaData.createdAt,desc`,
      {
        method: 'GET',
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}

export const updateFacilitiesCost = async ({ status, objectId }) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v2/costRecovery/facilities/update?status=${status}&objectId=${objectId}`,
      {
        method: 'PUT',
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}

export const deleteRow = async (objectId, subModule) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v2/costRecovery/${subModule}/${objectId}`,
      {
        method: 'DELETE',
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}
export const deleteRows = async (subModule, objectIds) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v2/costRecovery/${subModule}/?objectIds=${objectIds}`,
      {
        method: 'DELETE',
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}

// ProdLifting

export const findAllProdLiftingByUserCompanyAccess = async ({ queryKey }) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v2/costRecovery/prodLifting/list/analytics?sort=metaData.createdAt,desc`,
      {
        method: 'GET',
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}

export const updateProdLiftingCost = async ({ status, objectId }) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v2/costRecovery/prodLifting/update?status=${status}&objectId=${objectId}`,
      {
        method: 'PUT',
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}

// Costs

export const findAllCostsByUserCompanyAccess = async ({ queryKey }) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v2/costRecovery/costs/list/analytics?sort=metaData.createdAt,desc`,
      {
        method: 'GET',
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}
export const updateCostsVersion = async ({ subModule, objectId, body }) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v2/costRecovery/${subModule}/${objectId}`,
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
export const updateCostsCost = async ({ objectId, status }) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v2/costRecovery/costs/update?status=${status}&objectId=${objectId}`,
      {
        method: 'PUT',
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}

// Transaction

export const commitSubModule = async ({ body, key }) => {
  // console.log(body, 'body')
  let res
  let apiUrl =
    key === 'transaction'
      ? `${appUrl}/pulse-be/api/v2/costRecovery/${key}/${body?.id}/commit`
      : `${appUrl}/pulse-be/api/v2/costRecovery/${key}/commit`
  try {
    res = await fetchJSON(apiUrl, {
      method: 'POST',
      ...(key === 'transaction' ? {} : { body: JSON.stringify(body) }),
    })
  } catch (e) {
    res = { error: e }
  }
  return res
}

export const findAllTransactionByUserCompanyAccess = async ({ queryKey }) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v2/costRecovery/transaction/list/analytics?sort=metaData.createdAt,desc`,
      {
        method: 'GET',
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}

export const updateTransactionCost = async ({ status, objectId }) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v2/costRecovery/transaction/update?status=${status}&objectId=${objectId}`,
      {
        method: 'PUT',
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}

export const uploadReport = async ({ data, key }) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v2/costRecovery/${key}/upload`,
      {
        method: 'POST',
        isFormData: true,
        body: data && formDataBody(data),
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}
export const listOfReports = async ({ queryKey }) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v2/costRecovery/${queryKey[0]}?sort=metaData.createdAt,desc&page=${queryKey[1]?.page}&size=${queryKey[1]?.size}`,
      {
        method: 'GET',
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}
export const overrideReport = async ({ body, overrideId, key }) => {
  // body={
  //   "statement": "string"
  // }
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v2/costRecovery/${key}/override/${overrideId}`,
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
export const detailReportRows = async ({ queryKey }) => {
  let res
  try {
    res = await fetchJSON(
      /// rows?page=${queryKey[2]?.page}&size=${queryKey[2]?.size}
      `${appUrl}/pulse-be/api/v2/costRecovery/${queryKey[0]}/${queryKey[1]}/rows?page=${queryKey[2]?.page}&size=${queryKey[2]?.size}`,
      {
        method: 'GET',
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}
export const detailReport = async ({ queryKey }) => {
  let res
  try {
    res = await fetchJSON(
      /// rows?page=${queryKey[2]?.page}&size=${queryKey[2]?.size}
      `${appUrl}/pulse-be/api/v2/costRecovery/${queryKey[0]}/${queryKey[1]}`,
      {
        method: 'GET',
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}
export const detailReportByVersion = async ({ queryKey }) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v2/costRecovery/${queryKey[0]}/${queryKey[1]}/versions?version=${queryKey[2]}`,
      {
        method: 'GET',
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}

export const getTemplatesCostRecovery = async () => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v2/regulations/C%20:%20Reporting%20Templates/MOG-S08-BUDGETARY%20&%20FINANCIAL?excludeLinksFeeds=true&sort=uploadDate,desc`,
      {
        method: 'GET',
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}

export const addTemplateCostRecovery = async (body) => {
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

export const getReportsByTemplate = async ({ queryKey }) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v2/regulations/${queryKey[2]}/links/query?page=${queryKey[3]}&size=${queryKey[4]}&sort=uploadDate,desc`,
      {
        method: 'POST',
        body: JSON.stringify(queryKey[1]),
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}

export const deleteReports = async (objectIds) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v2/regulations/?objectIds=${objectIds}`,
      {
        method: 'DELETE',
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}
