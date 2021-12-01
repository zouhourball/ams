export const configsLpgDialogMht = () => {
  return [
    {
      label: 'Company',
      key: 'company',
      width: '200',
      icon: 'mdi mdi-spellcheck',
      type: 'text',
    },
    {
      label: 'Quota MT',
      key: 'quota',
      width: '200',
      icon: 'mdi mdi-spellcheck',
      type: 'text',
    },

    {
      label: 'Actual Lifting',
      key: 'lifting',
      width: '600',
      icon: 'mdi mdi-spellcheck',
      type: 'subColumns',
      columns: [
        {
          label: 'Source 1',
          subKey: 'source1',
          icon: 'mdi mdi-spellcheck',
          width: 200,
        },
        {
          label: 'Source 2',
          subKey: 'source2',
          icon: 'mdi mdi-spellcheck',
          width: 200,
        },
      ],
    },
    {
      label: 'Total Lifted MT',
      key: 'total',
      width: '200',
      icon: 'mdi mdi-spellcheck',
      type: 'text',
    },
    {
      label: 'Variance MT',
      key: 'variance',
      width: '200',
      icon: 'mdi mdi-spellcheck',
      type: 'text',
    },
    {
      label: 'Remarks',
      key: 'remarks',
      width: '200',
      icon: 'mdi mdi-spellcheck',
      type: 'text',
    },
  ]
}
