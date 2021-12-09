export const mhtConfigRecords = () => [
  {
    label: 'Company',
    key: 'company',
    width: '200',
    icon: 'mdi mdi-spellcheck',
    type: 'text',
  },

  {
    label: 'Block',
    key: 'block',
    width: '200',
    type: 'text',
    icon: 'mdi mdi-spellcheck',
  },
  {
    label: 'Submission Date',
    key: 'submissionDate',
    width: '200',
    icon: 'mdi mdi-spellcheck',
  },
  {
    label: 'Stock Count Before',
    key: 'stockCountBefore',
    width: '200',
    icon: 'mdi mdi-spellcheck',
  },
  {
    label: 'Consumed Items',
    key: 'consumedItems',
    width: '200',
    icon: 'mdi mdi-spellcheck',
  },
  {
    label: 'Stock Count After',
    key: 'stockCountAfter',
    width: '200',
    icon: 'mdi mdi-spellcheck',
  },
  {
    label: 'Status',
    key: 'status',
    width: '200',
    icon: 'mdi mdi-spellcheck',
    render: (row) => (
      <div className={`table-status ${row?.status}`}>{row?.status}</div>
    ),
  },
]
