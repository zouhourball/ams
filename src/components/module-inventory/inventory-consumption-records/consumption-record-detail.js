import { navigate } from '@reach/router'
import { useMutation, useQuery } from 'react-query'
import Mht from '@target-energysolutions/mht'

import { get } from 'lodash-es'
import { useDispatch } from 'react-redux'
import { getTransactionById, acceptedTransaction } from 'libs/api/api-inventory'

import { addToast } from 'modules/app/actions'

import TopBarDetail from 'components/top-bar-detail'
import ToastMsg from 'components/toast-msg'

import { consumptionRecordDetailsConfigs } from '../helpers'
import { Button, FontIcon } from 'react-md'
import useRole from 'libs/hooks/use-role'
import '../style.scss'
const ConsumptionRecordDetail = () => {
  const role = useRole('inventory')

  const pathItems = get(location, 'pathname', '/').split('/').reverse()
  const transactionId = pathItems[0]
  const inventoryId = pathItems[2]
  const dispatch = useDispatch()

  const { data: listAdditions, refetch: renderRefetchAfterUpdate } = useQuery(
    ['getTransactionById', transactionId, 0, 2000],
    getTransactionById,
    {
      refetchOnWindowFocus: false,
    },
  )

  const acceptedTransactionMutation = useMutation(acceptedTransaction, {
    onSuccess: (res) => {
      if (!res.error) {
        // navigate('/ams/inventory')
        renderRefetchAfterUpdate()
        navigate(
          `/ams/inventory/inventory-consumption-records/${inventoryId}/base-consumption`,
        )
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

  const mhtDisposalDetailData = (get(listAdditions, 'data', []) || []).map(
    (el) => {
      return {
        materialName: el?.data?.materialName,
        materialCategory: el?.data?.materialCategory,
        materialDescription: el?.data?.materialDescription,
        measurementUnit: el?.data?.measurementUnit,
        quantity: el?.data?.quantity,
        unitPrice: el?.data?.unitPrice,
        consumption: el?.data?.Count,
        currentSt: el?.data?.currentSt,
        date: el?.data?.date,
        uom: '_',
      }
    },
  )

  const onAcceptTransaction = () => {
    acceptedTransactionMutation.mutate({
      transactionId: transactionId,
    })
  }
  return (
    <div className="details-container">
      <TopBarDetail
        onClickBack={() =>
          navigate(
            `/ams/inventory/inventory-consumption-records/${inventoryId}/base-consumption`,
          )
        }
        detailData={{ title: 'Consumption Record Detail' }}
        actions={[
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
              {listAdditions?.metaData?.status === 'ACCEPTED' ? (
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
                    onClick={() => {
                      /* onChangeStatus(inventoryId, 'REJECTED') */
                    }}
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
                    onClick={() => {
                      onAcceptTransaction()
                    }}
                  >
                    Approve
                  </Button>
                </>
              )}
            </>
          ),
        ]}
      />
      <Mht
        configs={consumptionRecordDetailsConfigs()}
        tableData={mhtDisposalDetailData}
        withSearch
        hideTotal={false}
        withFooter
      />
    </div>
  )
}

export default ConsumptionRecordDetail
