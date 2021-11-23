import store from 'libs/store'

export function userRole () {
  const roles = store?.getState()?.query?.DEFAULT?.me?.data?.roles
  const orgId = store?.getState().shell.organizationId

  let availableRoles = {}

  const opPrefix = `target-subscription-store:${orgId}:pulse `
  const regPrefix = 'pulse '

  const opSuffix = ' operator'
  const regSuffix = ' regulator'

  const operators = roles
    ?.map((role) => {
      let key = role.replace(opPrefix, '').replace(opSuffix, '')
      if (role === opPrefix + key + opSuffix) {
        return key
      }
    })
    .filter((role) => role)

  const regulators = roles
    ?.map((role) => {
      let key = role.replace(regPrefix, '').replace(regSuffix, '')
      if (role === regPrefix + key + regSuffix) {
        return key
      }
    })
    .filter((role) => role)

  availableRoles.operators = [...operators]
  availableRoles.regulators = [...regulators]
  return availableRoles
}
