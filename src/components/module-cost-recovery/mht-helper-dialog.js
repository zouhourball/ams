import moment from 'moment'
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
            subKey: `q${qIndex}`,
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
export const configsAnnualCostsDialogMht = () => {
  return [
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
      key: 'description',
      width: '200',
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
}
export const configsLiftingCostsDialogMht = (subSubModule) => {
  return [
    {
      label: 'Month',
      key: 'month',
      width: '300',
      icon: 'mdi mdi-spellcheck',
    },
    {
      label: 'MOG Price (USD)',
      key: 'price',
      width: '300',
      icon: 'mdi mdi-spellcheck',
    },
    {
      label:
        subSubModule === 'dataActualLifting'
          ? 'Total Lifting'
          : 'Total Production',
      key: 'totalProduction',
      width: '300',
      icon: 'mdi mdi-spellcheck',
      type: 'subColumns',
      columns: [
        {
          label: 'Barrels',
          subKey: 'barrels',
          width: '300',
          icon: 'mdi mdi-spellcheck',
        },
        {
          label: 'USD',
          subKey: 'usd',
          width: '300',
          icon: 'mdi mdi-spellcheck',
        },
      ],
    },
    {
      label: 'Contractor Entitlement',
      key: 'contractorEntitlement',
      width: '600',
      icon: 'mdi mdi-spellcheck',
      type: 'subColumns',
      columns: [
        {
          label: 'Cost Recovery',
          subKey: 'costRecovery',
          icon: 'mdi mdi-spellcheck',
          width: 200,
          subColumns: [
            {
              label: 'Barrels',
              subKeyS: 'barrels',
              width: 200,
              icon: 'mdi mdi-pound-box',
            },
            {
              label: 'USD',
              subKeyS: 'usd',
              width: 200,
              icon: 'mdi mdi-pound-box',
            },
          ],
        },
        {
          label: 'Profit Oil',
          subKey: 'profit',
          icon: 'mdi mdi-spellcheck',
          width: 200,
          subColumns: [
            {
              label: 'Barrels',
              subKeyS: 'barrels',
              width: 200,
              icon: 'mdi mdi-pound-box',
            },
            {
              label: 'USD',
              subKeyS: 'usd',
              width: 200,
              icon: 'mdi mdi-pound-box',
            },
          ],
        },
        {
          label: 'Total Entitlement',
          subKey: 'total',
          icon: 'mdi mdi-spellcheck',
          width: 200,
          subColumns: [
            {
              label: 'Barrels',
              subKeyS: 'barrels',
              width: 200,
              icon: 'mdi mdi-pound-box',
            },
            {
              label: 'USD',
              subKeyS: 'usd',
              width: 200,
              icon: 'mdi mdi-pound-box',
            },
          ],
        },
      ],
    },
    {
      label: 'Government Entitlement',
      key: 'governmentEntitlement',
      width: '600',
      icon: 'mdi mdi-spellcheck',
      type: 'subColumns',
      columns: [
        {
          label: 'Profit Oil',
          subKey: 'profit',
          icon: 'mdi mdi-spellcheck',
          width: 200,
          subColumns: [
            {
              label: 'Barrels',
              subKeyS: 'barrels',
              width: 200,
              icon: 'mdi mdi-pound-box',
            },
            {
              label: 'USD',
              subKeyS: 'usd',
              width: 200,
              icon: 'mdi mdi-pound-box',
            },
          ],
        },
      ],
    },
  ]
}

export const transactionConfig = () => {
  return [
    {
      label: 'Block',
      key: 'block',
      width: '200',
      icon: 'mdi mdi-spellcheck',
    },
    {
      label: 'Transaction Date',
      key: 'transactionDate',
      width: '200',
      icon: 'mdi mdi-spellcheck',
    },
    {
      label: 'Transaction Reference',
      key: 'transactionReference',
      width: '200',
      icon: 'mdi mdi-spellcheck',
    },
    {
      label: 'Transaction Description',
      key: 'transactionDescription',
      width: '200',
      icon: 'mdi mdi-spellcheck',
    },
    {
      label: 'Transaction Expenditure Type/ Element',
      key: 'transactionExpElement',
      width: '200',
      icon: 'mdi mdi-spellcheck',
    },
    {
      label: 'Transaction Expenditure Type/ Element Description',
      key: 'transactionExpDescription',
      width: '200',
      icon: 'mdi mdi-spellcheck',
    },
    {
      label: 'Project',
      key: 'project',
      width: '200',
      icon: 'mdi mdi-spellcheck',
    },
  ]
}

export const affiliateConfig = () => {
  return [
    {
      label: 'Name of Service',
      key: 'nameOfService',
      width: '200',
      icon: 'mdi mdi-spellcheck',
    },
    {
      label: 'Budget',
      key: 'budget',
      width: '200',
      icon: 'mdi mdi-spellcheck',
    },
    {
      label: 'Hourly Rate (USD/hour)',
      key: 'hourlyRate',
      width: '200',
      icon: 'mdi mdi-spellcheck',
    },
    {
      label: 'Man Hours Estimate',
      key: 'manHoursEstimate',
      width: '200',
      icon: 'mdi mdi-spellcheck',
    },
    {
      label: 'Total (USD',
      key: 'total',
      width: '200',
      icon: 'mdi mdi-spellcheck',
    },
    {
      label: 'Specialists Name',
      key: 'specialistsName',
      width: '200',
      icon: 'mdi mdi-spellcheck',
    },
    {
      label: 'Years of experience',
      key: 'yearsOfExperience',
      width: '200',
      icon: 'mdi mdi-spellcheck',
    },
    {
      label: 'Gran Total (USD)',
      key: 'granTotal',
      width: '200',
      icon: 'mdi mdi-spellcheck',
    },
    {
      label: 'Duration & Timing',
      key: 'durationTiming',
      width: '200',
      icon: 'mdi mdi-spellcheck',
    },
  ]
}

export const facilitiesConfig = () => {
  return [
    {
      label: 'Project Title',
      key: 'projectTitle',
      width: '200',
      icon: 'mdi mdi-spellcheck',
    },
    {
      label: 'Project # / AFE',
      key: 'projectAFE',
      width: '200',
      icon: 'mdi mdi-spellcheck',
    },
    {
      label: 'Budget Year',
      key: 'budgetYear',
      width: '200',
      icon: 'mdi mdi-spellcheck',
    },
    {
      label: 'ITD Actual',
      key: 'iTDActual',
      width: '200',
      icon: 'mdi mdi-spellcheck',
    },
  ]
}
export const configsContractsCostsDialogMht = () => {
  return []
}
export const configsContractsDialogMht = () => {
  return [
    {
      label: 'Vendor Name',
      key: 'vendorName',
      width: '200',
      icon: 'mdi mdi-spellcheck',
    },
    {
      label: 'Vendor',
      key: 'vendor',
      width: '200',
      icon: 'mdi mdi-spellcheck',
    },
    {
      label: 'Actual Spent',
      key: 'actualSpent',
      width: '200',
      icon: 'mdi mdi-spellcheck',
    },
    {
      label: 'Contract of Service Order',
      key: 'contractPoServiceOrder',
      width: '200',
      icon: 'mdi mdi-spellcheck',
    },
    {
      label: 'Description Of Services',
      key: 'descriptionOfServices',
      width: '200',
      icon: 'mdi mdi-spellcheck',
    },
    {
      label: 'Is it Budgeted',
      key: 'isItBudgeted',
      width: '200',
      icon: 'mdi mdi-spellcheck',
    },
    {
      label: 'Approved Amount',
      key: 'approvedAmount',
      width: '200',
      icon: 'mdi mdi-spellcheck',
    },
    {
      label: 'Actual Spent',
      key: 'actualSpent',
      width: '200',
      icon: 'mdi mdi-spellcheck',
    },
    {
      label: 'Amount Committed / Spent to date',
      key: 'amountCommittedSpentDate',
      width: '200',
      icon: 'mdi mdi-spellcheck',
    },
    {
      label: 'Amount Rejected by Tender Board',
      key: 'amountRejectedTenderBoard',
      width: '200',
      icon: 'mdi mdi-spellcheck',
    },
    {
      label: 'Tender Board / Committee approval date',
      key: 'tenderBoardCommitteeApprovalDate',
      width: '200',
      icon: 'mdi mdi-spellcheck',
    },
    {
      label: 'competitively Bid Sole Source',
      key: 'competitivelyBidSoleSource',
      width: '200',
      icon: 'mdi mdi-spellcheck',
    },
    {
      label: 'Start Date',
      key: 'startDate',
      width: '200',
      icon: 'mdi mdi-spellcheck',
    },
    {
      label: 'Expiry Date',
      key: 'expiryDate',
      width: '200',
      icon: 'mdi mdi-spellcheck',
    },
    {
      label: 'Initial Approved amount',
      key: 'initialApprovedAmount',
      width: '200',
      icon: 'mdi mdi-spellcheck',
    },
    {
      label: '# of Revisions',
      key: 'ofRevisions',
      width: '200',
      icon: 'mdi mdi-spellcheck',
    },
  ]
}
