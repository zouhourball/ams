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
export const configsRsDialogMht = () => {
  return [
    {
      label: 'SN',
      key: 'sn',
      width: '200',
      icon: 'mdi mdi-spellcheck',
      type: 'text',
    },
    {
      label: 'Governorate/Wilayat',
      key: 'gov',
      width: '200',
      icon: 'mdi mdi-spellcheck',
      type: 'text',
    },

    {
      label: 'Type pf Product & Sale Quantity',
      key: 'product',
      width: '600',
      icon: 'mdi mdi-spellcheck',
      type: 'subColumns',
      columns: [
        {
          label: 'M-95',
          subKey: 'm95',
          icon: 'mdi mdi-spellcheck',
          width: 200,
        },
        {
          label: 'M-91',
          subKey: 'm91',
          icon: 'mdi mdi-spellcheck',
          width: 200,
        },
        {
          label: 'Kerosen',
          subKey: 'kerosen',
          icon: 'mdi mdi-spellcheck',
          width: 200,
        },
        {
          label: 'Jet A1',
          subKey: 'jet',
          icon: 'mdi mdi-spellcheck',
          width: 200,
        },
        {
          label: 'Gas Oil',
          subKey: 'gas',
          icon: 'mdi mdi-spellcheck',
          width: 200,
        },
        {
          label: 'M-98',
          subKey: 'm98',
          icon: 'mdi mdi-spellcheck',
          width: 200,
        },
        {
          label: 'Total',
          subKey: 'totalProduct',
          icon: 'mdi mdi-spellcheck',
          width: 200,
        },
      ],
    },
  ]
}

export const configsNgDialogMht = () => {
  return [
    {
      label: 'Terminal Type',
      key: 'terminalType',
      width: '200',
      icon: 'mdi mdi-spellcheck',
      type: 'text',
    },
    {
      label: 'Consumer/Supplier',
      key: 'consumerSupplier',
      width: '200',
      icon: 'mdi mdi-spellcheck',
      type: 'text',
    },

    {
      label: 'January',
      key: 'January',
      width: '600',
      icon: 'mdi mdi-spellcheck',
      type: 'subColumns',
      columns: [
        {
          label: 'On-Spec Gas Delivery(SM3 * 10)',
          subKey: 'jGD',
          icon: 'mdi mdi-spellcheck',
          width: 200,
        },
        {
          label: 'Energy Corresponding to On-Spec Gas(MJ)',
          subKey: 'jCG',
          icon: 'mdi mdi-spellcheck',
          width: 200,
        },
        {
          label: 'Energy Corresponding to On-Spec Gas (MMBTU)',
          subKey: 'jSG',
          icon: 'mdi mdi-spellcheck',
          width: 200,
        },
      ],
    },
    {
      label: 'February',
      key: 'February',
      width: '600',
      icon: 'mdi mdi-spellcheck',
      type: 'subColumns',
      columns: [
        {
          label: 'On-Spec Gas Delivery(SM3 * 10)',
          subKey: 'fGD',
          icon: 'mdi mdi-spellcheck',
          width: 200,
        },
        {
          label: 'Energy Corresponding to On-Spec Gas(MJ)',
          subKey: 'fCG',
          icon: 'mdi mdi-spellcheck',
          width: 200,
        },
        {
          label: 'Energy Corresponding to On-Spec Gas (MMBTU)',
          subKey: 'fSG',
          icon: 'mdi mdi-spellcheck',
          width: 200,
        },
      ],
    },
    {
      label: 'March',
      key: 'March',
      width: '600',
      icon: 'mdi mdi-spellcheck',
      type: 'subColumns',
      columns: [
        {
          label: 'On-Spec Gas Delivery(SM3 * 10)',
          subKey: 'mGD',
          icon: 'mdi mdi-spellcheck',
          width: 200,
        },
        {
          label: 'Energy Corresponding to On-Spec Gas(MJ)',
          subKey: 'mCG',
          icon: 'mdi mdi-spellcheck',
          width: 200,
        },
        {
          label: 'Energy Corresponding to On-Spec Gas (MMBTU)',
          subKey: 'mSG',
          icon: 'mdi mdi-spellcheck',
          width: 200,
        },
      ],
    },
    {
      label: 'April',
      key: 'April',
      width: '600',
      icon: 'mdi mdi-spellcheck',
      type: 'subColumns',
      columns: [
        {
          label: 'On-Spec Gas Delivery(SM3 * 10)',
          subKey: 'aGD',
          icon: 'mdi mdi-spellcheck',
          width: 200,
        },
        {
          label: 'Energy Corresponding to On-Spec Gas(MJ)',
          subKey: 'aCG',
          icon: 'mdi mdi-spellcheck',
          width: 200,
        },
        {
          label: 'Energy Corresponding to On-Spec Gas (MMBTU)',
          subKey: 'aSG',
          icon: 'mdi mdi-spellcheck',
          width: 200,
        },
      ],
    },
    {
      label: 'May',
      key: 'May',
      width: '600',
      icon: 'mdi mdi-spellcheck',
      type: 'subColumns',
      columns: [
        {
          label: 'On-Spec Gas Delivery(SM3 * 10)',
          subKey: 'myGD',
          icon: 'mdi mdi-spellcheck',
          width: 200,
        },
        {
          label: 'Energy Corresponding to On-Spec Gas(MJ)',
          subKey: 'myCG',
          icon: 'mdi mdi-spellcheck',
          width: 200,
        },
        {
          label: 'Energy Corresponding to On-Spec Gas (MMBTU)',
          subKey: 'mySG',
          icon: 'mdi mdi-spellcheck',
          width: 200,
        },
      ],
    },
    {
      label: 'June',
      key: 'June',
      width: '600',
      icon: 'mdi mdi-spellcheck',
      type: 'subColumns',
      columns: [
        {
          label: 'On-Spec Gas Delivery(SM3 * 10)',
          subKey: 'jGD',
          icon: 'mdi mdi-spellcheck',
          width: 200,
        },
        {
          label: 'Energy Corresponding to On-Spec Gas(MJ)',
          subKey: 'jCG',
          icon: 'mdi mdi-spellcheck',
          width: 200,
        },
        {
          label: 'Energy Corresponding to On-Spec Gas (MMBTU)',
          subKey: 'jSG',
          icon: 'mdi mdi-spellcheck',
          width: 200,
        },
      ],
    },
    {
      label: 'July',
      key: 'July',
      width: '600',
      icon: 'mdi mdi-spellcheck',
      type: 'subColumns',
      columns: [
        {
          label: 'On-Spec Gas Delivery(SM3 * 10)',
          subKey: 'juGD',
          icon: 'mdi mdi-spellcheck',
          width: 200,
        },
        {
          label: 'Energy Corresponding to On-Spec Gas(MJ)',
          subKey: 'juCG',
          icon: 'mdi mdi-spellcheck',
          width: 200,
        },
        {
          label: 'Energy Corresponding to On-Spec Gas (MMBTU)',
          subKey: 'juSG',
          icon: 'mdi mdi-spellcheck',
          width: 200,
        },
      ],
    },
    {
      label: 'August',
      key: 'August',
      width: '600',
      icon: 'mdi mdi-spellcheck',
      type: 'subColumns',
      columns: [
        {
          label: 'On-Spec Gas Delivery(SM3 * 10)',
          subKey: 'auGD',
          icon: 'mdi mdi-spellcheck',
          width: 200,
        },
        {
          label: 'Energy Corresponding to On-Spec Gas(MJ)',
          subKey: 'auCG',
          icon: 'mdi mdi-spellcheck',
          width: 200,
        },
        {
          label: 'Energy Corresponding to On-Spec Gas (MMBTU)',
          subKey: 'auSG',
          icon: 'mdi mdi-spellcheck',
          width: 200,
        },
      ],
    },
    {
      label: 'September',
      key: 'September',
      width: '600',
      icon: 'mdi mdi-spellcheck',
      type: 'subColumns',
      columns: [
        {
          label: 'On-Spec Gas Delivery(SM3 * 10)',
          subKey: 'sGD',
          icon: 'mdi mdi-spellcheck',
          width: 200,
        },
        {
          label: 'Energy Corresponding to On-Spec Gas(MJ)',
          subKey: 'sCG',
          icon: 'mdi mdi-spellcheck',
          width: 200,
        },
        {
          label: 'Energy Corresponding to On-Spec Gas (MMBTU)',
          subKey: 'sSG',
          icon: 'mdi mdi-spellcheck',
          width: 200,
        },
      ],
    },
    {
      label: 'October',
      key: 'October',
      width: '600',
      icon: 'mdi mdi-spellcheck',
      type: 'subColumns',
      columns: [
        {
          label: 'On-Spec Gas Delivery(SM3 * 10)',
          subKey: 'oGD',
          icon: 'mdi mdi-spellcheck',
          width: 200,
        },
        {
          label: 'Energy Corresponding to On-Spec Gas(MJ)',
          subKey: 'oCG',
          icon: 'mdi mdi-spellcheck',
          width: 200,
        },
        {
          label: 'Energy Corresponding to On-Spec Gas (MMBTU)',
          subKey: 'oSG',
          icon: 'mdi mdi-spellcheck',
          width: 200,
        },
      ],
    },
    {
      label: 'November',
      key: 'November',
      width: '600',
      icon: 'mdi mdi-spellcheck',
      type: 'subColumns',
      columns: [
        {
          label: 'On-Spec Gas Delivery(SM3 * 10)',
          subKey: 'nGD',
          icon: 'mdi mdi-spellcheck',
          width: 200,
        },
        {
          label: 'Energy Corresponding to On-Spec Gas(MJ)',
          subKey: 'nCG',
          icon: 'mdi mdi-spellcheck',
          width: 200,
        },
        {
          label: 'Energy Corresponding to On-Spec Gas (MMBTU)',
          subKey: 'nSG',
          icon: 'mdi mdi-spellcheck',
          width: 200,
        },
      ],
    },
    {
      label: 'December',
      key: 'December',
      width: '600',
      icon: 'mdi mdi-spellcheck',
      type: 'subColumns',
      columns: [
        {
          label: 'On-Spec Gas Delivery(SM3 * 10)',
          subKey: 'dGD',
          icon: 'mdi mdi-spellcheck',
          width: 200,
        },
        {
          label: 'Energy Corresponding to On-Spec Gas(MJ)',
          subKey: 'dCG',
          icon: 'mdi mdi-spellcheck',
          width: 200,
        },
        {
          label: 'Energy Corresponding to On-Spec Gas (MMBTU)',
          subKey: 'dSG',
          icon: 'mdi mdi-spellcheck',
          width: 200,
        },
      ],
    },
  ]
}
