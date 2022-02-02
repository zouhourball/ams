import { useEffect, useState } from 'react'
import { navigate } from '@reach/router'
import { get } from 'lodash-es'
import { CircularProgress } from 'react-md'

import Mht from '@target-energysolutions/mht'

import mutate from 'libs/hocs/mutate'
import { getAnnualPlanById } from 'libs/api/api-tendering'

// import NavigateMenu from '../../components/navigate-menu'
import TopBarDetail from 'components/top-bar-detail'

import emptyImage from '../../components/annual-plan/create_proposal.svg'

import { configs, configsOngoing, configsCloseOut } from './helper'

import './style.scss'
const AnnualPlanDetail = ({
  setIsVisibleTopBar,
  mutations: { getAnnualPlanById },
  getAnnualPlanByIdStatus,
  annualPlanId,
  planType,
  userRole,
  currentUserSubject,
}) => {
  const [page, setPage] = useState(0)

  const [annualPlans, setAnnualPlan] = useState([])

  const loading = get(getAnnualPlanByIdStatus, 'pending', false)

  useEffect(() => {
    if (page === 0) {
      getAnnualPlanById(annualPlanId, page).then((response) => {
        if (response.success) {
          setAnnualPlan([...get(response, 'data.data.content', [])])
        }
      })
    } else {
      getAnnualPlanById(annualPlanId, page).then((response) => {
        if (response.success) {
          setAnnualPlan([
            ...annualPlans,
            ...get(response, 'data.data.content', []),
          ])
        }
      })
    }
    setIsVisibleTopBar(true)
  }, [page])

  useEffect(() => {
    return () => {
      setAnnualPlan([])
    }
  }, [])
  const fetchMoreAnnualPlan = () => {
    const totalPages = get(getAnnualPlanByIdStatus, 'data.data.totalPages', 0)
    if (page < totalPages - 1) {
      setPage((page) => page + 1)
    }
  }
  const renderConfigs = () => {
    switch (planType) {
      case 'Closeout':
        return configsCloseOut()
      case 'Ongoing':
        return configsOngoing()
      case 'New':
      default:
        return configs()
    }
  }
  return (
    <div className="annualPlanDetail">
      <TopBarDetail
        onClickBack={() => navigate(`/tendering/bs/plan`)}
        actions={[]}
        detailData={{
          title: `${annualPlans[0]?.companyName} Details`,
          blockNumber: annualPlans[0]?.blockNumber,
          totalProposals: annualPlans.length,
        }}
      />
      <div className="annualPlanDetail_details">
        <Mht
          id="tendering-annual-plan-details"
          configs={renderConfigs()}
          tableData={annualPlans || []}
          withChecked
          withSearch
          commonActions
          fetchMore={fetchMoreAnnualPlan}
          renderEmpty={
            <div className="emptyContent">
              <div>
                <img src={emptyImage} width="50px" />
                <p>
                  You haven’t created any annual plan yet <br />
                  click New Plan on top right to create new...
                </p>
              </div>
            </div>
          }
        />
        {loading && (
          <div className="portal">
            <CircularProgress className="annualPlanDetail_loader" />
          </div>
        )}
      </div>
    </div>
  )
}

export default mutate({
  moduleName: 'annual',
  mutations: { getAnnualPlanById },
})(AnnualPlanDetail)
