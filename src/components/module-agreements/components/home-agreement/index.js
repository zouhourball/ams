import { useState, useEffect } from 'react'
import { Router, navigate, Redirect } from '@reach/router'
import { Button } from 'react-md'
import { connect } from 'react-redux'
import { get } from 'lodash-es'

import TopBar from 'components/module-agreements/components/top-bar'
import MainContentManager from 'components/module-agreements/components/main-content-manager'
import PSA from 'components//module-agreements/components/psa'
import PSAgreement from 'components/module-agreements/components/psa-agreement'
import Visualiser from 'components/module-agreements/images/topBar/Visualiser.svg'
import dashboard from 'components/module-agreements/images/topBar/dashboard.svg'
// import newPsa from 'components/module-agreements/images/topBar/new-psa.svg'
import NotFound from 'components/module-agreements/components/not-found'
import { useTranslation } from 'libs/langs'

import './style.scss'

const HomeAgreement = ({ location: { pathname }, roles, organizationId }) => {
  const { t } = useTranslation()
  const [isVisibleTopBar, setIsVisibleTopBar] = useState(true)
  const [subSectionLabel, setSubsectionLabel] = useState('visualizer')

  useEffect(() => {
    const urlSubs = pathname.split('/').filter((pth) => pth)

    if (urlSubs.length === 3 && urlSubs[2] === 'content') {
      setIsVisibleTopBar(true)
      setSubsectionLabel('visualizer')
    }
    if (urlSubs.length === 3 && urlSubs[2] === 'configurator') {
      setSubsectionLabel('configurator')
      setIsVisibleTopBar(true)
    }
  }, [pathname])
  useEffect(() => {
    const urlSubs = pathname.split('/').filter((pth) => pth)
    if (!hasRoleConfigurator() && urlSubs[2] === 'configurator') {
      navigate('/')
    }
  }, [organizationId])
  const [view, setView] = useState('card')

  const hasRoleConfigurator = () => {
    return roles.includes(
      `target-subscription-store:${organizationId}:target:psa:configurator`,
    )
  }
  const renderActionsButton = () => {
    if (subSectionLabel === 'visualizer' && hasRoleConfigurator()) {
      return (
        <Button
          primary
          key={'cnp'}
          // iconEl={<img src={newPsa} width="18px" />}
          className="add-psa-btn"
          flat
          onClick={() => handelOnClickItem('new agreement')}
        >
          {t('create_new')}
        </Button>
      )
    } else {
      return null
    }
  }
  const renderSubSections = () => {
    let subMenus = [
      {
        key: 'visualizer',
        text: t('visualizer'),
        icon: Visualiser,
        onClick: () => navigate('/ams/agreement/content'),
      },
      {
        key: 'dashboard',
        text: t('dashboard'),
        icon: dashboard,
        onClick: () => navigate(`${PRODUCT_APP_URL_AMC}/psc/dashboard`),
      },
    ]
    if (hasRoleConfigurator()) {
      subMenus = [
        ...subMenus,
        {
          key: 'configurator',
          text: t('configurator'),
          icon: 'settings',
          onClick: () => navigate('/ams/agreement/configurator'),
        },
      ]
    }

    return subMenus
  }

  const handelOnClickItem = (item) => {
    switch (item) {
      case 'new agreement':
        navigate('/ams/agreement/content/new')
        break
    }
  }
  const renderTo = () => {
    // return '/agreement/content'

    if (hasRoleConfigurator()) {
      return '/ams/agreement/configurator'
    } else {
      return '/ams/agreement/content'
    }
  }
  return (
    <div className="psa-container">
      {isVisibleTopBar && (
        <TopBar
          subSection={renderSubSections()}
          subSectionLabel={subSectionLabel}
          withSwitch
          view={view}
          onSwitchView={setView}
          actionButtons={renderActionsButton()}
          onClickFilter={() => {}}
        />
      )}

      <div
        className={`main-content ${isVisibleTopBar ? '' : 'no-Bar'} ${
          pathname.includes('/content/current/') ? 'psa-page' : ''
        }`}
      >
        <Router>
          <NotFound default />
          <Redirect from="/" to={renderTo()} noThrow />
          {hasRoleConfigurator() && (
            <PSA path="/configurator" organizationId={organizationId} />
          )}
          <MainContentManager path="/content" view={view} />
          <PSAgreement
            path="/content/new"
            setIsVisibleTopBar={() => setIsVisibleTopBar(false)}
          />
          <PSAgreement
            path="/content/current/:agreementId"
            setIsVisibleTopBar={() => setIsVisibleTopBar(false)}
          />
          <PSAgreement
            path="/content/current/:agreementId/:activityId/:activityName"
            setIsVisibleTopBar={() => setIsVisibleTopBar(false)}
          />
        </Router>
      </div>
    </div>
  )
}
export default connect(({ query, shell }) => ({
  roles: get(query, 'DEFAULT.me.data.roles', []),

  organizationId: get(shell, 'organizationId', null),
}))(HomeAgreement)
