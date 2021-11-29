import { navigate } from '@reach/router'
import { Button } from 'react-md'
import Mht from '@target-energysolutions/mht'
import { useQuery, useMutation } from 'react-query'
import { useMemo } from 'react'
import moment from 'moment'

import {
  detailCostsCostByLoggedUser,
  updateCostsCost,
} from 'libs/api/cost-recovery-api'

import TopBarDetail from 'components/top-bar-detail'
import useRole from 'libs/hooks/use-role'

import { costRecoveryDetailsConfigs } from '../helpers'

import './style.scss'

const CostRecoveryDetails = ({ location: { pathname }, detailId }) => {
  const subModule = pathname?.split('/')[4]
  const { mutate: acknowledgeAnnualCostsExp } = useMutation(updateCostsCost)

  const role = useRole('costrecovery')

  const { data: costsDetail } = useQuery(
    ['detailCostsCostByLoggedUser', detailId],
    subModule === 'costs' && detailCostsCostByLoggedUser,
  )

  const costRecoveryDetailsData = useMemo(() => {
    switch (subModule) {
      case 'costs':
        return (
          costsDetail?.items?.map((el) => ({
            category: el?.category,
            subCategory: el?.subCategory,
            uom: el?.uom,
            group: el?.group,
            item: el?.name,
            costDescription: el?.explanation,
            year: [
              {
                approved: el?.qvalues?.map((el) => ({ plan: el?.plan || '' })),
              },
              {
                outlook: el?.qvalues?.map((el) => ({
                  outlook: el?.quarter || '',
                })),
              },
              { ytd: el?.qvalues?.map((el) => ({ actual: el?.actual || '' })) },
            ],
          })) || []
        )
      default:
        return {}
    }
  }, [costsDetail, subModule])

  const detailData = useMemo(() => {
    switch (subModule) {
      case 'costs':
        return {
          title: 'Annual Cost and Expenditure',
          subTitle: costsDetail?.metaData?.block,
          companyName: costsDetail?.metaData?.company,
          submittedDate: moment(costsDetail?.metaData.createdAt).format(
            'DD MMM, YYYY',
          ),
          submittedBy: costsDetail?.metaData?.createdBy?.name,
        }
      default:
        return {}
    }
  }, [costsDetail, subModule])

  const handleAcknowledge = () => {
    switch (subModule) {
      case 'costs':
        acknowledgeAnnualCostsExp({
          objectId: detailId,
          status: 'ACKNOWLEDGED',
        })
        break
      default:
        break
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
      className="top-bar-buttons-list-item-btn view-doc"
      flat
      primary
      onClick={() => {}}
    >
      Download Original File
    </Button>,
    role === 'regulator' && (
      <Button
        key="4"
        id="acknowledge"
        className="top-bar-buttons-list-item-btn view-doc"
        flat
        primary
        onClick={() => {
          handleAcknowledge()
        }}
      >
        Acknowledge
      </Button>
    ),
  ]
  return (
    <div className="cost-recovery-details">
      <TopBarDetail
        title={'Annual Cost and Expenditure'}
        onClickBack={() => navigate(`/ams/costrecovery`)}
        actions={actions}
        detailData={detailData}
      />
      <Mht
        configs={costRecoveryDetailsConfigs}
        tableData={costRecoveryDetailsData}
        withSearch
        commonActions
        withSubColumns
        hideTotal={false}
        withFooter
      />
    </div>
  )
}
export default CostRecoveryDetails
