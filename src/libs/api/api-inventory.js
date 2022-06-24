import { fetchJSON } from 'libs/fetch'

const appUrl =
  process.env.NODE_ENV === 'production'
    ? PRODUCT_APP_URL_API
    : PRODUCT_APP_URL_API

export const getInventories = async ({ queryKey }) => {
  let res
  // `${appUrl}/pulse-be/api/v2/inventory/list?query=metaData.category==${queryKey[1]}&page=${queryKey[2]}&size=${queryKey[3]}&sort=metaData.createdAt,desc`,
  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v2/inventory/list?query=metaData.category==${queryKey[0]}&page=${queryKey[1]}&size=${queryKey[2]}&sort=metaData.createdAt,desc`,
      {
        method: 'GET',
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}
export const uploadAnnualBaseInventoryReport = async ({ body }) => {
  let newBody = new FormData()
  newBody.append('block', body?.block)
  // newBody.append('category', body?.category)
  newBody.append('company', body?.company)
  newBody.append('file', body?.file[0])
  newBody.append('processInstanceId', body?.processInstanceId)
  newBody.append('year', body?.year)

  let res
  try {
    res = await fetchJSON(`${appUrl}/pulse-be/api/v2/inventory/base/upload`, {
      method: 'POST',
      isFormData: true,
      body: newBody,
    })
  } catch (e) {
    res = { error: e }
  }
  return res
}

export const getInventoriesAccepted = async ({ queryKey }) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v2/inventory/list?query=metaData.category==base;metaData.status==ACCEPTED&page=${queryKey[0]}&size=${queryKey[1]}&sort=metaData.createdAt,desc`,
      {
        method: 'GET',
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}
export const getConsumptionsList = async ({ queryKey }) => {
  let res

  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v2/transaction/list?query=transactionType==consumptionReportProcess;inventoryId==${queryKey[1]}&page=${queryKey[2]}&size=${queryKey[3]}&sort=metaData.createdAt,desc`,
      {
        method: 'GET',
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}

export const getSurplusList = async ({ queryKey }) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v2/transaction/list?query=transactionType==surplusInventoryProcess;inventoryId==${queryKey[1]}&page=${queryKey[2]}&size=${queryKey[3]}&sort=metaData.createdAt,desc`,
      {
        method: 'GET',
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}

export const getAdditionsList = async ({ queryKey }) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v2/transaction/list?query=transactionType==addition;inventoryId==${queryKey[1]}&page=${queryKey[2]}&size=${queryKey[3]}&sort=metaData.createdAt,desc`,
      {
        method: 'GET',
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}

export const commitInventory = async ({ subModule, body }) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v2/inventory/${subModule}/${body?.id}/commit`,
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
export const saveInventory = async ({ subModule, body }) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v2/inventory/${subModule}/${body?.id}/save`,
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
export const overrideInventoryReport = async ({
  subModule,
  overrideId,
  body,
}) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v2/inventory/${subModule}/${body?.id}/override/${overrideId}`,
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

export const deleteInventory = async ({ inventoryId }) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v2/inventory/base/${inventoryId}`,
      {
        method: 'DELETE',
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}
export const uploadAssetDisposalInventoryReport = async ({ body }) => {
  let newBody = new FormData()
  newBody.append('block', body?.block)
  // newBody.append('category', body?.category)
  newBody.append('company', body?.company)

  newBody.append('file', body?.file[0])
  newBody.append('processInstanceId', body?.processInstanceId)
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v2/inventory/disposal/upload`,
      {
        method: 'POST',
        isFormData: true,
        body: newBody,
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}

export const uploadAssetTransferInventoryReport = async ({ body }) => {
  let newBody = new FormData()
  newBody.append('block', body?.block)
  // newBody.append('category', body?.category)
  newBody.append('company', body?.company)
  newBody.append('companyToTransfer', body?.companyToTransfer)
  newBody.append('file', body?.file[0])
  newBody.append('processInstanceId', body?.processInstanceId)
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v2/inventory/transfer/upload`,
      {
        method: 'POST',
        isFormData: true,
        body: newBody,
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}

export const getCompaniesInventory = async ({ queryKey }) => {
  let res
  try {
    res = await fetchJSON(`${appUrl}/arm/api/v1/config/companies?size=2000`, {
      method: 'GET',
    })
  } catch (e) {
    res = { error: e }
  }
  return res
}

export const updateInventory = async ({ inventoryId, status }) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v2/inventory/base/update?objectId=${inventoryId}&status=${status}`,
      {
        method: 'PUT',
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}
export const channelUpdate = async ({ inventoryId, channelId }) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v2/inventory/base/${inventoryId}/chat-channel-id?channelId=${channelId}`,
      {
        method: 'PUT',
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}

export const getDetailInventoryById = async ({ queryKey }) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v2/inventory/${queryKey[1]}/${queryKey[2]}?sort=metaData.createdAt,desc`,
      {
        method: 'GET',
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}

export const getTransactionById = async ({ queryKey }) => {
  let res
  try {
    res = await fetchJSON(
      // &page=${queryKey[2]}&size=${queryKey[3]}
      `${appUrl}/pulse-be/api/v2/transaction/details/${queryKey[1]}?sort=metaData.createdAt,desc`,
      {
        method: 'GET',
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}

export const addTransaction = async ({ body }) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v2/transaction/addTransaction`,
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

export const commitRows = async ({ body }) => {
  let res
  try {
    res = await fetchJSON(`${appUrl}/pulse-be/api/v2/transaction/commitRows`, {
      method: 'POST',
      body: JSON.stringify(body),
    })
  } catch (e) {
    res = { error: e }
  }
  return res
}
export const saveRows = async ({ body }) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v2/transaction/saveTransaction`,
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

export const getTransactionDetail = async ({ queryKey }) => {
  let res

  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v2/transaction&objectId=${queryKey[1]}?sort=metaData.createdAt,desc`,
      {
        method: 'GET',
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}

export const acceptedTransaction = async ({ transactionId }) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v2/transaction/acceptedTransaction?id=${transactionId}`,
      {
        method: 'PUT',
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}

export const getSnapshotsByInventoryId = async ({ queryKey }) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v2/transaction/snapshots/${queryKey[1]}?sort=metaData.createdAt,desc`,
      {
        method: 'GET',
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}

export const getSnapshotOfBase = async ({ queryKey }) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v2/inventory/base/${queryKey[1]}/snapshots/${queryKey[2]}?sort=metaData.createdAt,desc`,
      {
        method: 'GET',
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}
export const deleteAllInventory = async (subModule, objectIds) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v2/inventory/${subModule}?objectIds=${objectIds}`,
      {
        method: 'DELETE',
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}
