import { getCompanyInfo } from 'libs/api/configurator-api'
import { useQuery } from 'react-query'
import { useSelector } from 'react-redux'

const getCompanyInfos = () => {
  const orgId = useSelector(({ shell }) => shell?.organizationId)

  const { data: organization } = useQuery(
    ['getCompanyInfo', orgId],
    getCompanyInfo,
    {
      refetchOnWindowFocus: false,
      enabled: !!orgId,
    },
  )
  return organization?.[0]
}

export default getCompanyInfos
