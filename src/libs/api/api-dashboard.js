import { fetchJSON } from 'libs/fetch'

export async function getReservesData (category, id) {
  const params = !id ? 'size=100000' : `query=id=in=(${id})&size=10000000`
  const res = await fetchJSON(
    // `https://pulse.mog.meeraspace.com/docs/api/v2/reserve/${category}/list/analytics?${params}&query=metaData.status=out=(ARCHIVED,DRAFT)`,
    `/pulse-be/api/v1/reserve/${category}/list/analytics?${params}&query=metaData.status=out=(ARCHIVED,DRAFT)`,
  )
  return res
}
export async function getProductionData (category, id) {
  const params = !id ? 'size=100000' : `query=id=in=(${id})&size=10000000`
  const res = await fetchJSON(
    `/pulse-be/api/v1/production/list/${category}/analytics?${params}&query=metaData.status=out=(ARCHIVED,DRAFT)`,
    null,
    true,
  )
  return res
}
export async function getProductionTrackingData () {
  const res = await fetchJSON(
    `/pulse-be/api/v1/production/list/monthly-tracking/analytics?query=metaData.status=out=(ARCHIVED,DRAFT)`,
    null,
    true,
  )
  return res
}
export async function getDownstreamAnalyticsData (cat, id) {
  const params = !id ? 'size=100000' : `query=id=in=(${id})&size=100000`
  const res = await fetchJSON(
    `/pulse-be/api/v2/downstream/${cat}/list/analytics?${params}&query=metaData.status=out=(ARCHIVED,DRAFT)`,
  )
  return res
}
export function getCostRecoveryData (cat) {
  return fetchJSON(
    `/pulse-be/api/v2/costRecovery/${cat}/list/analytics?query=metaData.status=out=(ARCHIVED,DRAFT)`,
  )
}
export function getInventoryData (cat, id) {
  switch (cat) {
    case 'base':
    case 'assetTransferRequestProcess':
    case 'assetDisposalRequestProcess': {
      const params = !id
        ? `query=metaData.category==${cat};metaData.status=in=(ACCEPTED,SUBMITTED)`
        : `query=id=in=(${id})`
      return fetchJSON(`/pulse-be/api/v2/inventory/analytics?${params}`)
    }
    // current default includes
    // consumptionReportProcess, surplusInventoryProcess
    default: {
      const params = !id
        ? `query=transactionType==${cat}`
        : `query=id=in=(${id})`
      return fetchJSON(
        `/pulse-be/api/v2/transaction/analytics?${params}&query=metaData.status=out=(ARCHIVED,DRAFT)`,
      )
    }
  }
}
export async function getPermittingData (id) {
  const params = !id ? 'size=100000' : `query=id=in=(${id})&size=100000`
  const res = await fetchJSON(
    `/pulse-be/api/v1/permit/analytics?${params}&query=metaData.status=out=(ARCHIVED,DRAFT)`,
  )
  return res
}
export function getPlanningData (cat, id) {
  const params = !id
    ? `query=metaData.status=out=(ARCHIVED,DRAFT)`
    : `query=id=in=(${id})`
  return fetchJSON(`/pulse-be/api/v2/planning/${cat}/list/analytics?${params}`)
}
export async function getFlaringData (workflow, id) {
  const params = !id ? 'size=100000' : `query=id=in=(${id})&size=100000`
  const res = await fetchJSON(
    `/pulse-be/api/v2/flaring/${workflow}/list/analytics?${params}&query=metaData.status=out=(ARCHIVED,DRAFT)`,
  )
  return res
}
