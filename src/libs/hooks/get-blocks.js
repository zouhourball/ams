import { useQuery } from 'react-query'
import { useSelector } from 'react-redux'

import { getBlockByOrgId } from 'libs/api/configurator-api'

const getBlocks = () => {
  const orgId = useSelector(({ shell }) => shell?.organizationId)
  const { data: blocks } = useQuery(
    ['getBlockByOrgId', orgId],
    getBlockByOrgId,
    {
      refetchOnWindowFocus: false,
      enabled: !!orgId,
    },
  )
  return blocks
}

export default getBlocks
