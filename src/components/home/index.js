import { lazy, Suspense, useState } from 'react'

import { Router, Redirect } from '@reach/router'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'

import { PrimeContext } from 'components/app/context'

import './style.scss'

const Permitting = lazy(() => import('components/module-permitting'))
const Audit = lazy(() => import('components/audit-module'))
// const Agreement = lazy(() => import('components/module-agreements'))
// const TenderingModule = lazy(() => import('components/module-tendering'))
const InventoryHome = lazy(() => import('components/module-inventory'))
const Downstream = lazy(() => import('components/module-downstream'))
const Planning = lazy(() => import('components/module-planning'))
const CostRecovery = lazy(() => import('components/module-cost-recovery'))
const HSE = lazy(() => import('components/module-hse'))
const Reserves = lazy(() => import('components/module-reserves'))
const Production = lazy(() => import('components/module-production'))
const ConfiguratorPage = lazy(() => import('components/configurator-page'))
const HomeAgreement = lazy(() => import('components/module-agreements/components/home-agreement'))

const queryClient = new QueryClient()

const Home = ({ location: { pathname }, defaultModule }) => {
  const [vision, setVision] = useState(false)
  const [mission, setMission] = useState(false)

  const loader = (
    <div className="loadingWrapper">
      <div className="loadingWrapper-bg"></div>
    </div>
  )
  return (
    <PrimeContext.Provider value={{ vision, mission, setVision, setMission }}>
      <QueryClientProvider client={queryClient}>
        <div className="module-container">
          <Suspense fallback={loader}>
            <Router>
              <Redirect from="/" to={`/ams/${defaultModule}`} noThrow />
              {/* <Div path="/test">AMS</Div> */}
              <Production path="/production/*" />
              <Reserves path="/reserves/*" />
              <HSE path="/hse/*" />
              <CostRecovery path="/costrecovery/*" />
              <Planning path="/planning/*" />
              <Permitting path="/permitting/*" />
              <Downstream path="/downstream/*" />
              <InventoryHome path="/inventory/*" />
              {/* <TenderingModule path="/tendering/*" /> */}
              <HomeAgreement path="/agreement/*" />
              <Audit path="/audit/*" />
              <ConfiguratorPage path="/configurator" />
            </Router>
          </Suspense>
        </div>
        <ReactQueryDevtools initialIsOpen={false} position="top-left" />
      </QueryClientProvider>
    </PrimeContext.Provider>
  )
}
export default Home
