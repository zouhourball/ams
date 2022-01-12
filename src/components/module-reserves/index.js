import { lazy, Suspense } from 'react'
import { Router, Redirect } from '@reach/router'

const Reserves = lazy(() => import('./reserves'))
const ReservesDetails = lazy(() =>
  import('components/module-reserves/reserves-details'),
)
const ReservesDashboard = lazy(() =>
  import('components/module-reserves/dashboard'),
)

const ReservesModule = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Router>
        <ReservesDetails path="/reserves-details/:subkey/:reserveId" />
        <Reserves path="/:subkey" />
        <Redirect from="/" to="/ams/reserves/annual" noThrow />
        <ReservesDashboard path="/analytics/dashboard" />
      </Router>
    </Suspense>
  )
}
export default ReservesModule
