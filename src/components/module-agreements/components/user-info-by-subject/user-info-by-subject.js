import seeUserProfileBySubject from 'libs/queries/user-profile-by-subject.gql'
import { graphql } from 'react-apollo'
import { get } from 'lodash-es'

const UserInfoBySubject = ({ userProfile, children }) => {
  return <>{children && children(userProfile)}</>
}

export default graphql(seeUserProfileBySubject, {
  options: (props) => ({
    context: { uri: `${PRODUCT_APP_URL_PROFILE}/graphql` },
    notifyOnNetworkStatusChange: true,
    variables: { subject: get(props, 'subject', null) },
  }),
  props: (response) => {
    return {
      userProfile: get(response, 'data.seeUserProfileBySubject.user', {}),
    }
  },
  skip: (props) => !get(props, 'subject', null),
})(UserInfoBySubject)
