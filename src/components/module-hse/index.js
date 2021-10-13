import { Router, Redirect } from '@reach/router'
import Emissions from './emissions'
import Flaring from './flaring'
import HSSE from './hsse'
import FlaringDetails from './flaring-details'
import HsseDetails from './hsse-details'
import EmissionsDetails from './emissions-details'

const HSE = () => {
  return (
    <Router>
      <Redirect from="/" to="/ams/hse/flaring" noThrow />
      <Flaring path="/flaring" />
      <FlaringDetails path="/flaring/:flaringId" />
      <HSSE path="/hsse" />
      <HsseDetails path="/hsse/:hsseId" />
      <Emissions path="/emissions" />
      <EmissionsDetails path="/emissions/:emissionId" />

    </Router>
  )
}
export default HSE
