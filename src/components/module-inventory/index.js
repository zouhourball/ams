import { lazy, Suspense } from 'react'
import { Router, Redirect } from '@reach/router'

import InventoryConsumptionRecords from './inventory-consumption-records'
import InventorySurplusRecords from './inventory-surplus-records'
import AdditionRecords from './addition-records'
import AdditionRecordsDetail from './addition-records-detail'
import ConsumptionRecordDetail from './inventory-consumption-records/consumption-record-detail'
import SurplusRecordDetail from './inventory-surplus-records/surplus-record-detail'

const InventoryDetails = lazy(() =>
  import('components/module-inventory/inventory-details'),
)
const Inventory = lazy(() => import('./inventory'))

const Inventories = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Router>
        <Redirect from="/" to="annual-base" noThrow />
        <Inventory path="/:subModule" />
        <InventoryDetails path="/inventory-details/:inventoryId/:tabId" />
        <InventoryConsumptionRecords path="/inventory-consumption-records/:inventoryId/:tabId" />
        <InventorySurplusRecords path="/inventory-surplus-records/:inventoryId/:tabId" />
        <AdditionRecords path="/addition-records/:inventoryId" />
        <AdditionRecordsDetail path="/:inventoryId/transaction-detail/:transactionId" />
        <ConsumptionRecordDetail path="/:inventoryId/consumption-detail/:transactionId" />
        <SurplusRecordDetail path="/:inventoryId/surplus-detail/:transactionId" />
      </Router>
    </Suspense>
  )
}
export default Inventories
