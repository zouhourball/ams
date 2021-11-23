import { lazy, Suspense } from 'react'
import { Router } from '@reach/router'

// import useRole from 'libs/hooks/use-role'

const Reserves = lazy(() => import('./reserves'))
const ReservesDetails = lazy(() =>
  import('components/module-reserves/reserves-details'),
)

const Permitting = () => {
  // const role = useRole('production')
  // console.log('role', role)
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Router>
        <Reserves path="/" />
        <ReservesDetails path="/reserves-details/:reserveId" />
      </Router>
    </Suspense>
  )
}
export default Permitting
