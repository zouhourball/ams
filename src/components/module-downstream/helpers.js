import { FileInput, FontIcon } from 'react-md'
import { navigate } from '@reach/router'

export const liquefiedPetroleumGasConfigs = () => [
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

export const naturalGasConfigs = () => [
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
export const petroleumProductsConfigs = () => [
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

export const liquefiedPetroleumGasData = [
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
export const naturalGasData = [
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

export const petroleumProductsData = [
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

export const actionsHeader = (key, id, role, supportedDocument) => {
  switch (role) {
    case 'regulator':
    default:
      return [
        {
          id: 1,
          label: 'Download Original File',
          onClick: () => {},
        },
        {
          id: 2,
          label: 'View Details',
          onClick: () => {
            key && id && navigate(`/ams/downstream/${key}/${id}`)
          },
        },
        {
          id: 3,
          label: 'View Documents',
          primary: true,
          onClick: () => {},
        },
      ]
    case 'operator':
      return [
        {
          id: 1,
          label: 'Delete',
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
            key && id && navigate(`/ams/downstream/${key}/${id}`)
          },
        },
        {
          id: 5,
          label: 'Upload Documents',
          primary: true,
          onClick: () => {
            supportedDocument(true)
          },
        },
      ]
  }
}

export const costRecoveryDetailsConfigs = [
  {
    label: 'Main Category',
    key: 'category',
    width: '200',
    icon: 'mdi mdi-spellcheck',
    type: 'text',
  },
  {
    label: 'Sub Category',
    key: 'subCategory',
    width: '200',
    icon: 'mdi mdi-spellcheck',
    type: 'text',
  },
  {
    label: 'Group',
    key: 'group',
    width: '200',
    icon: 'mdi mdi-spellcheck',
    type: 'text',
  },
  {
    label: 'Item',
    key: 'item',
    width: '200',
    icon: 'mdi mdi-spellcheck',
    type: 'text',
  },
  {
    label: 'UOM',
    key: 'uom',
    width: '200',
    icon: 'mdi mdi-spellcheck',
    type: 'text',
  },
  {
    label: 'Cost Description',
    key: 'costDescription',
    width: '400',
    icon: 'mdi mdi-spellcheck',
    type: 'text',
  },
  /* {
    label: '218',
    key: 'year',
    width: '600',
    icon: 'mdi mdi-spellcheck',
    type: 'subColumns',
    columns: [
      {
        label: 'Approved',
        subKey: 'approved',
        icon: 'mdi mdi-spellcheck',
        width: 200,
        subColumns: [
          {
            label: 'Plan',
            subKeyS: 'plan',
            width: 200,
            icon: 'mdi mdi-pound-box',
          },
        ],
      },
      {
        label: 'Outlook',
        subKey: 'outlook',
        icon: 'mdi mdi-spellcheck',
        width: 200,
        subColumns: [
          {
            label: 'Outlook',
            subKeyS: 'outlook',
            width: 200,
            icon: 'mdi mdi-pound-box',
          },
        ],
      },
      {
        label: 'YTD',
        subKey: 'ytd',
        icon: 'mdi mdi-spellcheck',
        width: 200,
        subColumns: [
          {
            label: 'Actual',
            subKeyS: 'actual',
            width: 200,
            icon: 'mdi mdi-pound-box',
          },
        ],
      },
    ],
  }, */
]

export const costRecoveryDetailsData = [
  {
    id: 'dddj2333',
    category: 'CAPITAL COSTS',
    subCategory: 'GEOLOGICAL & GEOPHYSICAL',
    group: 'GEOLOGICAL (SURFACE)',
    item: 'Item 1',
    uom: '$USD',
    costDescription: 'List all surface studies & activities...',
    year: [
      { approved: [{ plan: 'test' }] },
      { outlook: [{ outlook: 'test' }] },
      { ytd: [{ actual: 'test' }] },
    ],
  },
  {
    id: 'dddj2333',
    category: 'CAPITAL COSTS',
    subCategory: 'GEOLOGICAL & GEOPHYSICAL',
    group: 'GEOLOGICAL (SURFACE)',
    item: 'Item 1',
    uom: '$USD',
    costDescription: 'List all surface studies & activities...',
    year: [
      { approved: [{ plan: 'test' }] },
      { outlook: [{ outlook: 'test' }] },
      { ytd: [{ actual: 'test' }] },
    ],
  },
  {
    id: 'dddj2333',
    category: 'CAPITAL COSTS',
    subCategory: 'GEOLOGICAL & GEOPHYSICAL',
    group: 'GEOLOGICAL (SURFACE)',
    item: 'Item 1',
    uom: '$USD',
    costDescription: 'List all surface studies & activities...',
    year: [
      { approved: [{ plan: 'test' }] },
      { outlook: [{ outlook: 'test' }] },
      { ytd: [{ actual: 'test' }] },
    ],
  },
  {
    id: 'dddj2333',
    category: 'CAPITAL COSTS',
    subCategory: 'GEOLOGICAL & GEOPHYSICAL',
    group: 'GEOLOGICAL (SURFACE)',
    item: 'Item 1',
    uom: '$USD',
    costDescription: 'List all surface studies & activities...',
    year: [
      { approved: [{ plan: 'test' }] },
      { outlook: [{ outlook: 'test' }] },
      { ytd: [{ actual: 'test' }] },
    ],
  },
]