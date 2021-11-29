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
        <Production path="/" />
        <ProductionDetails path="/production-details/:productionId/:subModule" />
        <ProductionDetails path="/production-details/:productionId/:subsubModule/:subModule" />
      </Router>
    </Suspense>
  )
}
export default Permitting
