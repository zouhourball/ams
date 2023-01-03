import { useEffect, useState } from 'react'
import Mht from '@target-energysolutions/mht'
import { get } from 'lodash-es'
// import { connect } from 'react-redux'
import { CircularProgress } from 'react-md'
import { useQuery } from 'react-query'
import { addToast } from 'modules/app/actions'

import {
  getDownloadToken,
  getAnnualPlans,
  deleteAnnualPlan,
  acknowledgeAnnualPlan,
} from 'libs/api/api-tendering'
import mutate from 'libs/hocs/mutate'
import { fileDownloadTus } from 'libs/api/tus-upload'

import { usePrevious } from 'libs/utils/use-previous'

// import * as act from 'modules/app/actions'
// import * as action from 'modules/plan/actions'

import ToastMsg from 'components/toast-msg'
import ConfirmDialog from '../../components/confirm-dialog'
import HeaderTemplate from 'components/header-template'

import emptyImage from './create_proposal.svg'

import { configPlan } from './helper'

import './style.scss'
const AnnualPlan = ({
  onViewDetails,
  setIsVisibleTopBar,
  mutations: { getAnnualPlans, deleteAnnualPlan, acknowledgeAnnualPlan },
  deleteAnnualPlanStatus,
  getAnnualPlansStatus,
  createAnnualPlanStatus,
  userRole,
  currentUserSubject,
  acknowledgeAnnualPlanStatus,
}) => {
  const [page, setPage] = useState(0)
  const [deletePlan, setDeletePlan] = useState(null)
  const [acknowledgePlan, setAcknowledgePlan] = useState(null)
  const prevDeleteAnnualPlanStatus = usePrevious(deleteAnnualPlanStatus)
  const prevCreateAnnualPlanStatus = usePrevious(createAnnualPlanStatus)
  const loading = get(getAnnualPlansStatus, 'pending', false)

  const [selectedRows, setSelectedRows] = useState([])

  const [annualPlans, setAnnualPlan] = useState([])

  const { data: downloadToken } = useQuery(
    ['getDownloadToken'],
    getDownloadToken,
  )

  useEffect(() => {
    if (page === 0) {
      getAnnualPlans(page).then((response) => {
        if (response.success) {
          setAnnualPlan([...get(response, 'data.data.content', [])])
        }
      })
    } else {
      getAnnualPlans(page).then((response) => {
        if (response.success) {
          setAnnualPlan([
            ...annualPlans,
            ...get(response, 'data.data.content', []),
          ])
        }
      })
    }
    setIsVisibleTopBar(false)
  }, [page])

  useEffect(() => {
    return () => {
      setAnnualPlan([])
    }
  }, [])

  useEffect(() => {
    if (
      prevDeleteAnnualPlanStatus &&
      prevDeleteAnnualPlanStatus !== deleteAnnualPlanStatus &&
      !deleteAnnualPlanStatus.pending &&
      deleteAnnualPlanStatus.data &&
      deleteAnnualPlanStatus.data.success
    ) {
      addToast(
        <ToastMsg text={'Delete annual plan successfully'} type="success" />,
      )
      page === 0
        ? getAnnualPlans(0).then((response) => {
          if (response.success) {
            setAnnualPlan([...get(response, 'data.data.content', [])])
          }
        })
        : setPage(0)
    } else if (
      prevDeleteAnnualPlanStatus &&
      prevDeleteAnnualPlanStatus !== deleteAnnualPlanStatus &&
      !deleteAnnualPlanStatus.pending &&
      deleteAnnualPlanStatus.data &&
      !deleteAnnualPlanStatus.data.success
    ) {
      addToast(
        <ToastMsg
          text={get(
            deleteAnnualPlanStatus,
            'errorMsg',
            'some thing goes wrong',
          )}
          type="error"
        />,
      )
    }
  }, [deleteAnnualPlanStatus])

  useEffect(() => {
    if (
      prevCreateAnnualPlanStatus &&
      prevCreateAnnualPlanStatus !== createAnnualPlanStatus &&
      !createAnnualPlanStatus.pending &&
      createAnnualPlanStatus.data &&
      createAnnualPlanStatus.data.success
    ) {
      addToast(
        <ToastMsg
          text={'Create new annual plan successfully'}
          type="success"
        />,
      )
      page === 0
        ? getAnnualPlans(0).then((response) => {
          if (response.success) {
            setAnnualPlan([...get(response, 'data.data.content', [])])
          }
        })
        : setPage(0)
    } else if (
      prevCreateAnnualPlanStatus &&
      prevCreateAnnualPlanStatus !== createAnnualPlanStatus &&
      !createAnnualPlanStatus.pending &&
      createAnnualPlanStatus.data &&
      !createAnnualPlanStatus.data.success
    ) {
      addToast(
        <ToastMsg
          text={get(
            createAnnualPlanStatus,
            'data.error.body.errorMsg',
            'Some goes wrong',
          )}
          type="error"
        />,
      )
    }
  }, [createAnnualPlanStatus])

  const onDeletePlanConfirm = (planId) => {
    setDeletePlan(planId)
  }

  const onDeletePlan = () => {
    deleteAnnualPlan(deletePlan)
    setDeletePlan(null)
  }

  const handleAcknowledge = (planId) => {
    setAcknowledgePlan(planId)
  }

  const fetchMoreAnnualPlan = () => {
    const totalPages = get(getAnnualPlansStatus, 'data.data.totalPages', 0)
    if (page < totalPages - 1) {
      setPage((page) => page + 1)
    }
  }

  const handleAcknowledgeAnnualPLan = () => {
    acknowledgeAnnualPlan(acknowledgePlan).then((res) => {
      if (res.success) {
        setAcknowledgePlan(null)
        addToast(
          <ToastMsg text={'Annual plan pass to acknowledge'} type="success" />,
        )
        page === 0
          ? getAnnualPlans(0).then((response) => {
            if (response.success) {
              setAnnualPlan([...get(response, 'data.data.content', [])])
            }
          })
          : setPage(0)
      }
    })
  }

  const downloadFile = (fileId, fileName) => {
    fileDownloadTus(fileId, fileName, downloadToken?.token)
  }

  const actionsHeader = (row) => {
    if (userRole === 'secretary' && row.status === 'Pending') {
      return currentUserSubject === row.submittedBy
        ? [
          {
            id: 1,
            label: 'Acknowledge',
            onClick: () => handleAcknowledge(row.id),
          },
          {
            id: 2,
            label: 'Download original file',
            onClick: () => downloadFile(row?.fileUrl, row?.fileName),
          },
          {
            id: 3,
            label: 'View annual plan details',
            onClick: () => onViewDetails(row.id, row.planType),
          },
          {
            id: 4,
            label: 'Delete annual plan',
            onClick: () => onDeletePlan(row.id),
          },
        ]
        : [
          {
            id: 1,
            label: 'Acknowledge',
            onClick: () => handleAcknowledge(row.id),
          },
          {
            id: 2,
            label: 'Download original file',
            onClick: () => downloadFile(row?.fileUrl, row?.fileName),
          },
          {
            id: 3,
            label: 'View annual plan details',
            onClick: () => onViewDetails(row.id, row.planType),
          },
        ]
    } else {
      return currentUserSubject === row.submittedBy
        ? [
          {
            id: 2,
            label: 'Download original file',
            onClick: () => downloadFile(row?.fileUrl, row?.fileName),
          },
          {
            id: 3,
            label: 'View annual plan details',
            onClick: () => onViewDetails(row.id, row.planType),
          },
          {
            id: 4,
            label: 'Delete annual plan',
            onClick: () => onDeletePlan(row.id),
          },
        ]
        : [
          {
            id: 2,
            label: 'Download original file',
            onClick: () => downloadFile(row?.fileUrl, row?.fileName),
          },
          {
            id: 3,
            label: 'View annual plan details',
            onClick: () => onViewDetails(row.id, row.planType),
          },
        ]
    }
  }

  // --------------------------

  const selectRows = (rows) => {
    setSelectedRows(rows)
  }

  return (
    <div className="annualPlan">
      <Mht
        id="tendering-annual-plan"
        configs={configPlan(
          onViewDetails,
          onDeletePlanConfirm,
          userRole,
          currentUserSubject,
          handleAcknowledge,
          downloadFile,
        )}
        tableData={annualPlans.map((v) => ({
          ...v,
          submissionDate: v.submissionDate / 1000,
        }))}
        withChecked
        withFooter
        withSearch={selectedRows?.length === 0}
        commonActions={selectedRows?.length === 0 || selectedRows?.length > 1}
        onSelectRows={selectRows}
        headerTemplate={
          selectedRows?.length === 1 ? (
            <HeaderTemplate
              title={
                selectedRows?.length === 1
                  ? `1 Row Selected`
                  : `${selectedRows?.length} Rows selected`
              }
              actions={actionsHeader(selectedRows[0])}
            />
          ) : (
            <div />
          )
        }
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
        fetchMore={fetchMoreAnnualPlan}
      />
      {loading && (
        <div className="portal">
          <CircularProgress className="annualPlan_loader" />
        </div>
      )}
      <ConfirmDialog
        visible={deletePlan}
        hideDialog={() => setDeletePlan(null)}
        title="Confirm Delete"
        text="Are you sure, you want delete this annual plan?"
        handleConfirm={onDeletePlan}
      />
      <ConfirmDialog
        visible={acknowledgePlan}
        hideDialog={() => setAcknowledgePlan(null)}
        title="Confirm Acknowledge"
        text="Are you sure, you want to pass this plan to acknowledge?"
        handleConfirm={handleAcknowledgeAnnualPLan}
      />
    </div>
  )
}
export default mutate({
  moduleName: 'annualPlans',
  mutations: { getAnnualPlans, deleteAnnualPlan, acknowledgeAnnualPlan },
})(AnnualPlan)
