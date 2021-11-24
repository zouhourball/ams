import { fetchJSON } from 'libs/fetch'

const appUrl =
  process.env.NODE_ENV === 'production'
    ? PRODUCT_APP_URL_API
    : PRODUCT_APP_URL_API

// affiliate
export const listAffiliateCost = async ({ queryKey }) => {
  let res
  try {
    res = await fetchJSON(`${appUrl}/pulse-be/api/v2/costRecovery/affiliate`, {
      method: 'GET',
    })
  } catch (e) {
    res = { error: e }
  }
  return res
}
export const commitLoadAffiliateCost = async ({ body }) => {
  // body={
  //   "statement": "string"
  // }
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v2/costRecovery/affiliate/commit`,
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

export const findAllAffiliateByUserCompanyAccess = async ({ queryKey }) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v2/costRecovery/affiliate/list/analytics`,
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
export const updateAffiliateCost = async ({ body }) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v2/costRecovery/affiliate/update`,
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

export const uploadAffiliateCost = async ({ body }) => {
  // body={
  //   "statement": "string"
  // }
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v2/costRecovery/affiliate/upload`,
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
export const detailAffiliateCostByLoggedUser = async ({ queryKey }) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v2/costRecovery/affiliate/${queryKey[1]}`,
      {
        method: 'GET',
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}

export const deleteAffiliate = async ({ objectId }) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v2/costRecovery/affiliate/${objectId}`,
      {
        method: 'DELETE',
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
    res = await fetchJSON(`${appUrl}/pulse-be/api/v2/costRecovery/contracts`, {
      method: 'GET',
    })
  } catch (e) {
    res = { error: e }
  }
  return res
}
export const commitLoadContractsCost = async ({ body }) => {
  // body={
  //   "statement": "string"
  // }
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v2/costRecovery/contracts/commit`,
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

export const findAllContractsByUserCompanyAccess = async ({ queryKey }) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v2/costRecovery/contracts/list/analytics`,
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
  // body={
  //   "statement": "string"
  // }
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
export const updateContractsCost = async ({ body }) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v2/costRecovery/contracts/update`,
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

export const uploadContractsCost = async ({ body }) => {
  // body={
  //   "statement": "string"
  // }
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v2/costRecovery/contracts/upload`,
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
export const detailContractsCostByLoggedUser = async ({ queryKey }) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v2/costRecovery/contracts/${queryKey[1]}`,
      {
        method: 'GET',
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}

export const deleteContracts = async ({ objectId }) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v2/costRecovery/contracts/${objectId}`,
      {
        method: 'DELETE',
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
    res = await fetchJSON(`${appUrl}/pulse-be/api/v2/costRecovery/facilities`, {
      method: 'GET',
    })
  } catch (e) {
    res = { error: e }
  }
  return res
}
export const commitLoadFacilitiesCost = async ({ body }) => {
  // body={
  //   "statement": "string"
  // }
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v2/costRecovery/facilities/commit`,
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

export const findAllFacilitiesByUserCompanyAccess = async ({ queryKey }) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v2/costRecovery/facilities/list/analytics`,
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
  // body={
  //   "statement": "string"
  // }
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
export const updateFacilitiesCost = async ({ body }) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v2/costRecovery/facilities/update`,
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

export const uploadFacilitiesCost = async ({ body }) => {
  // body={
  //   "statement": "string"
  // }
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v2/costRecovery/facilities/upload`,
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
export const detailFacilitiesCostByLoggedUser = async ({ queryKey }) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v2/costRecovery/facilities/${queryKey[1]}`,
      {
        method: 'GET',
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}

export const deleteFacilities = async ({ objectId }) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v2/costRecovery/facilities/${objectId}`,
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
      `${appUrl}/pulse-be/api/v2/costRecovery/prodLifting`,
      {
        method: 'GET',
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}
export const commitLoadProdLiftingCost = async ({ body }) => {
  // body={
  //   "statement": "string"
  // }
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v2/costRecovery/prodLifting/commit`,
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

export const findAllProdLiftingByUserCompanyAccess = async ({ queryKey }) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v2/costRecovery/prodLifting/list/analytics`,
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
  // body={
  //   "statement": "string"
  // }
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
export const updateProdLiftingCost = async ({ body }) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v2/costRecovery/prodLifting/update`,
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

export const uploadProdLiftingCost = async ({ body }) => {
  // body={
  //   "statement": "string"
  // }
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v2/costRecovery/prodLifting/upload`,
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
export const detailProdLiftingCostByLoggedUser = async ({ queryKey }) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v2/costRecovery/prodLifting/${queryKey[1]}`,
      {
        method: 'GET',
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}

export const deleteProdLifting = async ({ objectId }) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v2/costRecovery/ProdLifting/${objectId}`,
      {
        method: 'DELETE',
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
    res = await fetchJSON(`${appUrl}/pulse-be/api/v2/costRecovery/costs`, {
      method: 'GET',
    })
  } catch (e) {
    res = { error: e }
  }
  return res
}
export const commitLoadCostsCost = async ({ body }) => {
  // body={
  //   "statement": "string"
  // }
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v2/costRecovery/costs/commit`,
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

export const findAllCostsByUserCompanyAccess = async ({ queryKey }) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v2/costRecovery/costs/list/analytics`,
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
  // body={
  //   "statement": "string"
  // }
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
export const updateCostsCost = async ({ body }) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v2/costRecovery/costs/update`,
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

export const uploadCostsCost = async ({ body }) => {
  // body={
  //   "statement": "string"
  // }
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v2/costRecovery/costs/upload`,
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
export const detailCostsCostByLoggedUser = async ({ queryKey }) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v2/costRecovery/costs/${queryKey[1]}`,
      {
        method: 'GET',
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}

export const deleteCosts = async ({ objectId }) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v2/costRecovery/costs/${objectId}`,
      {
        method: 'DELETE',
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
      `${appUrl}/pulse-be/api/v2/costRecovery/transaction`,
      {
        method: 'GET',
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}
export const commitLoadTransactionCost = async ({ body }) => {
  // body={
  //   "statement": "string"
  // }
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v2/costRecovery/transaction/commit`,
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
      `${appUrl}/pulse-be/api/v2/costRecovery/transaction/list/analytics`,
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
export const updateTransactionCost = async ({ body }) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v2/costRecovery/transaction/update`,
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

export const uploadTransactionCost = async ({ body }) => {
  // body={
  //   "statement": "string"
  // }
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v2/costRecovery/transaction/upload`,
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
export const detailTransactionCostByLoggedUser = async ({ queryKey }) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v2/costRecovery/transaction/${queryKey[1]}`,
      {
        method: 'GET',
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}

export const deleteTransaction = async ({ objectId }) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v2/costRecovery/transaction/${objectId}`,
      {
        method: 'DELETE',
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}