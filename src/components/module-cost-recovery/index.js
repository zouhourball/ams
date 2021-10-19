import { lazy, Suspense } from 'react'
import { Router } from '@reach/router'

const CostRecovery = lazy(() => import('./cost-recovery'))
const CostRecoveryDetails = lazy(() =>
  import('./cost-recovery-details/cost-recovery-details'),
)

const Permitting = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Router>
        <CostRecovery path="/" />
        <CostRecoveryDetails path="/cost-recovery-details/:costId" />
      </Router>
    </Suspense>
  )
}
export default Permitting
