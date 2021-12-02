import { lazy, Suspense } from 'react'
import { Router } from '@reach/router'

import InventoryConsumptionRecords from './inventory-consumption-records'
import InventorySurplusRecords from './inventory-surplus-records'

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
        <InventoryConsumptionRecords path="/inventory-consumption-records/:inventoryId/:tabId" />
        <InventorySurplusRecords path="/inventory-consumption-records/:inventoryId/:tabId" />
      </Router>
    </Suspense>
  )
}
export default Inventories
