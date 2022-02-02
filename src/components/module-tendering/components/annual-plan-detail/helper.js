import moment from 'moment'

export const configs = () => [
  {
    label: 'Contract Ref. No',
    key: 'contractRefNo',
    width: '200',
    icon: 'mdi mdi-spellcheck',
    align: 'center',
  },
  {
    label: 'Planned Contracts Title',
    key: 'contractTitle',
    width: '200',
    icon: 'mdi mdi-spellcheck',
    align: 'center',
  },
  {
    label: 'Contract Type',
    key: 'contractType',
    width: '200',
    icon: 'mdi mdi-spellcheck',
    align: 'center',
  },
  {
    label: 'Duration',
    key: 'duration',
    width: '200',
    icon: 'mdi mdi-spellcheck',
    align: 'center',
  },
  {
    label: 'Time frame',
    key: 'timeFrame',
    width: '200',
    icon: 'mdi mdi-spellcheck',
    align: 'center',
  },
  {
    label: 'Estimated Contract Value $',
    key: 'estimatedContractValue',
    width: '250',
    icon: 'mdi mdi-spellcheck',
    align: 'center',
  },
  {
    label: 'Budget Value $',
    key: 'budgetValue',
    align: 'center',
    width: '200',
    icon: 'mdi mdi-spellcheck',
  },
  {
    label: 'Approved Budget Ref $',
    key: 'approvedBudgetRef',
    align: 'center',
    width: '200',
    icon: 'mdi mdi-spellcheck',
  },
  {
    label: 'Funding Resource/Category $',
    key: 'fundingResource',
    width: '250',
    icon: 'mdi mdi-spellcheck',
    align: 'center',
  },
  {
    label: 'Value $',
    key: 'tcovalue',
    align: 'center',
    width: '200',
    icon: 'mdi mdi-spellcheck',
  },
  {
    label: '%',
    key: 'tcopercentage',
    align: 'center',
    width: '200',
    icon: 'mdi mdi-spellcheck',
  },
  {
    label: 'Progressing Duration',
    key: 'progressingDuration',
    align: 'center',
    width: '200',
    icon: 'mdi mdi-spellcheck',
  },
  {
    label: 'Expected Commencement Date',
    key: 'expectedCommencementDate',
    align: 'center',
    width: '200',
    icon: 'mdi5mdi-spellcheck',
    render: (row) =>
      row.expectedCommencementDate
        ? moment(row.expectedCommencementDate).format('DD MMM, YYYY')
        : '',
  },
  {
    label: 'Expected Ending Date',
    key: 'expectedEndingDate',
    align: 'center',
    width: '200',
    icon: 'mdi mdi-spellcheck',
    render: (row) =>
      row.expectedEndingDate
        ? moment(row.expectedEndingDate).format('DD MMM, YYYY')
        : '',
  },
  {
    label: 'Remarks',
    key: 'remarks',
    align: 'center',
    width: '200',
    icon: 'mdi mdi-spellcheck',
  },
]

export const configsOngoing = () => [
  {
    label: 'Contract Ref. No',
    key: 'contractRefNo',
    width: '200',
    icon: 'mdi mdi-spellcheck',
    align: 'center',
  },
  {
    label: 'Planned Contracts Title',
    key: 'contractTitle',
    width: '200',
    icon: 'mdi mdi-spellcheck',
    align: 'center',
  },
  {
    label: 'Contract Type',
    key: 'contractType',
    width: '200',
    icon: 'mdi mdi-spellcheck',
    align: 'center',
  },
  {
    label: 'Duration',
    key: 'duration',
    width: '200',
    icon: 'mdi mdi-spellcheck',
    align: 'center',
  },
  {
    label: 'Time frame',
    key: 'timeFrame',
    width: '200',
    icon: 'mdi mdi-spellcheck',
    align: 'center',
  },
  {
    label: 'Estimated Contract Value $',
    key: 'estimatedContractValue',
    width: '250',
    icon: 'mdi mdi-spellcheck',
    align: 'center',
  },
  {
    label: 'Budget Value $',
    key: 'budgetValue',
    align: 'center',
    width: '200',
    icon: 'mdi mdi-spellcheck',
  },
  {
    label: 'Approved Budget Ref $',
    key: 'approvedBudgetRef',
    align: 'center',
    width: '200',
    icon: 'mdi mdi-spellcheck',
  },
  {
    label: 'Funding Resource/Category $',
    key: 'fundingResource',
    width: '250',
    icon: 'mdi mdi-spellcheck',
    align: 'center',
  },
  {
    label: 'Value $',
    key: 'tcovalue',
    align: 'center',
    width: '200',
    icon: 'mdi mdi-spellcheck',
  },
  {
    label: '%',
    key: 'tcopercentage',
    align: 'center',
    width: '200',
    icon: 'mdi mdi-spellcheck',
  },
  {
    label: 'Progressing Duration',
    key: 'progressingDuration',
    align: 'center',
    width: '200',
    icon: 'mdi mdi-spellcheck',
  },
  {
    label: 'Expected Commencement Date',
    key: 'expectedCommencementDate',
    align: 'center',
    width: '200',
    icon: 'mdi5mdi-spellcheck',
    render: (row) =>
      row.expectedCommencementDate
        ? moment(row.expectedCommencementDate).format('DD MMM, YYYY')
        : '',
  },
  {
    label: 'Expected Ending Date',
    key: 'expectedEndingDate',
    align: 'center',
    width: '200',
    icon: 'mdi mdi-spellcheck',
    render: (row) =>
      row.expectedEndingDate
        ? moment(row.expectedEndingDate).format('DD MMM, YYYY')
        : '',
  },
  {
    label: 'Remarks',
    key: 'remarks',
    align: 'center',
    width: '200',
    icon: 'mdi mdi-spellcheck',
  },
]

export const configsCloseOut = () => [
  {
    label: 'Contract Ref. No',
    key: 'contractRefNo',
    width: '200',
    icon: 'mdi mdi-spellcheck',
    align: 'center',
  },
  {
    label: 'Planned Contracts Title',
    key: 'contractTitle',
    width: '200',
    icon: 'mdi mdi-spellcheck',
    align: 'center',
  },
  {
    label: 'Contract Type',
    key: 'contractType',
    width: '200',
    icon: 'mdi mdi-spellcheck',
    align: 'center',
  },
  {
    label: 'Original Duration',
    key: 'originalDuration',
    width: '200',
    icon: 'mdi mdi-spellcheck',
    align: 'center',
  },
  {
    label: 'Approved Extension Period',
    key: 'approvedExtensionPeriod',
    width: '250',
    icon: 'mdi mdi-spellcheck',
    align: 'center',
  },
  {
    label: 'Total Duration',
    key: 'totalDuration',
    width: '200',
    icon: 'mdi mdi-spellcheck',
    align: 'center',
  },
  {
    label: 'Estimated Contract Value $',
    key: 'estimatedContractValue',
    align: 'center',
    width: '250',
    icon: 'mdi mdi-spellcheck',
  },
  {
    label: 'Approved Original ACV Value',
    key: 'approvedOriginalACVValue',
    align: 'center',
    width: '250',
    icon: 'mdi mdi-spellcheck',
  },
  {
    label: 'Approved Additional ACV',
    key: 'approvedAdditionalACV',
    width: '250',
    icon: 'mdi mdi-spellcheck',
    align: 'center',
  },
  {
    label: 'Total Approved ACV',
    key: 'totalApprovedACV',
    align: 'center',
    width: '200',
    icon: 'mdi mdi-spellcheck',
  },
  {
    label: 'Estimated Total Expenditure',
    key: 'estimatedTotalExpenditure',
    align: 'center',
    width: '250',
    icon: 'mdi mdi-spellcheck',
  },
  {
    label: 'Value $',
    key: 'acvvalue',
    align: 'center',
    width: '200',
    icon: 'mdi mdi-spellcheck',
  },
  {
    label: '%',
    key: 'acvpercentage',
    align: 'center',
    width: '200',
    icon: 'mdi mdi-spellcheck',
  },
  {
    label: 'Plan Value $',
    key: 'tcovalue',
    align: 'center',
    width: '200',
    icon: 'mdi mdi-spellcheck',
  },
  {
    label: 'Forcast Actual Value $',
    key: 'tcoforecastActualValue',
    align: 'center',
    width: '250',
    icon: 'mdi mdi-spellcheck',
  },
  {
    label: 'Plan %',
    key: 'tcopercentage',
    align: 'center',
    width: '200',
    icon: 'mdi mdi-spellcheck',
  },
  {
    label: 'Forcast Actual %',
    key: 'tcoforecastActualPercentage',
    align: 'center',
    width: '200',
    icon: 'mdi mdi-spellcheck',
  },
]

export const annualPlanDetailData = []
