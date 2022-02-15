import { useState } from 'react'
import { navigate } from '@reach/router'
import { Button } from 'react-md'

import TopBarDetailAudit from 'components/top-bar-detail-audit'

const AuditDetails = () => {
  const [showSupportedDocumentDialog, setShowSupportedDocumentDialog] =
    useState(false)

  const actions = [
    <Button
      key="2"
      id="viewDoc"
      className="top-bar-buttons-list-item-btn view-doc"
      flat
      swapTheming
      onClick={() => {}}
    >
      Clarify
    </Button>,
    <Button
      key="1"
      id="viewDoc"
      className="top-bar-buttons-list-item-btn view-doc"
      flat
      swapTheming
      onClick={() => {
        setShowSupportedDocumentDialog(true)
      }}
    >
      Supporting documents
    </Button>,
    <Button
      key="3"
      id="viewDoc"
      className="top-bar-buttons-list-item-btn view-doc"
      flat
      swapTheming
      onClick={() => {}}
    >
      Create Audit Space
    </Button>,
    <Button
      key="4"
      id="viewDoc"
      className="top-bar-buttons-list-item-btn view-doc"
      flat
      swapTheming
      onClick={() => {}}
    >
      Acknowledge
    </Button>,
  ]
  return (
    <div>
      <TopBarDetailAudit
        onClickBack={() => navigate(`/ams/audit`)}
        actions={actions}
        detailData={{
          title: 'New Audit Request',
          purpose: 'purpose',
          auditId: '1111',
          date: '11/12/2022',
          scope: 'scooope',
          expectedDeliv: '12/22/2022',
        }}
      />
      {showSupportedDocumentDialog && <div>supp doc</div>}
    </div>
  )
}
export default AuditDetails
