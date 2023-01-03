import { useState, useEffect } from 'react'
import { navigate } from '@reach/router'
import Mht from '@target-energysolutions/mht'
import { Button } from 'react-md'
import { get } from 'lodash-es'

import mutate from 'libs/hocs/mutate'
import { getAllProposals, deleteProposal } from 'libs/api/api-tendering'

import { config } from './helper'

import 'components/module-tendering/style.scss'

const VendorDevelopment = ({
  mutations: { getAllProposals, deleteProposal },
  getAllProposalsStatus,
  deleteProposalStatus,
  role,
  onClickDetails,
  onClickDelete,
  setIsVisibleTopBar,
  onEditProposal,
}) => {
  const [selectedRows, setSelectedRows] = useState([])
  // const getTableActions = () => {
  //   return [
  //     {
  //       text: 'view details',
  //       icon: 'remove_red_eye',
  //       onClick: () => onClickDetails(selectedRows[0].data.id),
  //     },
  //     {
  //       text: 'delete',
  //       icon: 'delete',
  //       onClick: () => onClickDelete(selectedRows[0].data.id),
  //     },
  //   ]
  // }

  // const menuBarRenderTree = () => {
  //   return [
  //     {
  //       name: 'Vendor Development',
  //       link: () => navigate('/tendering/vd'),
  //     },
  //     {
  //       name: 'Target Oil Fields',
  //     },
  //   ]
  // }
  // const menuBarRenderActions = () => {
  //   return [
  //     {
  //       label: 'CLOSE',
  //       action: () => {
  //         navigate('/tendering/vd')
  //       },
  //       isVisible: true,
  //       swapTheming: false,
  //       active: true,
  //     },
  //   ]
  // }
  // const filterControls = [
  //   {
  //     id: 1,
  //     label: 'Contract Reference Number',
  //     value: 'Contract Reference Number',
  //   },
  //   {
  //     id: 2,
  //     label: 'Awarding Operator',
  //     value: 'Awarding Operator',
  //   },
  //   { id: 3, label: 'Block', value: 'Block' },
  //   {
  //     id: 4,
  //     label: 'Scope Of Contract',
  //     value: 'Scope Of Contract',
  //   },
  //   {
  //     id: 5,
  //     label: 'Type Of Contract',
  //     value: 'Type Of Contract',
  //   },
  //   {
  //     id: 6,
  //     label: 'Threashold Level',
  //     value: 'Threashold Level',
  //   },
  // ]

  // const renderConfig = role => {
  //   switch (role) {
  //     case 'operator':
  //       return fbpOpConfig
  //     case 'secretary':
  //       return fbpSecConfig
  //     case 'member':
  //       return fbpMeConfig
  //     default:
  //       break
  //   }
  // }

  // const renderData = () => {
  //   switch (role) {
  //     case 'operator':
  //       return dataOp
  //     case 'secretary':
  //       return dataSec
  //     case 'member':
  //       return dataMem
  //   }
  // }

  // const renderStatusList = role => {
  //   switch (role) {
  //     case 'operator':
  //       return statusListOp
  //     case 'secretary':
  //       return statusListSec
  //     case 'member':
  //       return statusListMem
  //   }
  // }

  useEffect(() => {
    role === 'operator' && getAllProposals()
  }, [deleteProposalStatus])

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
          onClick={() => navigate(`/tendering/fbp/${selectedRows[0].id}`)}
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

  const renderAllProposals = () => {
    const allProposals = get(getAllProposalsStatus, 'data.data', [])
    return allProposals
  }

  return (
    <div className="mht-tendering">
      <Mht
        configs={config}
        tableData={renderAllProposals()}
        withChecked
        withSearch
        commonActions
        onSelectRows={selectRows}
        actions={renderActions()}
        withFooter
      />
    </div>
  )
}
export default mutate({
  moduleName: 'proposals',
  mutations: {
    getAllProposals,
    deleteProposal,
  },
})(VendorDevelopment)
