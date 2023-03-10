import { fetchJSON } from 'libs/fetch'

const appUrl =
  process.env.NODE_ENV === 'production'
    ? PRODUCT_APP_URL_API
    : PRODUCT_APP_URL_API
// lpg

export const getConfiguredCompanies = async ({ queryKey }) => {
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
export const addNewCompany = async (body) => {
  let res
  try {
    res = await fetchJSON(`${appUrl}/arm/api/v1/config/companies`, {
      method: 'POST',
      body: JSON.stringify(body),
    })
  } catch (e) {
    res = { error: e }
  }
  return res
}

export const getBlockByOrgId = async ({ queryKey }) => {
  let res
  try {
    res = await fetchJSON(`${appUrl}/arm/api/v1/blocks?orgId=${queryKey[1]}`, {
      method: 'GET',
    })
  } catch (e) {
    res = { error: e }
  }
  return res
}

export const addNewBlock = async (body) => {
  let res
  try {
    res = await fetchJSON(`${appUrl}/arm/api/v1/config/blocks`, {
      method: 'POST',
      body: JSON.stringify(body),
    })
  } catch (e) {
    res = { error: e }
  }
  return res
}

export const deleteBlock = async (blockId) => {
  let res
  try {
    res = await fetchJSON(`${appUrl}/arm/api/v1/config/blocks/${blockId}`, {
      method: 'DELETE',
    })
  } catch (e) {
    res = { error: e }
  }
  return res
}

export const updateBlock = async ({ blockId, body }) => {
  let res
  try {
    res = await fetchJSON(`${appUrl}/arm/api/v1/config/blocks/${blockId}`, {
      method: 'PUT',
      body: JSON.stringify(body),
    })
  } catch (e) {
    res = { error: e }
  }
  return res
}

export const deleteCompany = async (companyId) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/arm/api/v1/config/companies/${companyId}`,
      {
        method: 'DELETE',
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}

export const getCompanyInfo = async ({ queryKey }) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/arm/api/v1/companies?orgId=${queryKey[1]}`,
      {
        method: 'GET',
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}
