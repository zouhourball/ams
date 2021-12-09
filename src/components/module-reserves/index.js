import { lazy, Suspense } from 'react'
import { Router } from '@reach/router'

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
        <Reserves path="/" />
        <ReservesDetails path="/reserves-details/:subkey/:reserveId" />
        <ReservesDashboard path="/analytics/dashboard" />
      </Router>
    </Suspense>
  )
}
export default ReservesModule
