import { FileInput, FontIcon } from 'react-md'
import { navigate } from '@reach/router'
import { downloadOriginalFile } from 'libs/api/supporting-document-api'
import { deleteReport } from 'libs/api/api-reserves'

export const annualReservesConfigs = (supportedDocument) => [
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
    // dateFormat: 'DD MMM YYYY',
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
    // dateFormat: 'YYYY',
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
          e.stopPropagation()
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

export const historyConfigs = (supportedDocument) => [
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
    // dateFormat: 'DD MMM YYYY',
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
    // dateFormat: 'YYYY',
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
          e.stopPropagation()
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
export const annualResourceConfigs = (supportedDocument) => [
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
    // dateFormat: 'DD MMM YYYY',
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
    // dateFormat: 'YYYY',
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
          e.stopPropagation()
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

export const annualReservesData = [
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

export const historyData = [
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

export const annualResourceData = [
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
  row,
  role,
  supportedDocument,
  setRow,
  section,
) => {
  switch (role) {
    case 'regulator':
    default:
      return [
        {
          id: 1,
          label: 'Download Original File',
          onClick: () => {
            downloadOriginalFile(row?.fileId)
          },
        },
        {
          id: 2,
          label: 'View Details',
          onClick: () => {
            key &&
              row?.id &&
              navigate(`/ams/reserves/${key}/${section?.name}/${row?.id}`)
          },
        },
        {
          id: 3,
          label: 'Upload Documents',
          onClick: () => {
            supportedDocument(section?.name)
          },
        },
      ]
    case 'operator':
      return [
        {
          id: 1,
          label: 'Delete',
          onClick: () => {
            deleteReport(row?.id, section?.name)
              .then(() => section?.refetch())
              .then(() => setRow([]))
          },
        },
        {
          id: 2,
          label: 'Download Original File',
          onClick: () => {
            downloadOriginalFile(row?.fileId, row?.fileName)
          },
        },
        {
          id: 3,
          label: 'View Details',
          onClick: () => {
            key &&
              row?.id &&
              navigate(`/ams/reserves/${key}/${section?.name}/${row?.id}`)
          },
        },
        {
          id: 4,
          label: 'Upload Documents',
          onClick: () => {
            supportedDocument(section?.name)
          },
        },
      ]
  }
}
export const annualData = (reserveDetail) => {
  let formedData = reserveDetail?.data?.map((el) => {
    return el?.items?.map((item) => {
      return { ...{ category: el?.category }, ...item }
    })
  })
  formedData = formedData?.flat()
  return (
    formedData?.map((el) => {
      let hydrocarbonTypesVals = el?.values?.map((val) => ({
        [val?.hydrocarbon]: val?.value,
      }))
      return {
        category: el?.category,
        items: el?.name,
        hydrocarbonTypes: hydrocarbonTypesVals,
      }
    }) || []
  )
}
export const fyfData = (reserveDetail) => {
  return (
    reserveDetail?.data?.map((el) => ({
      currentY: el?.currentYear?.year,
      hydrocarbonType: el?.hydrocarbon,
      unit: el?.unit,
      forecast: el?.forecast?.map((elem) => ({
        year: [{ oneP: elem['values']['1P'] }, { twoP: elem['values']['2P'] }],
      })), // array
      previousYear: el?.previousYear?.map((element) => ({
        year: [
          { oneP: element['values']['1P'] },
          { twoP: element['values']['2P'] },
        ],
      })),
      currentYear: [
        {
          year: [
            { oneP: el?.currentYear['values']['1P'] },
            { twoP: el?.currentYear['values']['2P'] },
          ],
        },
      ],
    })) || []
  )
}
export const annualResource = (reserveDetail) =>
  reserveDetail?.data?.map((el) => ({
    cluster: el?.cluster,
    field: el?.field,
    group: el?.group,
    formation: el?.formation,
    member: el?.member,
    hciip: el?.hciip,
    eur: el?.eur,
    cumProd: el?.cumulativeProduction,
    oneP: [{ dev: el?.p1Developed }, { underDev: el?.p1Undeveloped }],
  }))
export const annualReservesDetailsConfigs = (subModule, cuYear = 2033) => {
  switch (subModule) {
    case 'annual':
      return [
        {
          label: 'Category',
          key: 'category',
          width: 200,
          icon: 'mdi mdi-spellcheck',
          type: 'text',
        },

        {
          label: 'Items',
          key: 'items',
          width: 200,
          type: 'text',
          icon: 'mdi mdi-spellcheck',
        },
        {
          label: 'Hydrocarbon Types & Volumes',
          key: 'hydrocarbonTypes',
          type: 'subColumns',
          width: 600,
          columns: [
            { label: 'Oil (MMstb)', subKey: 'Oil', width: 200 },
            { label: 'Condensate (MMstb)', subKey: 'Condensate', width: 200 },
            { label: 'Gas (Tscf)', subKey: 'Gas', width: 200 },
          ],
        },
      ]
    case 'fyf':
      return [
        {
          label: 'Hydrocarbon Type',
          key: 'hydrocarbonType',
          width: 200,
          icon: 'mdi mdi-spellcheck',
          type: 'text',
        },
        {
          label: 'Unit',
          key: 'unit',
          width: 200,
          icon: 'mdi mdi-spellcheck',
          type: 'text',
        },
        {
          label: 'Previous year',
          key: 'previousYear',
          width: 200,
          type: 'subColumns',
          columns: [
            {
              label: cuYear - 1,
              subKey: 'year',
              width: 100,
              subColumns: [
                {
                  label: '1P',
                  subKeyS: 'oneP',
                  icon: 'mdi mdi-spellcheck',
                  width: 100,
                },
                {
                  label: '2P',
                  subKeyS: 'twoP',
                  icon: 'mdi mdi-spellcheck',
                  width: 100,
                },
              ],
            },
            {
              label: cuYear - 2,
              subKey: 'year',
              width: 100,
              subColumns: [
                {
                  label: '1P',
                  subKeyS: 'oneP',
                  icon: 'mdi mdi-spellcheck',
                  width: 100,
                },
                {
                  label: '2P',
                  subKeyS: 'twoP',
                  icon: 'mdi mdi-spellcheck',
                  width: 100,
                },
              ],
            },
            {
              label: cuYear - 3,
              subKey: 'year',
              width: 100,
              subColumns: [
                {
                  label: '1P',
                  subKeyS: 'oneP',
                  icon: 'mdi mdi-spellcheck',
                  width: 100,
                },
                {
                  label: '2P',
                  subKeyS: 'twoP',
                  icon: 'mdi mdi-spellcheck',
                  width: 100,
                },
              ],
            },
            {
              label: cuYear - 4,
              subKey: 'year',
              width: 100,
              subColumns: [
                {
                  label: '1P',
                  subKeyS: 'oneP',
                  icon: 'mdi mdi-spellcheck',
                  width: 100,
                },
                {
                  label: '2P',
                  subKeyS: 'twoP',
                  icon: 'mdi mdi-spellcheck',
                  width: 100,
                },
              ],
            },
            {
              label: cuYear - 5,
              subKey: 'year',
              width: 100,
              subColumns: [
                {
                  label: '1P',
                  subKeyS: 'oneP',
                  icon: 'mdi mdi-spellcheck',
                  width: 100,
                },
                {
                  label: '2P',
                  subKeyS: 'twoP',
                  icon: 'mdi mdi-spellcheck',
                  width: 100,
                },
              ],
            },
          ],
        },
        {
          label: 'Current year',
          key: 'currentYear',
          width: 200,
          type: 'subColumns',
          columns: [
            {
              label: cuYear,
              subKey: 'year',
              width: 200,
              subColumns: [
                {
                  label: '1P',
                  subKeyS: 'oneP',
                  icon: 'mdi mdi-spellcheck',
                  width: 100,
                },
                {
                  label: '2P',
                  subKeyS: 'twoP',
                  icon: 'mdi mdi-spellcheck',
                  width: 100,
                },
              ],
            },
          ],
        },
        {
          label: 'Forecast',
          key: 'forecast',
          width: 200,
          type: 'subColumns',
          columns: [
            {
              label: cuYear + 1,
              subKey: 'year',
              width: 100,
              subColumns: [
                {
                  label: '1P',
                  subKeyS: 'oneP',
                  icon: 'mdi mdi-spellcheck',
                  width: 100,
                },
                {
                  label: '2P',
                  subKeyS: 'twoP',
                  icon: 'mdi mdi-spellcheck',
                  width: 100,
                },
              ],
            },
            {
              label: cuYear + 2,
              subKey: 'year',
              width: 100,
              subColumns: [
                {
                  label: '1P',
                  subKeyS: 'oneP',
                  icon: 'mdi mdi-spellcheck',
                  width: 100,
                },
                {
                  label: '2P',
                  subKeyS: 'twoP',
                  icon: 'mdi mdi-spellcheck',
                  width: 100,
                },
              ],
            },
            {
              label: cuYear + 3,
              subKey: 'year',
              width: 100,
              subColumns: [
                {
                  label: '1P',
                  subKeyS: 'oneP',
                  icon: 'mdi mdi-spellcheck',
                  width: 100,
                },
                {
                  label: '2P',
                  subKeyS: 'twoP',
                  icon: 'mdi mdi-spellcheck',
                  width: 100,
                },
              ],
            },
            {
              label: cuYear + 4,
              subKey: 'year',
              width: 100,
              subColumns: [
                {
                  label: '1P',
                  subKeyS: 'oneP',
                  icon: 'mdi mdi-spellcheck',
                  width: 100,
                },
                {
                  label: '2P',
                  subKeyS: 'twoP',
                  icon: 'mdi mdi-spellcheck',
                  width: 100,
                },
              ],
            },
            {
              label: cuYear + 5,
              subKey: 'year',
              width: 100,
              subColumns: [
                {
                  label: '1P',
                  subKeyS: 'oneP',
                  icon: 'mdi mdi-spellcheck',
                  width: 100,
                },
                {
                  label: '2P',
                  subKeyS: 'twoP',
                  icon: 'mdi mdi-spellcheck',
                  width: 100,
                },
              ],
            },
          ],
        },
      ]
    case 'annualResource':
      return [
        {
          label: 'Cluster',
          key: 'cluster',
          width: 200,
          icon: 'mdi mdi-spellcheck',
          type: 'text',
        },
        {
          label: 'Field',
          key: 'field',
          width: 200,
          icon: 'mdi mdi-spellcheck',
          type: 'text',
        },
        {
          label: 'Group',
          key: 'group',
          width: 200,
          icon: 'mdi mdi-spellcheck',
          type: 'text',
        },
        {
          label: 'Formation',
          key: 'formation',
          width: 200,
          icon: 'mdi mdi-spellcheck',
          type: 'text',
        },
        {
          label: 'Member',
          key: 'member',
          width: 200,
          icon: 'mdi mdi-spellcheck',
          type: 'text',
        },
        {
          label: 'HCIIP (E6 bbl)',
          key: 'hciip',
          width: 200,
          icon: 'mdi mdi-spellcheck',
          type: 'text',
        },
        {
          label: 'EUR',
          key: 'eur',
          width: 200,
          icon: 'mdi mdi-spellcheck',
          type: 'text',
        },
        {
          label: 'Cumulative Production (E6 bbl',
          key: 'cumProd',
          width: 200,
          icon: 'mdi mdi-spellcheck',
          type: 'text',
        },
        {
          label: '1P',
          key: 'oneP',
          width: 200,
          icon: 'mdi mdi-spellcheck',
          type: 'subColumns',
          columns: [
            {
              label: 'Developed (E6 bbl)',
              subKey: 'dev',
              width: 100,
              icon: 'mdi mdi-spellcheck',
            },
            {
              label: 'Under Developed (E6 bbl)',
              subKey: 'underDev',
              width: 100,
              icon: 'mdi mdi-spellcheck',
            },
          ],
        },
      ]
    default:
      break
  }
}
