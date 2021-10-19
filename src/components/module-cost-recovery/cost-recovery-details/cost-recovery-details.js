import { navigate } from '@reach/router'
import { Button } from 'react-md'
import Mht from '@target-energysolutions/mht'

import TopBarDetail from 'components/top-bar-detail'

import {
  costRecoveryDetailsData,
  costRecoveryDetailsConfigs,
} from '../helpers'

import './style.scss'

const CostRecoveryDetails = () => {
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
      onClick={() => {}}
    >
      Download Original File
    </Button>,
  ]
  return (
    <div className="cost-recovery-details">
      <TopBarDetail
        title={'Annual Cost and Expenditure'}
        onClickBack={() => navigate(`/ams/costrecovery`)}
        actions={actions}
      />
      <Mht
        configs={costRecoveryDetailsConfigs()}
        tableData={costRecoveryDetailsData}
        withSearch
        commonActions
        withSubColumns
      />
    </div>
  )
}
export default CostRecoveryDetails
