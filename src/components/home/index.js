import { Suspense, useState } from 'react'

import { Router, Redirect } from '@reach/router'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'

import { PrimeContext } from 'components/app/context'

import './style.scss'
import Production from 'components/module-production'
import Reserves from 'components/module-reserves'
import HSE from 'components/module-hse'
import CostRecovery from 'components/module-cost-recovery'
import Planning from 'components/module-planning'
import Permitting from 'components/module-permitting'
import Downstream from 'components/module-downstream'
import Inventory from 'components/module-inventory'
import Tendering from 'components/module-tendering'
import Agreement from 'components/module-agreements'
import Audit from 'components/module-audit'

const queryClient = new QueryClient()

const Home = ({ location: { pathname }, defaultModule = 'production' }) => {
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
        <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
      </QueryClientProvider>
    </PrimeContext.Provider>
  )
}
export default Home
