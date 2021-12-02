import { fetchJSON, fetchGeneric } from 'libs/fetch'
import { downloadFromBlob } from 'libs/utils/download-blob'

const appUrl =
  process.env.NODE_ENV === 'production'
    ? PRODUCT_APP_URL_API
    : PRODUCT_APP_URL_API

export const getInventories = async ({ queryKey }) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v2/inventory/list?query=metaData.category==${queryKey[1]}&page=${queryKey[2]}&size=${queryKey[3]}`,
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
  newBody.append('category', body?.category)
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
      `${appUrl}/pulse-be/api/v2/inventory/list?query=metaData.category==base;metaData.status==ACCEPTED&page=${queryKey[1]}&size=${queryKey[2]}`,
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
      `${appUrl}/pulse-be/api/v2/transaction/list?query=transactionType==consumptionReportProcess;inventoryId==${queryKey[1]}&page=${queryKey[2]}&size=${queryKey[3]}`,
      {
        method: 'GET',
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}

export const getSurplusList = async ({ page, size, inventoryId }) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v2/transaction/list?query=transactionType==surplusInventoryProcess;inventoryId==${inventoryId}&page=${page}&size=${size}`,
      {
        method: 'GET',
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}

export const getAdditionsList = async ({ page, size, inventoryId }) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v2/transaction/list?query=transactionType==addition;inventoryId==${inventoryId}&page=${page}&size=${size}`,
      {
        method: 'GET',
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}

export const downloadTemp = async (module, sub) => {
  const url = `${appUrl}/pulse-be/api/v2/files/${module}/${sub}/template/download`
  const apiResponseBlob = await await fetchGeneric(url, { method: 'GET' }).then(
    (response) => response.blob(),
  )
  downloadFromBlob(
    apiResponseBlob,
    `template_${module}_${sub}.xlsx` || URL.split('/').reverse()[0],
  )
}

export const commitInventory = async ({ subModule, body }) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v2/inventory/${subModule}/commit`,
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
      `${appUrl}/pulse-be/api/v2/inventory/${subModule}/override/${overrideId}`,
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
  newBody.append('category', body?.category)
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
  newBody.append('category', body?.category)
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
    res = await fetchJSON(
      `${appUrl}/arm-be/api/v1/config/companies?size=2000`,
      {
        method: 'GET',
      },
    )
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

export const getDetailInventoryById = async ({ queryKey }) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v2/inventory/${queryKey[1]}/${queryKey[2]}`,
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
      `${appUrl}/pulse-be/api/v2/transaction/details/${queryKey[1]}`,
      {
        method: 'GET',
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}
