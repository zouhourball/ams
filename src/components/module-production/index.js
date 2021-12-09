import { lazy, Suspense } from 'react'
import { Router } from '@reach/router'

const ProductionDetails = lazy(() =>
  import('components/module-production/production-details'),
)
const Production = lazy(() => import('./production'))

const Permitting = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Router>
        <Production path="/:subModule" />
        <ProductionDetails path="/:productionId/:subModule" />
        <ProductionDetails path="/:productionId/:subsubModule/:subModule" />
      </Router>
    </Suspense>
  )
}
export default Permitting
