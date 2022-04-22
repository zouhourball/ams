import { useState, useEffect, useMemo, useCallback } from 'react'
import { get } from 'lodash-es'
import { connect } from 'react-redux'
import { MenuButton, DialogContainer, Button } from 'react-md'
import moment from 'moment'
import { navigate } from '@reach/router'

import Mht from '@target-energysolutions/mht'

import { useQuery } from 'react-query'

import {
  getAllProposals,
  getAllProposalsByCompany,
  deleteProposal,
  createMeeting,
  passToAgendaProposal,
  getMembers,
  approvedProposal,
  rejectedProposal,
  getMeetingsList,
  // meetings,
} from 'libs/api/api-tendering'
import mutate from 'libs/hocs/mutate'

import { usePrevious } from 'libs/utils/use-previous'
import { useTranslation } from 'libs/langs'

import * as act from 'modules/app/actions'

import ToastMsg from '../../components/toast-msg'
import CreateAgenda from '../../components/create-agenda'
import HeaderTemplate from 'components/header-template'
import TopBarDetail from 'components/top-bar-detail'

import {
  config,
  // statusListSec,
  // statusListOp,
  // statusListMem,
  allStatusList,
} from './helper'
import emptyProposals from './create_proposal.svg'

import './style.scss'

const FunctionBusinessProcessByOrg = ({
  mutations: {
    getAllProposals,
    getAllProposalsByCompany,
    deleteProposal,
    createMeeting,
    passToAgendaProposal,
    getMembers,
    approvedProposal,
    rejectedProposal,
  },
  getAllProposalsStatus,
  getAllProposalsByCompanyStatus,
  deleteProposalStatus,
  newProposal,
  clarifiedProposal,
  role,
  onHideDialog,
  onEditProposal,
  addToast,
  passToAgendaProposalStatus,
  createMeetingStatus,
  organizationID,
  orgId,
  selectedRows,
  setSelectedRows,
  // approvedProposal,
  // rejectedProposal,
  clarifyProposal,
  underReviewProposal,
  onClarify,
  openCreateAgenda,
  setOpenCreateAgenda,
  handleAttachedFiles,
  onReview,
  publishProposal,
  onPublish,
}) => {
  const { t } = useTranslation()
  const changeNewProposal = usePrevious(newProposal)
  const changeClarifiedProposal = usePrevious(clarifiedProposal)
  const [status, setStatus] = useState('All')
  const [agendaData, setAgendaData] = useState(null)
  const [deleteVisibility, setDeleteVisibility] = useState(false)
  const [workspaceID, setWorkspaceID] = useState(0)
  const [info, setInformation] = useState(null)
  useEffect(() => {
    role === 'operator'
      ? getAllProposals()
      : getAllProposalsByCompany(decodeURIComponent(orgId), organizationID)
  }, [])
  const prevUnderReviewProposalStatus = usePrevious(underReviewProposal)
  useEffect(() => {
    if (
      prevUnderReviewProposalStatus &&
      prevUnderReviewProposalStatus !== underReviewProposal &&
      !underReviewProposal.pending &&
      underReviewProposal.data &&
      underReviewProposal.data.success
    ) {
      setSelectedRows([])
      role === 'operator'
        ? getAllProposals()
        : getAllProposalsByCompany(decodeURIComponent(orgId), organizationID)
    }
  }, [underReviewProposal])
  const prevApprovedProposalStatus = usePrevious(approvedProposal)
  const prevPublishProposalStatus = usePrevious(publishProposal)

  useEffect(() => {
    if (
      prevPublishProposalStatus &&
      prevPublishProposalStatus !== publishProposal &&
      !publishProposal.pending &&
      publishProposal.data &&
      publishProposal.data.success &&
      !publishProposal.data.errorMsg
    ) {
      setSelectedRows([])
      role === 'operator'
        ? getAllProposals()
        : getAllProposalsByCompany(decodeURIComponent(orgId), organizationID)
    }
  }, [publishProposal])

  useEffect(() => {
    if (
      prevApprovedProposalStatus &&
      prevApprovedProposalStatus !== approvedProposal &&
      !approvedProposal.pending &&
      approvedProposal.data &&
      approvedProposal.data.success
    ) {
      setSelectedRows([])
      role === 'operator'
        ? getAllProposals()
        : getAllProposalsByCompany(decodeURIComponent(orgId), organizationID)
    }
  }, [approvedProposal])
  const prevRejectedProposal = usePrevious(rejectedProposal)
  useEffect(() => {
    if (
      prevRejectedProposal &&
      prevRejectedProposal !== rejectedProposal &&
      !rejectedProposal.pending &&
      rejectedProposal.data &&
      rejectedProposal.data.success
    ) {
      setSelectedRows([])
      role === 'operator'
        ? getAllProposals()
        : getAllProposalsByCompany(decodeURIComponent(orgId), organizationID)
    }
  }, [rejectedProposal])
  const clarifyProposalProposal = usePrevious(clarifyProposal)
  useEffect(() => {
    if (
      clarifyProposalProposal &&
      clarifyProposalProposal !== clarifyProposal &&
      !clarifyProposal.pending &&
      clarifyProposal.data &&
      clarifyProposal.data.success
    ) {
      setSelectedRows([])
      role === 'operator'
        ? getAllProposals()
        : getAllProposalsByCompany(decodeURIComponent(orgId), organizationID)
    }
  }, [clarifyProposal])
  useEffect(() => {
    if (
      passToAgendaProposalStatus &&
      !passToAgendaProposalStatus.pending &&
      passToAgendaProposalStatus.data
    ) {
      if (
        agendaData &&
        passToAgendaProposalStatus.data.success &&
        get(passToAgendaProposalStatus, 'data.data.processInstanceId', null)
      ) {
        const res = {
          title: agendaData.title,
          objective: agendaData.title,
          agenda: agendaData.title,
          startDate: `${agendaData.date} ${moment({
            hour: agendaData.startTime.split(':')[0],
            minute: agendaData.startTime.split(':')[1],
          })
            .utc()
            .format('HH:mm')}`,
          endDate: `${agendaData.date} ${moment({
            hour: agendaData.endTime.split(':')[0],
            minute: agendaData.endTime.split(':')[1],
          })
            .utc()
            .format('HH:mm')}`,
          workspaceId: get(agendaData, 'workspace.id', '0'),
          workspaceName: get(agendaData, 'workspace.name', 'placeholder'),
          orgId: organizationID,
          processInstanceId: get(
            passToAgendaProposalStatus,
            'data.data.processInstanceId',
            null,
          ),
          participants: agendaData.selectedItems.map((el) => {
            return {
              sub: el.subject,
              name: el.name,
              email: el.email,
              // role: String
            }
          }),
          chapters: agendaData.chapters.map(
            ({ id, chapter, voiceMemos, objective, agenda }) => ({
              chapterName: chapter,
              objective,
              agenda,
              voiceMemos,
              proposalId: id,
            }),
          ),
        }
        createMeeting(res)

        // getAllProposals()
      } else if (passToAgendaProposalStatus.data.error) {
        addToast(
          <ToastMsg
            text={
              get(
                passToAgendaProposalStatus,
                'data.error.body.errorMsg',
                null,
              ) ||
              get(
                passToAgendaProposalStatus,
                'data.error.body.message',
                null,
              ) ||
              'Something went wrong. Please try again later.'
            }
            type="error"
          />,
        )
        setOpenCreateAgenda(false)
        setAgendaData(null)
      }
    }
  }, [passToAgendaProposalStatus])

  useEffect(() => {
    if (
      createMeetingStatus &&
      !createMeetingStatus.pending &&
      createMeetingStatus.data
    ) {
      if (createMeetingStatus.data.success) {
        role === 'operator'
          ? getAllProposals()
          : getAllProposalsByCompany(decodeURIComponent(orgId), organizationID)
        setOpenCreateAgenda(false)
        setAgendaData(null)
      } else if (createMeetingStatus.data.error) {
        addToast(
          <ToastMsg
            text={
              get(createMeetingStatus, 'data.error.body.errorMsg', null) ||
              get(createMeetingStatus, 'data.error.body.message', null) ||
              'Something went wrong. Please try again later.'
            }
            type="error"
          />,
        )
        setOpenCreateAgenda(false)
        setAgendaData(null)
      }
    }
  }, [createMeetingStatus])

  useEffect(() => {
    if (
      deleteProposalStatus &&
      !deleteProposalStatus.pending &&
      deleteProposalStatus.data
    ) {
      if (deleteProposalStatus.data.success) {
        role === 'operator'
          ? getAllProposals()
          : getAllProposalsByCompany(decodeURIComponent(orgId), organizationID)
      } else if (deleteProposalStatus.data.error) {
        addToast(
          <ToastMsg
            text={
              get(deleteProposalStatus, 'data.error.body.errorMsg', null) ||
              get(deleteProposalStatus, 'data.error.body.message', null) ||
              'Something went wrong. Please try again later.'
            }
            type="error"
          />,
        )
      }
      setDeleteVisibility(false)
    }
  }, [deleteProposalStatus])

  useEffect(() => {
    if (
      (changeNewProposal &&
        changeNewProposal !== newProposal &&
        !newProposal.pending &&
        newProposal.data &&
        newProposal.data.success) ||
      (changeClarifiedProposal &&
        changeClarifiedProposal !== clarifiedProposal &&
        !clarifiedProposal.pending &&
        clarifiedProposal.data &&
        clarifiedProposal.data.success)
    ) {
      role === 'operator'
        ? getAllProposals()
        : getAllProposalsByCompany(decodeURIComponent(orgId), organizationID)
      onHideDialog()
    }
  }, [newProposal, clarifiedProposal])

  const onDeleteProposal = useCallback((id) => {
    setDeleteVisibility(id)
  }, [])

  const renderStatusList = (role) => {
    // switch (role) {
    //   case 'operator':
    //     return statusListOp
    //   case 'secretary':
    //     return statusListSec
    //   case 'member':
    //     return statusListMem
    // }
    return allStatusList
  }
  const renderStatus = (status) => {
    switch (status) {
      case 'Under Review':
        return 'UnderReview'
      case 'Passed To Agenda':
        return 'PassedToAgenda'
      default:
        return status
    }
  }
  const renderAllProposals = () => {
    const allProposals = (
      status === 'All'
        ? get(
          role === 'operator'
            ? getAllProposalsStatus
            : getAllProposalsByCompanyStatus,
          'data.data',
          [],
        )
        : get(
          role === 'operator'
            ? getAllProposalsStatus
            : getAllProposalsByCompanyStatus,
          'data.data',
          [],
        ).filter((elem) => elem.proposalStateEnum === renderStatus(status))
    ).map((elem) => ({
      ...elem,
      submissionDate: moment(elem.submissionDate).unix(),
    }))
    return allProposals.sort((a, b) => b.submissionDate - a.submissionDate)
  }

  const renderDataByStatus = () => {
    const dataWithStatus = renderStatusList(role).map((el) => {
      return {
        primaryText: el.status,
        onClick: () => {
          setStatus(el.status)
          setSelectedRows([])
        },
      }
    })
    const dataStatusWithoutPending = dataWithStatus.filter(
      (row) => row.primaryText !== 'Pending',
    )
    return [
      {
        primaryText: 'All',
        onClick: () => {
          setStatus('All')
          setSelectedRows([])
        },
      },
      ...dataStatusWithoutPending,
    ]
  }

  const selectRows = (rows) => {
    setSelectedRows(rows)
  }
  const onCreateAgenda = (agenda) => {
    setAgendaData(agenda)
    const {
      title,
      date,
      startTime,
      endTime,
      selectedItems,
      chapters,
      workspace,
    } = agenda
    const body = {
      title,
      objective: title,
      startDate: moment(`${date} ${startTime}`, 'DD-MM-YYYY HH:mm').unix(),
      endDate: moment(`${date} ${endTime}`, 'DD-MM-YYYY HH:mm').unix(),
      workspaceId: workspace.id || '0',
      workspaceName: workspace.name || 'placeholder',
      proposals: chapters.map(({ id }) => id),
      participants: selectedItems,
    }
    passToAgendaProposal(body)
  }

  const seeInformation = (info) => {
    setInformation(info)
  }
  const fetchMembers = async () => {
    const { data: members } = await getMembers(organizationID)
    return members
  }

  const { data: listMeetings } = useQuery(
    ['meetingsList', '0'],
    getMeetingsList,
  )
  // const { data: meetingss } = useQuery(
  //   ['meetingsList', 'c681c16a-c6a8-413a-b146-45df7eef60d6'],
  //   meetings,
  // )
  // console.log(meetingss, 'getMeetingsList')
  const handleShowMeeting = async (agenda, proposalId) => {
    if (agenda.workspaceId) {
      const meeting =
        listMeetings?.content?.length > 0 &&
        listMeetings.content.find(
          (el) => +get(el, 'additionalInfos.proposalId', null) === proposalId,
        )
      meeting &&
        window.open(
          `${PRODUCT_APP_URL_WORKSPACE}/${meeting.orgId}/workspace/${meeting.workspaceId}/meeting/${meeting.id}`,
        )
    }
  }

  const mhtConfig = useMemo(
    () =>
      config(
        role,
        onReview,
        onClarify,
        seeInformation,
        onDeleteProposal,
        handleAttachedFiles,
        handleShowMeeting,
        onEditProposal,
      ),
    [role, onReview, onClarify, onDeleteProposal, handleAttachedFiles],
  )

  const actionsHeader = (row) => {
    switch (role) {
      case 'operator':
      default:
        return [
          {
            id: 1,
            label: 'Information',
            onClick: () => {
              seeInformation({
                toClarifyComment: row.toClarifyComment,
                toClarifyAttachments: row.toClarifyAttachments,
              })
            },
            disabled:
              !row.toClarifyComment && row.proposalStateEnum !== 'Clarify',
          },
          {
            id: 2,
            label: 'edit',
            onClick: () => {
              onEditProposal(row)
            },
            disabled: !(row.proposalStateEnum === 'Clarify'),
          },
          {
            id: 3,
            label: 'Supporting Documents',
            onClick: () => handleAttachedFiles(row),
          },

          {
            id: 4,
            label: 'Delete',
            onClick: () => onDeleteProposal(row.id),
            disabled: row.proposalStateEnum !== 'New',
          },
          {
            id: 5,
            label: 'Meeting View',
            onClick: () => handleShowMeeting(row?.agendas[0], row.id),
            disabled: !['Rejected', 'Approved', 'PassedToAgenda'].includes(
              row.proposalStateEnum,
            ),
          },
        ]

      case 'secretary':
        if (row.proposalStateEnum !== 'ApprovedPublished') {
          return [
            {
              id: 1,
              label:
                row.proposalStateEnum === 'UnderReview'
                  ? 'Create Agenda'
                  : row.proposalStateEnum === 'Approved'
                    ? 'Publish'
                    : 'Review',
              onClick: () =>
                row.proposalStateEnum === 'UnderReview'
                  ? setOpenCreateAgenda(true)
                  : row.proposalStateEnum === 'Approved'
                    ? onPublish(row)
                    : onReview(row.id),
              // disabled:
              //   row.proposalStateEnum !== 'UnderReview'
              //     ? !['New', 'Clarified'].includes(row.proposalStateEnum)
              //     : !(row.proposalStateEnum === 'UnderReview'),
            },
            {
              id: 1,
              label: 'Request For Information',
              onClick: () => onClarify(row.id, row.tenderStatus),
              disabled: !['New', 'Clarified'].includes(row.proposalStateEnum),
            },
            {
              id: 1,
              label: 'View Process Historian',
              onClick: () =>
                navigate(`/tendering/fbp/${row.companyId}/historian/${row.id}`),
            },
            {
              id: 1,
              label: 'Supporting Documents',
              onClick: () => handleAttachedFiles(row),
            },
            {
              id: 1,
              label: 'Meeting View',
              onClick: () => handleShowMeeting(row?.agendas[0], row.id),
              disabled: !['Rejected', 'Approved', 'PassedToAgenda'].includes(
                row.proposalStateEnum,
              ),
            },
          ]
        } else {
          return [
            {
              id: 1,
              label: 'View Process Historian',
              onClick: () =>
                navigate(`/tendering/fbp/${row.companyId}/historian/${row.id}`),
            },
            {
              id: 1,
              label: 'Supporting Documents',
              onClick: () => handleAttachedFiles(row),
            },
          ]
        }
      case 'chairman':
        return [
          {
            id: 1,
            label: 'Reject',
            className: 'functionBusinessProcessByOrg-dataTable-btn reject',
            onClick: () => {
              // setProposalId(selectedRows[0].id)
              // setOpenRejectComment(true)
            },
            disabled: !['PassedToAgenda'].includes(row.proposalStateEnum),
          },
          {
            id: 1,
            label: 'Approve',
            className: 'functionBusinessProcessByOrg-dataTable-btn approve',
            onClick: () => {
              approvedProposal(
                row.id,
                {
                  workspaceName: 'workspace test',
                  workspaceId: '1619',
                },
                organizationID,
              )
            },
            disabled: !['PassedToAgenda'].includes(row.proposalStateEnum),
          },
        ]
    }
  }

  return (
    <>
      {role !== 'operator' && (
        <TopBarDetail
          onClickBack={() => navigate(`/tendering/fbp`)}
          actions={[]}
          detailData={{
            title: renderAllProposals()[0]?.companyName || '',
            blockNumber: renderAllProposals()[0]?.blockNumber || '',
            totalProposals: renderAllProposals().length,
          }}
        />
      )}
      <Mht
        id="tendering-function-business-process-by-org"
        configs={mhtConfig}
        tableData={renderAllProposals()}
        withChecked
        className="functionBusinessProcessByOrg-dataTable"
        onSelectRows={selectRows}
        actions={[]}
        withSearch={selectedRows?.length === 0}
        commonActions={selectedRows?.length === 0 || selectedRows?.length > 1}
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
            <div>
              <MenuButton
                menuItems={renderDataByStatus()}
                iconChildren="arrow_drop_down"
                iconBefore={false}
                simplifiedMenu={false}
              >
                {status}
              </MenuButton>
            </div>
          )
        }
        renderEmpty={
          <div className="emptyContent">
            <div>
              <img src={emptyProposals} width="50px" />
              <p>
                You haven’t created any proposal yet <br />
                click New Plan on top right to create new...
              </p>
            </div>
          </div>
        }
        defaultCsvFileTitle="Function Business Process"
      />
      {openCreateAgenda && selectedRows.length !== 0 && (
        <CreateAgenda
          organizationID={organizationID}
          visible={openCreateAgenda}
          onHideDialog={() => {
            setOpenCreateAgenda(false)
            setAgendaData(null)
          }}
          workspace={workspaceID}
          setWorkspace={setWorkspaceID}
          onSave={(agenda) => onCreateAgenda(agenda)}
          members={fetchMembers}
          disabled={
            (passToAgendaProposalStatus &&
              passToAgendaProposalStatus.pending) ||
            (createMeetingStatus && createMeetingStatus.pending)
          }
          proposalList={selectedRows}
        />
      )}
      {deleteVisibility && (
        <DialogContainer
          id="delete-proposal-dialogue"
          className="deleteProposalDialog"
          visible={deleteVisibility}
          onHide={() => setDeleteVisibility(false)}
          actions={[
            <Button
              key={1}
              className="button-discard"
              flat
              primary
              onClick={() => setDeleteVisibility(false)}
            >
              Discard
            </Button>,

            <Button
              key={2}
              flat
              primary
              swapTheming
              onClick={() => deleteProposal(deleteVisibility)}
            >
              {t('confirm')}
            </Button>,
          ]}
          title="Confirm delete Proposal"
          disableScrollLocking={true}
        >
          Are you sure you want to delete this proposal ?
        </DialogContainer>
      )}
      {info && (
        <DialogContainer
          id="information-proposal-dialogue"
          className="informationProposalDialog"
          visible={info}
          onHide={() => setInformation(null)}
          actions={[
            <Button
              key={1}
              className="button-info-discard"
              flat
              primary
              onClick={() => setInformation(null)}
            >
              Close
            </Button>,
          ]}
          title="Request For Information"
          disableScrollLocking={true}
        >
          <div className="clarify-proposal-title">
            List of attachments need clarification
          </div>
          {get(info, 'toClarifyAttachments', []).map((el) => (
            <span key={el} className="clarify-proposal-chip">
              {el}
            </span>
          ))}
          <div className="clarify-proposal-text">
            {get(info, 'toClarifyComment', '')}
          </div>
        </DialogContainer>
      )}
    </>
  )
}
export default connect(
  ({ mutation, shell }) => {
    const newProposal = get(mutation, 'proposals.submitProposalStatus', {})
    const clarifiedProposal = get(
      mutation,
      'proposals.clarifiedProposalStatus',
      {},
    )
    return {
      newProposal,
      clarifiedProposal,
      organizationID: shell.organizationId,
      approvedProposal: get(mutation, 'proposals.approvedProposalStatus', {}),
      underReviewProposal: get(
        mutation,
        'proposals.underReviewProposalStatus',
        {},
      ),
      rejectedProposal: get(mutation, 'proposals.rejectedProposalStatus', {}),
      clarifyProposal: get(mutation, 'proposals.clarifyProposalStatus', {}),
      publishProposal: get(mutation, 'proposals.publishProposalStatus', {}),
    }
  },
  {
    addToast: act.addToast,
  },
)(
  mutate({
    moduleName: 'proposals-by-org',
    mutations: {
      getAllProposals,
      getAllProposalsByCompany,
      deleteProposal,
      createMeeting,
      passToAgendaProposal,
      getMembers,
      approvedProposal,
      rejectedProposal,
    },
  })(FunctionBusinessProcessByOrg),
)
