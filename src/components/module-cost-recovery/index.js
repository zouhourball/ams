import { Router } from '@reach/router'
import CostRecovery from './cost-recovery'
import CostRecoveryDetails from './cost-recovery-details/cost-recovery-details'

const Permitting = () => {
  return (
    <Router>
      <CostRecovery path="/" />
      <CostRecoveryDetails path="/cost-recovery-details/:costId" />
    </Router>
  )
}
export default Permitting
