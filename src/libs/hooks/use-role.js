import { useSelector } from 'react-redux'

import { rolesTab } from 'libs/roles-tab'

const useRole = (path) => {
  const roles = useSelector(({ query }) => query?.DEFAULT?.me?.data?.roles)
  const organizationID = useSelector(({ shell }) => shell?.organizationId)
  let nestedRoles = rolesTab?.filter((el) => el?.hasSubModule)
  nestedRoles = nestedRoles?.map((el) => el?.hasSubModule)?.flat()
  const allRoles = [...rolesTab, ...nestedRoles]
  const findModule = allRoles?.find((module) => module?.path === path)
  const planningRoles = () => {
    if (
      roles?.includes(
        `target-subscription-store:${organizationID}:${findModule.roleOp}`,
      )
    ) {
      return 'operator'
    } else if (roles?.includes(findModule.roleJmcChair)) {
      return 'JMCC'
    } else if (
      roles?.includes(
        `target-subscription-store:${organizationID}:${findModule.roleTecSec}`,
      )
    ) {
      return 'TECOMS'
    } else if (
      roles?.includes(
        `target-subscription-store:${organizationID}:${findModule.roleFinSec}`,
      )
    ) {
      return 'FINCOMS'
    } else if (
      roles?.includes(
        `target-subscription-store:${organizationID}:${findModule.roleJmcSec}`,
      )
    ) {
      return 'JMCS'
    } else if (
      roles?.includes(
        `target-subscription-store:${organizationID}:${findModule.roleTecChair}`,
      )
    ) {
      return 'TECOMC'
    } else if (
      roles?.includes(
        `target-subscription-store:${organizationID}:${findModule.roleFinChair}`,
      )
    ) {
      return 'FINCOMC'
    } else if (roles?.includes(findModule.roleRe)) {
      return 'regulator'
    } else return null
  }

  const auditRoles = () => {
    if (
      roles?.includes(
        `target-subscription-store:${organizationID}:${findModule.roleAU}`,
      )
    ) {
      return 'AU'
    } else if (
      roles?.includes(
        `target-subscription-store:${organizationID}:${findModule.roleFP}`,
      )
    ) {
      return 'FP'
    } else if (
      roles?.includes(
        `target-subscription-store:${organizationID}:${findModule.roleAP}`,
      )
    ) {
      return 'AP'
    }
  }

  if (findModule && roles) {
    if (path === 'planning') {
      return planningRoles()
    } else if (path === 'audit') {
      return auditRoles()
    } else if (roles?.includes(findModule.roleRe)) {
      return 'regulator'
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
