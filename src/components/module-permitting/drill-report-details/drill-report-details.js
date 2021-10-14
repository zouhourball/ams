import { navigate } from '@reach/router'
import { Button } from 'react-md'

import TopBar from 'components/top-bar'
import DetailsPermit from 'components/details-permit'

import './style.scss'

const DrillReportDetails = () => {
  let placeholder = 'Block 15'

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
      Edit Details
    </Button>,
  ]
  return (
    <div className="drill-report-details">
      <TopBar
        title={`Permit to Drill / ${placeholder}`}
        actions={actions}
        returnTo={() => navigate(`/ams/permitting/drill-report`)}
      />
      <DetailsPermit />
    </div>
  )
}
export default DrillReportDetails
