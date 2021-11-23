import { lazy, Suspense } from 'react'
import { Router } from '@reach/router'

const Downstream = lazy(() => import('./downstream'))
const DownstreamDetails = lazy(() =>
  import('./downstream-details/downstream-details'),
)

const DownstreamModule = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Router>
        <Downstream path="/" />
        <DownstreamDetails path="/downstream-details/:downstreamId" />
      </Router>
    </Suspense>
  )
}
export default DownstreamModule
