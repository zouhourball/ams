import { fetchJSON } from 'libs/fetch'
import { formDataBody } from 'libs/utils/custom-function'

const appUrl = process.env.NODE_ENV === 'production' ? PRODUCT_APP_URL_API : ''

// affiliate
export const listAffiliateCost = async ({ queryKey }) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v2/costRecovery/affiliate?sort=metaData.createdAt,desc`,
      {
        method: 'GET',
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}

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
export const overrideAffiliateCost = async ({ body, overrideId }) => {
  // body={
  //   "statement": "string"
  // }
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v2/costRecovery/affiliate/override/${overrideId}`,
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

export const uploadAffiliateCost = async (body) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v2/costRecovery/affiliate/upload`,
      {
        method: 'POST',
        body: formDataBody(body),
        isFormData: true,
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}
export const detailAffiliateCostByLoggedUser = async ({ queryKey }) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v2/costRecovery/affiliate/${queryKey[1]}?sort=metaData.createdAt,desc`,
      {
        method: 'GET',
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}

// Contracts

export const listContractsCost = async ({ queryKey }) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v2/costRecovery/contracts?sort=metaData.createdAt,desc`,
      {
        method: 'GET',
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}

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
export const overrideContractsCost = async ({ body, overrideId }) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v2/costRecovery/contracts/override/${overrideId}`,
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

export const uploadContracts = async (body) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v2/costRecovery/contracts/upload`,
      {
        method: 'POST',
        body: formDataBody(body),
        isFormData: true,
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}
export const detailContractsCostByLoggedUser = async ({ queryKey }) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v2/costRecovery/contracts/${queryKey[1]}?sort=metaData.createdAt,desc`,
      {
        method: 'GET',
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}

// Facilities
export const listFacilitiesCost = async ({ queryKey }) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v2/costRecovery/facilities?sort=metaData.createdAt,desc`,
      {
        method: 'GET',
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}

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
export const overrideFacilitiesCost = async ({ body, overrideId }) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v2/costRecovery/facilities/override/${overrideId}`,
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

export const uploadFacilitiesCost = async (body) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v2/costRecovery/facilities/upload`,
      {
        method: 'POST',
        body: formDataBody(body),
        isFormData: true,
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}
export const detailFacilitiesCostByLoggedUser = async ({ queryKey }) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v2/costRecovery/facilities/${queryKey[1]}?sort=metaData.createdAt,desc`,
      {
        method: 'GET',
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}

export const deleteRow = async ({ objectId, subModule }) => {
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

// ProdLifting
export const listProdLiftingCost = async ({ queryKey }) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v2/costRecovery/prodLifting?sort=metaData.createdAt,desc`,
      {
        method: 'GET',
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}

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
export const overrideProdLiftingCost = async ({ body, overrideId }) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v2/costRecovery/prodLifting/override/${overrideId}`,
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

export const uploadProdLiftingCost = async (body) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v2/costRecovery/prodLifting/upload`,
      {
        method: 'POST',
        isFormData: true,
        body: formDataBody(body),
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}
export const detailProdLiftingCostByLoggedUser = async ({ queryKey }) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v2/costRecovery/prodLifting/${queryKey[1]}?sort=metaData.createdAt,desc`,
      {
        method: 'GET',
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}

// Costs
export const listCostsCost = async ({ queryKey }) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v2/costRecovery/costs?sort=metaData.createdAt,desc`,
      {
        method: 'GET',
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}

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
export const overrideCostsCost = async ({ body, overrideId }) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v2/costRecovery/costs/override/${overrideId}`,
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

export const uploadAnnualCosts = async (body) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v2/costRecovery/costs/upload`,
      {
        method: 'POST',
        isFormData: true,
        body: body && formDataBody(body),
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}
export const detailCostsCostByLoggedUser = async ({ queryKey }) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v2/costRecovery/costs/${queryKey[1]}?sort=metaData.createdAt,desc`,
      {
        method: 'GET',
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}

// Transaction
export const listTransactionCost = async ({ queryKey }) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v2/costRecovery/transaction?sort=metaData.createdAt,desc`,
      {
        method: 'GET',
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}

export const commitSubModule = async ({ body, subModule }) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v2/costRecovery/${subModule}/commit`,
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
export const overrideTransactionCost = async ({ body, overrideId }) => {
  // body={
  //   "statement": "string"
  // }
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v2/costRecovery/transaction/override/${overrideId}`,
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

export const uploadTransactionCost = async (body) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v2/costRecovery/transaction/upload`,
      {
        method: 'POST',
        isFormData: true,
        body: formDataBody(body),
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}
export const detailTransactionCostByLoggedUser = async ({ queryKey }) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v2/costRecovery/transaction/${queryKey[1]}?sort=metaData.createdAt,desc`,
      {
        method: 'GET',
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}
