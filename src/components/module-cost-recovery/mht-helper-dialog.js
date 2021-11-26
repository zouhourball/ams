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
