import { Router } from '@reach/router'
import ReservesDetails from 'components/module-reserves/reserves-details'
import Reserves from './reserves'

const Permitting = () => {
  return (
    <Router>
      <Reserves path="/" />
      <ReservesDetails path="/reserves-details/:reserveId" />
    </Router>
  )
}
export default Permitting
