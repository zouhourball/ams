import moment from 'moment'

export const fbpConfig = [
  {
    label: 'Company Name',
    key: 'companyName',
    width: 200,
  },
  {
    label: 'Reference No',
    key: 'referenceNumber',
    width: 200,
  },
  {
    label: 'Block No',
    key: 'blockNumber',
    width: 200,
  },
  {
    label: 'Contract Type',
    key: 'contractType',
    width: 200,
  },
  {
    label: 'ThreadHold Level',
    key: 'threadHoldLevel',
    width: 200,
  },
  {
    label: 'Tender Status',
    key: 'tenderStatus',
    width: 250,
  },
  {
    label: 'Approved Budget by  JMC',
    key: 'budgetApprovedByJMC',
    width: 200,
  },
  {
    label: 'Original Cost Estimate',
    key: 'originalCostEstimate',
    width: 200,
  },
  // {
  //   label: 'Original ACV Approved',
  //   key: 'originalACV',
  //   width: 200,
  // },
  {
    label: 'Original Duration',
    render: (row) => (
      <div>{moment(row.originalDuration).format('dddd, DD MMMM YYYY')}</div>
    ),
    width: 250,
  },
  {
    label: 'Contract Title',
    key: 'contractTitle',
    width: 200,
  },
  {
    label: 'Estimated Duration per Job',
    render: (row) => (
      <div>
        {moment(row.estimatedDurationPerJob).format('dddd, DD MMMM YYYY')}
      </div>
    ),
    width: 200,
  },
  {
    label: 'Estimated Duration per period (Firm)',
    render: (row) => (
      <div>
        {row.estimatedDurationPerPeriodType === 'Firm'
          ? moment(row.estimatedDurationPerPeriodFirmEndValue).format(
            'dddd, DD MMMM YYYY',
          )
          : ''}
      </div>
    ),
    width: 250,
  },
  {
    label: 'Estimated Duration per period (Option)',
    render: (row) => (
      <div>
        {row.estimatedDurationPerPeriodType === 'Option'
          ? row.estimatedDurationPerPeriodOptionValue
          : ''}
      </div>
    ),
    width: 250,
  },
]

export const fbpTableData = [
  {
    companyName: 'ABC Company',
    referenceNo: '12321456',
    blockNo: '23',
    contractType: 'New Plan 2020',
    threadsHoldLevel: '5 Years',
    tenderStatus: 'Tender Strategy',
    approvedBudgetByJMC: '$30 M',
    originalCostEstimate: '$22 M',
    originalACVApproved: '$17 M',
    originalDuration: '3 years',
    estimatedDuration: '4 Years',
  },
]

export const dataOp = [
  {
    companyName: 'Title Sould Be Mentioned',
    block: '123456',
    submissionDate: '11-06-2019',
    submissionBy: 'Maryam Khan',
    contractTitle: 'Title should be mentioned',
    contractType: 'Major Contract',
    status: 'Pending',
    id: 1,
  },
  {
    companyName: 'Title Sould Be Mentioned',
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
    companyName: 'Title Sould Be Mentioned',
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
    companyName: 'Title Sould Be Mentioned',
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
    companyName: 'Title Sould Be Mentioned',
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
    companyName: 'Title Sould Be Mentioned',
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
    companyName: 'Title Sould Be Mentioned',
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
    companyName: 'Title Sould Be Mentioned',
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
    companyName: 'Title Sould Be Mentioned',
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
    companyName: 'Title Sould Be Mentioned',
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
    companyName: 'Title Sould Be Mentioned',
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
    companyName: 'Title Sould Be Mentioned',
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
