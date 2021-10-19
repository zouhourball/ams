import { lazy, Suspense } from 'react'
import { Router, Redirect } from '@reach/router'

const Emissions = lazy(() => import('./emissions'))
const Flaring = lazy(() => import('./flaring'))
const EmissionsDetails = lazy(() => import('./emissions-details'))
const HSSE = lazy(() => import('./hsse'))
const HsseDetails = lazy(() => import('./hsse-details'))
const FlaringDetails = lazy(() => import('./flaring-details'))

const HSE = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Router>
        <Redirect from="/" to="/ams/hse/flaring" noThrow />
        <Flaring path="/flaring" />
        <FlaringDetails path="/flaring/:flaringId" />
        <HSSE path="/hsse" />
        <HsseDetails path="/hsse/:hsseId" />
        <Emissions path="/emissions" />
        <EmissionsDetails path="/emissions/:emissionId" />
      </Router>
    </Suspense>
  )
}
export default HSE
