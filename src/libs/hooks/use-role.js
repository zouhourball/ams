import { useSelector } from 'react-redux'

import { rolesTab } from 'libs/roles-tab'

const useRole = (path) => {
  const roles = useSelector(({ query }) => query?.DEFAULT?.me?.data?.roles)
  const organizationID = useSelector(({ shell }) => shell?.organizationId)

  const findModule = rolesTab.find((module) => module.path === path)
  if (findModule && roles) {
    if (
      roles.includes(
        `target-subscription-store:${organizationID}:${findModule.roleOp}`,
      )
    ) {
      return 'operator'
    } else if (roles.includes(findModule.roleRe)) {
      return 'regulator'
    } else return null
  } else return null
}

export default useRole
