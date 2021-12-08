import { lazy, Suspense } from 'react'
import { Router } from '@reach/router'

import InventoryConsumptionRecords from './inventory-consumption-records'
import InventorySurplusRecords from './inventory-surplus-records'
import AdditionRecords from './addition-records'
import AdditionRecordsDetail from './addition-records-detail'

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
        <InventorySurplusRecords path="/inventory-surplus-records/:inventoryId/:tabId" />
        <AdditionRecords path="/addition-records/:inventoryId" />
        <AdditionRecordsDetail path="/:inventoryId/transaction-detail/:transactionId" />
      </Router>
    </Suspense>
  )
}
export default Inventories
