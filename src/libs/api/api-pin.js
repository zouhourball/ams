import { fetchJSON } from 'libs/fetch'
import * as cookies from 'tiny-cookie'

export async function pinToWorkSpace ({
  metaData,
  appName,
  name = 'defaultName',
}) {
  const body = {
    wsID: `${cookies.get('workspaceId') || 23}`,
    dashboardName: 'defaultDashboard',
    name,
    appName,
    metadata: JSON.stringify(metaData),
  }
  const res = await fetchJSON(`${PRODUCT_WORKSPACE_URL || ''}/rest/chart`, {
    method: 'POST',
    body: JSON.stringify(body),
  })
  return res
}
