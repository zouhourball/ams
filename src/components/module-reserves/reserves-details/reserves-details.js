import { navigate } from '@reach/router'
import { Button } from 'react-md'
import Mht from '@target-energysolutions/mht'
import { useQuery, useMutation } from 'react-query'
import { useMemo } from 'react'
import moment from 'moment'
import { useDispatch } from 'react-redux'

import useRole from 'libs/hooks/use-role'
import { addToast } from 'modules/app/actions'

import { detailReserve, updateReserveReport } from 'libs/api/api-reserves'
import { downloadOriginalFile } from 'libs/api/supporting-document-api'

import TopBarDetail from 'components/top-bar-detail'
import ToastMsg from 'components/toast-msg'

import { annualReservesDetailsConfigs } from '../helpers'

import './style.scss'

const ReservesDetails = ({ location: { pathname }, reserveId, subkey }) => {
  const dispatch = useDispatch()
  const subModule = subkey
  let role = useRole('reserves')

  const { data: reserveDetail } = useQuery(
    ['detailReserve', reserveId, subModule],
    reserveId && detailReserve,
  )
  const updateReport = useMutation(updateReserveReport, {
    onSuccess: (res) => {
      if (!res.error) {
        navigate('/ams/reserves')
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
  const reserveDetailsData = useMemo(() => {
    // console.log(subModule)
    switch (subModule) {
      case 'annual':
        return (
          reserveDetail?.items?.map((el) => ({
            id: '2656552',
            category: 'BLOCK SUMMARY',
            items: 'P50 In Place Volume (HCIIP)',
            hydrocarbonTypes: [{ oil: '0' }, { condensate: '0' }, { gaz: '0' }],
            createdAt: 2022,
            status: 'ACKNOWLEDGED',
          })) || []
        )
      case 'fyf':
        return (
          reserveDetail?.items?.map((el) => ({
            id: '2656552',
            category: 'BLOCK SUMMARY',
            items: 'P50 In Place Volume (HCIIP)',
            hydrocarbonTypes: [{ oil: '0' }, { condensate: '0' }, { gaz: '0' }],
            status: 'ACKNOWLEDGED',
          })) || []
        )
      case 'annualResource':
        return (
          reserveDetail?.items?.map((el) => ({
            id: '2656552',
            category: 'BLOCK SUMMARY',
            items: 'P50 In Place Volume (HCIIP)',
            hydrocarbonTypes: [{ oil: '0' }, { condensate: '0' }, { gaz: '0' }],
            status: 'ACKNOWLEDGED',
          })) || []
        )
      default:
        return (
          reserveDetail?.items?.map((el) => ({
            id: '2656552',
            category: 'BLOCK SUMMARY',
            items: 'P50 In Place Volume (HCIIP)',
            hydrocarbonTypes: [{ oil: '0' }, { condensate: '0' }, { gaz: '0' }],
            status: 'ACKNOWLEDGED',
          })) || []
        )
    }
  }, [reserveDetail, subModule])

  const onAcknowledge = (subModule, objectId, status) => {
    updateReport.mutate({
      subModule: subModule,
      objectId: objectId,
      status: status,
    })
  }
  const detailData = useMemo(() => {
    switch (subModule) {
      case 'annual':
        return {
          title: 'Annual Cost and Expenditure',
          subTitle: reserveDetail?.metaData?.block,
          companyName: reserveDetail?.metaData?.company,
          submittedDate: moment(reserveDetail?.metaData?.createdAt).format(
            'DD MMM, YYYY',
          ),
          submittedBy: reserveDetail?.metaData?.createdBy?.name,
        }
      case 'fyf':
        return {
          title: 'Annual Cost and Expenditure',
          subTitle: reserveDetail?.metaData?.block,
          companyName: reserveDetail?.metaData?.company,
          submittedDate: moment(reserveDetail?.metaData?.createdAt).format(
            'DD MMM, YYYY',
          ),
          submittedBy: reserveDetail?.metaData?.createdBy?.name,
        }
      case 'annualResource':
        return {
          title: 'Annual Cost and Expenditure',
          subTitle: reserveDetail?.metaData?.block,
          companyName: reserveDetail?.metaData?.company,
          submittedDate: moment(reserveDetail?.metaData?.createdAt).format(
            'DD MMM, YYYY',
          ),
          submittedBy: reserveDetail?.metaData?.createdBy?.name,
        }
      default:
        return {
          title: 'Annual Cost and Expenditure',
          subTitle: reserveDetail?.metaData?.block,
          companyName: reserveDetail?.metaData?.company,
          submittedDate: moment(reserveDetail?.metaData?.createdAt).format(
            'DD MMM, YYYY',
          ),
          submittedBy: reserveDetail?.metaData?.createdBy?.name,
        }
    }
  }, [reserveDetail, subModule])
  // console.log(reserveDetailsData, 'status')
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
        downloadOriginalFile(
          reserveDetailsData?.fileId,
          reserveDetailsData?.fileName,
        )
      }}
    >
      Download Original File
    </Button>,
    role === 'regulator' && reserveDetailsData?.status !== 'ACKNOWLEDGED' && (
      <Button
        key="4"
        id="acknowledge"
        className="top-bar-buttons-list-item-btn"
        flat
        primary
        swapTheming
        onClick={() => {
          onAcknowledge(subModule, reserveId, 'ACKNOWLEDGED')
        }}
      >
        Acknowledge
      </Button>
    ),
  ]
  // console.log(reserveDetailsData, 'reserveDetailsData');
  return (
    <div className="reserves-details">
      <TopBarDetail
        title={'Annual Reserves Reporting'}
        onClickBack={() => navigate('/ams/reserves')}
        actions={actions}
        detailData={detailData}
      />
      <Mht
        id="reserves-details"
        configs={annualReservesDetailsConfigs()}
        tableData={reserveDetailsData}
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
