import store from 'libs/store'

export function userRole () {
  const roles = store?.getState()?.query?.DEFAULT?.me?.data?.roles
  const orgId = store?.getState().shell.organizationId

  const opPrefix = `target-subscription-store:${orgId}:pulse `
  const regPrefix = 'pulse '

  const opSuffix = ' operator'
  const regSuffix = ' regulator'

  const regMatcher = new RegExp(regPrefix + '[a-z]*' + regSuffix, 'i')
  const opMatcher = new RegExp(opPrefix + '[a-z]*' + opSuffix, 'i')

  const opExist = roles?.filter((role) => opMatcher.test(role))
  const regExist = roles?.filter((role) => regMatcher.test(role))

  // ghofran
  if (regExist?.length) {
    return 'regulator'
  } else if (opExist?.length) {
    // zouhour
    return 'operator'
  } else return ''
}
