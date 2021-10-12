import 'styles/index.scss'
import 'normalize.css'

import { render } from 'react-dom'
import { navigate } from '@reach/router'

// import { initAxiosInterceptors } from 'libs/utils/axios-interceptors'
import { initOauthHelper } from 'libs/utils/oauth'
import configureStore from 'libs/store'
import configureApolloClient from 'libs/apollo'

import Root from 'components/root'

initOauthHelper(navigate)
// initAxiosInterceptors()

const store = configureStore()
const apolloClient = configureApolloClient()

render(
  <Root store={store} apolloClient={apolloClient} />,
  document.getElementById('root'),
)
