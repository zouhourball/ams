import { Button, FontIcon } from 'react-md'
import { navigate } from '@reach/router'
import { downloadOriginalFile } from 'libs/api/supporting-document-api'
import moment from 'moment'

export const configs = (supportedDocument, currentTab) => {
  if (currentTab === 0) {
    return [
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
        label: 'Latest version',
        key: 'latestVersion',
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
          <Button
            className="upload-docs-button"
            id={row.id}
            flat
            primary
            iconBefore
            iconChildren={<FontIcon>save_alt</FontIcon>}
            onClick={(e) => {
              e.preventDefault()
              supportedDocument(row)
            }}
          >
            Upload Documents
          </Button>
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
  } else {
    return [
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
          <Button
            className="upload-docs-button"
            id={row.id}
            flat
            primary
            iconBefore
            iconChildren={<FontIcon>save_alt</FontIcon>}
            onClick={(e) => {
              e.preventDefault()
              supportedDocument(row)
            }}
          >
            Upload Documents
          </Button>
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
  }
}
/* export const annualCostConfigs = (supportedDocument) => [
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
      <Button
        className="upload-docs-button"
        id={row.id}
        flat
        primary
        iconBefore
        iconChildren={<FontIcon>save_alt</FontIcon>}
        onClick={(e) => {
          e.preventDefault()
          supportedDocument(row)
        }}
      >
        Upload Documents
      </Button>
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

export const contractReportConfigs = (supportedDocument) => [
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
      <Button
        className="upload-docs-button"
        id={row.id}
        flat
        primary
        iconBefore
        iconChildren={<FontIcon>save_alt</FontIcon>}
        onClick={(e) => {
          e.preventDefault()
          supportedDocument(row)
        }}
      >
        Upload Documents
      </Button>
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
export const productionLiftingConfigs = (supportedDocument) => [
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
      <Button
        className="upload-docs-button"
        id={row.id}
        flat
        primary
        iconBefore
        iconChildren={<FontIcon>save_alt</FontIcon>}
        onClick={(e) => {
          e.preventDefault()
          supportedDocument(row)
        }}
      >
        Upload Documents
      </Button>
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
export const transactionConfigs = (supportedDocument) => [
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
      <Button
        className="upload-docs-button"
        id={row.id}
        flat
        primary
        iconBefore
        iconChildren={<FontIcon>save_alt</FontIcon>}
        onClick={(e) => {
          e.preventDefault()
          supportedDocument(row)
        }}
      >
        Upload Documents
      </Button>
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
export const affiliateConfigs = (supportedDocument) => [
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
      <Button
        className="upload-docs-button"
        id={row.id}
        flat
        primary
        iconBefore
        iconChildren={<FontIcon>save_alt</FontIcon>}
        onClick={(e) => {
          e.preventDefault()
          supportedDocument(row)
        }}
      >
        {' '}
        Upload Documents
      </Button>
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
export const facilitiesConfigs = (supportedDocument) => [
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
      <Button
        className="upload-docs-button"
        id={row.id}
        flat
        primary
        iconBefore
        iconChildren={<FontIcon>save_alt</FontIcon>}
        onClick={(e) => {
          e.preventDefault()
          supportedDocument(row)
        }}
      >
        Upload Documents
      </Button>
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
*/
export const annualCostData = [
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
export const contractReportData = [
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

export const productionLiftingData = [
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

export const transactionData = [
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

export const affiliateData = [
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
export const facilitiesData = [
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
  subKey,
  role,
  supportedDocument,
  deleteRow,
  row,
  setShowUploadRapportDialog,
) => {
  switch (role) {
    case 'regulator':
    default:
      return [
        {
          id: 1,
          label: 'Download Original File',
          onClick: () => {
            downloadOriginalFile(row?.originalFileId, row?.originalFileName)
          },
        },
        {
          id: 2,
          label: 'View Details',
          onClick: () => {
            key && id && navigate(`/ams/costrecovery/${key}/${subKey}/${id}`)
          },
        },
        {
          id: 3,
          label: 'View Documents',
          primary: true,
          onClick: () => {
            supportedDocument(subKey)
          },
        },
      ]
    case 'operator':
      return [
        {
          id: 1,
          label: 'Download Original File',
          onClick: () => {
            downloadOriginalFile(row?.originalFileId, row?.originalFileName)
          },
        },
        {
          id: 2,
          label: 'Delete',
          onClick: () => {
            deleteRow()
          },
        },
        // {
        //   id: 3,
        //   label: 'Update',
        //   onClick: () => {},
        // },
        {
          id: 4,
          label: 'View Details',
          onClick: () => {
            key && id && navigate(`/ams/costrecovery/${key}/${subKey}/${id}`)
          },
        },
        {
          id: 5,
          label: 'Upload Documents',
          primary: true,
          onClick: () => {
            supportedDocument(subKey)
          },
        },
        {
          id: 5,
          label: 'Update',
          primary: true,
          onClick: () => {
            setShowUploadRapportDialog(true)
          },
        },
      ]
  }
}
const renderMonths = (index) => {
  let end = index * 3
  let start = end - 3
  let monthCells = []
  for (let i = start; i < end; i++) {
    monthCells.push({
      label: moment.monthsShort(i).toUpperCase(),
      subKey: moment.monthsShort(i).toUpperCase(),
      icon: 'mdi mdi-spellcheck',
      width: 100,
      subColumns: [
        {
          label: 'Plan',
          subKeyS: 'plan',
          width: 100,
          icon: 'mdi mdi-pound-box',
        },
        {
          label: 'Actual',
          subKeyS: 'actual',
          width: 100,
          icon: 'mdi mdi-pound-box',
        },
      ],
    })
  }
  return monthCells
}
const renderMonthsAndQuarter = () => {
  let elements = []
  let qIndex = 1
  for (let i = 0; i < 8; i++) {
    if (i % 2 === 0) {
      elements.push({
        label: 'Month',
        key: `month${i}`,
        width: '600',
        icon: 'mdi mdi-spellcheck',
        type: 'subColumns',
        columns: renderMonths(qIndex),
      })
    } else {
      elements.push({
        label: `Quarter`,
        key: `quarter${i}`,
        width: '200',
        icon: 'mdi mdi-spellcheck',
        type: 'subColumns',
        columns: [
          {
            label: `Q${qIndex}`,
            subKey: `Q${qIndex}`,
            icon: 'mdi mdi-spellcheck',
            width: 200,
            subColumns: [
              {
                label: 'Plan',
                subKeyS: 'plan',
                width: 100,
                icon: 'mdi mdi-pound-box',
              },
              {
                label: 'Actual',
                subKeyS: 'actual',
                width: 100,
                icon: 'mdi mdi-pound-box',
              },
            ],
          },
        ],
      })
      qIndex++
    }
  }
  return elements
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
  {
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
  },
  ...renderMonthsAndQuarter(),
]
export const actionsHeaderReports = (row, handleDeletePermit, setPreview) => [
  {
    id: 1,
    label: 'Delete',
    onClick: () => {
      handleDeletePermit(row?.id)
    },
  },
  {
    id: 2,
    label: 'Preview',
    onClick: () => {
      setPreview(true)
    },
  },
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
