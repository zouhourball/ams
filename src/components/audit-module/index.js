import { lazy, Suspense } from 'react'
import { Router, Redirect } from '@reach/router'

const Audit = lazy(() => import('./audit'))
const AuditDetails = lazy(() => import('./audit-details'))

const ViewHistorianAudit = lazy(() =>
  import('components/audit-module/view-historian-audit'),
)

const AuditModule = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Router>
        <AuditDetails path="/audit-details/:subkey/:auditId" />
        <Audit path="/:subkey" />
        <ViewHistorianAudit path="/view-historian/:objectId" returnTo="audit" />
        <Redirect from="/" to="/ams/audit/state-audit" noThrow />
      </Router>
    </Suspense>
  )
}
export default AuditModule
