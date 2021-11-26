import { lazy, Suspense } from 'react'
import { Router } from '@reach/router'

// import getBlocks from 'libs/hooks/get-blocks'

// import useRole from 'libs/hooks/use-role'

const Reserves = lazy(() => import('./reserves'))
const ReservesDetails = lazy(() =>
  import('components/module-reserves/reserves-details'),
)

const Permitting = () => {
  // const role = useRole('costrecovery')
  // console.log('role', role)
  // const blocks = getBlocks()
  // console.log(blocks, 'BLOCKS')
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
