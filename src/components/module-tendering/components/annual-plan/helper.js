import { Button, Avatar } from 'react-md'
import moment from 'moment'
import { get } from 'lodash-es'

import { getPublicUrl } from 'libs/utils/custom-function'

import UserInfoBySubject from 'components/user-info-by-subject'

import image from './text-box-check-outline.svg'

export const configPlan = (
  onViewDetails,
  onDeletePlan,
  userRole,
  currentUserSubject,
  handleAcknowledge,
  downloadFile,
) => {
  return [
    {
      label: 'Company Name',
      key: 'companyName',
      width: '220',
      icon: 'mdi mdi-spellcheck',
      align: 'center',
    },
    {
      label: 'Block',
      key: 'blockNumber',
      width: '150',
      icon: 'mdi mdi-spellcheck',
      align: 'center',
    },
    {
      label: 'Plan Type',
      key: 'planType',
      width: '200',
      icon: 'mdi mdi-spellcheck',
      align: 'center',
    },
    {
      label: 'Submission Date',
      key: 'submissionDate',
      width: '200',
      icon: 'mdi mdi-calendar',
      type: 'date',
      // format: 'DD MMM, YYYY',
      align: 'center',
      render: (row) => moment.unix(+row.submissionDate).format('DD MMM, YYYY'),
    },
    {
      label: 'Submission By',
      key: 'submittedBy',
      width: '200',
      icon: 'mdi mdi-spellcheck',
      align: 'center',
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
    },
    {
      label: 'Reporting Year',
      key: 'reportingYear',
      width: '200',
      icon: 'mdi mdi-spellcheck',
      align: 'center',
      render: (row) => moment(row.reportingYear).format('YYYY'),
    },
    {
      label: 'Status',
      align: 'center',
      key: 'status',
      width: '200',
      icon: 'mdi mdi-spellcheck',
      render: (row) => <span className="status">{row.status}</span>,
    },
    {
      label: 'Actions',
      width: '220',
      align: 'center',
      icon: 'mdi mdi-gesture-double-tap',
      render: (row) => (
        <div className="actions">
          {userRole === 'secretary' && row.status === 'Pending' && (
            <Button
              onClick={() => handleAcknowledge(row.id)}
              icon
              primary
              title="Acknowledge"
              className="actions_btn"
              iconEl={<img src={image} width="20px" height="20px" />}
            />
          )}
          <Button
            title="Download original file"
            onClick={() => downloadFile(row?.fileUrl, row?.fileName)}
            icon
            primary
            className="actions_btn"
          >
            attach_file
          </Button>
          <Button
            icon
            primary
            onClick={() => onViewDetails(row.id, row.planType)}
            title="View annual plan details"
            className="actions_btn"
          >
            visibility
          </Button>
          {currentUserSubject === row.submittedBy && (
            <Button
              icon
              primary
              onClick={() => onDeletePlan(row.id)}
              className="actions_btn"
              title="Delete annual plan"
            >
              delete
            </Button>
          )}
        </div>
      ),
    },
  ]
}

export const tableDataPlan = [
  {
    planType: 'To be mentioned',
    block: '1234',
    submissionDate: '01 Jan, 2020',
    submissionBy: 'Junaid Bareera',
    imgUrl: 'https://i.pravatar.cc/150?img=59',
    contractTitle: 'To be mentioned',
    contractType: 'Major Contract',
    status: 'Pending',
    id: 'jn276726gvv772vvj8272Y7',
  },
]

export const config = [
  {
    name: 'Plan Type',
    dataKey: 'planType',
    align: 'center',
  },
  {
    name: 'Reference No',
    dataKey: 'Reference No',
    align: 'center',
  },
  {
    name: 'Block No',
    dataKey: 'Block No',
    align: 'center',
  },
  {
    name: 'Threadshold Level',
    dataKey: 'Threadshold Level',
    align: 'center',
  },
  {
    name: 'Tender Status',
    dataKey: 'Tender Status',
    align: 'center',
  },
  {
    name: 'Approved Budget by  JMC',
    dataKey: 'Approved Budget by  JMC',
    align: 'center',
  },
  {
    name: 'Original Cost Estimate',
    dataKey: 'Original Cost Estimate',
    align: 'center',
  },
  {
    name: 'Original ACV Approved',
    dataKey: 'Original ACV Approved',
    align: 'center',
  },
  {
    name: 'Original Duration',
    dataKey: 'Original Duration',
    align: 'center',
  },
  {
    name: 'Estimated Duration',
    dataKey: 'Estimated Duration',
    align: 'center',
  },
]

export const tableData = [
  {
    'Plan Type': 'ABC Company',
    'Reference No': '12321456',
    'Block No': '23',
    'Contract Type': 'New Plan 2020',
    'Threadshold Level': '5 Years',
    'Tender Status': 'Tender Strategy',
    'Approved Budget by  JMC': '$30 M',
    'Original Cost Estimate': '$22 M',
    'Original ACV Approved': '$17 M',
    'Original Duration': '3 years',
    'Estimated Duration': '4 Years',
  },
]

export const dataOp = [
  {
    planType: 'Title Sould Be Mentioned',
    block: '123456',
    submissionDate: '11-06-2019',
    submissionBy: 'Maryam Khan',
    contractTitle: 'Title should be mentioned',
    contractType: 'Major Contract',
    status: 'Pending',
    id: 1,
  },
  {
    planType: 'Title Sould Be Mentioned',
    block: '123456',
    submissionDate: '11-06-2019',
    submissionBy: 'Maryam Khan',
    contractTitle: 'Title should be mentioned',
    contractType: 'Major Contract',
    status: 'Pending',
    id: 2,
  },
]
export const dataSec = [
  {
    planType: 'Title Sould Be Mentioned',
    block: '123456',
    submissionDay: 'Tuesday',
    submissionDate: '11-06-2019',
    submissionBy: 'Maryam Khan',
    contractTitle: 'Title should be mentioned',
    contractType: 'Major Contract',
    status: 'Approved',
    id: 1,
  },
  {
    planType: 'Title Sould Be Mentioned',
    block: '123456',
    submissionDay: 'Tuesday',
    submissionDate: '11-06-2019',
    submissionBy: 'Maryam Khan',
    contractTitle: 'Title should be mentioned',
    contractType: 'Major Contract',
    status: 'Passed To Agenda',
    id: 2,
  },
  {
    planType: 'Title Sould Be Mentioned',
    block: '123456',
    submissionDay: 'Tuesday',
    submissionDate: '11-06-2019',
    submissionBy: 'Maryam Khan',
    contractTitle: 'Title should be mentioned',
    contractType: 'Major Contract',
    status: 'Not Discussed',
    id: 3,
  },
  {
    planType: 'Title Sould Be Mentioned',
    block: '123456',
    submissionDay: 'Tuesday',
    submissionDate: '11-06-2019',
    submissionBy: 'Maryam Khan',
    contractTitle: 'Title should be mentioned',
    contractType: 'Major Contract',
    status: 'Under Review',
    id: 4,
  },
  {
    planType: 'Title Sould Be Mentioned',
    block: '123456',
    submissionDay: 'Tuesday',
    submissionDate: '11-06-2019',
    submissionBy: 'Maryam Khan',
    contractTitle: 'Title should be mentioned',
    contractType: 'Major Contract',
    status: 'Under Review',
    id: 5,
  },
  {
    planType: 'Title Sould Be Mentioned',
    block: '123456',
    submissionDay: 'Tuesday',
    submissionDate: '11-06-2019',
    submissionBy: 'Maryam Khan',
    contractTitle: 'Title should be mentioned',
    contractType: 'Major Contract',
    status: 'Rejected',
    id: 6,
  },
  {
    planType: 'Title Sould Be Mentioned',
    block: '123456',
    submissionDay: 'Tuesday',
    submissionDate: '11-06-2019',
    submissionBy: 'Maryam Khan',
    contractTitle: 'Title should be mentioned',
    contractType: 'Major Contract',
    status: 'Rejected',
    id: 7,
  },
]

export const dataMem = [
  {
    planType: 'Title Sould Be Mentioned',
    block: '123456',
    submissionDay: 'Tuesday',
    submissionDate: '11-06-2019',
    submissionBy: 'Maryam Khan',
    contractTitle: 'Title should be mentioned',
    contractType: 'Major Contract',
    date: '01/01/2019',
    from: '1:30 AM',
    to: '2:30 PM',
    status: 'Approved',
    id: 1,
  },
  {
    planType: 'Title Sould Be Mentioned',
    block: '123456',
    submissionDay: 'Tuesday',
    submissionDate: '11-06-2019',
    submissionBy: 'Maryam Khan',
    contractTitle: 'Title should be mentioned',
    contractType: 'Major Contract',
    date: '01/01/2019',
    from: '1:30 AM',
    to: '2:30 PM',
    status: 'Under Review',
    id: 2,
  },
  {
    planType: 'Title Sould Be Mentioned',
    block: '123456',
    submissionDay: 'Tuesday',
    submissionDate: '11-06-2019',
    submissionBy: 'Maryam Khan',
    contractTitle: 'Title should be mentioned',
    contractType: 'Major Contract',
    date: '01/01/2019',
    from: '1:30 AM',
    to: '2:30 PM',
    status: 'Rejected',
    id: 3,
  },
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
