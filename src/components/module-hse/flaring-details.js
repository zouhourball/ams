import { Button } from 'react-md'
import { navigate } from '@reach/router'
import Mht from '@target-energysolutions/mht'
import { get } from 'lodash-es'
import { useMutation } from 'react-query'
import { useDispatch } from 'react-redux'

import TopBarDetail from 'components/top-bar-detail'
import ToastMsg from 'components/toast-msg'

import { updateFlaring } from 'libs/api/api-flaring'
import useRole from 'libs/hooks/use-role'

import { addToast } from 'modules/app/actions'

import { flaringDetailsConfigs, flaringDetailsData } from './helpers'

const FlaringDetails = () => {
  const dispatch = useDispatch()

  const role = useRole('flaring')

  const subModule = get(location, 'pathname', '/').split('/').reverse()[0]
  const objectId = get(location, 'pathname', '/').split('/').reverse()[1]

  // const { data: flaringData } = useQuery(
  //   ['getDetailFlaringById', subModule, objectId],
  //   objectId && getDetailFlaringById,
  //   {
  //     refetchOnWindowFocus: false,
  //   },
  // )
  const updateFlaringMutation = useMutation(updateFlaring, {
    onSuccess: (res) => {
      if (!res.error) {
        navigate('/ams/hse/flaring')
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

  const onAcknowledge = (subModule, objectId, status) => {
    updateFlaringMutation.mutate({
      subModule: subModule,
      objectId: objectId,
      status: status,
    })
  }
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
    role === 'regulator' && (
      <Button
        key="4"
        id="acknowledge"
        className="top-bar-detail-buttons-list-item-btn"
        flat
        primary
        swapTheming
        onClick={() => {
          onAcknowledge(subModule, objectId, 'ACKNOWLEDGED')
        }}
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
        hideTotal={false}
        withFooter
      />
    </div>
  )
}

export default FlaringDetails
