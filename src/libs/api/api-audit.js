import { fetchJSON } from 'libs/fetch'
// import { formDataBody } from 'libs/utils/custom-function'

const appUrl = process.env.NODE_ENV === 'production' ? PRODUCT_APP_URL_API : ''

export const getStateAudit = async ({ queryKey }) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v2/audits?sort=metaData.createdAt,desc&page=${queryKey[1]?.page}&size=${queryKey[1]?.size}`,
      {
        method: 'GET',
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}
