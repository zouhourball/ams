import { navigate } from '@reach/router'
import Mht from '@target-energysolutions/mht'
import { Button } from 'react-md'

import TopBarDetail from 'components/top-bar-detail'
import { hsseDetailsConfigs, hsseDetailsData } from './helpers'

const HsseDetails = () => {
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
  ]
  return (
    <div className="details-container">
      <TopBarDetail
        onClickBack={() => navigate('/ams/hse/hsse')}
        actions={actions}
      />
      <Mht
        id="hsse-mht-details"
        configs={hsseDetailsConfigs}
        tableData={hsseDetailsData}
        withSearch
        commonActions
        withSubColumns
        hideTotal={false}
        withFooter
      />
    </div>
  )
}

export default HsseDetails
