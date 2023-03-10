import { FileInput, FontIcon } from 'react-md'
import { navigate } from '@reach/router'

import annualPlanTemplate from './files/Annual-Gas-Conservation-Plan.doc'

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
  },
  {
    label: 'Status Date',
    key: 'statusDate',
    width: '200',
    icon: 'mdi mdi-spellcheck',
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
    // type: 'date',
    // dateFormat: 'DD MMM, YYYY',
    displayInCsv: true,
  },
  {
    label: 'Status Date',
    key: 'statusDate',
    width: '200',
    icon: 'mdi mdi-spellcheck',
    // type: 'date',
    // dateFormat: 'DD MMM, YYYY',
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
  downloadOriginalFile,
  originalFileId,
  fileName,
  submitDraft,
  status,
) => {
  const opEntries = [
    {
      id: 1,
      label: 'Delete',
      onClick: () => {
        onDelete(id)
      },
    },
    {
      id: 2,
      label: 'Download Annual Plan',
      onClick: () => {
        annualPlanTemplate && annualPlanTemplate.downloadFile()
      },
    },
    {
      id: 3,
      label: 'Download Original File',
      onClick: () => {
        downloadOriginalFile(originalFileId, fileName)
      },
    },
    {
      id: 4,
      label: 'View Details',
      onClick: () => {
        navigate(`/ams/hse/${key}/${subModule}/${id}`)
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

  const draftBtn = {
    id: 6,
    label: 'Submit Draft report',
    onClick: () => {
      submitDraft(subModule, id)
    },
  }

  switch (role) {
    case 'regulator':
    default:
      return [
        {
          id: 1,
          label: 'Download Annual Plan',
          onClick: () => {
            annualPlanTemplate && annualPlanTemplate.downloadFile()
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
            navigate(`/ams/hse/${key}/${subModule}/${id}`)
          },
        },
        {
          id: 4,
          label: 'View Documents',
          onClick: () => {
            // navigate(`/ams/hse/${key}/${id}`)
            supportedDocument(true)
          },
        },
      ]
    case 'operator':
      return status === 'DRAFT' ? [...opEntries, draftBtn] : [...opEntries]
  }
}

export const actionsHeaderMonthly = (
  key,
  id,
  role,
  supportedDocument,
  subModule,
  onDelete,
  downloadOriginalFile,
  originalFileId,
  fileName,
  submitDraft,
  status,
) => {
  const opEntries = [
    {
      id: 1,
      label: 'Delete',
      onClick: () => {
        onDelete(id)
      },
    },
    {
      id: 3,
      label: 'Download Original File',
      onClick: () => {
        downloadOriginalFile(originalFileId, fileName)
      },
    },
    {
      id: 4,
      label: 'View Details',
      onClick: () => {
        navigate(`/ams/hse/${key}/${subModule}/${id}`)
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
  const draftBtn = {
    id: 6,
    label: 'Submit Draft report',
    onClick: () => {
      submitDraft(subModule, id)
    },
  }
  switch (role) {
    case 'regulator':
    default:
      return [
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
            navigate(`/ams/hse/${key}/${subModule}/${id}`)
          },
        },
        {
          id: 4,
          label: 'View Documents',
          onClick: () => {
            // navigate(`/ams/hse/${key}/${id}`)
            supportedDocument(true)
          },
        },
      ]
    case 'operator':
      return status === 'DRAFT' ? [...opEntries, draftBtn] : [...opEntries]
  }
}

export const actionsHeader = (
  key,
  id,
  role,
  supportedDocument,
  onDelete,
  downloadOriginalFile,
  originalFileId,
  fileName,
  submitDraft,
  status,
) => {
  const opEntries = [
    {
      id: 1,
      label: 'Delete',
      onClick: () => {
        onDelete(id)
      },
    },
    {
      id: 3,
      label: 'Download Original File',
      onClick: () => {
        downloadOriginalFile(originalFileId, fileName)
      },
    },
    {
      id: 4,
      label: 'View Details',
      onClick: () => {
        navigate(`/ams/hse/${key}/${id}`)
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
  const draftBtn = {
    id: 6,
    label: 'Submit Draft report',
    onClick: () => {
      submitDraft(id)
    },
  }
  switch (role) {
    case 'regulator':
    default:
      return [
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
            navigate(`/ams/hse/${key}/${id}`)
          },
        },
        {
          id: 4,
          label: 'View Documents',
          onClick: () => {
            // navigate(`/ams/hse/${key}/${id}`)
            supportedDocument(true)
          },
        },
      ]
    case 'operator':
      return status === 'DRAFT' ? [...opEntries, draftBtn] : [...opEntries]
  }
}

export const actionsHeaderDaily = (
  key,
  id,
  role,
  supportedDocument,
  subModule,
  onDelete,
  downloadOriginalFile,
  originalFileId,
  fileName,
  submitDraft,
  status,
) => {
  const opEntries = [
    {
      id: 1,
      label: 'Delete',
      onClick: () => {
        onDelete(id)
      },
    },
    {
      id: 3,
      label: 'Download Original File',
      onClick: () => {
        downloadOriginalFile(originalFileId, fileName)
      },
    },
    {
      id: 4,
      label: 'View Details',
      onClick: () => {
        navigate(`/ams/hse/${key}/${subModule}/${id}`)
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
  const draftBtn = {
    id: 6,
    label: 'Submit Draft report',
    onClick: () => {
      submitDraft(subModule, id)
    },
  }
  switch (role) {
    case 'regulator':
    default:
      return [
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
            navigate(`/ams/hse/${key}/${subModule}/${id}`)
          },
        },
        {
          id: 4,
          label: 'View Documents',
          onClick: () => {
            // navigate(`/ams/hse/${key}/${id}`)
            supportedDocument(true)
          },
        },
      ]
    case 'operator':
      return status === 'DRAFT' ? [...opEntries, draftBtn] : [...opEntries]
  }
}
export const flaringDetailsAnnualConfigs = (
  // startYear = 2018,
  yearsFromReport = ['2018', '2022'],
) => {
  const yearTabConfigs = yearsFromReport?.map((y) => {
    return {
      label: y?.year,
      key: `year${y?.year}`,
      width: '200',
      icon: 'mdi mdi-spellcheck',
      type: 'text',
    }
  })
  return [
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
    ...yearTabConfigs,
    /* {
      label: startYear,
      key: `year${startYear}`,
      width: '200',
      icon: 'mdi mdi-spellcheck',
      type: 'text',
    },
    {
      label: startYear + 1,
      key: `year${startYear + 1}`,
      width: '200',
      icon: 'mdi mdi-spellcheck',
      type: 'text',
    },
    {
      label: startYear + 2,
      key: `year${startYear + 2}`,
      width: '200',
      icon: 'mdi mdi-spellcheck',
      type: 'text',
    },
    {
      label: startYear + 3,
      key: `year${startYear + 3}`,
      width: '200',
      icon: 'mdi mdi-spellcheck',
      type: 'text',
    },
    {
      label: startYear + 4,
      key: `year${startYear + 4}`,
      width: '200',
      icon: 'mdi mdi-spellcheck',
      type: 'text',
    },
    {
      label: startYear + 5,
      key: `year${startYear + 5}`,
      width: '200',
      icon: 'mdi mdi-spellcheck',
      type: 'text',
    },
    {
      label: startYear + 6,
      key: `year${startYear + 6}`,
      width: '200',
      icon: 'mdi mdi-spellcheck',
      type: 'text',
    },
    {
      label: startYear + 7,
      key: `year${startYear + 7}`,
      width: '200',
      icon: 'mdi mdi-spellcheck',
      type: 'text',
    },
    {
      label: startYear + 8,
      key: `year${startYear + 8}`,
      width: '200',
      icon: 'mdi mdi-spellcheck',
      type: 'text',
    },
    {
      label: startYear + 9,
      key: `year${startYear + 9}`,
      width: '200',
      icon: 'mdi mdi-spellcheck',
      type: 'text',
    }, */
  ]
}

export const flaringDetailsDailyConfigs = [
  {
    label: 'Flare Station ID',
    key: 'flareStation',
    width: '300',
    icon: 'mdi mdi-spellcheck',
    type: 'text',
  },
  {
    label: 'Latitude/Northing',
    key: 'latitudeNorthing',
    width: '300',
    icon: 'mdi mdi-spellcheck',
    type: 'text',
  },
  {
    label: 'Longitude/Easting',
    key: 'longitudeEasting',
    width: '300',
    icon: 'mdi mdi-spellcheck',
    type: 'text',
  },
  {
    label: 'Flare Amount Total (MMSCF/D)',
    key: 'flareAmountTotal',
    width: '300',
    icon: 'mdi mdi-spellcheck',
    type: 'text',
  },
  {
    label: 'Routine Flaring Amount (MMSCF/D)',
    key: 'routineFlaringAmount',
    width: '300',
    icon: 'mdi mdi-spellcheck',
    type: 'text',
  },
  {
    label: 'Non-routine Flaring Amount (MMSCF/D)',
    key: 'nonroutineFlaringAmount',
    width: '300',
    icon: 'mdi mdi-spellcheck',
    type: 'text',
  },
  {
    label: 'Comments (Sweet or Sour) ??? (NAG or AG)??? Reason',
    key: 'comment',
    width: '300',
    icon: 'mdi mdi-spellcheck',
    type: 'text',
  },
]

export const flaringDetailsMonthlyConfigs = [
  {
    label: 'Flare Station',
    key: 'flareStation',
    width: '300',
    icon: 'mdi mdi-spellcheck',
    type: 'text',
  },
  {
    label: 'LAT/NORTHING (UTM)',
    key: 'latitudeNorthing',
    width: '300',
    icon: 'mdi mdi-spellcheck',
    type: 'text',
  },
  {
    label: 'LONG/EASTING (UTM)',
    key: 'longitudeEasting',
    width: '300',
    icon: 'mdi mdi-spellcheck',
    type: 'text',
  },
  {
    label: 'TOTAL FLARING (ACTUAL) (MMSCF)',
    key: 'totalFlaringActuals',
    width: '300',
    icon: 'mdi mdi-spellcheck',
    type: 'text',
  },
  {
    label: 'ROUTINE FLARING (ACTUAL) (MMSCF)',
    key: 'routineFlaringActuals',
    width: '300',
    icon: 'mdi mdi-spellcheck',
    type: 'text',
  },
  {
    label: 'NON-ROUTINE FLARING (ACTUAL) (MMSCF)',
    key: 'nonRoutineFlaringActuals',
    width: '300',
    icon: 'mdi mdi-spellcheck',
    type: 'text',
  },
  {
    label: '(PLANNED) ROUTINE FLARING (MMSCF)',
    key: 'rotuineFlaringPlanned',
    width: '300',
    icon: 'mdi mdi-spellcheck',
    type: 'text',
  },
  {
    label: 'NON-ROUTINE FLARING (PLANNED) (MMSCF)',
    key: 'nonRotuineFlaringPlanned',
    width: '300',
    icon: 'mdi mdi-spellcheck',
    type: 'text',
  },
  {
    label: 'Comments (Sweet or Sour) ??? (NAG or AG)??? Reason',
    key: 'comment',
    width: '300',
    icon: 'mdi mdi-spellcheck',
    type: 'text',
  },
]

export const flaringDetailsDataMonthly = [
  {
    flareStation: '1223',
    latitudeNorthing: '1223',
    longitudeEasting: '1223',
    totalFlaringActuals: '1223',
    routineFlaringActuals: '1223',
    nonRoutineFlaringActuals: '1223',
    rotuineFlaringPlanned: '1223',
    nonRotuineFlaringPlanned: '1223',
    comment: '1223',
  },
]

export const flaringDetailsDataDaily = [
  {
    flareStation: '4545',
    latitudeNorthing: '45',
    longitudeEasting: '4545',
    flareAmountTotal: '4545',
    routineFlaringAmount: '4545',
    nonroutineFlaringAmount: '4545',
    comment: '4545',
  },
]

export const flaringDetailsData = [
  {
    gaz_type: 'Gas Flared (Excl. Gas Conservation)',
    unit: 'MMscf/d',
    year2017: '54454545',
    year2018: '54454545',
    year2019: '54454545',
    year2020: '54454545',
    year2021: '54454545',
    year2022: '54454545',
    year2023: '54454545',
    year2024: '54454545',
    year2025: '54454545',
    year2026: '54454545',
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
    key: 'yearEnd',
    width: '200',
    type: 'text',
    icon: 'mdi mdi-spellcheck',
    /* columns: [
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
    ], */
  },
  ...[
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ].map((el) => ({
    label: el,
    key: el, // .toLowerCase(),
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
