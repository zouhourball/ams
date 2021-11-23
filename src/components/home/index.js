import { lazy, Suspense, useState } from 'react'

import { Router, Redirect } from '@reach/router'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'

import { PrimeContext } from 'components/app/context'

import './style.scss'

const Permitting = lazy(() => import('components/module-permitting'))
const Audit = lazy(() => import('components/module-audit'))
const Agreement = lazy(() => import('components/module-agreements'))
const Tendering = lazy(() => import('components/module-tendering'))
const Inventory = lazy(() => import('components/module-inventory'))
const Downstream = lazy(() => import('components/module-downstream'))
const Planning = lazy(() => import('components/module-planning'))
const CostRecovery = lazy(() => import('components/module-cost-recovery'))
const HSE = lazy(() => import('components/module-hse'))
const Reserves = lazy(() => import('components/module-reserves'))
const Production = lazy(() => import('components/module-production'))

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
              <Planning path="/planning" />
              <Permitting path="/permitting/*" />
              <Downstream path="/downstream" />
              <Inventory path="/inventory" />
              <Tendering path="/tendering" />
              <Agreement path="/agreement" />
              <Audit path="/audit" />
            </Router>
          </Suspense>
        </div>
        <ReactQueryDevtools initialIsOpen={false} position="top-left" />
      </QueryClientProvider>
    </PrimeContext.Provider>
  )
}
export default Home
