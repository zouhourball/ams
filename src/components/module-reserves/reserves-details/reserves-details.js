import { navigate } from '@reach/router'
import { Button } from 'react-md'
import Mht from '@target-energysolutions/mht'

import TopBarDetail from 'components/top-bar-detail'

import {
  annualReservesDetailsData,
  annualReservesDetailsConfigs,
} from '../helpers'

import './style.scss'

const ReservesDetails = () => {
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
        navigate(`/ams/reserves/reserves-details`)
      }}
    >
      Download Original File
    </Button>,
  ]
  return (
    <div className="reserves-details">
      <TopBarDetail
        title={'Annual Reserves Reporting'}
        onClickBack={() => navigate('/ams/reserves')}
        actions={actions}
      />
      <Mht
        id="reserves-details"
        configs={annualReservesDetailsConfigs()}
        tableData={annualReservesDetailsData}
        withSearch
        commonActions
        withSubColumns
        hideTotal={false}
        withFooter
      />
    </div>
  )
}
export default ReservesDetails
