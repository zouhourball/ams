import { fetchJSON, fetchGeneric } from 'libs/fetch'
import { overlayControl } from './'
import { downloadFromBlob } from 'libs/utils/download-blob'
import { getAccessToken } from 'utils/manageTokens'

const appendFileToForm = (form, file) => {
  form.append('file', file)
  return form
}

export const getPreviewFile = overlayControl(async (fileId) => {
  let request = {
    method: 'GET',
  }
  let res = await fetchGeneric(`/fm/download/preview/${fileId}`, request)
    .then(async (response) => ({
      response,
      blob: await response.blob(),
    }))
    .then((res) => ({
      response: res.response,
      ok: res.response.ok,
      blobURL: URL.createObjectURL(res.blob), // blob:http:// url to access the file
    }))

  return res
})

export const getPreviewPDFFile = overlayControl(async (fileId) => {
  let request = {
    method: 'GET',
  }
  return fetchGeneric(`${PRODUCT_APP_URL_API}/fm/download/${fileId}`, request)
    .then(async (response) => ({
      response,
      blob: await response.blob(),
    }))
    .then((res) => ({
      response: res.response,
      ok: res.response.ok,
      blobURL: URL.createObjectURL(res.blob), // blob:http:// url to access the file
    }))
})

export function fileManagerUpload (files, isPublic) {
  const uploadURL = `${PRODUCT_APP_URL_API}/fm/upload?bucket=${'upload'}&share_with=${
    isPublic ? 'sys:anonymous' : 'sys:authenticated'
  }&permission=${'view'}`
  const opts = {
    method: 'POST',
    isFormData: true,
    body: Array.isArray(files)
      ? files.reduce(appendFileToForm, new FormData())
      : appendFileToForm(new FormData(), files),
  }

  return fetchJSON(uploadURL, opts)
}

export const getListTemplates = async (subject) => {
  const category = 'C : Reporting Templates'
  let res = await fetchJSON(
    `/docs/api/v2/regulations/${category}/${subject}?excludeLinksFeeds=true`,
    {
      method: 'GET',
    },
  )
  return res
}

export const addNewTemplate = async (body) => {
  let res
  try {
    res = await fetchJSON(
      `/docs/api/v2/regulations
  `,
      {
        method: 'POST',
        body: JSON.stringify(body),
      },
    )
  } catch (error) {
    res = {
      error,
    }
  }
  return res
}

export const addLink = async (ID, body) => {
  let res
  try {
    res = await fetchJSON(`/docs/api/v2/regulations/${ID}/links`, {
      method: 'POST',
      body: JSON.stringify(body),
    })
  } catch (error) {
    res = {
      error,
    }
  }
  return res
}
export const getListOfLinkedReports = async (
  ID,
  body,
  page = 0,
  size = 2000,
) => {
  let res
  try {
    res = await fetchJSON(
      `/docs/api/v2/regulations/${ID}/links/query?page=${page}&size=${size}`,
      {
        method: 'POST',
        body: JSON.stringify(body),
      },
    )
  } catch (error) {
    res = {
      error,
    }
  }
  return res
}

export async function fileDownload (URL, fileNameOnDownload) {
  const apiResponseBlob = await fetch(URL, {
    responseType: 'blob',
  }).then((response) => response.blob())

  downloadFromBlob(
    apiResponseBlob,
    fileNameOnDownload || URL.split('/').reverse()[0],
  )
}

export async function fileManagerDownload (fileID, fileNameOnDownload) {
  await fileDownload(
    `${PRODUCT_APP_URL_API}/fm/download/${fileID}?access_token=${getAccessToken()}`,
    fileNameOnDownload,
  )
}

export const deleteFile = overlayControl(async (objectId) => {
  let res = await fetchJSON(`/docs/api/v2/regulations?objectIds=${objectId}`, {
    method: 'DELETE',
  })
  return res
})
