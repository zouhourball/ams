
import store from 'libs/store'

export function userRole () {
  const roles = store?.getState()?.query?.DEFAULT?.me?.data?.roles
  // zouhour
  if (roles?.includes('target-subscription-store:1145:Member')) {
    return 'regulator'
  } else {
    // rihab
    if (roles?.includes('target:workspace:696')) return 'operator'
    else return ''
  }
}