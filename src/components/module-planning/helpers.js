import { FileInput, FontIcon } from 'react-md'
import { navigate } from '@reach/router'
import { listAnalytics } from 'libs/api/api-planning'

export const planningConfigs = () => [
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
  role,
  supportedDocument,
  subModule,
  onDelete,
  downloadOriginalFile,
  originalFileId,
  onUpdate,
) => {
  switch (role) {
    case 'tecom fincom jmc':
    default:
      return [
        {
          id: 1,
          label: 'Initiate Meeting',
          onClick: () => {},
        },
        {
          id: 2,
          label: 'View Process Historian',
          onClick: () => {
            id && navigate(`/ams/planning/view-historian/${subModule}/${id}`)
          },
        },
        {
          id: 3,
          label: 'View Details',
          onClick: () => {
            key && id && navigate(`/ams/planning/${key}/${id}`)
          },
        },
        {
          id: 4,
          label: 'View Analytics',
          onClick: () => {
            listAnalytics(subModule)
          },
        },
        {
          id: 5,
          label: 'Clarity',
          onClick: () => {},
        },
        {
          id: 6,
          label: 'Download Original File',
          onClick: () => {
            downloadOriginalFile(originalFileId, `template_${key}_${subModule}`)
          },
        },
        {
          id: 7,
          label: 'View Documents',
          onClick: () => {},
        },
      ]
    case 'operator':
      return [
        {
          id: 1,
          label: 'View Process Historian',
          onClick: () => {
            id && navigate(`/ams/planning/view-historian/${subModule}/${id}`)
          },
        },
        {
          id: 2,
          label: 'Delete',
          onClick: () => {
            onDelete(subModule, id)
          },
        },
        {
          id: 3,
          label: 'View Details',
          onClick: () => {
            key && id && navigate(`/ams/planning/${key}/${id}`)
          },
        },
        {
          id: 4,
          label: 'View Analytics',
          onClick: () => {
            listAnalytics(subModule)
          },
        },
        {
          id: 5,
          label: 'Update',
          onClick: () => {
            onUpdate(true)
          },
        },
        {
          id: 6,
          label: 'Download Original File',
          onClick: () => {
            downloadOriginalFile(originalFileId, `template_${key}_${subModule}`)
          },
        },
        {
          id: 7,
          label: 'Upload Documents',
          onClick: () => {
            supportedDocument(true)
          },
        },
      ]
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
    label: 'Scheduled Department Vols',
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
    ],
  },
]
export const dailyProductionDetailsData = [
  {
    production: [{ item: 'OIL' }, { uom: 'bbl/d' }],
    dailyField: [{ actualF: '1421' }, { target: 'target' }, { le: 'le' }],
    scheduled: [{ actual: 'actual' }, { actualS: '23%' }],
  },
]
