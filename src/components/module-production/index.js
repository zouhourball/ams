import { Router } from '@reach/router'
import ProductionDetails from 'components/module-production/production-details'
import Production from './production'

const Permitting = () => {
  return (
    <Router>
      <Production path="/" />
      <ProductionDetails path="/production-details/:productionId" />
    </Router>
  )
}
export default Permitting
