import { FileInput, FontIcon } from 'react-md'
import { navigate } from '@reach/router'

export const annualReportConfigs = (supportedDocument) => [
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
    label: 'Submitted Date',
    key: 'submittedDate',
    width: '200',
    type: 'date',
    dateFormat: 'DD MMM, YYYY',
    icon: 'mdi mdi-spellcheck',
  },
  {
    label: 'Submitted By',
    key: 'submittedBy',
    width: '200',
    icon: 'mdi mdi-spellcheck',
  },
  {
    label: 'Reference Date',
    key: 'referenceDate',
    width: '200',
    icon: 'mdi mdi-spellcheck',
    type: 'date',
    dateFormat: 'DD MMM, YYYY',
  },
  {
    label: 'Status Date',
    key: 'statusDate',
    width: '200',
    icon: 'mdi mdi-spellcheck',
    type: 'date',
    dateFormat: 'DD MMM, YYYY',
  },
  {
    label: 'Supporting Documents',
    key: 'supportingDocuments',
    width: '200',
    icon: 'mdi mdi-spellcheck',
    render: (row) => (
      <FileInput
        className="upload-docs-button"
        id={row.id}
        flat
        primary
        iconBefore
        icon={<FontIcon>save_alt</FontIcon>}
        label={'Upload Documents'}
        onClick={(e) => {
          e.preventDefault()
          supportedDocument(row)
        }}
      />
    ),
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

export const monthlyReportConfigs = (supportedDocument) => [
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
    label: 'Submitted Date',
    key: 'submittedDate',
    width: '200',
    type: 'date',
    dateFormat: 'DD MMM, YYYY',
    icon: 'mdi mdi-spellcheck',
  },
  {
    label: 'Submitted By',
    key: 'submittedBy',
    width: '200',
    icon: 'mdi mdi-spellcheck',
  },
  {
    label: 'Reference Date',
    key: 'referenceDate',
    width: '200',
    icon: 'mdi mdi-spellcheck',
    type: 'date',
    dateFormat: 'DD MMM, YYYY',
  },
  {
    label: 'Status Date',
    key: 'statusDate',
    width: '200',
    icon: 'mdi mdi-spellcheck',
    type: 'date',
    dateFormat: 'DD MMM, YYYY',
  },
  {
    label: 'Supporting Documents',
    key: 'supportingDocuments',
    width: '200',
    icon: 'mdi mdi-spellcheck',
    render: (row) => (
      <FileInput
        className="upload-docs-button"
        id={row.id}
        flat
        primary
        iconBefore
        icon={<FontIcon>save_alt</FontIcon>}
        label={'Upload Documents'}
        onClick={(e) => {
          e.preventDefault()
          supportedDocument(row)
        }}
      />
    ),
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
export const dailyReportConfigs = (supportedDocument) => [
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
    label: 'Submitted Date',
    key: 'submittedDate',
    width: '200',
    // type: 'date',
    // dateFormat: 'DD MMM, YYYY',
    icon: 'mdi mdi-spellcheck',
  },
  {
    label: 'Submitted By',
    key: 'submittedBy',
    width: '200',
    icon: 'mdi mdi-spellcheck',
  },
  {
    label: 'Reference Date',
    key: 'referenceDate',
    width: '200',
    icon: 'mdi mdi-spellcheck',
    // type: 'date',
    // dateFormat: 'DD MMM, YYYY',
  },
  {
    label: 'Status Date',
    key: 'statusDate',
    width: '200',
    icon: 'mdi mdi-spellcheck',
    // type: 'date',
    // dateFormat: 'DD MMM, YYYY',
  },
  {
    label: 'Supporting Documents',
    key: 'supportingDocuments',
    width: '200',
    icon: 'mdi mdi-spellcheck',
    render: (row) => (
      <FileInput
        className="upload-docs-button"
        id={row.id}
        flat
        primary
        iconBefore
        icon={<FontIcon>save_alt</FontIcon>}
        label={'Upload Documents'}
        onClick={(e) => {
          e.preventDefault()
          supportedDocument(row)
        }}
      />
    ),
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
export const annualReportData = [
  {
    id: '2656552',
    company: 'PDO',
    block: 31,
    submittedDate: 233333098,
    submittedBy: 'Mohamed Ahmed',
    referenceDate: 2021,
    statusDate: 23098873,
    supportingDocuments: '',
    status: 'Submitted',
  },
  {
    id: '265653452',
    company: 'PDO',
    block: 31,
    submittedDate: 233333098,
    submittedBy: 'Mohamed Ahmed',
    referenceDate: 2021,
    statusDate: 23098873,
    supportingDocuments: '',
    status: 'Submitted',
  },
  {
    id: '26565342352',
    company: 'PDO',
    block: 31,
    submittedDate: 233333098,
    submittedBy: 'Mohamed Ahmed',
    referenceDate: 2021,
    statusDate: 23098873,
    supportingDocuments: '',
    status: 'Submitted',
  },
]

export const monthlyReportData = [
  {
    id: '2656552',
    company: 'PDO',
    block: 31,
    submittedDate: 233333098,
    submittedBy: 'Mohamed Ahmed',
    referenceDate: 2021,
    statusDate: 23098873,
    supportingDocuments: '',
    status: 'Submitted',
  },
  {
    id: '265653452',
    company: 'PDO',
    block: 31,
    submittedDate: 233333098,
    submittedBy: 'Mohamed Ahmed',
    referenceDate: 2021,
    statusDate: 23098873,
    supportingDocuments: '',
    status: 'Submitted',
  },
  {
    id: '26565342352',
    company: 'PDO',
    block: 31,
    submittedDate: 233333098,
    submittedBy: 'Mohamed Ahmed',
    referenceDate: 2021,
    statusDate: 23098873,
    supportingDocuments: '',
    status: 'Submitted',
  },
]

export const dailyReportData = [
  {
    id: '2656552',
    company: 'PDO',
    block: 31,
    submittedDate: 233333098,
    submittedBy: 'Mohamed Ahmed',
    referenceDate: 2021,
    statusDate: 23098873,
    supportingDocuments: '',
    status: 'Submitted',
  },
  {
    id: '265653452',
    company: 'PDO',
    block: 31,
    submittedDate: 233333098,
    submittedBy: 'Mohamed Ahmed',
    referenceDate: 2021,
    statusDate: 23098873,
    supportingDocuments: '',
    status: 'Submitted',
  },
  {
    id: '26565342352',
    company: 'PDO',
    block: 31,
    submittedDate: 233333098,
    submittedBy: 'Mohamed Ahmed',
    referenceDate: 2021,
    statusDate: 23098873,
    supportingDocuments: '',
    status: 'Submitted',
  },
]

export const actionsHeaderAnnual = (
  key,
  id,
  role,
  supportedDocument,
  subModule,
  onDelete,
) => {
  switch (role) {
    case 'regulator':
    default:
      return [
        {
          id: 1,
          label: 'Download Annual Plan',
          onClick: () => {},
        },
        {
          id: 2,
          label: 'Download Original File',
          onClick: () => {},
        },
        {
          id: 3,
          label: 'View Details',
          onClick: () => {
            navigate(`/ams/hse/${key}/${id}/${subModule}`)
          },
        },
        {
          id: 4,
          label: 'View Documents',
          onClick: () => {
            // navigate(`/ams/hse/${key}/${id}`)
          },
        },
      ]
    case 'operator':
      return [
        {
          id: 1,
          label: 'Delete',
          onClick: () => {
            onDelete(subModule, id)
          },
        },
        {
          id: 2,
          label: 'Download Annual Plan',
          onClick: () => {},
        },
        {
          id: 3,
          label: 'Download Original File',
          onClick: () => {},
        },
        {
          id: 4,
          label: 'View Details',
          onClick: () => {
            navigate(`/ams/hse/${key}/${id}/${subModule}`)
          },
        },
        {
          id: 5,
          label: 'Upload Documents',
          onClick: () => {
            supportedDocument(true)
          },
        },
      ]
  }
}

export const actionsHeaderMonthly = (
  key,
  id,
  role,
  supportedDocument,
  subModule,
  onDelete,
) => {
  switch (role) {
    case 'regulator':
    default:
      return [
        {
          id: 2,
          label: 'Download Original File',
          onClick: () => {},
        },
        {
          id: 3,
          label: 'View Details',
          onClick: () => {
            navigate(`/ams/hse/${key}/${id}/${subModule}`)
          },
        },
        {
          id: 4,
          label: 'View Documents',
          onClick: () => {
            // navigate(`/ams/hse/${key}/${id}`)
          },
        },
      ]
    case 'operator':
      return [
        {
          id: 1,
          label: 'Delete',
          onClick: () => {
            onDelete(subModule, id)
          },
        },
        {
          id: 3,
          label: 'Download Original File',
          onClick: () => {},
        },
        {
          id: 4,
          label: 'View Details',
          onClick: () => {
            navigate(`/ams/hse/${key}/${id}/${subModule}`)
          },
        },
        {
          id: 5,
          label: 'Upload Documents',
          onClick: () => {
            supportedDocument(true)
          },
        },
      ]
  }
}

export const actionsHeaderDaily = (
  key,
  id,
  role,
  supportedDocument,
  subModule,
  onDelete,
) => {
  switch (role) {
    case 'regulator':
    default:
      return [
        {
          id: 2,
          label: 'Download Original File',
          onClick: () => {},
        },
        {
          id: 3,
          label: 'View Details',
          onClick: () => {
            navigate(`/ams/hse/${key}/${id}/${subModule}`)
          },
        },
        {
          id: 4,
          label: 'View Documents',
          onClick: () => {
            // navigate(`/ams/hse/${key}/${id}`)
          },
        },
      ]
    case 'operator':
      return [
        {
          id: 1,
          label: 'Delete',
          onClick: () => {
            onDelete(subModule, id)
          },
        },
        {
          id: 3,
          label: 'Download Original File',
          onClick: () => {},
        },
        {
          id: 4,
          label: 'View Details',
          onClick: () => {
            navigate(`/ams/hse/${key}/${id}/${subModule}`)
          },
        },
        {
          id: 5,
          label: 'Upload Documents',
          onClick: () => {
            supportedDocument(true)
          },
        },
      ]
  }
}
export const flaringDetailsConfigs = [
  {
    label: 'Gaz Type',
    key: 'gaz_type',
    width: '300',
    icon: 'mdi mdi-spellcheck',
    type: 'text',
  },
  {
    label: 'Unit',
    key: 'unit',
    width: '200',
    icon: 'mdi mdi-spellcheck',
    type: 'text',
  },
  {
    label: '2021',
    key: 'year2021',
    width: '200',
    icon: 'mdi mdi-spellcheck',
    type: 'text',
  },
  {
    label: '2022',
    key: 'year2022',
    width: '200',
    icon: 'mdi mdi-spellcheck',
    type: 'text',
  },
  {
    label: '2023',
    key: 'year2023',
    width: '200',
    icon: 'mdi mdi-spellcheck',
    type: 'text',
  },
  {
    label: '2024',
    key: 'year2024',
    width: '200',
    icon: 'mdi mdi-spellcheck',
    type: 'text',
  },
  {
    label: '2025',
    key: 'year2025',
    width: '200',
    icon: 'mdi mdi-spellcheck',
    type: 'text',
  },
  {
    label: '2026',
    key: 'year2026',
    width: '200',
    icon: 'mdi mdi-spellcheck',
    type: 'text',
  },
]

export const flaringDetailsData = [
  {
    gaz_type: 'Gas Flared (Excl. Gas Conservation)',
    unit: 'MMscf/d',
  },
  {
    gaz_type: 'Gas Flared (Excl. Gas Conservation)',
    unit: 'MMscf/d',
  },
]

export const hsseDetailsConfigs = [
  {
    label: 'Item',
    key: 'item',
    width: '500',
    icon: 'mdi mdi-spellcheck',
    type: 'text',
  },
  {
    label: 'Year End Target',
    key: 'columns',
    type: 'subColumns',
    icon: 'mdi mdi-spellcheck',
    columns: [
      {
        label: 'Operator',
        subKey: 'operator',
        icon: 'mdi mdi-spellcheck',
        width: '150',
        type: 'text',
      },
      {
        label: 'Contractor',
        subKey: 'contractor',
        icon: 'mdi mdi-spellcheck',
        width: '150',
        type: 'text',
      },
    ],
  },
  ...[
    'Jun',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ].map((el) => ({
    label: el,
    key: el.toLowerCase(),
    width: '150',
    icon: 'mdi mdi-spellcheck',
    type: 'text',
  })),
]

export const hsseDetailsData = [
  {
    item: "Fatalities 'Work related' (FAT) (Total no.)",
  },
  {
    item: 'Non Accidental Death (NAD)',
  },
]
