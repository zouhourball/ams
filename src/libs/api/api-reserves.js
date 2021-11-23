import { fetchJSON, fetchGeneric } from 'libs/fetch'
import { downloadFromBlob } from 'libs/utils/download-blob'

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
  let newBody = new FormData()
  newBody.append('block', body?.block)
  newBody.append('year', body?.year)
  newBody.append('file', body?.file[0])
  newBody.append('processInstanceId', body?.processInstanceId)
  newBody.append('company', body?.company)

  let res
  try {
    res = await fetchJSON(`${appUrl}/pulse-be/api/v1/reserve/annual/upload`, {
      method: 'POST',
      isFormData: true,
      body: newBody,
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

export const downloadTemp = async (module, sub) => {
  const url = `${appUrl}/pulse-be/api/v1/${module}/${sub}/template/download`
  const apiResponseBlob = await await fetchGeneric(url, { method: 'GET' }).then(
    (response) => response.blob(),
  )
  downloadFromBlob(
    apiResponseBlob,
    `template_${module}_${sub}.xlsx` || URL.split('/').reverse()[0],
  )
}
