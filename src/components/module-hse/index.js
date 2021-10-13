import { Router, Redirect } from '@reach/router'
import Emissions from './emissions'
import Flaring from './flaring'
import HSSE from './hsse'

const HSE = () => {
  return (
    <Router>
      <Redirect from="/" to="/ams/hse/flaring" noThrow />
      <Emissions path="/emissions" />
      <Flaring path="/flaring" />
      <HSSE path="/hsse" />
    </Router>
  )
}
export default HSE
