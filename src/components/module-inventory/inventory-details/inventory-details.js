import { navigate } from '@reach/router'
import { Button } from 'react-md'
import { useMutation, useQuery } from 'react-query'
import { useDispatch } from 'react-redux'
import { get } from 'lodash-es'

import Mht from '@target-energysolutions/mht'

import { addToast } from 'modules/app/actions'
import useRole from 'libs/hooks/use-role'
import { updateInventory, getDetailInventoryById } from 'libs/api/api-inventory'

import TopBarDetail from 'components/top-bar-detail'
import ToastMsg from 'components/toast-msg'
import {
  annualBaseDetailsConfigs,
  annualBaseDetailsData,
  assetConsumptionDetailsConfigs,
  assetConsumptionDetailsData,
} from '../helpers'
import './style.scss'

const InventoryDetails = () => {
  const dispatch = useDispatch()
  const role = useRole('inventory')
  const pathItems = get(location, 'pathname', '/').split('/').reverse()
  const currentTabName = pathItems[0]
  const inventoryId = pathItems[1]
  const { data: inventoryData } = useQuery(
    ['getDetailInventoryById', currentTabName, inventoryId],
    inventoryId && getDetailInventoryById,
    {
      refetchOnWindowFocus: false,
    },
  )

  const updateInventoryMutation = useMutation(updateInventory, {
    onSuccess: (res) => {
      if (!res.error) {
        // navigate('/ams/inventory')
        dispatch(
          addToast(
            <ToastMsg text={res.message || 'success'} type="success" />,
            'hide',
          ),
        )
      } else {
        dispatch(
          addToast(
            <ToastMsg
              text={res.error?.body?.message || 'Something went wrong'}
              type="error"
            />,
            'hide',
          ),
        )
      }
    },
  })

  const renderCurrentTabData = () => {
    switch (currentTabName) {
      case 'base':
        return annualBaseDetailsData || inventoryData
      case '':
        return assetConsumptionDetailsData
      default:
        return annualBaseDetailsData
    }
  }
  const renderCurrentTabConfigs = () => {
    switch (currentTabName) {
      case 'base':
        return annualBaseDetailsConfigs()
      case '':
        return assetConsumptionDetailsConfigs()
      default:
        return annualBaseDetailsConfigs()
    }
  }
  const onChangeStatus = (inventoryId, status) => {
    updateInventoryMutation.mutate({
      inventoryId: inventoryId,
      status: status,
    })
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
        id="approve"
        className="top-bar-buttons-list-item-btn"
        flat
        primary
        swapTheming
        onClick={() => onChangeStatus(inventoryId, 'APPROVED')}
      >
        Approve
      </Button>
    ),

    role === 'operator' && (
      <Button
        key="4"
        id="approve"
        className="top-bar-buttons-list-item-btn"
        flat
        primary
        swapTheming
        onClick={() => onChangeStatus(inventoryId, 'SUBMITTED')}
      >
        Submit
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
