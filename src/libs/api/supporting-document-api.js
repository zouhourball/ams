import { fetchJSON } from 'libs/fetch'

const appUrl =
  process.env.NODE_ENV === 'production'
    ? PRODUCT_APP_URL_API
    : PRODUCT_APP_URL_API
// lpg

export const getDocumentsById = async ({ queryKey }) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v2/docs?processInstanceId=${queryKey[0]}`,
      {
        method: 'GET',
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}
export const addDocuments = async (body) => {
  let res
  try {
    res = await fetchJSON(`${appUrl}/pulse-be/api/v2/docs`, {
      method: 'POST',
      body: JSON.stringify(body),
    })
  } catch (e) {
    res = { error: e }
  }
  return res
}

export const deleteDocument = async ({ queryKey }) => {
  let res
  try {
    res = await fetchJSON(`${appUrl}/pulse-be/api/v2/docs/${queryKey[1]}`, {
      method: 'DELETE',
    })
  } catch (e) {
    res = { error: e }
  }
  return res
}
