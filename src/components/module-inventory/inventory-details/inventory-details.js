import { navigate } from '@reach/router'
import { Button, FontIcon } from 'react-md'
import { useMutation, useQuery } from 'react-query'
import { useDispatch } from 'react-redux'
import { get } from 'lodash-es'

import Mht from '@target-energysolutions/mht'

import { addToast } from 'modules/app/actions'
// import useRole from 'libs/hooks/use-role'
import useRole from 'libs/hooks/use-role'
import {
  updateInventory,
  getDetailInventoryById,
  getTransactionById,
} from 'libs/api/api-inventory'

import TopBarDetail from 'components/top-bar-detail'
import ToastMsg from 'components/toast-msg'
import {
  annualBaseDetailsConfigs,
  annualBaseDetailsData,
  assetDisposalDetailsConfigs,
} from '../helpers'
import './style.scss'

const InventoryDetails = () => {
  const dispatch = useDispatch()
  const role = useRole('inventory')
  const pathItems = get(location, 'pathname', '/').split('/').reverse()
  const currentTabName = pathItems[0]
  const inventoryId = pathItems[1]
  const categoryKeyword = [
    'base',
    'assetTransferRequestProcess',
    'assetDisposalRequestProcess',
  ]
  const transactionKeyword = [
    'consumptionReportProcess',
    'surplusInventoryProcess',
  ]
  const categoryAccepted = ['base-consumption', 'base-surplus']

  const { data: inventoryData, refetch: refetchInventory } = useQuery(
    ['getDetailInventoryById', currentTabName, inventoryId],
    categoryKeyword.includes(currentTabName) && getDetailInventoryById,
    {
      refetchOnWindowFocus: false,
    },
  )

  const { data: inventoryAcceptedData, refetch: refetchInventoryAccepted } =
    useQuery(
      ['getDetailInventoryById', 'base', inventoryId],
      categoryAccepted.includes(currentTabName) && getDetailInventoryById,
      {
        refetchOnWindowFocus: false,
      },
    )
  const { data: transactionData, refetch: refetchTransaction } = useQuery(
    ['getTransactionById', inventoryId],
    transactionKeyword.includes(currentTabName) && getTransactionById,
    {
      refetchOnWindowFocus: false,
    },
  )
  const updateInventoryMutation = useMutation(updateInventory, {
    onSuccess: (res) => {
      if (!res.error) {
        // navigate('/ams/inventory')
        renderRefetchAfterUpdate()

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

  const mhtBaseDetailData = (
    get(
      inventoryData || inventoryAcceptedData || transactionData,
      'rows',
      [],
    ) || []
  ).map((el) => {
    return {
      id: el?.rowId,
      materialName: el?.data['Material Name'],
      materialCategory: el?.data['Material Category'],
      materialDescription: el?.data['Material Description '],
      measurementUnit: el?.data['Measurement Unit'],
      currentSt: 5,
      quantity: el?.data['Quantity'],
      unitPrice: el?.data['Unit Price (USD)'],
    }
  })

  const mhtDisposalDetailData = (get(inventoryData, 'rows', []) || []).map(
    (el) => {
      return {
        id: el?.rowId,
        materialName: el?.data['Material Name'],
        materialCategory: el?.data['Material Category'],
        materialDescription: el?.data['Material Description '],
        measurementUnit: el?.data['Measurement Unit'],
        quantity: el?.data['Quantity'],
        unitPrice: el?.data['Unit Price (USD)'],
        classification: el?.data['Classification'],
        bookValue: el?.data['Book Value(USD)'],
        estimatedCurrentValue: el?.data['Estimated Current Value(USD)'],
        dateOfPurchase: el?.data['Date of Purchase'],
        averageLength: el?.data['Average Length'],
        grade: el?.data['Grade'],
        inspectionDate: el?.data['Inspection Date'],
        itemWeight: el?.data['Item Weight'],
        mTCertificate: el?.data['MT Certificate'],
        materialCondition: el?.data['Material Condition'],
        materialLocation: el?.data['Material Location'],
        reasonsForSale: el?.data['Reasons for Sale / Write - off'],
        remarks: el?.data['Remarks'],
        storageLocation: el?.data['Storage Location'],
        totalWeight: el?.data['Total Weight'],
        weight: el?.data['Weight'],
      }
    },
  )
  const renderCurrentTabData = () => {
    switch (currentTabName) {
      case 'base': // annual base tab 0
        return mhtBaseDetailData
      case 'assetTransferRequestProcess': // Asset Transfer tab 3
        return mhtBaseDetailData
      case 'assetDisposalRequestProcess': // Asset Disposal tab 4
        return mhtDisposalDetailData
      case 'base-consumption': // Asset Consumption tab 2
        return mhtBaseDetailData
      case 'base-surplus': // Surplus Declaration tab 3
        return mhtBaseDetailData
      default:
        return annualBaseDetailsData
    }
  }
  const renderRefetchAfterUpdate = () => {
    switch (currentTabName) {
      case 'base': // annual base tab 0
        return refetchInventory()
      case 'assetTransferRequestProcess': // Asset Transfer tab 3
        return refetchInventory()
      case 'assetDisposalRequestProcess': // Asset Disposal tab 4
        return refetchInventory()
      case 'base-consumption': // Asset Consumption tab 2
        return refetchInventoryAccepted()
      case 'base-surplus': // Surplus Declaration tab 3
        return refetchInventoryAccepted()
      default:
        return refetchTransaction()
    }
  }
  const renderCurrentTabConfigs = () => {
    switch (currentTabName) {
      case 'base':
      case 'base-consumption':
      case 'base-surplus':
        return annualBaseDetailsConfigs()
      case 'assetDisposalRequestProcess':
        return assetDisposalDetailsConfigs()
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

  const renderActionsByTab = () => {
    switch (currentTabName) {
      case 'base':
        return [
          role === 'regulator' && (
            <>
              <Button
                key="6"
                id="clarify"
                className="top-bar-buttons-list-item-btn discard"
                flat
                primary
                swapTheming
                onClick={() => {}}
              >
                Clarify
              </Button>
              <Button
                key="7"
                id="support"
                className="top-bar-buttons-list-item-btn discard"
                flat
                primary
                swapTheming
                onClick={() => {}}
              >
                View Support Documents
              </Button>
              {inventoryData?.metaData?.status === 'APPROVED' ? (
                <Button
                  key="8"
                  id="reject"
                  className="top-bar-buttons-list-item-btn approve"
                  flat
                  primary
                  swapTheming
                  disabled
                  iconEl={<FontIcon>check_circle</FontIcon>}
                  onClick={() => {}}
                >
                  Approved
                </Button>
              ) : (
                <>
                  {' '}
                  <Button
                    key="5"
                    id="reject"
                    className="top-bar-buttons-list-item-btn reject"
                    flat
                    primary
                    swapTheming
                    onClick={() => onChangeStatus(inventoryId, 'REJECTED')}
                  >
                    Reject
                  </Button>
                  <Button
                    key="3"
                    id="approve"
                    className="top-bar-buttons-list-item-btn approve"
                    flat
                    primary
                    swapTheming
                    onClick={() => onChangeStatus(inventoryId, 'APPROVED')}
                  >
                    Approve
                  </Button>
                </>
              )}
            </>
          ),

          role === 'operator' && (
            <>
              <Button
                key="2"
                id="edit"
                className="top-bar-buttons-list-item-btn discard"
                flat
                primary
                swapTheming
                onClick={() => {
                  // navigate(`/ams/production/production-detail`)
                }}
              >
                Download Original File
              </Button>
              <Button
                key="1"
                id="viewDoc"
                className="top-bar-buttons-list-item-btn view-doc"
                flat
                swapTheming
                onClick={() => {}}
              >
                Upload documents
              </Button>
            </>
          ),
        ]
      case 'base-consumption':
      case 'base-surplus':
        return [
          role === 'regulator' && (
            <>
              <Button
                key="6"
                id="clarify"
                className="top-bar-buttons-list-item-btn discard"
                flat
                primary
                swapTheming
                onClick={() => {}}
              >
                Clarify
              </Button>
              <Button
                key="7"
                id="support"
                className="top-bar-buttons-list-item-btn discard"
                flat
                primary
                swapTheming
                onClick={() => {}}
              >
                View Support Documents
              </Button>
              {inventoryData?.metaData?.status === 'APPROVED' ? (
                <Button
                  key="8"
                  id="reject"
                  className="top-bar-buttons-list-item-btn approve"
                  flat
                  primary
                  swapTheming
                  disabled
                  iconEl={<FontIcon>check_circle</FontIcon>}
                  onClick={() => {}}
                >
                  Approved
                </Button>
              ) : (
                <>
                  {' '}
                  <Button
                    key="5"
                    id="reject"
                    className="top-bar-buttons-list-item-btn reject"
                    flat
                    primary
                    swapTheming
                    onClick={() => onChangeStatus(inventoryId, 'REJECTED')}
                  >
                    Reject
                  </Button>
                  <Button
                    key="3"
                    id="approve"
                    className="top-bar-buttons-list-item-btn approve"
                    flat
                    primary
                    swapTheming
                    onClick={() => onChangeStatus(inventoryId, 'APPROVED')}
                  >
                    Approve
                  </Button>
                </>
              )}
            </>
          ),

          role === 'operator' && (
            <>
              <Button
                key="1"
                id="viewDoc"
                className="top-bar-buttons-list-item-btn view-doc"
                flat
                swapTheming
                onClick={() => {}}
              >
                Upload documents
              </Button>

              <Button
                key="2"
                id="edit"
                className="top-bar-buttons-list-item-btn discard"
                flat
                primary
                swapTheming
                onClick={() => {
                  navigate(location)
                }}
              >
                Discard
              </Button>
              <Button
                key="2"
                id="edit"
                className="top-bar-buttons-list-item-btn discard"
                flat
                primary
                swapTheming
                onClick={() => {
                  // navigate(`/ams/production/production-detail`)
                }}
              >
                Submit
              </Button>
            </>
          ),
        ]
      case 'assetDisposalRequestProcess':
        return []
      default:
        return [
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
          <Button
            key="1"
            id="viewDoc"
            className="top-bar-buttons-list-item-btn view-doc"
            flat
            swapTheming
            onClick={() => {}}
          >
            Upload documents
          </Button>,
        ]
    }
  }

  return (
    <div className="details-container">
      <TopBarDetail
        onClickBack={() => navigate('/ams/inventory')}
        actions={renderActionsByTab()}
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