import { FileInput, FontIcon } from 'react-md'
import { navigate } from '@reach/router'

export const mhtConfig = () => [
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

export const mhtFakeData = [
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
export const actionsHeader = (key, id, role, supportedDocument, tab) => {
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
            key && id && navigate(`/ams/inventory/${key}/${id}/${tab}`)
          },
        },
        {
          id: 3,
          label: 'View Documents',
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
            key && id && navigate(`/ams/inventory/${key}/${id}/${tab}`)
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

export const annualBaseDetailsConfigs = () => [
  {
    label: 'Material Name',
    key: 'materialName',
    width: '200',
    icon: 'mdi mdi-spellcheck',
    type: 'text',
  },

  {
    label: 'Material Category',
    key: 'materialCategory',
    width: '200',
    type: 'text',
    icon: 'mdi mdi-spellcheck',
  },
  {
    label: 'Material Description',
    key: 'materialDescription',
    width: '200',
    // type: 'date',
    // dateFormat: 'DD MMM, YYYY',
    icon: 'mdi mdi-spellcheck',
  },
  {
    label: 'Measurement Unit',
    key: 'measurementUnit',
    width: '200',
    icon: 'mdi mdi-spellcheck',
  },
  {
    label: 'Current St',
    key: 'currentSt',
    width: '200',
    icon: 'mdi mdi-spellcheck',
    // type: 'date',
    // dateFormat: 'DD MMM, YYYY',
  },
  {
    label: 'Quantity',
    key: 'quantity',
    width: '200',
    icon: 'mdi mdi-spellcheck',
    // type: 'date',
    // dateFormat: 'DD MMM, YYYY',
  },
  {
    label: 'Unit Price',
    key: 'unitPrice',
    width: '200',
    icon: 'mdi mdi-spellcheck',
    // type: 'date',
    // dateFormat: 'DD MMM, YYYY',
  },
]
export const annualBaseDetailsData = [
  {
    id: '2656552',
    materialName: '60AAAA',
    materialCategory: 'Instruments, General',
    materialDescription: 'Emer-pm,ce3008,48mb',
    measurementUnit: 'EA',
    currentSt: 5,
    quantity: 3,
    unitPrice: '453852.55',
  },
]
export const assetConsumptionDetailsConfigs = () => [
  {
    label: 'Material Name',
    key: 'materialName',
    width: '200',
    icon: 'mdi mdi-spellcheck',
    type: 'text',
  },

  {
    label: 'Material Category',
    key: 'materialCategory',
    width: '200',
    type: 'text',
    icon: 'mdi mdi-spellcheck',
  },
  {
    label: 'Material Description',
    key: 'materialDescription',
    width: '200',
    // type: 'date',
    // dateFormat: 'DD MMM, YYYY',
    icon: 'mdi mdi-spellcheck',
  },
  {
    label: 'Consumption',
    key: 'consumption',
    width: '200',
    icon: 'mdi mdi-spellcheck',
  },
  {
    label: 'Current Stock',
    key: 'currentStock',
    width: '200',
    icon: 'mdi mdi-spellcheck',
    // type: 'date',
    // dateFormat: 'DD MMM, YYYY',
  },
  {
    label: 'Date of Consumption',
    key: 'dateOfConsumption',
    width: '200',
    icon: 'mdi mdi-spellcheck',
    // type: 'date',
    // dateFormat: 'DD MMM, YYYY',
  },
  {
    label: 'UOM',
    key: 'uom',
    width: '200',
    icon: 'mdi mdi-spellcheck',
    // type: 'date',
    // dateFormat: 'DD MMM, YYYY',
  },
  {
    label: 'Total Quantity',
    key: 'totalQuantity',
    width: '200',
    icon: 'mdi mdi-spellcheck',
    // type: 'date',
    // dateFormat: 'DD MMM, YYYY',
  },
  {
    label: 'Unit Price',
    key: 'unitPrice',
    width: '200',
    icon: 'mdi mdi-spellcheck',
    // type: 'date',
    // dateFormat: 'DD MMM, YYYY',
  },
  {
    label: 'Total Value',
    key: 'totalValue',
    width: '200',
    icon: 'mdi mdi-spellcheck',
    // type: 'date',
    // dateFormat: 'DD MMM, YYYY',
  },
]
export const assetConsumptionDetailsData = [
  {
    id: '2656552',
    materialName: '60AAAA',
    materialCategory: 'Instruments, General',
    materialDescription: 'Emer-pm,ce3008,48mb',
    consumption: 'EA',
    currentStock: 5,
    dateOfConsumption: 3,
    uom: '453852.55',
    totalQuantity: 5665,
    unitPrice: 745,
    totalValue: 56,
  },
  {
    id: '58',
    materialName: '5/5',
    materialCategory: 'Casing, Coupling/Pupjo...',
    materialDescription: 'Housing, Spring, L505, Gill...',
    consumption: 'EA',
    currentStock: 5,
    dateOfConsumption: '12 Oct, 2021',
    uom: '453852.55',
    totalQuantity: 5665,
    unitPrice: 745,
    totalValue: 56,
  },
]
