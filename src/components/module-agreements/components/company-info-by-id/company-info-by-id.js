import companiesByOrganizationIDs from 'libs/queries/companies-by-org-id.gql'
import { graphql } from 'react-apollo'
import { get } from 'lodash-es'

const CompaniesInfoById = ({ organizations, children }) => {
  return <>{children && children(organizations)}</>
}

export default graphql(companiesByOrganizationIDs, {
  options: (props) => {
    return {
      context: { uri: `${PRODUCT_APP_URL_PROFILE}/graphql` },
      notifyOnNetworkStatusChange: true,
      variables: { organisationIDs: props?.organisationIDs?.filter(el => el !== '23') },
    }
  },
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
