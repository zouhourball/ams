export const propsConfigs = [
  {
    label: 'Gaz Type',
    key: 'gaz_type',
    width: '300',
    icon: 'mdi mdi-spellcheck',
    type: 'text',
  },
  {
    label: 'Unit',
    key: 'unit',
    width: '200',
    icon: 'mdi mdi-spellcheck',
    type: 'text',
  },
  {
    label: '2021',
    key: 'year2021',
    width: '200',
    icon: 'mdi mdi-spellcheck',
    type: 'text',
  },
  {
    label: '2022',
    key: 'year2022',
    width: '200',
    icon: 'mdi mdi-spellcheck',
    type: 'text',
  },
  {
    label: '2023',
    key: 'year2023',
    width: '200',
    icon: 'mdi mdi-spellcheck',
    type: 'text',
  },
  {
    label: '2024',
    key: 'year2024',
    width: '200',
    icon: 'mdi mdi-spellcheck',
    type: 'text',
  },
  {
    label: '2025',
    key: 'year2025',
    width: '200',
    icon: 'mdi mdi-spellcheck',
    type: 'text',
  },
  {
    label: '2026',
    key: 'year2026',
    width: '200',
    icon: 'mdi mdi-spellcheck',
    type: 'text',
  },
]

export const propsDataTable = [
  {
    gaz_type: 'Gas Flared (Excl. Gas Conservation)',
    unit: 'MMscf/d',
  },
  {
    gaz_type: 'Gas Flared (Excl. Gas Conservation)',
    unit: 'MMscf/d',
  },
]

// ----------------
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
