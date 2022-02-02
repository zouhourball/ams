import { useState, useEffect } from 'react'
import { navigate } from '@reach/router'
import Mht from '@target-energysolutions/mht'
import { Button } from 'react-md'
import { get } from 'lodash-es'

import { usePrevious } from 'libs/utils/use-previous'
import mutate from 'libs/hocs/mutate'
import { getAllProposals, deleteProposal } from 'libs/api/api-tendering'

import { configPlan } from './helper'

// const fbpSecConfig = [
//   {
//     name: 'Plan Type',
//     dataKey: 'planType',
//     align: 'left',
//   },
//   {
//     name: 'Block',
//     dataKey: 'block',
//     align: 'left',
//   },
//   {
//     name: 'Submission Day',
//     dataKey: 'submissionDay',
//     align: 'left',
//   },
//   {
//     name: 'Submission Date',
//     dataKey: 'submissionDate',
//     align: 'left',
//   },
//   {
//     name: 'Submission By',
//     dataKey: 'submissionBy',
//     align: 'left',
//   },
//   {
//     name: 'Contract Title',
//     dataKey: 'contractTitle',
//     align: 'left',
//   },
//   {
//     name: 'Contract Type',
//     dataKey: 'contractType',
//     align: 'left',
//   },
//   {
//     name: 'Status',
//     dataKey: 'status',
//     align: 'left',
//     render: data => {
//       const renderStatus = data => (
//         <span className={data['status'].toLowerCase().replace(/ /g, '_')}>
//           {data['status']}
//         </span>
//       )
//       return renderStatus(data)
//     },
//   },
// ]

// const fbpOpConfig = [
//   {
//     name: 'Plan Type',
//     dataKey: 'planType',
//     align: 'left',
//   },
//   {
//     name: 'Block',
//     dataKey: 'block',
//     align: 'left',
//   },
//   {
//     name: 'Submission Date',
//     dataKey: 'submissionDate',
//     align: 'left',
//   },
//   {
//     name: 'Submission By',
//     dataKey: 'submissionBy',
//     align: 'left',
//   },
//   {
//     name: 'Contract Title',
//     dataKey: 'contractTitle',
//     align: 'left',
//   },
//   {
//     name: 'Contract Type',
//     dataKey: 'contractType',
//     align: 'left',
//   },
//   {
//     name: 'Status',
//     dataKey: 'status',
//     align: 'left',
//     render: data => {
//       const renderStatus = data => (
//         <span className={data['status'].toLowerCase().replace(/ /g, '_')}>
//           {data['status']}
//         </span>
//       )
//       return renderStatus(data)
//     },
//   },
// ]

// const fbpMeConfig = [
//   {
//     name: 'Plan Type',
//     dataKey: 'planType',
//     align: 'left',
//   },
//   {
//     name: 'Block',
//     dataKey: 'block',
//     align: 'left',
//   },
//   {
//     name: 'Submission Date',
//     dataKey: 'submissionDate',
//     align: 'left',
//   },
//   {
//     name: 'Submission By',
//     dataKey: 'submissionBy',
//     align: 'left',
//   },
//   {
//     name: 'Contract Title',
//     dataKey: 'contractTitle',
//     align: 'left',
//   },
//   {
//     name: 'Contract Type',
//     dataKey: 'contractType',
//     align: 'left',
//   },
//   {
//     name: 'Date',
//     dataKey: 'date',
//     align: 'left',
//   },
//   {
//     name: 'From',
//     dataKey: 'from',
//     align: 'left',
//   },
//   {
//     name: 'To',
//     dataKey: 'to',
//     align: 'left',
//   },
//   {
//     name: 'Status',
//     dataKey: 'status',
//     align: 'left',
//     render: data => {
//       const renderStatus = data => (
//         <span className={data['status'].toLowerCase().replace(/ /g, '_')}>
//           {data['status']}
//         </span>
//       )
//       return renderStatus(data)
//     },
//   },
// ]

const ActualPerformanceReport = ({
  mutations: { getAllProposals, deleteProposal },
  role,
  onClickDetails,
  onClickDelete,
  setIsVisibleTopBar,
  getAllProposalsStatus,
  deleteProposalStatus,
  newProposal,
  onEditProposal,
}) => {
  const changeNewProposal = usePrevious(newProposal)
  const [selectedRows, setSelectedRows] = useState([])

  useEffect(() => {
    getAllProposals()
  }, [])

  useEffect(() => {
    getAllProposals()
  }, [deleteProposalStatus])

  useEffect(() => {
    if (
      newProposal &&
      !newProposal.pending &&
      newProposal.data &&
      newProposal.data.success
    ) {
      getAllProposals()
    }
  }, [changeNewProposal])

  const renderAllProposals = () => {
    const allProposals = get(getAllProposalsStatus, 'data.data', [])
    return allProposals
  }

  const renderActions = () => {
    if (selectedRows.length === 1) {
      return [
        role === 'secretary' && (
          <Button
            key={3}
            flat
            primary
            onClick={() =>
              navigate(`/tendering/fbp/historian/${selectedRows[0].id}`)
            }
          >
            TRACK PROPOSAL STATUS
          </Button>
        ),
        <Button
          key={2}
          flat
          primary
          onClick={() => {
            navigate(`/tendering/fbp/${selectedRows[0].id}`)
          }}
        >
          View Details
        </Button>,
        role === 'operator' && selectedRows[0].proposalStateEnum === 'Clarify' && (
          <Button
            key={1}
            flat
            primary
            onClick={() => onEditProposal(selectedRows[0])}
            iconChildren="edit"
          >
            Edit
          </Button>
        ),
        role === 'operator' && (
          <Button
            key={0}
            flat
            primary
            onClick={() => {
              deleteProposal(selectedRows[0].id)
            }}
            iconChildren="delete_outline"
          >
            Delete
          </Button>
        ),
      ]
    }
    return []
  }
  const selectRows = (rows) => {
    setSelectedRows(rows)
  }

  return (
    <Mht
      configs={configPlan}
      tableData={renderAllProposals()}
      withChecked
      withSearch
      commonActions
      onSelectRows={selectRows}
      actions={renderActions()}
    />
  )
}
export default mutate({
  moduleName: 'proposals',
  mutations: {
    getAllProposals,
    deleteProposal,
  },
})(ActualPerformanceReport)
