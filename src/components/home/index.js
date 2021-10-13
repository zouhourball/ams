import { Suspense, useState } from 'react'

import { Router, Redirect } from '@reach/router'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'

import { PrimeContext } from 'components/app/context'

import './style.scss'

const queryClient = new QueryClient()

const Home = ({ location: { pathname } }) => {
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
        <Suspense fallback={loader}>
          <Router>
            <Redirect from="/" to="/ams/test" noThrow />
            <Div path="/test">AMS</Div>
          </Router>
        </Suspense>
        <ReactQueryDevtools initialIsOpen={false} position="top-right" />
      </QueryClientProvider>
    </PrimeContext.Provider>
  )
}
export default Home

const Div = () => {
  return <div>AMS</div>
}
