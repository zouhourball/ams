import { fetchJSON, fetchGeneric } from 'libs/fetch'
import { downloadFromBlob } from 'libs/utils/download-blob'

const appUrl =
  process.env.NODE_ENV === 'production'
    ? PRODUCT_APP_URL_API
    : PRODUCT_APP_URL_API
// lpg

export const getDocumentsById = async ({ queryKey }) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v2/docs?processInstanceId=${queryKey[1]}`,
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

export const deleteDocument = async (id) => {
  let res
  try {
    res = await fetchJSON(`${appUrl}/pulse-be/api/v2/docs/${id}`, {
      method: 'DELETE',
    })
  } catch (e) {
    res = { error: e }
  }
  return res
}

export const downloadTemp = async (module, sub, onLoading) => {
  const url = `${appUrl}/pulse-be/api/v2/files/${module}/${sub}/template/download`
  const apiResponseBlob = await fetchGeneric(url, { method: 'GET' }).then(
    (response) => response.blob(),
    onLoading(true),
  )
  downloadFromBlob(
    apiResponseBlob,
    `template_${module}_${sub}.xlsx` || URL.split('/').reverse()[0],
  )
  onLoading(false)
}

export const downloadOriginalFile = async (fileId, name) => {
  const url = `${appUrl}/pulse-be/api/v2/files/original-file?id=${fileId}`
  const apiResponseBlob = await fetchGeneric(url, { method: 'GET' }).then(
    (response) => response.blob(),
  )
  downloadFromBlob(
    apiResponseBlob,
    `${name}.xlsx` || URL.split('/').reverse()[0],
  )
}
