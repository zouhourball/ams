import { lazy, Suspense } from 'react'
import { Router } from '@reach/router'

const Downstream = lazy(() => import('./downstream'))
const DownstreamDetails = lazy(() =>
  import('./downstream-details/downstream-details'),
)
const DownstreamDashboard = lazy(() =>
  import('components/module-downstream/analytics'),
)
const DownstreamModule = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Router>
        <Downstream path="/" />
        <DownstreamDetails path="/downstream-details/:subkey/:downstreamId" />
        <DownstreamDashboard path="/analytics/dashboard" />
      </Router>
    </Suspense>
  )
}
export default DownstreamModule
