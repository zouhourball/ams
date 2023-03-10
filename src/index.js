/* eslint-disable jest/require-hook */
import 'styles/index.scss'
import 'normalize.css'

import { render } from 'react-dom'
import { navigate } from '@reach/router'

// import { initAxiosInterceptors } from 'libs/utils/axios-interceptors'
import { initOauthHelper } from 'libs/utils/oauth'
import store from 'libs/store'
import configureApolloClient from 'libs/apollo'

import Root from 'components/root'

// eslint-disable-next-line no-console
console.log(`GIT COMMIT HASH - ${GIT_COMMIT_HASH}`)

initOauthHelper(navigate)
// initAxiosInterceptors()

const apolloClient = configureApolloClient()

render(
  <Root store={store} apolloClient={apolloClient} />,
  document.getElementById('root'),
)
