import { FileInput, FontIcon } from 'react-md'
import { navigate } from '@reach/router'
import { listAnalytics } from 'libs/api/api-planning'

export const planningConfigs = (supportedDocument) => [
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
  // handleUpdateUploadRapport,
  fileName,
  submitDraft,
  status,
) => {
  const opEntries = [
    // {
    //   id: 1,
    //   label: 'View Process Historian',
    //   onClick: () => {
    //     id && navigate(`/ams/planning/view-historian/${subModule}/${id}`)
    //   },
    // },
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
        key && id && navigate(`/ams/planning/${key}/${subModule}/${id}`)
      },
    },
    {
      id: 4,
      label: 'View Analytics',
      onClick: () => {
        listAnalytics(subModule)
      },
    },
    // {
    //   id: 5,
    //   label: 'Update',
    //   onClick: (e) => {
    //     e.stopPropagation()
    //     // handleUpdateUploadRapport(true)
    //   },
    // },
    {
      id: 6,
      label: 'Download Original File',
      onClick: () => {
        downloadOriginalFile(originalFileId, fileName)
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
  const draftBtn = {
    id: 15,
    label: 'Submit Draft report',
    onClick: () => {
      submitDraft(subModule, id)
    },
  }
  switch (role) {
    case 'operator':
      return status === 'DRAFT' ? [...opEntries, draftBtn] : opEntries
    case 'regulator':
    default:
      return [
        // {
        //   id: 1,
        //   label: 'Initiate Meeting',
        //   onClick: () => {},
        // },
        // {
        //   id: 2,
        //   label: 'View Process Historian',
        //   onClick: () => {
        //     id && navigate(`/ams/planning/view-historian/${subModule}/${id}`)
        //   },
        // },
        {
          id: 3,
          label: 'View Details',
          onClick: () => {
            key && id && navigate(`/ams/planning/${key}/${subModule}/${id}`)
          },
        },
        {
          id: 4,
          label: 'View Analytics',
          onClick: () => {
            listAnalytics(subModule)
          },
        },
        // {
        //   id: 5,
        //   label: 'Clarity',
        //   onClick: () => {},
        // },
        {
          id: 6,
          label: 'Download Original File',
          onClick: () => {
            downloadOriginalFile(originalFileId, fileName)
          },
        },
        {
          id: 7,
          label: 'View Documents',
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
const wpbMonthsData = (data) => {
  const initialValue = {}
  return data?.reduce((obj, val) => {
    return {
      ...obj,
      [val?.month]: [
        { actual: val?.data['ACTUAL'] },
        { plan: val?.data['PLAN'] },
      ],
    }
  }, initialValue)
}
const fypMonthsData = (data) => {
  const initialValue = {}
  return data?.reduce((obj, val) => {
    return {
      ...obj,
      [val?.year]: [{ plan: val?.plan }],
    }
  }, initialValue)
}
export const wpbData = (dataDetails) => {
  let formedData = dataDetails?.categories?.map((cat) => {
    return cat?.subCategories?.map((subCat) => {
      return subCat?.kpis?.map((kpi) => ({
        company: dataDetails?.metaData?.company,
        block: dataDetails?.metaData?.block,
        dataStatus: 'no dynamic data',
        category: cat?.name,
        subCategory: subCat?.name,
        kpiGroupe: kpi?.kpiGroup,
        kpi: kpi?.name,
        unit: kpi?.unit,
        year: dataDetails?.metaData?.year,
        ...wpbMonthsData(kpi?.values),
      }))
    })
  })
  return formedData?.flat(2)
}
export const fypData = (dataDetails) => {
  let formedData = dataDetails?.categories?.map((cat) => {
    return cat?.subCategories?.map((subCat) => {
      return subCat?.kpis?.map((kpi) => ({
        company: dataDetails?.metaData?.company,
        block: dataDetails?.metaData?.block,
        category: cat?.name,
        subCategory: subCat?.name,
        kpiGroupe: kpi?.kpiGroup,
        kpi: kpi?.name,
        unit: kpi?.unit,
        ...fypMonthsData(kpi?.values),
      }))
    })
  })
  return formedData?.flat(2)
}
