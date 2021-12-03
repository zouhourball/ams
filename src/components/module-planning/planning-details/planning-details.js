import { navigate } from '@reach/router'
import { Button } from 'react-md'
import Mht from '@target-energysolutions/mht'

import TopBarDetail from 'components/top-bar-detail'
import { userRole } from 'components/shared-hook/get-roles'
import { configsWpbDialogMht } from '../mht-helper-dialog'

import './style.scss'

const PlanningDetails = () => {
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
        // navigate(`/ams/production/production-detail`)
      }}
    >
      Download Original File
    </Button>,
    userRole() === 'regulator' && (
      <Button
        key="3"
        id="acknowledge"
        className="top-bar-buttons-list-item-btn"
        flat
        primary
        swapTheming
        onClick={() => {}}
      >
        Acknowledge
      </Button>
    ),
  ]
  return (
    <div className="details-container">
      <TopBarDetail
        onClickBack={() => navigate('/ams/production')}
        actions={actions}
      />
      <Mht
        configs={configsWpbDialogMht()}
        tableData={[]}
        withSearch
        commonActions
        withSubColumns
        hideTotal={false}
        withFooter
      />
    </div>
  )
}
export default PlanningDetails
