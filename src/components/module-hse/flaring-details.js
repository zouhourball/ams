import { Button } from 'react-md'
import { navigate } from '@reach/router'
import Mht from '@target-energysolutions/mht'

import TopBarDetail from 'components/top-bar-detail'
import { userRole } from 'components/shared-hook/get-roles'

import { flaringDetailsConfigs, flaringDetailsData } from './helpers'

const FlaringDetails = () => {
  const actions = [
    <Button
      key="1"
      id="save"
      className="top-bar-detail-buttons-list-item-btn"
      flat
      primary
      swapTheming
      onClick={() => {}}
    >
      Download Annual Plan
    </Button>,
    <Button
      key="2"
      id="save"
      className="top-bar-detail-buttons-list-item-btn"
      flat
      primary
      swapTheming
      onClick={() => {}}
    >
      View Documents
    </Button>,
    <Button
      key="3"
      id="save"
      className="top-bar-detail-buttons-list-item-btn"
      flat
      primary
      swapTheming
      onClick={() => {}}
    >
      Download Original File
    </Button>,
    userRole() === 'regulator' && (
      <Button
        key="4"
        id="acknowledge"
        className="top-bar-detail-buttons-list-item-btn"
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
        onClickBack={() => navigate('/ams/hse/flaring')}
        actions={actions}
      />
      <Mht
        configs={flaringDetailsConfigs}
        tableData={flaringDetailsData}
        withSearch
        commonActions
      />
    </div>
  )
}

export default FlaringDetails
