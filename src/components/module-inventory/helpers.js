import { FileInput, TextField, FontIcon } from 'react-md'
import { navigate } from '@reach/router'
import { downloadTemp } from 'libs/api/api-inventory'
import moment from 'moment'

import { DatePicker } from '@target-energysolutions/date-picker'

export const mhtConfig = (supportedDocument) => [
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
    render: (row) => (
      <div className={`table-status ${row?.status}`}>{row?.status}</div>
    ),
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
  setShowUploadRapportDialog,
  setCurrentInventoryId,
  originalFileId,
  originalFileName,
  downloadOriginalFile,
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
            id: 3,
            label: 'View Records',
            onClick: () => {
              key &&
                id &&
                navigate(
                  `/ams/inventory/inventory-consumption-records/${id}/${tab}`,
                )
            },
          },
        ]
      } else if (tab === 'base-surplus') {
        return [
          {
            id: 3,
            label: 'View Records',
            onClick: () => {
              key &&
                id &&
                navigate(
                  `/ams/inventory/inventory-surplus-records/${id}/${tab}`,
                )
            },
          },
        ]
      } else if (tab === 'addition') {
        return [
          {
            id: 1,
            label: 'Addition Records',
            onClick: () => {
              key && id && navigate(`/ams/inventory/addition-records/${id}`)
            },
          },
          {
            id: 2,
            label: 'View Documents',
            onClick: () => {
              supportedDocument(id)
            },
          },
          {
            id: 3,
            label: 'Download Template',
            onClick: () => {
              downloadTemp('inventoryManagment', 'AnnualInventoryProcess')
            },
          },
          {
            id: 3,
            label: 'Attach Spreadsheet',
            onClick: () => {
              setCurrentInventoryId(id)
              setShowUploadRapportDialog(true)
            },
          },
        ]
      } else if (
        tab === 'assetDisposalRequestProcess' ||
        tab === 'assetTransferRequestProcess'
      ) {
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
            onClick: () => {
              handleDeleteInventory(id)
            },
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
            onClick: () => {
              downloadOriginalFile(originalFileId, originalFileName)
            },
          },

          {
            id: 4,
            label: 'Upload Documents',
            onClick: () => {
              supportedDocument(id)
            },
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
              key &&
                id &&
                navigate(
                  `/ams/inventory/inventory-consumption-records/${id}/${tab}`,
                )
            },
          },
        ]
      } else if (tab === 'base-surplus') {
        return [
          {
            id: 2,
            label: 'Declare Surplus',
            onClick: () => {
              key && id && navigate(`/ams/inventory/${key}/${id}/${tab}`)
            },
          },
          {
            id: 3,
            label: 'View Records',
            onClick: () => {
              key &&
                id &&
                navigate(
                  `/ams/inventory/inventory-surplus-records/${id}/${tab}`,
                )
            },
          },
        ]
      } else if (tab === 'addition') {
        return [
          {
            id: 1,
            label: 'Addition Records',
            onClick: () => {
              key && id && navigate(`/ams/inventory/addition-records/${id}`)
            },
          },
          {
            id: 2,
            label: 'Upload Documents',
            onClick: () => {
              supportedDocument(id)
            },
          },
          {
            id: 3,
            label: 'Download Template',
            onClick: () => {
              downloadTemp('inventoryManagment', 'AnnualInventoryProcess')
            },
          },
          {
            id: 3,
            label: 'Attach Spreadsheet',
            onClick: () => {
              setCurrentInventoryId(id)
              setShowUploadRapportDialog(true)
            },
          },
        ]
      } else if (
        tab === 'assetDisposalRequestProcess' ||
        tab === 'assetTransferRequestProcess'
      ) {
        return [
          {
            id: 1,
            label: 'Delete',
            onClick: () => {
              handleDeleteInventory(id)
            },
          },
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
      } else {
        return []
      }
  }
}

export const additionRecordsConfigs = () => [
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
    label: 'Submission By',
    key: 'submissionBy',
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
    label: 'Status',
    key: 'status',
    width: '200',
    icon: 'mdi mdi-spellcheck',
  },
]
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

export const consumptionDetailsConfigs = () => [
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
export const additionRecordsDetailConfigs = () => [
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
export const assetConsumptionDetailsConfigs = (
  rows,
  setRows,
  colTitle,
  showDatePicker,
  setShowDatePicker,
) => [
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
    width: '300',
    icon: 'mdi mdi-spellcheck',
    expand: true,
  },

  {
    label: colTitle,
    key: 'consumption',
    width: '150',
    icon: 'mdi mdi-spellcheck',
    render: (row) => {
      let overStock = false
      const selectedRow = rows?.find((el) => el?.id === row?.id)
      if (+selectedRow?.Count <= +selectedRow?.currentSt) {
        overStock = false
      }
      return (
        <TextField
          lineDirection="center"
          id={row.id}
          type="number"
          className="upload-permit-dialog-textField"
          value={rows.find((r) => r.id === row.id)?.Count || ''}
          onChange={(v) => {
            if (+v <= +row?.currentSt) {
              let newRow = { ...row }
              const locaLRows = [...rows]
              newRow.Count = v
              const rowExist = rows?.find((el) => el?.id === newRow?.id)
              if (rowExist) {
                const index = rows.indexOf(rowExist)
                locaLRows[index].Count = v
              } else {
                locaLRows.push(newRow)
              }
              if (v === '') {
                const rowsFiltered = rows?.filter((el) => el?.id !== newRow?.id)
                setRows(rowsFiltered)
              } else {
                setRows(locaLRows)
              }
            } else {
            }
          }}
          min={0}
          error={overStock}
          // disabled={status === 'closed'}
          //   supportedDocument(row)
        />
      )
    },
  },

  {
    label: 'Current St',
    key: 'currentSt',
    width: '100',
    icon: 'mdi mdi-spellcheck',
  },
  {
    label: `Date of ${colTitle}`,
    key: 'dateOfConsumption',
    width: '200',
    icon: 'mdi mdi-spellcheck',
    className: 'datepicker-cell',
    render: (row) => {
      // const dateFormat = 'DD/MM/YYYY'
      // let validDate = false

      const selectedRow = rows?.find((el) => el?.id === row?.id)

      // if (
      //   selectedRow?.date &&
      //   !moment(selectedRow?.date, dateFormat, true).isValid()
      // ) {
      //   validDate = true
      // }

      return (
        <>
          <TextField
            id={row.id}
            className="upload-permit-dialog-textField"
            // onChange={(v) => {
            //   let newRow = { ...row }
            //   const locaLRows = [...rows]
            //   newRow.date = v
            //   const rowExist = rows?.find((el) => el?.id === newRow?.id)
            //   if (rowExist) {
            //     const index = rows.indexOf(rowExist)
            //     locaLRows[index].date = v
            //   } else {
            //     locaLRows.push(newRow)
            //   }

            //   if (v === '' && !selectedRow?.Count) {
            //     const rowsFiltered = rows?.filter((el) => el?.id !== newRow?.id)
            //     setRows(rowsFiltered)
            //   } else {
            //     setRows(locaLRows)
            //   }
            // }}
            onClick={() => setShowDatePicker(row)}
            placeholder={'DD/MM/YYYY'}
            rightIcon={<FontIcon>date_range</FontIcon>}
            // value={rows[row?.id]?.date}
            value={rows.find((r) => r.id === row.id)?.date || ''}
            block
            max={3}
            // error={validDate}
          />
          {showDatePicker?.id === row?.id && (
            <DatePicker
              singlePick
              translation={{ update: 'select' }}
              onUpdate={(v) => {
                let newRow = { ...row }
                const locaLRows = [...rows]
                newRow.date = moment(v.timestamp).format('DD/MM/YYYY')
                const rowExist = rows?.find((el) => el?.id === newRow?.id)
                if (rowExist) {
                  const index = rows.indexOf(rowExist)
                  locaLRows[index].date = moment(v.timestamp).format(
                    'DD/MM/YYYY',
                  )
                } else {
                  locaLRows.push(newRow)
                }

                if (v === '' && !selectedRow?.Count) {
                  const rowsFiltered = rows?.filter(
                    (el) => el?.id !== newRow?.id,
                  )
                  setRows(rowsFiltered)
                } else {
                  setRows(locaLRows)
                }
                setShowDatePicker(false)
              }}
              onCancel={() => setShowDatePicker(false)}
              minValidDate={{ timestamp: new Date().getTime() }}
              startView="year"
              endView="day"
            />
          )}
        </>
      )
    },
  },

  {
    label: 'UOM',
    key: 'uom',
    width: '100',
    icon: 'mdi mdi-spellcheck',
  },
  {
    label: 'Quantity',
    key: 'quantity',
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

export const consumptionRecordDetailsConfigs = () => [
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
    width: '400',
    icon: 'mdi mdi-spellcheck',
  },
  {
    label: 'Consumption',
    key: 'consumption',
    width: '200',
    icon: 'mdi mdi-spellcheck',
  },
  {
    label: 'Date  of Consumption',
    key: 'dateOfPurchase',
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
  {
    label: 'Total Value',
    key: 'totalValue',
    width: '200',
    icon: 'mdi mdi-spellcheck',
  },
]

export const surplusRecordDetailsConfigs = () => [
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
    width: '400',
    icon: 'mdi mdi-spellcheck',
  },
  {
    label: 'Surplus',
    key: 'surplus',
    width: '200',
    icon: 'mdi mdi-spellcheck',
  },
  {
    label: 'Date  of Consumption',
    key: 'dateOfPurchase',
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
  {
    label: 'Total Value',
    key: 'totalValue',
    width: '200',
    icon: 'mdi mdi-spellcheck',
  },
]
