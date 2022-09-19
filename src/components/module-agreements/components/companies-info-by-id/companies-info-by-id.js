import companiesByID from 'libs/queries/companies-by-id.gql'
import { graphql } from 'react-apollo'
import { get } from 'lodash-es'

const CompaniesInfoById = ({ organizations, children }) => {
  return <>{children && children(organizations)}</>
}

export default graphql(companiesByID, {
  options: (props) => ({
    context: { uri: `${PRODUCT_APP_URL_PROFILE}/graphql` },
    notifyOnNetworkStatusChange: true,
    variables: { organisationIDs: get(props, 'organisationIDs', null) },
  }),
  props: (response) => {
    return {
      organizations: get(
        response,
        'data.companiesByOrganisationIDs',
        [],
      ).filter((elem) => !!elem),
    }
  },
})(CompaniesInfoById)
