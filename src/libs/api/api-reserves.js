import { fetchJSON } from 'libs/fetch'

const appUrl = process.env.NODE_ENV === 'production' ? PRODUCT_APP_URL_API : ''

export const getBlocks = async () => {
  let res
  try {
    res = await fetchJSON(`${appUrl}/docs/api/v1/config/blocks`, {
      method: 'GET',
    })
  } catch (e) {
    res = { error: e }
  }
  return res
}

export const uploadAnnualReport = async ({ body }) => {
  let res
  try {
    res = await fetchJSON(`${appUrl}/pulse-be/api/v1/reserve/annual/upload`, {
      method: 'POST',
      body: JSON.stringify(body),
    })
  } catch (e) {
    res = { error: e }
  }
  return res
}
export const getAnnualReport = async () => {
  let res
  try {
    res = await fetchJSON(`${appUrl}/pulse-be/api/v1/reserve/annual`, {
      method: 'GET',
    })
  } catch (e) {
    res = { error: e }
  }
  return res
}
