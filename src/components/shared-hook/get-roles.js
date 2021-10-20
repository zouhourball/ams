import store from 'libs/store'

export function userRole () {
  const roles = store?.getState()?.query?.DEFAULT?.me?.data?.roles
  const orgId = store?.getState().shell.organizationId
  // ghofran
  if (roles?.includes(`target-subscription-store:${orgId}:regulator`)) {
    return 'regulator'
  } else {
    // zouhour
    if (roles?.includes(`target-subscription-store:${orgId}:operator`)) {
      return 'operator'
    } else return ''
  }
}
