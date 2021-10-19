import { navigate } from '@reach/router'
import { Button } from 'react-md'

import TopBarDetail from 'components/top-bar-detail'
import DetailsPermit from 'components/details-permit'
import { userRole } from 'components/shared-hook/get-roles'

import './style.scss'

const DrillReportDetails = () => {
  const actions = [
    <Button
      key="1"
      id="viewDoc"
      className="top-bar-buttons-list-item-btn view-doc"
      flat
      swapTheming
      onClick={() => {}}
    >
      View documents
    </Button>,
    <Button
      key="2"
      id="edit"
      className="top-bar-buttons-list-item-btn"
      flat
      primary
      swapTheming
      onClick={() => {
        navigate(`/ams/permitting/drill-report`)
      }}
    >
      {userRole() === 'operator' ? 'Edit Details' : 'Acknowledge'}
    </Button>,
  ]
  return (
    <div className="drill-report-details">
      <TopBarDetail
        onClickBack={() => navigate('/ams/permitting/drill-report')}
        actions={actions}
      />
      <DetailsPermit />
    </div>
  )
}
export default DrillReportDetails
