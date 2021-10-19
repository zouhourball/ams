
import store from 'libs/store'

export function userRole () {
  const roles = store?.getState()?.query?.DEFAULT?.me?.data?.roles
  const orgId = store?.getState().shell.organizationId
  // ghofran
  if (roles?.includes(`target-subscription-store:${orgId}:Admin`)) {
    return 'regulator'
  } else {
    // rihab
    if (roles?.includes(`target-subscription-store:${orgId}:permit:approver`)) return 'operator'
    else return ''
  }
}