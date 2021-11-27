import { navigate } from '@reach/router'
import { Button } from 'react-md'
import Mht from '@target-energysolutions/mht'

import TopBarDetail from 'components/top-bar-detail'
import useRole from 'libs/hooks/use-role'
import { get } from 'lodash-es'
import {
  annualBaseDetailsConfigs,
  annualBaseDetailsData,
  assetConsumptionDetailsConfigs,
  assetConsumptionDetailsData,
} from '../helpers'

import './style.scss'

const InventoryDetails = () => {
  const role = useRole('production')
  const tab = get(location, 'pathname', '/').split('/').pop()

  const renderCurrentTabData = () => {
    switch (+tab) {
      case 0:
        return annualBaseDetailsData
      case 1:
        return assetConsumptionDetailsData
      default:
        return annualBaseDetailsData
    }
  }
  const renderCurrentTabConfigs = () => {
    switch (+tab) {
      case 0:
        return annualBaseDetailsConfigs()
      case 1:
        return assetConsumptionDetailsConfigs()
      default:
        return annualBaseDetailsConfigs()
    }
  }
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
    role === 'regulator' && (
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
        onClickBack={() => navigate('/ams/inventory')}
        actions={actions}
        detailData={{ title: ' Block 100' }}
      />
      <Mht
        configs={renderCurrentTabConfigs()}
        tableData={renderCurrentTabData()}
        withSearch
        commonActions
        withSubColumns
        hideTotal={false}
        withFooter
      />
    </div>
  )
}
export default InventoryDetails
