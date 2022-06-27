import companyByID from 'libs/queries/company-by-id.gql'
import { graphql } from 'react-apollo'
import { get } from 'lodash-es'

const CompanyInfoById = ({ organization, children }) => {
  return <>{children && children(organization)}</>
}

export default graphql(companyByID, {
  options: (props) => ({
    context: { uri: `${PRODUCT_APP_URL_PROFILE}/graphql` },
    notifyOnNetworkStatusChange: true,
    variables: { organisationID: get(props, 'organisationID', null) },
  }),
  props: (response) => {
    return {
      organization: get(response, 'data.companyByID', {}),
    }
  },
})(CompanyInfoById)
