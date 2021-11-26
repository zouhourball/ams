import { fetchJSON } from 'libs/fetch'

const appUrl =
  process.env.NODE_ENV === 'production'
    ? PRODUCT_APP_URL_API
    : PRODUCT_APP_URL_API
// lpg

export const getConfiguredCompanies = async ({ queryKey }) => {
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
export const addNewCompany = async (body) => {
  let res
  try {
    res = await fetchJSON(`${appUrl}/arm-be/api/v1/config/companies`, {
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
    res = await fetchJSON(
      `${appUrl}/arm-be/api/v1/blocks?orgId=${queryKey[1]}`,
      {
        method: 'GET',
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}

export const addNewBlock = async (body) => {
  let res
  try {
    res = await fetchJSON(`${appUrl}/arm-be/api/v1/config/blocks`, {
      method: 'POST',
      body: JSON.stringify(body),
    })
  } catch (e) {
    res = { error: e }
  }
  return res
}
