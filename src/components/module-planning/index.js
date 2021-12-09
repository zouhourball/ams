import { lazy, Suspense } from 'react'
import { Router } from '@reach/router'

const Planning = lazy(() => import('./planning'))
const PlanningDetails = lazy(() =>
  import('./planning-details/planning-details'),
)
const ViewHistorian = lazy(() =>
  import('components/module-planning/view-historian'),
)
const Dashboard = lazy(() => import('components/module-planning/analytics'))
const PlanningModule = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Router>
        <Planning path="/" />
        <PlanningDetails path="/planning-details/:subModule/:objectId" />
        <ViewHistorian path="/view-historian/:subModule/:objectId" />
        <Dashboard path="/analytics/dashboard" />
      </Router>
    </Suspense>
  )
}
export default PlanningModule
