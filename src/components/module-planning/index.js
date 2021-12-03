import { lazy, Suspense } from 'react'
import { Router } from '@reach/router'

const Planning = lazy(() => import('./planning'))
const PlanningDetails = lazy(() =>
  import('./planning-details/planning-details'),
)

const DownstreamModule = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Router>
        <Planning path="/" />
        <PlanningDetails path="/planning-details/:planningId" />
      </Router>
    </Suspense>
  )
}
export default DownstreamModule
