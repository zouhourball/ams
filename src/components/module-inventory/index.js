import { lazy, Suspense } from 'react'
import { Router } from '@reach/router'

const InventoryDetails = lazy(() =>
  import('components/module-inventory/inventory-details'),
)
const Inventory = lazy(() => import('./inventory'))

const Inventories = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Router>
        <Inventory path="/" />
        <InventoryDetails path="/inventory-details/:inventoryId/:tabId" />
      </Router>
    </Suspense>
  )
}
export default Inventories
