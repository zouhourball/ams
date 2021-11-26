import { navigate } from '@reach/router'
import { Button } from 'react-md'
import Mht from '@target-energysolutions/mht'
import { useQuery } from 'react-query'
import { useMemo } from 'react'
import moment from 'moment'

import { detailReserveByLoggedUser } from 'libs/api/api-reserves'

import TopBarDetail from 'components/top-bar-detail'
import { userRole } from 'components/shared-hook/get-roles'

import { annualReservesDetailsConfigs } from '../helpers'

import './style.scss'

const ReservesDetails = ({ location: { pathname }, detailId }) => {
  const subModule = pathname?.split('/')[4]

  const { data: reserveDetail } = useQuery(
    ['detailReserveByLoggedUser', detailId],
    subModule === 'reserve' && detailReserveByLoggedUser,
  )
  const reserveDetailsData = useMemo(() => {
    // console.log(subModule)
    switch (subModule) {
      case 'reserve':
        return (
          reserveDetail?.items?.map((el) => ({
            id: '2656552',
            category: 'BLOCK SUMMARY',
            items: 'P50 In Place Volume (HCIIP)',
            hydrocarbonTypes: [{ oil: '0' }, { condensate: '0' }, { gaz: '0' }],
          })) || []
        )
      default:
        return {}
    }
  }, [reserveDetail, subModule])

  const detailData = useMemo(() => {
    switch (subModule) {
      case 'costs':
        return {
          title: 'Annual Cost and Expenditure',
          subTitle: reserveDetail?.metaData?.block,
          companyName: reserveDetail?.metaData?.company,
          submittedDate: moment(reserveDetail?.metaData.createdAt).format(
            'DD MMM, YYYY',
          ),
          submittedBy: reserveDetail?.metaData?.createdBy?.name,
        }
      default:
        return {}
    }
  }, [reserveDetail, subModule])

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
    userRole() === 'regulator' && (
      <Button
        key="4"
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
