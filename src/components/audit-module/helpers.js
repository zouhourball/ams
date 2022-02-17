import { navigate } from '@reach/router'

export const configs = [
  {
    label: 'Title',
    key: 'title',
    width: '250',
    icon: 'mdi mdi-spellcheck',
    type: 'text',
    displayInCsv: true,
  },

  {
    label: 'Audit ID',
    key: 'auditId',
    width: '250',
    type: 'text',
    icon: 'mdi mdi-spellcheck',
    displayInCsv: true,
  },
  {
    label: 'Request Date',
    key: 'requestDate',
    width: '250',
    // type: 'date',
    // dateFormat: 'DD MMM YYYY',
    icon: 'mdi mdi-spellcheck',
    displayInCsv: true,
  },
  {
    label: 'Short description',
    key: 'description',
    width: '500',
    icon: 'mdi mdi-spellcheck',
    displayInCsv: true,
  },
  {
    label: 'Status',
    key: 'status',
    width: '250',
    icon: 'mdi mdi-spellcheck',
    render: (row) => (
      <div className={`table-status ${row?.status}`}>{row?.status}</div>
    ),
    displayInCsv: true,
  },
]
export const responseConfigs = [
  {
    label: 'Response Date / Time',
    key: 'respDate',
    width: '300',
    icon: 'mdi mdi-spellcheck',
    type: 'text',
    displayInCsv: true,
  },
  {
    label: 'Response',
    key: 'response',
    width: '450',
    icon: 'mdi mdi-spellcheck',
    type: 'text',
    displayInCsv: true,
  },
  {
    label: 'Attached Document',
    key: 'attachedDocs',
    width: '300',
    icon: 'mdi mdi-spellcheck',
    type: 'text',
    displayInCsv: true,
  },
  {
    label: 'Status',
    key: 'status',
    width: '300',
    icon: 'mdi mdi-spellcheck',
    type: 'text',
    displayInCsv: true,
  },
]
export const requestConfigs = [
  {
    label: 'Enquire ID',
    key: 'enquireId',
    width: '250',
    icon: 'mdi mdi-spellcheck',
    type: 'text',
    displayInCsv: true,
  },
  {
    label: 'Audit ID',
    key: 'auditId',
    width: '250',
    icon: 'mdi mdi-spellcheck',
    type: 'text',
    displayInCsv: true,
  },
  {
    label: 'Date Raised',
    key: 'date',
    width: '250',
    icon: 'mdi mdi-spellcheck',
    type: 'text',
    displayInCsv: true,
  },
  {
    label: 'Assignee',
    key: 'assignee',
    width: '250',
    icon: 'mdi mdi-spellcheck',
    type: 'text',
    displayInCsv: true,
  },
  {
    label: 'Short Description',
    key: 'description',
    width: '450',
    icon: 'mdi mdi-spellcheck',
    type: 'text',
    displayInCsv: true,
  },
  {
    label: 'Status',
    key: 'status',
    width: '250',
    icon: 'mdi mdi-spellcheck',
    type: 'text',
    displayInCsv: true,
  },
]

export const actionsHeader = (row, suppDoc, showAuditClosureDialog) => {
  return [
    {
      id: 1,
      label: 'View Process Historian',
      onClick: () => {
        navigate(`/ams/audit/view-historian/${row?.id}`)
      },
    },
    {
      id: 2,
      label: 'Close Audit',
      onClick: () => {},
    },
    {
      id: 3,
      label: 'Delete',
      onClick: () => {},
    },
    {
      id: 4,
      label: 'View Enquiries',
      onClick: () => {
        navigate(`/ams/audit/audit-details/enquiries/${row?.id}`)
      },
    },
    {
      id: 5,
      label: 'Clarify',
      onClick: () => {},
    },
    {
      id: 6,
      label: 'Create Report',
      onClick: () => {
        showAuditClosureDialog(true)
      },
    },
    {
      id: 7,
      label: 'Supporting Documents',
      onClick: () => {
        suppDoc(true)
      },
    },
  ]
}
export const enquiryActionsHeader = (
  row,
  showDetails,
  updateStatus,
  showAssignDialog,
  showResponseDialog,
  setView,
  view,
) => {
  const ackBtn = {
    id: 2,
    label: 'Acknowledge',
    onClick: () => {
      updateStatus('ACKNOWLEDGED')
    },
  }
  const assignBtn = {
    id: 3,
    label: 'Assign',
    onClick: () => {
      showAssignDialog(true)
    },
  }
  const newResponseBtn = {
    id: 4,
    label: 'New Response',
    onClick: () => {
      showResponseDialog(true)
    },
  }
  const viewResponseBtn = {
    id: 5,
    label: 'View Response',
    onClick: () => {
      setView('response')
    },
  }
  const defBtns = [
    {
      id: 1,
      label: 'View Details',
      onClick: () => {
        showDetails(true)
      },
    },
  ]
  if (row?.status === 'NEW' || row?.status === 'ASSIGNED') {
    return [...defBtns, ackBtn]
  } else if (row?.status === 'ACKNOWLEDGED') {
    return [...defBtns, assignBtn]
  } else if (row?.status === 'RESPONDED' && view === 'default') {
    // row?.status === 'RESPONDED' && view === 'default'
    return [...defBtns, viewResponseBtn, newResponseBtn]
  } else if (row?.status === 'ASSIGNED' || row?.status === 'ACKNOWLEDGED') {
    // row?.status === 'ASSIGNED' || row?.status === 'ACKNOWLEDGED'

    return [...defBtns, newResponseBtn]
  } else return defBtns
}
export const dummyData = [
  {
    title: 'test',
    auditId: 'test',
    requestDate: 'data',
    description: 'description',
    status: 'submitted',
  },
]
