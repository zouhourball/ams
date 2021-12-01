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
  ]
}
export const configsContractsCostsDialogMht = () => {
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
      label: 'Total Lifting',
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
