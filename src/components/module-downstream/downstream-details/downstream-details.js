import { useMemo } from 'react'
import { navigate } from '@reach/router'
import { Button } from 'react-md'
import { useQuery } from 'react-query'
import moment from 'moment'

import {
  detailLpgDownstreamByLoggedUser,
  // updateDownstreamLpg,
} from 'libs/api/downstream-api'

import Mht from '@target-energysolutions/mht'
import { configsLpgDialogMht } from '../mht-helper-dialog'

import TopBarDetail from 'components/top-bar-detail'
import { userRole } from 'components/shared-hook/get-roles'
// import {
//   liquefiedPetroleumGasConfigs,
//   liquefiedPetroleumGasData,
// } from '../helpers'

import './style.scss'

const DownstreamDetails = ({ location: { pathname }, downstreamId }) => {
  const role = userRole('downstream')
  const subModule = pathname?.split('/')[4]

  const { data: downstreamDetail } = useQuery(
    ['detailLpgDownstreamByLoggedUser', subModule, downstreamId],
    subModule && detailLpgDownstreamByLoggedUser,
  )
  const DownstreamDetailsData = useMemo(() => {
    switch (subModule) {
      case 'lpg':
        return (
          downstreamDetail?.data?.map((el) => ({
            company: el?.company,
            quota: el?.quota,
            lifting: el?.actualLifted?.map((source) => ({
              source1: source[0]?.value,
              source2: source[1]?.value,
            })),
            total: el?.totalLifted,
            remarks: el?.remarks,
            variance: el?.variance,
          })) || []
        )
      default:
        return {}
    }
  }, [downstreamDetail, subModule])
  const detailData = useMemo(() => {
    switch (subModule) {
      case 'lpg':
        return {
          title: downstreamDetail?.metaData?.company,
          submittedDate: moment(downstreamDetail?.metaData.createdAt).format(
            'DD MMM, YYYY',
          ),
          submittedBy: downstreamDetail?.metaData?.createdBy?.name,
        }
      default:
        return {}
    }
  }, [downstreamDetail, subModule])
  const actions =
    role === 'operator'
      ? [
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
      : [
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
          key="3"
          id="acknowledge"
          className="top-bar-buttons-list-item-btn"
          flat
          primary
          swapTheming
          onClick={() => {}}
        >
            Acknowledge
        </Button>,
      ]
  return (
    <div className="details-container">
      <TopBarDetail
        onClickBack={() => navigate('/ams/downstream')}
        actions={actions}
        detailData={detailData}
      />
      <Mht
        configs={configsLpgDialogMht()}
        tableData={DownstreamDetailsData}
        withSearch
        commonActions
        withSubColumns
        hideTotal={false}
        withFooter
      />
    </div>
  )
}
export default DownstreamDetails
