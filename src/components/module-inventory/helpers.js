import { FileInput, FontIcon } from 'react-md'
import { navigate } from '@reach/router'

export const mhtConfig = (supportedDocument) => [
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

export const mhtConfigAssetRecords = (supportedDocument) => [
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
    label: 'Status Date',
    key: 'statusDate',
    width: '200',
    icon: 'mdi mdi-spellcheck',
  },
  {
    label: 'Status',
    key: 'status',
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
export const actionsHeader = (
  key,
  id,
  role,
  supportedDocument,
  tab,
  handleDeleteInventory,
) => {
  switch (role) {
    case 'regulator':
      if (tab === 'base') {
        return [
          /*   {
            id: 1,
            label: 'Download Original File',
            onClick: () => {},
          }, */
          {
            id: 2,
            label: 'View Details',
            onClick: () => {
              key && id && navigate(`/ams/inventory/${key}/${id}/${tab}`)
            },
          },
          /*      {
            id: 3,
            label: 'View Documents',
            onClick: () => {},
          }, */
        ]
      } else if (tab === 'base-consumption') {
        return [
          {
            id: 2,
            label: 'Declare Consumption',
            onClick: () => {
              key && id && navigate(`/ams/inventory/${key}/${id}/${tab}`)
            },
          },
          {
            id: 3,
            label: 'View Records',
            onClick: () => {
              key && id && navigate(`/ams/inventory/${key}/${id}/${tab}`)
            },
          },
        ]
      } else if (tab === 'base-surplus') {
        return [
          {
            id: 3,
            label: 'View Records',
            onClick: () => {
              key && id && navigate(`/ams/inventory/${key}/${id}/${tab}`)
            },
          },
        ]
      } else if (tab === 'addition') {
        // this else is to delete just for test .. ken 3ordhettek fassakhha plz
        return [
          {
            id: 1,
            label: 'View Details',
            onClick: () => {
              key && id && navigate(`/ams/inventory/${key}/${id}/${tab}`)
            },
          },
          {
            id: 2,
            label: 'Upload Documents',
            onClick: () => {},
          },
          {
            id: 3,
            label: 'Download Template',
            onClick: () => {},
          },
          {
            id: 4,
            label: 'Attach Spreadsheet',
            onClick: () => {},
          },
        ]
      } else {
        return []
      }

    default:
      return []
    case 'operator':
      if (tab === 'base') {
        return [
          {
            id: 1,
            label: 'Delete',
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
            label: 'Download Original File',
            onClick: () => {},
          },

          {
            id: 4,
            label: 'Upload Documents',
            onClick: () => {},
          },
        ]
      } else if (tab === 'base-consumption') {
        return [
          {
            id: 2,
            label: 'Declare Consumption',
            onClick: () => {
              key && id && navigate(`/ams/inventory/${key}/${id}/${tab}`)
            },
          },
          {
            id: 3,
            label: 'View Records',
            onClick: () => {
              key && id && navigate(`/ams/inventory/${key}/${id}/${tab}`)
            },
          },
        ]
      } else if (tab === 'base-surplus') {
        return [
          {
            id: 3,
            label: 'View Records',
            onClick: () => {
              key && id && navigate(`/ams/inventory/${key}/${id}/${tab}`)
            },
          },
        ]
      } else if (tab === 'addition') {
        return [
          {
            id: 1,
            label: 'View Details',
            onClick: () => {
              key && id && navigate(`/ams/inventory/${key}/${id}/${tab}`)
            },
          },
          {
            id: 2,
            label: 'Upload Documents',
            onClick: () => {},
          },
          {
            id: 3,
            label: 'Download Template',
            onClick: () => {},
          },
          {
            id: 3,
            label: 'Attach Spreadsheet',
            onClick: () => {},
          },
        ]
      } else {
        return []
      }
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
  },
  {
    label: 'Quantity',
    key: 'quantity',
    width: '200',
    icon: 'mdi mdi-spellcheck',
  },
  {
    label: 'Unit Price',
    key: 'unitPrice',
    width: '200',
    icon: 'mdi mdi-spellcheck',
  },
]

export const assetDisposalDetailsConfigs = () => [
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
    icon: 'mdi mdi-spellcheck',
  },
  {
    label: 'Classification',
    key: 'classification',
    width: '200',
    icon: 'mdi mdi-spellcheck',
  },
  {
    label: 'Quantity',
    key: 'quantity',
    width: '200',
    icon: 'mdi mdi-spellcheck',
  },
  {
    label: 'Measurement Unit',
    key: 'measurementUnit',
    width: '200',
    icon: 'mdi mdi-spellcheck',
  },
  {
    label: 'Storage Location',
    key: 'storageLocation',
    width: '200',
    icon: 'mdi mdi-spellcheck',
  },
  {
    label: 'Date of Purchase',
    key: 'dateOfPurchase',
    width: '200',
    icon: 'mdi mdi-spellcheck',
  },
  {
    label: 'Book Value',
    key: 'bookValue',
    width: '200',
    icon: 'mdi mdi-spellcheck',
  },
  {
    label: 'Estimated Current Value',
    key: 'estimatedCurrentValue',
    width: '200',
    icon: 'mdi mdi-spellcheck',
  },
  {
    label: 'Serial Number',
    key: 'serialNumber',
    width: '200',
    icon: 'mdi mdi-spellcheck',
  },
  {
    label: 'Material Location',
    key: 'materialLocation',
    width: '200',
    icon: 'mdi mdi-spellcheck',
  },
  {
    label: 'Inspection Date',
    key: 'inspectionDate',
    width: '200',
    icon: 'mdi mdi-spellcheck',
  },
  {
    label: 'Material Condition',
    key: 'materialCondition',
    width: '200',
    icon: 'mdi mdi-spellcheck',
  },
  {
    label: 'Weight',
    key: 'weight',
    width: '200',
    icon: 'mdi mdi-spellcheck',
  },
  {
    label: 'Average Length',
    key: 'averageLength',
    width: '200',
    icon: 'mdi mdi-spellcheck',
  },
  {
    label: 'Item Weight',
    key: 'itemWeight',
    width: '200',
    icon: 'mdi mdi-spellcheck',
  },
  {
    label: 'Total Weight',
    key: 'mTCertificate',
    width: '200',
    icon: 'mdi mdi-spellcheck',
  },
  {
    label: 'MT Certificate',
    key: 'mTCertificate',
    width: '200',
    icon: 'mdi mdi-spellcheck',
  },
  {
    label: 'Reasons for Sale / Write - off',
    key: 'reasonsForSale',
    width: '200',
    icon: 'mdi mdi-spellcheck',
  },
  {
    label: 'Remarks',
    key: 'remarks',
    width: '200',
    icon: 'mdi mdi-spellcheck',
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
export const assetDisposalDetailsData = [
  {
    id: '2656552',
    materialName: '60AAAA',
    materialCategory: 'Instruments, General',
    materialDescription: 'Emer-pm,ce3008,48mb',
    classification: 'EA',
    measurementUnit: 5,
    quantity: 3,
    storageLocation: '453852.55',
    bookValue: 5,
    estimatedCurrentValue: 3,
    serialNumber: '_',
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
  },
  {
    label: 'Date of Consumption',
    key: 'dateOfConsumption',
    width: '200',
    icon: 'mdi mdi-spellcheck',
  },
  {
    label: 'UOM',
    key: 'uom',
    width: '200',
    icon: 'mdi mdi-spellcheck',
  },
  {
    label: 'Total Quantity',
    key: 'totalQuantity',
    width: '200',
    icon: 'mdi mdi-spellcheck',
  },
  {
    label: 'Unit Price',
    key: 'unitPrice',
    width: '200',
    icon: 'mdi mdi-spellcheck',
  },
  {
    label: 'Total Value',
    key: 'totalValue',
    width: '200',
    icon: 'mdi mdi-spellcheck',
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
