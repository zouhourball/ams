import { useEffect, memo } from 'react'
import { useQuery } from 'react-apollo'
import { get as getLodash } from 'lodash-es'
import { AppShellSide } from '@target-energysolutions/app-shell'
import { cleanUp } from '@target-energysolutions/hoc-oauth'

import { Router, Redirect } from '@reach/router'

import { useSelector, useDispatch } from 'react-redux'
import { Snackbar, SVGIcon } from 'react-md'
// import query from 'react-hoc-query'
// import { getFSToken } from 'libs/api'
import { subModules, attrBasedOnRole } from './helpers'
import { rolesTab } from 'libs/roles-tab'

// import { format } from 'date-fns'

import Home from 'components/home'

import TenderingModule from 'components/module-tendering'

import { IntlContext, ContentContext } from 'components/app/context'

import { useSupportedLangs } from 'libs/langs'
import { getAuthToken } from 'libs/utils/oauth-token'
import meQuery from 'libs/queries/me-query.gql'

import * as act from 'modules/app/actions'
import { validURL } from 'libs/utils/custom-function'
// import { userRole } from 'components/shared-hook/get-roles'
import * as cookies from 'tiny-cookie'

import './styles.scss'

const DynamicApp = memo(({ path }) => {
  if (!path) {
    return null
  }
  return (
    <Router>
      <Redirect from="/" to="/ams" noThrow />

      <Home path="/ams/*" defaultModule={path} />
      <TenderingModule path="/tendering/*" />
    </Router>
  )
})

const Shell = ({ lang }) => {
  const langs = useSupportedLangs()
  const { data } = useQuery(meQuery, {
    notifyOnNetworkStatusChange: true,
    context: {
      uri: `${PRODUCT_WORKSPACE_URL}/graphql`,
    },
  })
  const { organizationID, toasts, roles } = useSelector(
    ({ app, shell, query }) => ({
      organizationID: shell.organizationId,
      toasts: app.toasts,
      visibleLoader: app.visibleLoader,
      roles: query?.DEFAULT?.me?.data?.roles,
      query: query,
    }),
  )
  const dispatch = useDispatch()

  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
  }, [])
  const signOut = () => {
    cleanUp()
    window.location.href = '/'
    if (process.env.NODE_ENV === 'development') {
      localStorage.setItem('organizationId', '')
    } else {
      cookies.set('organizationId', '')
    }
    // this.props.clearMessages()
  }
  const me = getLodash(data, 'mev2')
  const renderMenus = () => {
    const basedRoleSubMenus = []
    if (roles) {
      // debugger
      rolesTab.forEach(
        ({
          key,
          roleOp,
          roleRe,
          roleAU,
          roleFP,
          roleAP,
          roleCh,
          roleMe,
          roleConf,
          path,
          hasSubModule,
        }) => {
          if (hasSubModule) {
            const moduleS = { ...subModules.find((sM) => sM.key === key) }

            let subM = []
            if (moduleS) {
              hasSubModule.forEach(({ key, roleOp, roleRe, roleCh, path }) => {
                if (
                  roles.includes(
                    `target-subscription-store:${organizationID}:${roleOp}`,
                  ) ||
                  roles.includes(
                    `target-subscription-store:${organizationID}:target:${roleConf}`,
                  )
                ) {
                  subM.push({
                    ...attrBasedOnRole.find((sM) => sM.key === key),
                    path,
                  })
                } else if (roles.includes(roleRe)) {
                  subM.push({
                    ...attrBasedOnRole.find((sM) => sM.key === key),
                    path,
                  })
                } else if (
                  roles.includes(
                    `target-subscription-store:${organizationID}:${roleCh}`,
                  )
                ) {
                  subM.push({
                    ...attrBasedOnRole.find((sM) => sM.key === key),
                    path,
                  })
                }
              })
              if (subM.length > 0) {
                moduleS.subModules = subM
                basedRoleSubMenus.push({ ...moduleS })
              }
            }
          } else if (
            roles.includes(
              `target-subscription-store:${organizationID}:${roleOp}`,
            ) ||
            roles.includes(
              `target-subscription-store:${organizationID}:${roleAU}`,
            ) ||
            roles.includes(
              `target-subscription-store:${organizationID}:${roleFP}`,
            ) ||
            roles.includes(
              `target-subscription-store:${organizationID}:${roleAP}`,
            )
          ) {
            basedRoleSubMenus.push({
              ...subModules.find((sM) => sM.key === key),
              path,
            })
          } else if (
            roles.includes(
              `target-subscription-store:${organizationID}:${roleCh}`,
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
          } else if (roles.includes(roleMe) || roles.includes(roleCh)) {
            basedRoleSubMenus.push({
              ...subModules.find((sM) => sM.key === key),
              path,
            })
          }
        },
      )
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
    return basedRoleSubMenus?.filter((el) => el?.path !== 'regulation')
  }
  const newSubModules = renderMenus()

  const token = getAuthToken()

  const actionMenus = []

  return (
    <IntlContext.Provider value={lang}>
      <ContentContext.Provider
        value={{
          me,
          token,
          locale: lang,
        }}
      >
        <AppShellSide
          // refetchWs={refetchWs}
          languages={langs}
          actionMenus={actionMenus}
          notificationAPI={PRODUCT_APP_URL_API}
          accessToken={token}
          activeModule={'ams'}
          // onSideCollapsedClick={this.handleSideCollapsedClick}
          // onModuleChange={this.handleModuleChange}
          sideContent={<div />}
          // searchText={searchText}
          // searchPlaceholder={search && search.placeholder}
          onSearchChange={() => {}}
          // navigateToHome={this.handleNavigateToHome}
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
          envURL={validURL(BASE_ENV_URL) ? BASE_ENV_URL : PRODUCT_WORKSPACE_URL}
          apps={[
            'meeting',
            'taskManagement',
            'okr',
            'edge',
            'peopleSearch',
            'fileManager',
            'planner',
          ]}
          // onNewNotification={this.handleNewNotification}
          meeraLogoUrl="/"
          onSignOut={() => signOut()}
          meTo={ENV_VAR_ME_TO}
          lang={lang}
          onLangChange={act.changeLanguage}
          // onHelpClick={toggleHelpGuide}
          // onLogoClick={this.handleLogoClick}
          routes={
            <div className="app-shellwrapper-container">
              <div className="app-shellwrapper-content">
                <DynamicApp path={newSubModules[0]?.path} />
              </div>
            </div>
          }
        />
      </ContentContext.Provider>
      <Snackbar
        autohide
        toasts={toasts}
        onDismiss={() => dispatch(act.dismissToast())}
      />
    </IntlContext.Provider>
  )
}

export default Shell
