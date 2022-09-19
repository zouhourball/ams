import { Component } from 'react'
import { graphql } from 'react-apollo'
import { has } from 'lodash-es'
import userProfileBySubject from 'libs/queries/userprofile-by-subject.gql'

@graphql(userProfileBySubject, {
  options: ownProps => {
    const { subject } = ownProps
    return {
      context: {
        uri: `${PRODUCT_APP_URL_PROFILE}/graphql`,
      },
      variables: { subject: subject },
    }
  },
  skip: props => {
    return !props.subject
  },

  props: response => {
    return {
      userProfileData: response.data,
      reFetchProfile: response.data.refetch,
      profileLoading: response.data.loading,
    }
  },
})
export default class UserInfos extends Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  render () {
    const { userProfileData, children } = this.props
    const usableData = has(userProfileData, 'seeUserProfileBySubject.user')
      ? userProfileData.seeUserProfileBySubject.user
      : null
    if (usableData) return children(usableData)
    else return null
  }
}
