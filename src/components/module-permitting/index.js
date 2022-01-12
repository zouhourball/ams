import { lazy, Suspense } from 'react'
import { Router, Redirect } from '@reach/router'

const DrillReport = lazy(() =>
  import('components/module-permitting/drill-report'),
)
const SuspendReport = lazy(() =>
  import('components/module-permitting/suspend-report'),
)
const AbandonReport = lazy(() =>
  import('components/module-permitting/abandon-report'),
)
const Permit = lazy(() => import('./permit'))
const DrillReportDetails = lazy(() =>
  import('components/module-permitting/drill-report-details'),
)
const SuspendReportDetails = lazy(() =>
  import('components/module-permitting/suspend-report-details'),
)
const AbandonReportDetails = lazy(() =>
  import('components/module-permitting/abandon-report-details'),
)
const Dashboard = lazy(() => import('components/module-permitting/analytics'))
const Permitting = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Router>
        <DrillReport path="/drill-report" />
        <DrillReportDetails path="/drill-report/:drillReportId" />
        <DrillReport edit path="/drill-report/edit/:drillReportId" />
        <SuspendReport path="/suspend-report" />
        <SuspendReportDetails path="/suspend-report/:suspendReportId" />
        <SuspendReport edit path="/suspend-report/edit/:suspendReportId" />
        <AbandonReport path="/abandon-report" />
        <AbandonReportDetails path="/abandon-report/:abandonReportId" />
        <AbandonReport edit path="/abandon-report/edit/:abandonReportId" />
        <Dashboard path="/analytics/dashboard" />
        <Permit path="/:subModule" />
        <Redirect from="/" to="/ams/permitting/dr" noThrow />
      </Router>
    </Suspense>
  )
}
export default Permitting
