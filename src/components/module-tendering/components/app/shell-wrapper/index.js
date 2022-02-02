import { Component } from 'react'
import { graphql } from 'react-apollo'
import { get as getLodash } from 'lodash-es'
import { AppShell } from '@target-energysolutions/app-shell'
import { cleanUp } from '@target-energysolutions/hoc-oauth'
import { Router, Redirect, navigate } from '@reach/router'
import { get } from 'tiny-cookie'
import { AuthCheckContext } from '@target-energysolutions/auth-check'
import { connect } from 'react-redux'
import { Snackbar } from 'react-md'
// import { format } from 'date-fns'

import Home from 'components/home'
import {
  IntlContext,
  ContentContext,
} from 'components/app/shell-wrapper/context'

import { withTranslationEx } from 'libs/langs'
import { getAuthToken } from 'libs/utils/oauth-token'
import meQuery from 'libs/queries/me-query.gql'
import { extractUserInfos } from 'utils/extract-user-infos'
import * as act from 'modules/app/actions'
import { validURL } from 'libs/utils/custom-function'

import './styles.scss'

@connect(
  ({ app, shell }) => ({
    organizationID: shell.organizationId,
    toasts: app.toasts,
  }),
  {
    setUserInfos: act.setUserInfos,
    addToast: act.addToast,
    dismissToast: act.dismissToast,
  },
)
@graphql(meQuery, {
  options: (props) => {
    return {
      notifyOnNetworkStatusChange: true,
      context: {
        uri: `${PRODUCT_WORKSPACE_URL}/graphql`,
      },
    }
  },
  props: ({ data, ownProps: { setUserInfos } }) => {
    let userInfos = null
    if (data.mev2 && data.mev2.user && data.mev2.user.profile) {
      userInfos = extractUserInfos({
        id: data.mev2.user.id,
        subject: data.mev2.user.subject,
        profile: data.mev2.user.profile,
        roles: data.mev2.roles,
        isEnterprise: data.mev2.isEnterpriseUser,
      })
      setUserInfos(userInfos) // save userInfos to redux state.app for use elsewhere
    }
    const me = getLodash(data, 'mev2')
    return { userInfos, me }
  },
})
@withTranslationEx
export default class AppShellWrapper extends Component {
  // componentDidMount() {
  //   if (process.env.NODE_ENV === 'production' && !get('workspaceId')) {
  //     window.location = PRODUCT_WORKSPACE_URL
  //   }
  //   if (
  //     process.env.NODE_ENV === 'development' &&
  //     (!get('workspaceId') || !get('workspaceName'))
  //   ) {
  //     set('workspaceId', '313')
  //     set('workspaceName', 'First-wokspace')
  //   }
  // }
  // componentDidMount = () => {
  //   const { organizationID } = this.props
  //   if (
  //     process.env.NODE_ENV === 'production' &&
  //     !(organizationID || get('organizationId'))
  //   ) {
  //     window.location = PRODUCT_WORKSPACE_URL
  //   }
  //   if (process.env.NODE_ENV === 'development') {
  //     localStorage.setItem('organizationId', 187)
  //   }
  // }
  signOut = () => {
    cleanUp()
    window.location.href = '/'
    // this.props.clearMessages()
  }
  static contextType = AuthCheckContext

  state = {
    wsID: null,
    navBarCollapsed: true,
  }

  static getDerivedStateFromProps (props) {
    const [, subModule] = props.location.pathname.split('/')
    return {
      activeNavSubModule: subModule,
    }
  }

  handleNavModChange = ({ subModule }) => {
    this.setState({
      activeNavSubModule: subModule,
    })
    this.handleNavigateJump(subModule)
  }
  handleNavigateJump = (value) => {
    navigate(`/${value}`)
  }
  render () {
    const {
      organizationID,
      me,
      toasts,
      dismissToast,
      t,
      lang,
      changeLanguage,
      langs,
    } = this.props
    // const token = getAccessToken()
    const { activeNavSubModule } = this.state
    const token = getAuthToken()
    const orgId = organizationID || get('organizationId')
    return (
      <IntlContext.Provider value={lang}>
        <ContentContext.Provider
          value={{
            me,
            token,
            locale: lang,
          }}
        >
          <AppShell
            config={{
              wsHost: PRODUCT_WORKSPACE_URL,
            }}
            actionMenus={[
              {
                primaryText: t('signout'),
                onClick: this.signOut,
              },
            ]}
            notificationAPI={PRODUCT_APP_URL_API}
            accessToken={token}
            // navModules={[
            //   {
            //     key: 'tendering',
            //     label: 'Tendering',
            //     submodules: [],
            //   },
            // ]}
            // onNotificationItemClick={this.handleNotificationItemClick}
            // activeNavModules={['accounts', activeNavSubModule]}
            activeNavModule={'tendering'}
            activeNavSubModule={activeNavSubModule}
            // onViewNotificationAll={() => {
            //   window.location = `${PRODUCT_WORKSPACE_URL}/workspace/notification`
            // }}
            languages={langs}
            folioAPI={''}
            production="tendering"
            forcedLogoApp={''}
            lang={lang}
            onLangChange={changeLanguage}
            // onNavModuleChange={this.handleNavModChange}
            meTo={PRODUCT_APP_URL_PROFILE}
            disableSidebar={false}
            onModuleChange={this.handleModuleChange}
            meeraLogoUrl={`${PRODUCT_WORKSPACE_URL}/${
              orgId === '0' ? 'workspace' : 'enterprise/workspace'
            }`}
            apps={[
              'meeting',
              'taskManagement',
              'okr',
              'edge',
              'peopleSearch',
              'fileManager',
            ]}
            sideContent={true}
            productConfig={{
              workspace: PRODUCT_WORKSPACE_URL,
              media: MEETING_URL,
              configurator: PRODUCT_APP_URL_CONFIGURATOR,
              planner: PRODUCT_APP_URL_PLANNER,
              amc: PRODUCT_APP_URL_AMC,
              map: PRODUCT_APP_URL_MAP,
              hcm: PRODUCT_APP_URL_HCM,
              timesheet: PRODUCT_APP_URL_TIMESHEET,
              pulse: PRODUCT_APP_URL_PULSE,
              reach: PRODUCT_APP_URL_REACH,
              organisation: PRODUCT_APP_URL_ORGANIZATION,
              pdo: PRODUCT_APP_URL_PDO,
              csr: PRODUCT_APP_URL_CSR,
              was: PRODUCT_APP_URL_TROVE,
              okr: PRODUCT_APP_URL_OKR,
              profile: PRODUCT_APP_URL_PROFILE,
              meeting: MEETING_URL,
              crm: PRODUCT_APP_URL_CRM,
              sso: OAUTH_HOST,
              bi: PRODUCT_APP_URL_BI,
              psa: PRODUCT_APP_URL_PSA,
              regulation: PRODUCT_APP_URL_REGULATION,
              peopleanalytics: PRODUCT_APP_URL_PEOPLEANALYTICS,
            }}
            envURL={
              validURL(BASE_ENV_URL) ? BASE_ENV_URL : PRODUCT_WORKSPACE_URL
            }
            routes={
              <div className="app-shellwrapper-container">
                <div className="app-shellwrapper-content">
                  <Router>
                    <Redirect from="/" to="/tendering" noThrow />
                    <Home path="/tendering/*" />
                  </Router>
                </div>
              </div>
            }
          />
        </ContentContext.Provider>
        <Snackbar autohide toasts={toasts} onDismiss={dismissToast} />
      </IntlContext.Provider>
    )
  }
  // handleNotificationItemClick = item => {
  //   const { data: itemData } = item
  //   let { action, url, moduleName, workspaceId, startDate } = itemData || {}
  //   const { productName, body } = item
  //   if (productName === 'meetings' && body.includes('removed')) return
  //   if (moduleName === 'meeting' && action === 'popup') {
  //     location.href = `${PRODUCT_WORKSPACE_URL}/meetings?cat=new&date=${format(
  //       startDate || new Date(),
  //       'YYYY-MM-DD',
  //     )}&wsid=${workspaceId}`
  //     return
  //   }
  //   if (moduleName === 'message') {
  //     const { workspaceId } = itemData
  //     location.href = `${PRODUCT_WORKSPACE_URL}/workspace/details/${workspaceId}`
  //     return
  //   }
  //   if (url) {
  //     if (validURL(url)) {
  //       location.href = url
  //     } else {
  //       url = url[0] === '/' ? url : `/${url}`
  //       location.href = url
  //     }
  //   }
  // }
  handleModuleChange = (key, { jumpUrl }) => {
    if (jumpUrl.startsWith('http')) {
      location.href = jumpUrl
    } else {
      const [prefix] = jumpUrl
      navigate(prefix === '/' ? jumpUrl : '/' + jumpUrl)
    }
  }
}
