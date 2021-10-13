import { Router, Redirect } from '@reach/router'
import Emissions from './emissions'
import Flaring from './flaring'
import HSSE from './hsse'
import FlaringDetails from './flaring-details'

const HSE = () => {
  return (

    <Router>
      <Redirect from="/" to="/ams/hse/flaring" noThrow />
      <Flaring path="/flaring" />
      <FlaringDetails path="/flaring/:flaringId" />
      <Emissions path="/emissions" />

      <HSSE path="/hsse" />

    </Router>

  )
}
export default HSE