import { lazy, Suspense } from 'react'
import { Router, Redirect } from '@reach/router'

const Emissions = lazy(() => import('./emissions'))
const Flaring = lazy(() => import('./flaring'))
const EmissionsDetails = lazy(() => import('./emissions-details'))
const HSSE = lazy(() => import('./hsse'))
const HsseDetails = lazy(() => import('./hsse-details'))
const FlaringDetails = lazy(() => import('./flaring-details'))
const Dashboard = lazy(() => import('./analytics'))
const HSE = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Router>
        <Redirect from="/" to="/ams/hse/flaring" noThrow />
        {/* <Flaring path="/flaring" /> */}
        <Flaring path="/flaring/:subModule" />
        <FlaringDetails path="/flaring/:flaringId/:subModule" />
        <HSSE path="/hsse" />
        <HsseDetails path="/hsse/:hsseId" />
        <Emissions path="/emissions" />
        <EmissionsDetails path="/emissions/:emissionId" />
        <Dashboard path="/flaring/analytics/dashboard" />
      </Router>
    </Suspense>
  )
}
export default HSE
