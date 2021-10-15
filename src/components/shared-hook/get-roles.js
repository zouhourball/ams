
import store from 'libs/store'

export async function userRole () {
  const roles = store?.getState()?.query?.DEFAULT?.me?.data?.roles
  if (roles?.includes('target-subscription-store:1145:Member')) {
    return 'regulator'
  } else {
    if (roles?.includes('target:workspace:696')) return 'operator'
    else return ''
  }
}