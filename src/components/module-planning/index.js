import { lazy, Suspense } from 'react'
import { Router, Redirect } from '@reach/router'

const Planning = lazy(() => import('./planning'))
const PlanningDetails = lazy(() =>
  import('./planning-details/planning-details'),
)
const ViewHistorian = lazy(() =>
  import('components/module-planning/view-historian'),
)
const PlanningMeeting = lazy(() => import('components/ws-meeting'))
const Dashboard = lazy(() => import('components/module-planning/analytics'))
const PlanningModule = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Router>
        <PlanningDetails path="/planning-details/:subModule/:objectId" />
        <ViewHistorian
          path="/view-historian/:subModule/:objectId"
          returnTo="planning"
        />
        <Dashboard path="/analytics/dashboard" />
        <Planning path="/:subModule" />
        <PlanningMeeting path="/meeting/:meetingId" />
        <Redirect from="/" to="/ams/planning/wpb" noThrow />
      </Router>
    </Suspense>
  )
}
export default PlanningModule
