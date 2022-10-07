import { navigate } from '@reach/router'
import UserInfoBySubject from 'components/user-info-by-subject'

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
export const resolutionConfigs = [
  {
    label: 'Date Raised',
    key: 'date',
    width: '350',
    icon: 'mdi mdi-spellcheck',
    type: 'text',
    displayInCsv: true,
  },
  {
    label: 'Resolution Description',
    key: 'description',
    width: '550',
    icon: 'mdi mdi-spellcheck',
    type: 'text',
    displayInCsv: true,
  },
  {
    label: 'Attached Document',
    key: 'attachedDocs',
    width: '350',
    icon: 'mdi mdi-spellcheck',
    type: 'text',
    displayInCsv: true,
  },
  {
    label: 'Status',
    key: 'status',
    width: '350',
    icon: 'mdi mdi-spellcheck',
    type: 'text',
    displayInCsv: true,
  },
]
export const actionConfigs = [
  {
    label: 'Action ID',
    key: 'actionId',
    width: '300',
    icon: 'mdi mdi-spellcheck',
    type: 'text',
    displayInCsv: true,
  },
  {
    label: 'Date Raised',
    key: 'date',
    width: '300',
    icon: 'mdi mdi-spellcheck',
    type: 'text',
    displayInCsv: true,
  },
  {
    label: 'Assignee',
    key: 'assignee',
    width: '300',
    icon: 'mdi mdi-spellcheck',
    type: 'text',
    displayInCsv: true,
  },
  {
    label: 'Action Description',
    key: 'description',
    width: '400',
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
    render: (row) => (
      <UserInfoBySubject subject={row?.assignee}>
        {(res) => <div className="subject">{res ? res.fullName : 'N/A'}</div>}
      </UserInfoBySubject>
    ),
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

export const actionsHeader = (
  role,
  row,
  suppDoc,
  showAuditClosureDialog,
  viewClosureReport,
  // updateStatus,
  closeAudit,
) => {
  // console.log(row, 'row')
  const defAUActions = [
    {
      id: 1,
      label: 'View Process Historian',
      onClick: () => {
        navigate(`/ams/audit/view-historian/${row?.auditId}`)
      },
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
        navigate(`/ams/audit/audit-details/enquiries/${row?.auditId}`)
      },
    },
    // {
    //   id: 5,
    //   label: 'Clarify',
    //   onClick: () => {},
    // },

    {
      id: 7,
      label: 'Supporting Documents',
      onClick: () => {
        suppDoc(true)
      },
    },
  ]
  const defFPActions = [
    {
      id: 1,
      label: 'View Process Historian',
      onClick: () => {
        navigate(`/ams/audit/view-historian/${row?.auditId}`)
      },
    },
    // {
    //   id: 2,
    //   label: 'Close Audit',
    //   onClick: () => {
    //     updateStatus('CLOSED')
    //   },
    // },
    // {
    //   id: 3,
    //   label: 'Delete',
    //   onClick: () => {},
    // },
    {
      id: 4,
      label: 'View Enquiries',
      onClick: () => {
        navigate(`/ams/audit/audit-details/enquiries/${row?.auditId}`)
      },
    },
    {
      id: 5,
      label: 'Clarify',
      onClick: () => {},
    },
    // {
    //   id: 6,
    //   label: 'Create Report',
    //   onClick: () => {
    //     showAuditClosureDialog(true)
    //   },
    // },
    {
      id: 7,
      label: 'Supporting Documents',
      onClick: () => {
        suppDoc(true)
      },
    },
    // {
    //   id: 8,
    //   label: 'View Report',
    //   onClick: () => {
    //     viewClosureReport(true)
    //   },
    // },
  ]
  const defAPActions = [
    {
      id: 1,
      label: 'View Process Historian',
      onClick: () => {
        navigate(`/ams/audit/view-historian/${row?.auditId}`)
      },
    },
    // {
    //   id: 2,
    //   label: 'Close Audit',
    //   onClick: () => {
    //     updateStatus('CLOSED')
    //   },
    // },
    // {
    //   id: 3,
    //   label: 'Delete',
    //   onClick: () => {},
    // },
    {
      id: 4,
      label: 'View Enquiries',
      onClick: () => {
        navigate(`/ams/audit/audit-details/enquiries/${row?.auditId}`)
      },
    },
    {
      id: 5,
      label: 'Clarify',
      onClick: () => {},
    },
    // {
    //   id: 6,
    //   label: 'Create Report',
    //   onClick: () => {
    //     showAuditClosureDialog(true)
    //   },
    // },
    {
      id: 7,
      label: 'Supporting Documents',
      onClick: () => {
        suppDoc(true)
      },
    },
    // {
    //   id: 8,
    //   label: 'View Report',
    //   onClick: () => {
    //     viewClosureReport(true)
    //   },
    // },
  ]

  switch (role) {
    case 'AU':
    default:
      return !row?.report
        ? row?.status !== 'CLOSED' &&
          // row?.actions?.length > 0 &&
          row?.enquiries?.filter((el) => el?.status === 'RESPONDED')?.length > 0
          ? [
            ...defAUActions,
            // {
            //   id: 2,
            //   label: 'Close Audit',
            //   onClick: () => {
            //     closeAudit()
            //   },
            // },
            {
              id: 6,
              label: 'Create Report',
              onClick: () => {
                showAuditClosureDialog(true)
              },
            },
          ]
          : [
            ...defAUActions,
            // {
            //   id: 6,
            //   label: 'Create Report',
            //   onClick: () => {
            //     showAuditClosureDialog(true)
            //   },
            // },
          ]
        : row?.status !== 'CLOSED' &&
          // row?.actions?.length > 0 &&
          row?.enquiries?.filter((el) => el?.status === 'RESPONDED')?.length > 0
          ? [
            ...defAUActions,
            {
              id: 2,
              label: 'Close Audit',
              onClick: () => {
                closeAudit()
              },
            },
            {
              id: 8,
              label: 'View Report',
              onClick: () => {
                viewClosureReport(true)
              },
            },
          ]
          : [
            ...defAUActions,
            {
              id: 8,
              label: 'View Report',
              onClick: () => {
                viewClosureReport(true)
              },
            },
          ]
    case 'FP':
      return row?.report
        ? [
          ...defFPActions,

          {
            id: 9,
            label: 'View Actions',
            onClick: () => {
              navigate(`/ams/audit/audit-details/actions/${row?.auditId}`)
            },
          },
        ]
        : defFPActions
    case 'AP':
      return row?.report
        ? [
          ...defAPActions,
          {
            id: 9,
            label: 'View Actions',
            onClick: () => {
              navigate(`/ams/audit/audit-details/actions/${row?.auditId}`)
            },
          },
        ]
        : defAPActions
  }
}
export const enquiryActionsHeader = (
  row,
  showDetails,
  updateRow,
  showAssignDialog,
  showResponseDialog,
  setView,
  view,
  showResponseDetails,
  showNewResolutionDialog,
  role,
) => {
  const ackBtn = {
    id: 2,
    label: 'Acknowledge',
    onClick: () => {
      role === 'FP' && updateRow(row?.enquireId, 'acknowledge')
      role === 'AP' && updateRow(row?.enquireId, 'acknowledge-assignment')
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
      navigate(`/ams/audit/audit-details/response/${row?.enquireId}`)
    },
  }
  const newResolution = {
    id: 6,
    label: 'New Resolution',
    onClick: () => {
      showNewResolutionDialog(true)
    },
  }
  const viewResolutionBtn = {
    id: 7,
    label: 'View Resolution',
    onClick: () => {
      setView('resolutions')
      navigate(`/ams/audit/audit-details/resolutions/${row?.actionId}`)
    },
  }
  const defBtns = [
    {
      id: 1,
      label: 'View Details',
      onClick: () => {
        view === 'default' ? showDetails(true) : showResponseDetails(true)
      },
    },
  ]
  switch (view) {
    case 'default':
      if (
        (row?.status === 'NEW' && role === 'FP') ||
        (row?.status === 'ASSIGNED' && role === 'AP')
      ) {
        return [...defBtns, ackBtn]
      } else if (row?.status === 'ACKNOWLEDGED_BY_FP' && role === 'FP') {
        return [...defBtns, assignBtn]
      } else if (row?.status === 'RESPONDED' && role === 'AP') {
        return [...defBtns, viewResponseBtn, newResponseBtn]
      } else if (row?.status === 'RESPONDED' /* && role === 'FP' */) {
        return [...defBtns, viewResponseBtn]
      } else if (
        row?.status === 'ACKNOWLEDGED_BY_PARTICIPANT' &&
        role === 'AP'
      ) {
        return [...defBtns, newResponseBtn]
      } else if (
        (row?.status === 'ASSIGNED' || row?.status === 'ACKNOWLEDGED') &&
        role === 'AP'
      ) {
        // row?.status === 'ASSIGNED' || row?.status === 'ACKNOWLEDGED'

        return [...defBtns, newResponseBtn]
      } else return defBtns
    case 'response':
      if (row?.status !== 'NEW' && role === 'AP') {
        return [...defBtns, newResolution]
      } else return defBtns
    case 'actions':
      if (row?.resolutions?.length > 0 && role === 'AP') {
        return [...defBtns, newResolution, viewResolutionBtn]
      } else if (role === 'AP') {
        return [...defBtns, newResolution]
      } else if (role === 'FP') {
        return [...defBtns, viewResolutionBtn]
      }
      if (row?.status === 'OPEN' && role === 'AP') {
        return [...defBtns, newResolution, viewResolutionBtn]
      } else return [...defBtns]
    case 'resolutions':
    default:
      return defBtns
  }
  // if (view === 'default') {
  //   if (
  //     (row?.status === 'NEW' && role === 'FP') ||
  //     (row?.status === 'ASSIGNED' && role === 'AP')
  //   ) {
  //     return [...defBtns, ackBtn]
  //   } else if (row?.status === 'ACKNOWLEDGED_BY_FP') {
  //     return [...defBtns, assignBtn]
  //   } else if (
  //     row?.status === 'ACKNOWLEDGED_BY_PARTICIPANT' ||
  //     row?.status === 'RESPONDED'
  //   ) {
  //     return [...defBtns, viewResponseBtn, newResponseBtn]
  //   } else if (row?.status === 'ASSIGNED' || row?.status === 'ACKNOWLEDGED') {
  //     // row?.status === 'ASSIGNED' || row?.status === 'ACKNOWLEDGED'

  //     return [...defBtns, newResponseBtn]
  //   } else return defBtns
  // } else if (
  //   (view === 'response' || view === 'actions') &&
  //   !!row?.status &&
  //   row?.status !== 'NEW'
  // ) {
  //   return [...defBtns, newResolution, viewResolutionBtn]
  // } else if (view === 'actions') {
  //   return [...defBtns, newResponseBtn] /*, viewResolutionBtn */
  // } else if (view === 'actions' && row?.status === 'OPEN') {
  //   return [...defBtns, newResponseBtn, viewResolutionBtn]
  // } else return defBtns
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
