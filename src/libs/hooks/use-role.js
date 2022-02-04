import { useSelector } from 'react-redux'

import { rolesTab } from 'libs/roles-tab'

const useRole = (path) => {
  const roles = useSelector(({ query }) => query?.DEFAULT?.me?.data?.roles)
  const organizationID = useSelector(({ shell }) => shell?.organizationId)
  let nestedRoles = rolesTab?.filter((el) => el?.hasSubModule)
  nestedRoles = nestedRoles?.map((el) => el?.hasSubModule)?.flat()
  const allRoles = [...rolesTab, ...nestedRoles]
  const findModule = allRoles?.find((module) => module?.path === path)
  if (findModule && roles) {
    if (roles?.includes(findModule.roleJmcChair)) {
      return 'JMCC'
    } else if (roles?.includes(findModule.roleRe)) {
      return 'regulator'
    } else if (roles?.includes(findModule.roleTecSec)) {
      return 'TECOMS'
    } else if (roles?.includes(findModule.roleFinSec)) {
      return 'FINCOMS'
    } else if (roles?.includes(findModule.roleJmcSec)) {
      return 'JMCS'
    } else if (roles?.includes(findModule.roleTecChair)) {
      return 'TECOMC'
    } else if (roles?.includes(findModule.roleFinChair)) {
      return 'FINCOMC'
    } else if (
      roles?.includes(
        `target-subscription-store:${organizationID}:${findModule.roleOp}`,
      )
    ) {
      return 'operator'
    } else return null
  } else return null
}

export default useRole
