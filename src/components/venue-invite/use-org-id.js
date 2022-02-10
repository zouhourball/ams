import { useSelector } from 'react-redux'

export const useOrgId = () => {
  const { organizationId } = useSelector((store) => store.shell)
  return organizationId
}
