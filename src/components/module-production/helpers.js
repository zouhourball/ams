import { FileInput, FontIcon } from 'react-md'
import { navigate } from '@reach/router'

export const dailyProductionConfigs = (supportedDocument) => [
  {
    label: 'Company',
    key: 'company',
    width: '200',
    icon: 'mdi mdi-spellcheck',
    type: 'text',
    displayInCsv: true,
  },

  {
    label: 'Block',
    key: 'block',
    width: '200',
    type: 'text',
    icon: 'mdi mdi-spellcheck',
    displayInCsv: true,
  },
  {
    label: 'Submitted Date',
    key: 'submittedDate',
    width: '200',
    icon: 'mdi mdi-spellcheck',
    displayInCsv: true,
  },
  {
    label: 'Submitted By',
    key: 'submittedBy',
    width: '200',
    icon: 'mdi mdi-spellcheck',
    displayInCsv: true,
  },
  {
    label: 'Reference Date',
    key: 'referenceDate',
    width: '200',
    icon: 'mdi mdi-spellcheck',
    displayInCsv: true,
  },
  {
    label: 'Status Date',
    key: 'statusDate',
    width: '200',
    icon: 'mdi mdi-spellcheck',
    displayInCsv: true,
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
    displayInCsv: true,
  },
]

export const monthlyProductionConfigs = (supportedDocument) => [
  {
    label: 'Company',
    key: 'company',
    width: '200',
    icon: 'mdi mdi-spellcheck',
    type: 'text',
    displayInCsv: true,
  },

  {
    label: 'Block',
    key: 'block',
    width: '200',
    type: 'text',
    icon: 'mdi mdi-spellcheck',
    displayInCsv: true,
  },
  {
    label: 'Submitted Date',
    key: 'submittedDate',
    width: '200',
    // type: 'date',
    // dateFormat: 'DD MMM, YYYY',
    icon: 'mdi mdi-spellcheck',
    displayInCsv: true,
  },
  {
    label: 'Submitted By',
    key: 'submittedBy',
    width: '200',
    icon: 'mdi mdi-spellcheck',
    displayInCsv: true,
  },
  {
    label: 'Reference Date',
    key: 'referenceDate',
    width: '200',
    icon: 'mdi mdi-spellcheck',
    displayInCsv: true,
    // type: 'date',
    // dateFormat: 'DD MMM, YYYY',
  },
  {
    label: 'Status Date',
    key: 'statusDate',
    width: '200',
    icon: 'mdi mdi-spellcheck',
    displayInCsv: true,
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
    displayInCsv: true,
  },
]
export const monthlyTrackingConfigs = (supportedDocument) => [
  {
    label: 'Company',
    key: 'company',
    width: '200',
    icon: 'mdi mdi-spellcheck',
    type: 'text',
    displayInCsv: true,
  },

  {
    label: 'Block',
    key: 'block',
    width: '200',
    type: 'text',
    icon: 'mdi mdi-spellcheck',
    displayInCsv: true,
  },
  {
    label: 'Submitted Date',
    key: 'submittedDate',
    width: '200',
    // type: 'date',
    // dateFormat: 'DD MMM, YYYY',
    icon: 'mdi mdi-spellcheck',
    displayInCsv: true,
  },
  {
    label: 'Submitted By',
    key: 'submittedBy',
    width: '200',
    icon: 'mdi mdi-spellcheck',
    displayInCsv: true,
  },
  {
    label: 'Reference Date',
    key: 'referenceDate',
    width: '200',
    icon: 'mdi mdi-spellcheck',
    displayInCsv: true,
    // type: 'date',
    // dateFormat: 'DD MMM, YYYY',
  },
  {
    label: 'Status Date',
    key: 'statusDate',
    width: '200',
    icon: 'mdi mdi-spellcheck',
    displayInCsv: true,
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
    displayInCsv: true,
  },
]
export const omanHydConfigs = (supportedDocument) => [
  {
    label: 'Company',
    key: 'company',
    width: '200',
    icon: 'mdi mdi-spellcheck',
    type: 'text',
    displayInCsv: true,
  },

  /* {
    label: 'Block',
    key: 'block',
    width: '200',
    type: 'text',
    icon: 'mdi mdi-spellcheck',
    displayInCsv: true,
  }, */
  {
    label: 'Submitted Date',
    key: 'submittedDate',
    width: '200',
    type: 'text',
    dateFormat: 'DD MMM, YYYY',
    icon: 'mdi mdi-spellcheck',
    displayInCsv: true,
  },
  {
    label: 'Submitted By',
    key: 'submittedBy',
    width: '200',
    icon: 'mdi mdi-spellcheck',
    displayInCsv: true,
  },
  {
    label: 'Reference Date',
    key: 'referenceDate',
    width: '200',
    icon: 'mdi mdi-spellcheck',
    type: 'text',
    dateFormat: 'DD MMM, YYYY',
    displayInCsv: true,
  },
  {
    label: 'Status Date',
    key: 'statusDate',
    width: '200',
    icon: 'mdi mdi-spellcheck',
    type: 'text',
    dateFormat: 'DD MMM, YYYY',
    displayInCsv: true,
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
    displayInCsv: true,
  },
]
export const dailyProductionData = [
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

export const monthlyProductionData = [
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

export const monthlyTrackingData = [
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

export const omanHydData = [
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
export const actionsHeader = (
  key,
  id,
  subModule,
  subsubModule,
  role,
  supportedDocument,
  originalFileId,
  downloadOriginalFile,
  handleDeleteProduction,
  setShowDeleteDialog,
  fileName,
  status,
  submitDraft,
) => {
  switch (role) {
    case 'regulator':
    default:
      if (subModule === 'oman-hydrocarbon') {
        return [
          {
            id: 1,
            label: 'Download Original File',
            onClick: () => {
              downloadOriginalFile(originalFileId, fileName)
            },
          },
          {
            id: 2,
            label: 'View Details',
            onClick: () => {
              navigate(`/ams/production/${subModule}/${id}`)
            },
          },
          {
            id: 3,
            label: 'View Documents',
            onClick: () => {
              supportedDocument(subModule)
            },
          },
          {
            id: 3,
            label: 'Delete',
            onClick: () => {
              setShowDeleteDialog(id)
            },
          },
        ]
      } else {
        return [
          {
            id: 1,
            label: 'Download Original File',
            onClick: () => {
              downloadOriginalFile(originalFileId, fileName)
            },
          },
          {
            id: 2,
            label: 'View Details',
            onClick: () => {
              navigate(`/ams/production/${subModule}/${id}`)
            },
          },
          {
            id: 3,
            label: 'View Documents',
            onClick: () => {
              supportedDocument(subModule)
            },
          },
        ]
      }

    case 'operator':
      if (status === 'DRAFT') {
        return [
          {
            id: 1,
            label: 'Delete',
            onClick: () => {
              setShowDeleteDialog(id)
              // handleDeleteProduction(id)
            },
          },

          {
            id: 2,
            label: 'Download Original File',
            onClick: () => {
              downloadOriginalFile(originalFileId, fileName)
            },
          },
          {
            id: 3,
            label: 'View Details',
            onClick: () => {
              navigate(`/ams/production/${subModule}/${id}`)
            },
          },
          {
            id: 4,
            label: 'Upload Documents',
            onClick: () => {
              supportedDocument(true)
            },
          },
          {
            id: 5,
            label: 'Submit Draft report',
            onClick: () => {
              submitDraft(subModule, id)
            },
          },
        ]
      } else {
        return [
          {
            id: 1,
            label: 'Delete',
            onClick: () => {
              setShowDeleteDialog(id)
            },
          },
          {
            id: 2,
            label: 'Download Original File',
            onClick: () => {
              downloadOriginalFile(originalFileId, fileName)
            },
          },
          {
            id: 3,
            label: 'View Details',
            onClick: () => {
              navigate(`/ams/production/${subModule}/${id}`)
            },
          },
          {
            id: 4,
            label: 'Upload Documents',
            onClick: () => {
              supportedDocument(true)
            },
          },
        ]
      }
  }
}

export const dailyProductionDetailsConfigs = () => [
  {
    label: 'Production',
    key: 'production',
    type: 'subColumns',
    width: 400,
    columns: [
      {
        label: 'Item',
        subKey: 'item',
        icon: 'mdi mdi-spellcheck',
        width: 200,
      },
      {
        label: 'UOM',
        subKey: 'uom',
        icon: 'mdi mdi-spellcheck',
        width: 200,
      },
    ],
  },
  {
    label: 'Daily Field Production Vols',
    key: 'dailyField',
    type: 'subColumns',
    width: 600,
    columns: [
      {
        label: 'Actual',
        subKey: 'actualF',
        icon: 'mdi mdi-spellcheck',
        width: 200,
      },
      {
        label: 'Target',
        subKey: 'target',
        icon: 'mdi mdi-spellcheck',
        width: 200,
      },
      {
        label: 'LE',
        subKey: 'le',
        icon: 'mdi mdi-spellcheck',
        width: 200,
      },
    ],
  },
  {
    label: 'Scheduled Deferment Vols',
    type: 'subColumns',
    key: 'scheduled',
    width: 400,
    columns: [
      {
        label: 'Actual',
        subKey: 'actual',
        icon: 'mdi mdi-spellcheck',
        width: 200,
      },
      {
        label: 'Actual (%)',
        subKey: 'actualS',
        icon: 'mdi mdi-spellcheck',
        width: 200,
      },
      {
        label: 'Target',
        subKey: 'target',
        icon: 'mdi mdi-spellcheck',
        width: 200,
      },
    ],
  },
  {
    label: 'Unscheduled Deferment Vols',
    type: 'subColumns',
    key: 'unscheduled',
    width: 400,
    columns: [
      {
        label: 'Actual',
        subKey: 'actual',
        icon: 'mdi mdi-spellcheck',
        width: 200,
      },
      {
        label: 'Actual (%)',
        subKey: 'actualS',
        icon: 'mdi mdi-spellcheck',
        width: 200,
      },
      {
        label: 'Target',
        subKey: 'target',
        icon: 'mdi mdi-spellcheck',
        width: 200,
      },
    ],
  },
  {
    label: 'Major Production Highlights/Lowlights',
    key: 'majorProduction',
    width: '400',
    icon: 'mdi mdi-spellcheck',
    type: 'text',
  },
]
export const dailyProductionDetailsData = [
  {
    production: [{ item: 'OIL' }, { uom: 'bbl/d' }],
    dailyField: [{ actualF: '1421' }, { target: 'target' }, { le: 'le' }],
    scheduled: [{ actual: 'actual' }, { actualS: '23%' }],
  },
]

export const MonthlyProductionDetailsConfigs = () => [
  {
    label: 'OIL PROD (bbl/d)',
    key: 'oilProd',
    type: 'subColumns',
    width: 400,
    columns: [
      {
        label: 'Actual',
        subKey: 'actual',
        icon: 'mdi mdi-spellcheck',
        width: 200,
      },
      {
        label: 'Target',
        subKey: 'target',
        icon: 'mdi mdi-spellcheck',
        width: 200,
      },
    ],
  },
  {
    label: 'CONDENSATE PROD (bbl/d)',
    key: 'condensateProd',
    type: 'subColumns',
    width: 400,
    columns: [
      {
        label: 'Actual',
        subKey: 'actual',
        icon: 'mdi mdi-spellcheck',
        width: 200,
      },
      {
        label: 'Target',
        subKey: 'target',
        icon: 'mdi mdi-spellcheck',
        width: 200,
      },
    ],
  },
  {
    label: 'NAG PROD (MM scf/d)',
    type: 'subColumns',
    key: 'nagProd',
    width: 400,
    columns: [
      {
        label: 'Actual',
        subKey: 'actual',
        icon: 'mdi mdi-spellcheck',
        width: 200,
      },
      {
        label: 'Target',
        subKey: 'target',
        icon: 'mdi mdi-spellcheck',
        width: 200,
      },
    ],
  },
  {
    label: 'AG PROD (MM scf/d)',
    type: 'subColumns',
    key: 'agProd',
    width: 400,
    columns: [
      {
        label: 'Actual',
        subKey: 'actual',
        icon: 'mdi mdi-spellcheck',
        width: 200,
      },
      {
        label: 'Target',
        subKey: 'target',
        icon: 'mdi mdi-spellcheck',
        width: 200,
      },
    ],
  },
  {
    label: 'WATER PROD (MM scf/d)',
    type: 'subColumns',
    key: 'waterProd',
    width: 400,
    columns: [
      {
        label: 'Actual',
        subKey: 'actual',
        icon: 'mdi mdi-spellcheck',
        width: 200,
      },
      {
        label: 'Target',
        subKey: 'target',
        icon: 'mdi mdi-spellcheck',
        width: 200,
      },
    ],
  },
  {
    label: 'WATER INJ (bbi/d)',
    type: 'subColumns',
    key: 'waterInj',
    width: 400,
    columns: [
      {
        label: 'Actual',
        subKey: 'actual',
        icon: 'mdi mdi-spellcheck',
        width: 200,
      },
      {
        label: 'Target',
        subKey: 'target',
        icon: 'mdi mdi-spellcheck',
        width: 200,
      },
    ],
  },
  {
    label: 'WATER DISPOSAL (bbi/d)',
    type: 'subColumns',
    key: 'waterDisposal',
    width: 400,
    columns: [
      {
        label: 'Actual',
        subKey: 'actual',
        icon: 'mdi mdi-spellcheck',
        width: 200,
      },
      {
        label: 'Target',
        subKey: 'target',
        icon: 'mdi mdi-spellcheck',
        width: 200,
      },
    ],
  },
  {
    label: 'FLARE GAS RATE (MM scf/d)',
    type: 'subColumns',
    key: 'flareGasRate',
    width: 400,
    columns: [
      {
        label: 'Actual',
        subKey: 'actual',
        icon: 'mdi mdi-spellcheck',
        width: 200,
      },
      {
        label: 'Target',
        subKey: 'target',
        icon: 'mdi mdi-spellcheck',
        width: 200,
      },
    ],
  },
]

export const MonthlyProductionDetailsData = [
  {
    oilProd: [{ actual: 'OIL' }, { target: 'bbl/d' }],
    condensateProd: [{ actual: 'OIL' }, { target: 'bbl/d' }],
    nagProd: [{ actual: 'OIL' }, { target: 'bbl/d' }],
    agProd: [{ actual: 'OIL' }, { target: 'bbl/d' }],
    waterProd: [{ actual: 'OIL' }, { target: 'bbl/d' }],
    waterInj: [{ actual: 'OIL' }, { target: 'bbl/d' }],
    waterDisposal: [{ actual: 'OIL' }, { target: 'bbl/d' }],
    flareGasRate: [{ actual: 'OIL' }, { target: 'bbl/d' }],
  },
]
const gomiConfigs = [
  {
    label: 'GOMI Value',
    key: 'gomi',
    width: '800',
    type: 'text',
    icon: 'mdi mdi-spellcheck',
  },
  /* {
    label: 'Production',
    key: 'production',
    width: '800',
    type: 'text',
    icon: 'mdi mdi-spellcheck',
  }, */
  {
    label: 'Unit',
    key: 'unit',
    width: '800',
    type: 'text',
    icon: 'mdi mdi-spellcheck',
  },
  {
    label: 'Material Types',
    key: 'materialTypes',
    width: '800',
    type: 'text',
    icon: 'mdi mdi-spellcheck',
  },
  {
    label: 'Company',
    key: 'company',
    width: '800',
    type: 'text',
    icon: 'mdi mdi-spellcheck',
  },
  {
    label: 'Blocks',
    key: 'blocks',
    width: '800',
    type: 'text',
    icon: 'mdi mdi-spellcheck',
  },
]
export const MonthlyTrackingDetailsConfigs = (selectedGrid) => [
  ...(selectedGrid === 'gomi'
    ? gomiConfigs
    : [
      {
        label: 'Destination',
        key: 'destination',
        width: '800',
        icon: 'mdi mdi-spellcheck',
        type: 'text',
      },
      {
        label: 'Volume (bbis/d)',
        key: 'volume',
        width: '800',
        type: 'text',
        icon: 'mdi mdi-spellcheck',
      },
    ]),
]

export const MonthlyTrackingDetailsData = [
  {
    destination: 'China',
    volume: '122',
  },

  {
    destination: 'Japan',
    volume: '545445',
  },
]

// monthlyDataWellCount
export const MonthlyWellCountDetailsConfigs = () => [
  {
    label: 'OIL PRODUCER',
    key: 'oilProducer',
    type: 'subColumns',
    width: 400,
    columns: [
      {
        label: 'Total',
        subKey: 'total',
        icon: 'mdi mdi-spellcheck',
        width: 200,
      },
      {
        label: 'Closed-In',
        subKey: 'closedIn',
        icon: 'mdi mdi-spellcheck',
        width: 200,
      },
    ],
  },
  {
    label: 'GAS PRODUCER',
    key: 'gasProducer',
    type: 'subColumns',
    width: 400,
    columns: [
      {
        label: 'Total',
        subKey: 'total',
        icon: 'mdi mdi-spellcheck',
        width: 200,
      },
      {
        label: 'Closed-In',
        subKey: 'closedIn',
        icon: 'mdi mdi-spellcheck',
        width: 200,
      },
    ],
  },
  {
    label: 'WATER INJECTOR',
    type: 'waterInjector',
    key: 'nagProd',
    width: 400,
    columns: [
      {
        label: 'Total',
        subKey: 'total',
        icon: 'mdi mdi-spellcheck',
        width: 200,
      },
      {
        label: 'Closed-In',
        subKey: 'closedIn',
        icon: 'mdi mdi-spellcheck',
        width: 200,
      },
    ],
  },
  {
    label: 'STEAM INJECTOR',
    type: 'subColumns',
    key: 'steamInjector',
    width: 400,
    columns: [
      {
        label: 'Total',
        subKey: 'total',
        icon: 'mdi mdi-spellcheck',
        width: 200,
      },
      {
        label: 'Closed-In',
        subKey: 'closedIn',
        icon: 'mdi mdi-spellcheck',
        width: 200,
      },
    ],
  },
  {
    label: 'WATER SUPPLIER',
    type: 'subColumns',
    key: 'waterSupplier',
    width: 400,
    columns: [
      {
        label: 'Total',
        subKey: 'total',
        icon: 'mdi mdi-spellcheck',
        width: 200,
      },
      {
        label: 'Closed-In',
        subKey: 'closedIn',
        icon: 'mdi mdi-spellcheck',
        width: 200,
      },
    ],
  },
  {
    label: 'WATER DISPOSAL',
    type: 'subColumns',
    key: 'waterDisposal',
    width: 400,
    columns: [
      {
        label: 'Actual',
        subKey: 'total',
        icon: 'mdi mdi-spellcheck',
        width: 200,
      },
      {
        label: 'Target',
        subKey: 'closedIn',
        icon: 'mdi mdi-spellcheck',
        width: 200,
      },
    ],
  },
  {
    label: 'OTHERS*',
    type: 'subColumns',
    key: 'others',
    width: 400,
    columns: [
      {
        label: 'Actual',
        subKey: 'total',
        icon: 'mdi mdi-spellcheck',
        width: 200,
      },
      {
        label: 'Target',
        subKey: 'closedIn',
        icon: 'mdi mdi-spellcheck',
        width: 200,
      },
    ],
  },
]
const renderYears = (keys) => {
  let values = []
  for (let i = 0; i < keys?.duration; i++) {
    values = [
      ...values,
      {
        label: keys?.firstYear + i,
        key: 'year' + i,
        type: 'text',
        width: 400,
        icon: 'mdi mdi-spellcheck',
      },
    ]
  }
  return values
}
export const OmanHydrocarbonDetailsConfigs = (keys) => [
  {
    label: 'Companies & Blocks',
    key: 'compAndBlock',
    type: 'text',
    width: 400,
    icon: 'mdi mdi-spellcheck',
  },
  ...renderYears(keys),
]
