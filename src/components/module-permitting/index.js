import { Router } from '@reach/router'

import DrillReport from 'components/module-permitting/drill-report'
import DrillReportDetails from 'components/module-permitting/drill-report-details'
import Permit from './permit'

const Permitting = () => {
  return (
    <Router>
      <Permit path="/" />
      <DrillReport path="/drill-report" />
      <DrillReportDetails path="/drill-report/:drillReportId" />
    </Router>
  )
}
export default Permitting
