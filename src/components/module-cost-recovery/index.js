import { lazy, Suspense } from 'react'
import { Router, Redirect } from '@reach/router'

const CostRecovery = lazy(() => import('./cost-recovery'))
const CostRecoveryDetails = lazy(() =>
  import('./cost-recovery-details/cost-recovery-details'),
)
const Dashboard = lazy(() =>
  import('components/module-cost-recovery/analytics'),
)

const Permitting = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Router>
        <CostRecoveryDetails path="/cost-recovery-details/:subkey/:detailId" />
        <Dashboard path="/analytics/dashboard" />
        <CostRecovery path="/:subkey" />
        <Redirect from="/" to="/ams/costrecovery/costs" />
      </Router>
    </Suspense>
  )
}
export default Permitting
