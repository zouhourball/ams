import moment from 'moment'
import { Button, Avatar } from 'react-md'
import { get } from 'lodash-es'
import { navigate } from '@reach/router'

import UserInfoBySubject from '../../components/user-info-by-subject'

import { getPublicUrl } from 'libs/utils/custom-function'
import { fetchJSON } from 'libs/fetch'

import approved from '../../images/file_approved.svg'
import approvedDisabled from '../../images/file_approved_disabled.svg'

const proposalStatus = (row) => {
  const status = row.proposalStateEnum
  switch (status) {
    case 'Clarify':
      return 'Request for Information'
    case 'Clarified':
      return 'Resubmitted'
    default:
      return status
  }
}

export const config = (
  role,
  onReview,
  onClarify,
  seeInformation,
  onDelete,
  handleAttachedFiles,
  handleShowMeeting,
  onEditProposal,
) => [
  {
    label: 'Company Name',
    key: 'companyName',
    width: 180,
    displayInCsv: true,
  },
  {
    label: 'Reference No',
    key: 'referenceNumber',
    width: 180,
    displayInCsv: true,
  },
  {
    label: 'Block No',
    key: 'blockNumber',
    width: 180,
    displayInCsv: true,
  },
  {
    label: 'Submission Date',
    key: 'submissionDate',
    type: 'date',
    render: (row) => (
      <div>{moment.unix(row.submissionDate).format('DD MMM, YYYY')}</div>
    ),
    width: 200,
    displayInCsv: (row) =>
      `"${moment.unix(row.submissionDate).format('DD MMM, YYYY')}"`,
  },
  {
    label: 'Submitted By',
    key: 'submittedBy',
    align: 'center',
    width: 250,
    render: (row) => (
      <UserInfoBySubject subject={row.submittedBy}>
        {(res) => (
          <div className="submittedBy">
            <Avatar
              src={
                get(res, 'photo.aPIURL', null)
                  ? getPublicUrl(res.photo.aPIURL)
                  : null
              }
            >
              {get(res, 'photo.aPIURL', null)
                ? null
                : get(res, 'fullName.0', '')}
            </Avatar>
            {res ? res.fullName : 'N/A'}
          </div>
        )}
      </UserInfoBySubject>
    ),
    displayInCsv: (row) => submittedBy(row.submittedBy),
  },
  {
    label: 'Proposal Type',
    key: 'contractType',
    width: 180,
    displayInCsv: true,
  },
  {
    label: 'Threshold Level',
    key: 'threadHoldLevel',
    width: 180,
    displayInCsv: true,
  },
  {
    label: 'Tender Status',
    key: 'tenderStatus',
    width: 320,
    displayInCsv: true,
  },
  {
    label: 'Approved Budget by JMC',
    key: 'budgetApprovedByJMC',
    width: 180,
    displayInCsv: true,
  },
  {
    label: 'Original Cost Estimate',
    key: 'originalCostEstimate',
    width: 180,
    displayInCsv: true,
  },
  {
    label: 'Estimated Duration Per Firm',
    key: 'estimatedDurationPerPeriodFirmStartValue',
    width: 250,
    render: (row) =>
      row.estimatedDurationPerPeriodFirmStartValue &&
      row.estimatedDurationPerPeriodFirmEndValue
        ? `${moment(row.estimatedDurationPerPeriodFirmStartValue).format(
          'DD MMM, YYYY',
        )} - ${moment(row.estimatedDurationPerPeriodFirmEndValue).format(
          'DD MMM, YYYY',
        )}`
        : '--',
    displayInCsv: (row) =>
      `"${
        row.estimatedDurationPerPeriodFirmStartValue &&
        row.estimatedDurationPerPeriodFirmEndValue
          ? `${moment(row.estimatedDurationPerPeriodFirmStartValue).format(
            'DD MMM, YYYY',
          )} - ${moment(row.estimatedDurationPerPeriodFirmEndValue).format(
            'DD MMM, YYYY',
          )}`
          : '--'
      }"`,
  },
  {
    label: 'Estimated Duration Per Option',
    key: 'estimatedDurationPerPeriodOptionValue',
    width: 250,
    render: (row) =>
      row.estimatedDurationPerPeriodOptionValue &&
      row.estimatedDurationPerPeriodOptionValue.length
        ? (row.estimatedDurationPerPeriodOptionValue || []).join(', ')
        : '--',
    displayInCsv: (row) =>
      `"${
        row.estimatedDurationPerPeriodOptionValue &&
        row.estimatedDurationPerPeriodOptionValue.length
          ? (row.estimatedDurationPerPeriodOptionValue || []).join(', ')
          : '--'
      }"`,
  },
  {
    label: 'Estimated Duration Per Job',
    key: 'estimatedDurationPerJob',
    width: 250,
    displayInCsv: true,
  },
  {
    label: 'Status',
    key: 'proposalStateEnum',
    // className: 'noPadding',
    render: (row) => (
      <div
        className={`functionBusinessProcessByOrg-dataTable-status ${proposalStatus(
          row,
        )}`}
      >
        {proposalStatus(row)
          .match(/[A-Z][a-z]+/g)
          .join(' ')}
      </div>
    ),
    width: 200,
    displayInCsv: (row) => row.proposalStateEnum,
  },
  {
    label: 'Title',
    key: 'title',
    width: 300,
    expand: true,
    displayInCsv: true,
  },
  {
    label: 'Description',
    key: 'comment',
    width: 300,
    expand: true,
    displayInCsv: true,
  },
  {
    label: 'Actions',
    render: (row) => (
      <div>
        {role === 'secretary' && (
          <Button
            onClick={() => onReview(row.id)}
            icon
            disabled={!['New', 'Clarified'].includes(row.proposalStateEnum)}
            iconEl={
              <img
                src={
                  ['New', 'Clarified'].includes(row.proposalStateEnum)
                    ? approved
                    : approvedDisabled
                }
                height="18px"
              />
            }
            title="Review"
          />
        )}
        {role === 'secretary' && (
          <Button
            onClick={() => onClarify(row.id, row.tenderStatus)}
            icon
            disabled={!['New', 'Clarified'].includes(row.proposalStateEnum)}
            primary
            title="Request For Information"
          >
            info
          </Button>
        )}
        <Button
          onClick={() =>
            navigate(`/tendering/fbp/${row.companyId}/historian/${row.id}`)
          }
          icon
          primary
          title="Track Proposal Status"
        >
          restore
        </Button>
        {role === 'operator' && (
          <Button
            onClick={() => {
              seeInformation({
                toClarifyComment: row.toClarifyComment,
                toClarifyAttachments: row.toClarifyAttachments,
              })
            }}
            icon
            primary
            disabled={
              !row.toClarifyComment && row.proposalStateEnum !== 'Clarify'
            }
            title="Information"
          >
            info
          </Button>
        )}
        {role === 'operator' && (
          <Button
            onClick={() => {
              onEditProposal(row)
            }}
            icon
            primary
            disabled={!(row.proposalStateEnum === 'Clarify')}
            title="Edit Proposal"
          >
            edit
          </Button>
        )}
        <Button
          onClick={() => handleAttachedFiles(row)}
          icon
          primary
          title="View Support Documents"
        >
          attach_file
        </Button>
        {role === 'operator' && (
          <Button
            onClick={() => onDelete(row.id)}
            icon
            disabled={row.proposalStateEnum !== 'New'}
            primary
            title="Delete"
          >
            delete
          </Button>
        )}
        ,
        {
          <Button
            onClick={() => handleShowMeeting(row?.agendas[0], row.id)}
            icon
            disabled={
              !['Rejected', 'Approved', 'PassedToAgenda'].includes(
                row.proposalStateEnum,
              )
            }
            primary
            iconClassName="mdi mdi-eye-outline"
            title="Meeting View"
          />
        }
      </div>
    ),
    width: 300,
  },
]

export const allStatusList = [
  { status: 'New' },
  { status: 'Clarify' },
  { status: 'Clarified' },
  { status: 'UnderReview' },
  { status: 'PassedToAgenda' },
  { status: 'Approved' },
  { status: 'Rejected' },
]
export const statusListOp = [
  { status: 'Approved' },
  {
    status: 'Rejected',
  },
  { status: 'Under Review' },
]
export const statusListSec = [
  { status: 'Approved' },
  { status: 'Rejected' },
  { status: 'Under Review' },
  { status: 'Passed To Agenda' },
  { status: 'Not Discussed' },
]
export const statusListMem = [
  { status: 'New' },
  { status: 'Approved' },
  { status: 'Rejected' },
  { status: 'Under Review' },
]

const submittedBy = async (subject) => {
  const query = `query seeUserProfileBySubject($subject: String!) {
        seeUserProfileBySubject(subject: $subject) {
          user {
            fullName
          }
        }
      }
      `
  let res
  try {
    res = await fetchJSON(`${PRODUCT_APP_URL_PROFILE}/graphql`, {
      method: 'POST',
      body: JSON.stringify({ query, variables: { subject } }),
    })
  } catch (error) {
    res = { error }
  }
  return get(res, 'data.seeUserProfileBySubject.user.fullName', 'N/A')
}
