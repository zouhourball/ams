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

export const actionsHeader = (row, suppDoc, setRow) => {
  return [
    {
      id: 1,
      label: 'View Process Historian',
      onClick: () => {},
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
      onClick: () => {},
    },
    {
      id: 5,
      label: 'Clarify',
      onClick: () => {},
    },
    {
      id: 6,
      label: 'Supporting Documents',
      onClick: () => {},
    },
  ]
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
