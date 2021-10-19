import { lazy, Suspense } from 'react'
import { Router } from '@reach/router'

const DrillReport = lazy(() =>
  import('components/module-permitting/drill-report'),
)
const Permit = lazy(() => import('./permit'))
const DrillReportDetails = lazy(() =>
  import('components/module-permitting/drill-report-details'),
)

const Permitting = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Router>
        <Permit path="/" />
        <DrillReport path="/drill-report" />
        <DrillReportDetails path="/drill-report/:drillReportId" />
      </Router>
    </Suspense>
  )
}
export default Permitting
