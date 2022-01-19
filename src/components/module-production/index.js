import { lazy, Suspense } from 'react'
import { Router } from '@reach/router'

const ProductionDetails = lazy(() =>
  import('components/module-production/production-details'),
)
const Production = lazy(() => import('./production'))
const ProductionDashboard = lazy(() =>
  import('components/module-production/analytics'),
)

const Permitting = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Router>
        <ProductionDetails path="/:subModule/:productionId" />
        <Production path="/:subModule" />
        <ProductionDashboard path="/analytics/dashboard" />
      </Router>
    </Suspense>
  )
}
export default Permitting
