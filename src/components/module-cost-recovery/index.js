import { lazy, Suspense } from 'react'
import { Router } from '@reach/router'

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
        <CostRecovery path="/" />
        <CostRecoveryDetails path="/cost-recovery-details/:subkey/:detailId" />
        <Dashboard path="/analytics/dashboard" />
      </Router>
    </Suspense>
  )
}
export default Permitting
