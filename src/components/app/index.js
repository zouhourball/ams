import { Component } from 'react'
import { graphql } from 'react-apollo'
import { get as getLodash } from 'lodash-es'
import { AppShellSide } from '@target-energysolutions/app-shell'
import { cleanUp } from '@target-energysolutions/hoc-oauth'
import { Router, Redirect, navigate } from '@reach/router'
import { AuthCheckContext } from '@target-energysolutions/auth-check'
import { connect } from 'react-redux'
import { Snackbar, SVGIcon } from 'react-md'
import query from 'react-hoc-query'
import { getFSToken } from 'libs/api'
import { subModules } from './helpers'
import { rolesTab } from 'libs/roles-tab'

// import { format } from 'date-fns'

import Home from 'components/home'
import { IntlContext, ContentContext } from 'components/app/context'

import { useSupportedLangs, withTranslationEx } from 'libs/langs'
import { getAuthToken } from 'libs/utils/oauth-token'
import meQuery from 'libs/queries/me-query.gql'
import { extractUserInfos } from 'utils/extract-user-infos'
import * as act from 'modules/app/actions'
import { validURL } from 'libs/utils/custom-function'
// import { userRole } from 'components/shared-hook/get-roles'

import './styles.scss'

@query({
  key: 'getFSToken',
  op: getFSToken,
  name: 'getFSToken',
})
@connect(
  ({ app, shell, query }) => ({
    organizationID: shell.organizationId,
    toasts: app.toasts,
    visibleLoader: app.visibleLoader,
    roles: query?.DEFAULT?.me?.data?.roles,
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
  componentDidMount = () => {
    const { lang } = this.props
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
  }
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

  renderMenus = () => {
    const { organizationID, roles } = this.props
    const basedRoleSubMenus = []
    if (roles) {
      rolesTab.forEach(({ key, roleOp, roleRe, path }) => {
        if (
          roles.includes(
            `target-subscription-store:${organizationID}:${roleOp}`,
          )
        ) {
          basedRoleSubMenus.push({
            ...subModules.find((sM) => sM.key === key),
            path,
          })
        } else if (roles.includes(roleRe)) {
          basedRoleSubMenus.push({
            ...subModules.find((sM) => sM.key === key),
            path,
          })
        }
      })
      if (
        roles.includes('sys:admin') ||
        roles.includes('target-subscription-store:superadmin')
      ) {
        basedRoleSubMenus.push({
          ...subModules.find((sM) => sM.key === 'config'),
          path: 'configurator',
        })
      }
    }

    return basedRoleSubMenus
  }
  render () {
    const {
      // organizationID,
      me,
      toasts,
      dismissToast,
      t,
      lang,
      changeLanguage,
      // langs,
    } = this.props
    const newSubModules = this.renderMenus()
    // const token = getAccessToken()
    // const { activeNavSubModule } = this.state
    const token = getAuthToken()
    // const orgId = organizationID || get('organizationId')
    const actionMenus = [
      {
        primaryText: 'Manage Accounts',
        onClick: () => navigate('/talent/accounts'),
      },
      {
        key: 'signout',
        primaryText: t('signout'),
        primaryTextStyle: { color: '#f44336' },
        onClick: this.signOut,
      },
    ]
    // const attrBasedOnRole =
    //   userRole() === 'operator'
    //     ? {
    //       subModules: [
    //         {
    //           key: 'flaring',
    //           name: 'Flaring',
    //           onClick: () => navigate('/ams/hse/flaring'),
    //         },
    //         {
    //           key: 'hsse',
    //           name: 'HSSE',
    //           onClick: () => navigate('/ams/hse/hsse'),
    //         },
    //         {
    //           key: 'emissions',
    //           name: 'Emissions',
    //           onClick: () => navigate('/ams/hse/emissions'),
    //         },
    //       ],
    //     }
    //     : { onClick: () => navigate('/ams/hse') }

    return (
      <IntlContext.Provider value={lang}>
        <ContentContext.Provider
          value={{
            me,
            token,
            locale: lang,
          }}
        >
          <WSAppShell
            disableSidebar={true}
            // refetchWs={refetchWs}
            actionMenus={actionMenus}
            notificationAPI={PRODUCT_APP_URL_API}
            accessToken={token}
            activeModule={'ams'}
            onSideCollapsedClick={this.handleSideCollapsedClick}
            onModuleChange={this.handleModuleChange}
            sideContent={<div />}
            // searchText={searchText}
            // searchPlaceholder={search && search.placeholder}
            onSearchChange={() => {}}
            navigateToHome={this.handleNavigateToHome}
            production="talent"
            productConfig={{
              workspace: PRODUCT_WORKSPACE_URL,
              media: MEETING_URL,
              configurator: PRODUCT_APP_URL_CONFIGURATOR,
              // planner: PRODUCT_APP_URL_PLANNER,
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
            onLogOut={this.signOut}
            modules={{
              extraApps: [
                {
                  key: 'new-ams',
                  name: 'ams',
                  onClick: () => null,
                  icon: (
                    <SVGIcon viewBox={'0 0 16 19'}>
                      <path
                        d="M8.14614382,2.00769231 C11.1605284,2.00769231 13.7847207,3.67676923 15.1461438,6.14088462 C15.0140284,6.23892308 14.8952592,6.35596154 14.7948746,6.48976923 L14.7948746,6.48976923 L13.4100284,8.33623077 C12.7025669,6.10284615 10.6105284,4.4795 8.14614382,4.4795 C5.10210535,4.4795 2.62564382,6.956 2.62564382,10 C2.62564382,13.044 5.10210535,15.5205 8.14614382,15.5205 C10.6105284,15.5205 12.7025669,13.8971538 13.4100284,11.6637692 L13.4100284,11.6637692 L14.794913,13.5103077 C14.8952592,13.6441154 15.0140284,13.7611154 15.1461438,13.8591538 C13.7847207,16.3232692 11.1605284,17.9923077 8.14614382,17.9923077 C3.73210535,17.9923077 0.153836124,14.4140385 0.153836124,10 C0.153836124,5.58596154 3.73210535,2.00769231 8.14614382,2.00769231 Z M8.14614382,5.63334615 C10.3583746,5.63334615 12.1914515,7.287 12.4746438,9.42307692 L12.4746438,9.42307692 L11.139413,9.42307692 C10.868913,8.01703846 9.62995151,6.95126923 8.14614382,6.95126923 C6.46506689,6.95126923 5.09741305,8.31892308 5.09741305,10 C5.09741305,11.6810769 6.46506689,13.0487308 8.14614382,13.0487308 C9.62995151,13.0487308 10.868913,11.9829615 11.139413,10.5769231 L11.139413,10.5769231 L12.4746438,10.5769231 C12.1914515,12.713 10.3583746,14.3666538 8.14614382,14.3666538 C5.73833612,14.3666538 3.77948997,12.4077692 3.77948997,10 C3.77948997,7.59223077 5.73833612,5.63334615 8.14614382,5.63334615 Z M19.2692207,6.95126923 C19.4877592,6.95126923 19.6875284,7.07473077 19.7852592,7.27019231 C19.88299,7.46565385 19.8618746,7.69953846 19.7307592,7.87434615 L19.7307592,7.87434615 L18.1365284,10 L19.7307592,12.1256538 C19.8618746,12.3004615 19.88299,12.5343462 19.7852592,12.7298077 C19.68749,12.9252692 19.4877592,13.0487308 19.2692207,13.0487308 L19.2692207,13.0487308 L16.17949,13.0487308 C15.997913,13.0487308 15.826913,12.9632308 15.7179515,12.8179615 L15.7179515,12.8179615 L13.8641054,10.3461538 C13.7102592,10.1410385 13.7102592,9.85896154 13.8641054,9.65384615 L13.8641054,9.65384615 L15.7179515,7.18203846 C15.826913,7.03676923 15.997913,6.95126923 16.17949,6.95126923 L16.17949,6.95126923 Z M8.14614382,8.10511538 C8.98983612,8.10511538 9.7062592,8.65953846 9.95091305,9.42307692 L9.95091305,9.42307692 L8.14614382,9.42307692 C7.82752843,9.42307692 7.56922074,9.68138462 7.56922074,10 C7.56922074,10.3186154 7.82752843,10.5769231 8.14614382,10.5769231 L8.14614382,10.5769231 L9.95091305,10.5769231 C9.7062592,11.3404615 8.98987459,11.8948846 8.14614382,11.8948846 C7.10129766,11.8948846 6.2512592,11.0448462 6.2512592,10 C6.2512592,8.95515385 7.10129766,8.10511538 8.14614382,8.10511538 Z"
                        strokeWidth=".5"
                        fillRule="nonzero"
                      />
                    </SVGIcon>
                  ),
                  subModules: newSubModules,
                },
              ],
            }}
            envURL={
              validURL(BASE_ENV_URL) ? BASE_ENV_URL : PRODUCT_WORKSPACE_URL
            }
            apps={[
              'meeting',
              'taskManagement',
              'okr',
              'edge',
              'peopleSearch',
              'fileManager',
              'planner',
            ]}
            onNewNotification={this.handleNewNotification}
            meeraLogoUrl="/"
            meTo={ENV_VAR_ME_TO}
            lang={lang}
            onLangChange={changeLanguage}
            // onHelpClick={toggleHelpGuide}
            onLogoClick={this.handleLogoClick}
            routes={
              <div className="app-shellwrapper-container">
                <div className="app-shellwrapper-content">
                  <DynamicApp path={newSubModules[0]?.path} />
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
      if (jumpUrl) {
        const [prefix] = jumpUrl
        navigate(prefix === '/' ? jumpUrl : '/' + jumpUrl)
      }
    }
  }
}

export function WSAppShell (props) {
  const langs = useSupportedLangs()

  return <AppShellSide languages={langs} {...props} />
}

const DynamicApp = ({ path }) => {
  if (!path) {
    return null
  }
  return (
    <Router>
      <Redirect from="/" to="/ams" noThrow />

      <Home path="/ams/*" defaultModule={path} />
    </Router>
  )
}
