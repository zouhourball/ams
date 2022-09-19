export const categories = [
  // {
  //   label: 'VAT',
  //   value: 'VAT',
  //   subCategories: [
  //     {
  //       label: 'VAT_rate_on_goods_local',
  //       value: 'VAT_rate_on_goods_local',
  //       uom: [{ label: '%', value: '%' }],
  //     },
  //     {
  //       label: 'VAT_rate_on_goods_imported',
  //       value: 'VAT_rate_on_goods_imported',
  //       uom: [{ label: '%', value: '%' }],
  //     },
  //     {
  //       label: 'VAT_rate_on_services_local',
  //       value: 'VAT_rate_on_services_local',
  //       uom: [{ label: '%', value: '%' }],
  //     },
  //     {
  //       label: 'VAT_rate_on_services_outside',
  //       value: 'VAT_rate_on_services_outside',
  //       uom: [{ label: '%', value: '%' }],
  //     },
  //     {
  //       label: 'VAT_rate_on_freight_transport_goods_local',
  //       value: 'VAT_rate_on_freight_transport_goods_local',
  //       uom: [{ label: '%', value: '%' }],
  //     },
  //     {
  //       label: 'VAT_rate_on_freight_transport_goods_imported',
  //       value: 'VAT_rate_on_freight_transport_goods_imported',
  //       uom: [{ label: '%', value: '%' }],
  //     },
  //   ],
  // },
  // {
  //   label: 'Cost',
  //   value: 'Cost',
  //   subCategories: [
  //     {
  //       label: 'Minimum cost recovery',
  //       value: 'Minimum cost recovery',
  //       uom: [{ label: '%', value: '%' }],
  //     },
  //     {
  //       label: 'Maximum cost recovery',
  //       value: 'Maximum cost recovery',
  //       uom: [{ label: '%', value: '%' }],
  //     },
  //   ],
  // },
  // {
  //   label: 'Cost Recovery Order',
  //   value: 'Cost Recovery Order',
  //   subCategories: [
  //     {
  //       label: 'Production Cost',
  //       value: 'Production Cost',
  //       uom: [{ label: 'ORDER', value: 'ORDER' }],
  //     },
  //     {
  //       label: 'Exploration Cost',
  //       value: 'Exploration Cost',
  //       uom: [{ label: 'ORDER', value: 'ORDER' }],
  //     },
  //     {
  //       label: 'Development Costs',
  //       value: 'Development Costs',
  //       uom: [{ label: 'ORDER', value: 'ORDER' }],
  //     },
  //     {
  //       label: 'Uplift',
  //       value: 'Uplift',
  //       uom: [{ label: 'ORDER', value: 'ORDER' }],
  //     },
  //   ],
  // },
  // {
  //   label: 'Profit Share',
  //   value: 'Profit Share',
  //   subCategories: [
  //     {
  //       label: 'r-factor <1 Governments share',
  //       value: 'r-factor <1 Governments share',
  //       uom: [{ label: '%', value: '%' }],
  //     },
  //     {
  //       label: 'r_factor 1 < 2.5 Governments Share',
  //       value: 'r_factor 1 < 2.5 Governments Share',
  //       uom: [{ label: '%', value: '%' }],
  //     },
  //     {
  //       label: 'r_factor >= 2.5  Governments Share',
  //       value: 'r_factor >= 2.5  Governments Share',
  //       uom: [{ label: '%', value: '%' }],
  //     },
  //     {
  //       label: 'r-factor <1 Contractors share',
  //       value: 'r-factor <1 Contractors share',
  //       uom: [{ label: '%', value: '%' }],
  //     },
  //     {
  //       label: 'r_factor 1 < 2.5 Contractor Share',
  //       value: 'r_factor 1 < 2.5 Contractor Share',
  //       uom: [{ label: '%', value: '%' }],
  //     },
  //     {
  //       label: 'r_factor >= 2.5  Contractors Share',
  //       value: 'r_factor >= 2.5  Contractors Share',
  //       uom: [{ label: '%', value: '%' }],
  //     },
  //     {
  //       label: 'Daily Production  0-20',
  //       value: 'Daily Production  0-20',
  //       uom: [{ label: '%', value: '%' }],
  //     },
  //     {
  //       label: 'Daily Production  21-50',
  //       value: 'Daily Production  21-50',
  //       uom: [{ label: '%', value: '%' }],
  //     },
  //     {
  //       label: 'Daily Production  51-100',
  //       value: 'Daily Production  51-100',
  //       uom: [{ label: '%', value: '%' }],
  //     },
  //     {
  //       label: 'Daily Production  101-150',
  //       value: 'Daily Production  101-150',
  //       uom: [{ label: '%', value: '%' }],
  //     },
  //     {
  //       label: 'Daily Production  > 150',
  //       value: 'Daily Production  > 150',
  //       uom: [{ label: '%', value: '%' }],
  //     },
  //   ],
  // },
  // {
  //   label: 'Tax',
  //   value: 'Tax',
  //   subCategories: [
  //     {
  //       label: 'Paid CIT',
  //       value: 'Paid CIT',
  //       uom: [{ label: '%', value: '%' }],
  //     },
  //     {
  //       label: 'Dividend withholding',
  //       value: 'Dividend withholding',
  //       uom: [{ label: '%', value: '%' }],
  //     },
  //     {
  //       label: 'Participation',
  //       value: 'Participation',
  //       uom: [{ label: '%', value: '%' }],
  //     },
  //     {
  //       label: 'Windfall Tax',
  //       value: 'Windfall Tax',
  //       uom: [{ label: '%', value: '%' }],
  //     },
  //   ],
  // },
  {
    label: 'Royalty',
    value: 'Royalty',
    subCategories: [
      {
        label: 'Royalty Marked Price',
        value: 'Royalty Marked Price',
        uom: [{ label: 'fraction', value: 'fraction' }],
      },
      {
        label: 'Royalty FOB Export Port',
        value: 'Royalty FOB Export Port',
        uom: [{ label: 'fraction', value: 'fraction' }],
      },
      {
        label: 'Royalty AB Field',
        value: 'Royalty AB Field',
        uom: [{ label: 'fraction', value: 'fraction' }],
      },
    ],
  },
  {
    label: 'Cost Recovery',
    value: 'Cost Recovery',
    subCategories: [
      {
        label: 'Cost Oil Rate Cost Recovery',
        value: 'Cost Oil Rate Cost Recovery',
        uom: [{ label: 'fraction', value: 'fraction' }],
      },
      {
        label: 'Depreciation Years Cost Recovery',
        value: 'Depreciation Years Cost Recovery',
        uom: [{ label: 'Years', value: 'Years' }],
      },
      {
        label: 'Tigger(l)',
        value: 'Tigger(l)',
        uom: [{ label: 'US$/bbl', value: 'US$/bbl' }],
      },
      {
        label: 'Tigger(h)',
        value: 'Tigger(h)',
        uom: [{ label: 'US$/bbl', value: 'US$/bbl' }],
      },
      {
        label: 'Cost Recovery(l)',
        value: 'Cost Recovery(l)',
        uom: [{ label: 'fraction', value: 'fraction' }],
      },
      {
        label: 'Cost Recovery(h)',
        value: 'Cost Recovery(h)',
        uom: [{ label: 'fraction', value: 'fraction' }],
      },
    ],
  },
  {
    label: 'Uplift',
    value: 'Uplift',
    subCategories: [
      {
        label: 'Uplift Switch',
        value: 'Uplift Switch',
        uom: [
          {
            label: 'switch',
            value: 'switch',
            switch: [
              {
                label: 'True',
                value: 'True',
              },
              {
                label: 'False',
                value: 'False',
              },
            ],
          },
        ],
      },
      {
        label: 'Duration of Uplift',
        value: 'Duration of Uplift',
        uom: [{ label: 'Years', value: 'Years' }],
      },
      {
        label: 'Uplift Percentage',
        value: 'Uplift Percentage',
        uom: [{ label: 'fraction', value: 'fraction' }],
      },
    ],
  },
  {
    label: 'Price Basis',
    value: 'Price Basis',
    subCategories: [
      {
        label: 'Cost Oil Price Basis',
        value: 'Cost Oil Price Basis',
        uom: [
          {
            label: 'string',
            value: 'string',
            switch: [
              {
                label: 'AB FIELD',
                value: 'AB FIELD',
              },
              {
                label: 'AB Export Port',
                value: 'AB Export Port',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    label: 'Cost Category Switch',
    value: 'Cost Category Switch',
    subCategories: [
      {
        label: 'EA Expenditure Switch',
        value: 'EA Expenditure Switch',
        uom: [
          {
            label: 'switch',
            value: 'switch',
            switch: [
              {
                label: 'True',
                value: 'True',
              },
              {
                label: 'False',
                value: 'False',
              },
            ],
          },
        ],
      },
      {
        label: 'Tangible Capital Expenditure Switch',
        value: 'Tangible Capital Expenditure Switch',
        uom: [
          {
            label: 'switch',
            value: 'switch',
            switch: [
              {
                label: 'True',
                value: 'True',
              },
              {
                label: 'False',
                value: 'False',
              },
            ],
          },
        ],
      },
      {
        label: 'Intangible Capital Expenditure Switch',
        value: 'Intangible Capital Expenditure Switch',
        uom: [
          {
            label: 'switch',
            value: 'switch',
            switch: [
              {
                label: 'True',
                value: 'True',
              },
              {
                label: 'False',
                value: 'False',
              },
            ],
          },
        ],
      },
      {
        label: 'Operating Expenditure Switch',
        value: 'Operating Expenditure Switch',
        uom: [
          {
            label: 'switch',
            value: 'switch',
            switch: [
              {
                label: 'True',
                value: 'True',
              },
              {
                label: 'False',
                value: 'False',
              },
            ],
          },
        ],
      },
      {
        label: 'Abandonment Expenditure Switch',
        value: 'Abandonment Expenditure Switch',
        uom: [
          {
            label: 'switch',
            value: 'switch',
            switch: [
              {
                label: 'True',
                value: 'True',
              },
              {
                label: 'False',
                value: 'False',
              },
            ],
          },
        ],
      },
      {
        label: 'Surface Fees Switch',
        value: 'Surface Fees Switch',
        uom: [
          {
            label: 'switch',
            value: 'switch',
            switch: [
              {
                label: 'True',
                value: 'True',
              },
              {
                label: 'False',
                value: 'False',
              },
            ],
          },
        ],
      },
      {
        label: 'Training Fees Switch',
        value: 'Training Fees Switch',
        uom: [
          {
            label: 'switch',
            value: 'switch',
            switch: [
              {
                label: 'True',
                value: 'True',
              },
              {
                label: 'False',
                value: 'False',
              },
            ],
          },
        ],
      },
      {
        label: 'Intangible RDL Drilling Switch',
        value: 'Intangible RDL Drilling Switch',
        uom: [
          {
            label: 'switch',
            value: 'switch',
            switch: [
              {
                label: 'True',
                value: 'True',
              },
              {
                label: 'False',
                value: 'False',
              },
            ],
          },
        ],
      },
      {
        label: 'Intangible IDF Drilling Switch',
        value: 'Intangible IDF Drilling Switch',
        uom: [
          {
            label: 'switch',
            value: 'switch',
            switch: [
              {
                label: 'True',
                value: 'True',
              },
              {
                label: 'False',
                value: 'False',
              },
            ],
          },
        ],
      },
      {
        label: 'Intangible VAT Drilling Switch',
        value: 'Intangible VAT Drilling Switch',
        uom: [
          {
            label: 'switch',
            value: 'switch',
            switch: [
              {
                label: 'True',
                value: 'True',
              },
              {
                label: 'False',
                value: 'False',
              },
            ],
          },
        ],
      },
      {
        label: 'WHT Switch',
        value: 'WHT Switch',
        uom: [
          {
            label: 'switch',
            value: 'switch',
            switch: [
              {
                label: 'True',
                value: 'True',
              },
              {
                label: 'False',
                value: 'False',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    label: 'Cost Category Priority',
    value: 'Cost Category Priority',
    subCategories: [
      {
        label: 'CR Priority 1',
        value: 'CR Priority 1',
        uom: [
          {
            label: 'switch',
            value: 'switch',
            switch: [
              {
                label: 'petroleum_costs_pre_FID',
                value: 'petroleum_costs_pre_FID',
              },
              {
                label: 'petroleum_costs_post_FID',
                value: 'petroleum_costs_post_FID',
              },
              {
                label: 'Production Costs',
                value: 'Production Costs',
              },
              {
                label: 'Exploration Costs',
                value: 'Exploration Costs',
              },
              {
                label: 'tangible_CAPEX',
                value: 'tangible_CAPEX',
              },
              {
                label: 'Development Costs',
                value: 'Development Costs',
              },
              {
                label: 'Uplift',
                value: 'Uplift',
              },
              {
                label: 'Decommissioning Costs',
                value: 'Decommissioning Costs',
              },
            ],
          },
        ],
      },
      {
        label: 'CR Priority 2',
        value: 'CR Priority 2',
        uom: [
          {
            label: 'switch',
            value: 'switch',
            switch: [
              {
                label: 'petroleum_costs_pre_FID',
                value: 'petroleum_costs_pre_FID',
              },
              {
                label: 'petroleum_costs_post_FID',
                value: 'petroleum_costs_post_FID',
              },
              {
                label: 'Production Costs',
                value: 'Production Costs',
              },
              {
                label: 'Exploration Costs',
                value: 'Exploration Costs',
              },
              {
                label: 'tangible_CAPEX',
                value: 'tangible_CAPEX',
              },
              {
                label: 'Development Costs',
                value: 'Development Costs',
              },
              {
                label: 'Uplift',
                value: 'Uplift',
              },
              {
                label: 'Decommissioning Costs',
                value: 'Decommissioning Costs',
              },
            ],
          },
        ],
      },
      {
        label: 'CR Priority 3',
        value: 'CR Priority 3',
        uom: [
          {
            label: 'switch',
            value: 'switch',
            switch: [
              {
                label: 'petroleum_costs_pre_FID',
                value: 'petroleum_costs_pre_FID',
              },
              {
                label: 'petroleum_costs_post_FID',
                value: 'petroleum_costs_post_FID',
              },
              {
                label: 'Production Costs',
                value: 'Production Costs',
              },
              {
                label: 'Exploration Costs',
                value: 'Exploration Costs',
              },
              {
                label: 'tangible_CAPEX',
                value: 'tangible_CAPEX',
              },
              {
                label: 'Development Costs',
                value: 'Development Costs',
              },
              {
                label: 'Uplift',
                value: 'Uplift',
              },
              {
                label: 'Decommissioning Costs',
                value: 'Decommissioning Costs',
              },
            ],
          },
        ],
      },
      {
        label: 'CR Priority 4',
        value: 'CR Priority 4',
        uom: [
          {
            label: 'switch',
            value: 'switch',
            switch: [
              {
                label: 'petroleum_costs_pre_FID',
                value: 'petroleum_costs_pre_FID',
              },
              {
                label: 'petroleum_costs_post_FID',
                value: 'petroleum_costs_post_FID',
              },
              {
                label: 'Production Costs',
                value: 'Production Costs',
              },
              {
                label: 'Exploration Costs',
                value: 'Exploration Costs',
              },
              {
                label: 'tangible_CAPEX',
                value: 'tangible_CAPEX',
              },
              {
                label: 'Development Costs',
                value: 'Development Costs',
              },
              {
                label: 'Uplift',
                value: 'Uplift',
              },
              {
                label: 'Decommissioning Costs',
                value: 'Decommissioning Costs',
              },
            ],
          },
        ],
      },
      {
        label: 'CR Priority 5',
        value: 'CR Priority 5',
        uom: [
          {
            label: 'switch',
            value: 'switch',
            switch: [
              {
                label: 'petroleum_costs_pre_FID',
                value: 'petroleum_costs_pre_FID',
              },
              {
                label: 'petroleum_costs_post_FID',
                value: 'petroleum_costs_post_FID',
              },
              {
                label: 'Production Costs',
                value: 'Production Costs',
              },
              {
                label: 'Exploration Costs',
                value: 'Exploration Costs',
              },
              {
                label: 'tangible_CAPEX',
                value: 'tangible_CAPEX',
              },
              {
                label: 'Development Costs',
                value: 'Development Costs',
              },
              {
                label: 'Uplift',
                value: 'Uplift',
              },
              {
                label: 'Decommissioning Costs',
                value: 'Decommissioning Costs',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    label: 'Profit Oil 1',
    value: 'Profit Oil 1',
    subCategories: [
      {
        label: 'Profit Oil Calculation Method Switch',
        value: 'Profit Oil Calculation Method Switch',
        uom: [
          {
            label: 'switch',
            value: 'switch',
            switch: [{ label: 'production', value: 'production' }],
          },
        ],
      },
      {
        label: 'Less Cost Oil Production Switch',
        value: 'Less Cost Oil Production Switch',
        uom: [
          {
            label: 'switch',
            value: 'switch',
            switch: [
              {
                label: 'True',
                value: 'True',
              },
              {
                label: 'False',
                value: 'False',
              },
            ],
          },
        ],
      },
      {
        label: 'Profit Oil Tranche 1 Threshold',
        value: 'Profit Oil Tranche 1 Threshold',
        uom: [{ label: 'mbopd', value: 'mbopd' }],
      },
      {
        label: 'Profit Oil Tranche 1 Rate',
        value: 'Profit Oil Tranche 1 Rate',
        uom: [{ label: 'fraction', value: 'fraction' }],
      },
      {
        label: 'Profit Oil Tranche 2 Threshold',
        value: 'Profit Oil Tranche 2 Threshold',
        uom: [{ label: 'mbopd', value: 'mbopd' }],
      },
      {
        label: 'Profit Oil Tranche 2 Rate',
        value: 'Profit Oil Tranche 2 Rate',
        uom: [{ label: 'fraction', value: 'fraction' }],
      },
      {
        label: 'Profit Oil Tranche 3 Threshold',
        value: 'Profit Oil Tranche 3 Threshold',
        uom: [{ label: 'mbopd', value: 'mbopd' }],
      },
      {
        label: 'Profit Oil Tranche 3 Rate',
        value: 'Profit Oil Tranche 3 Rate',
        uom: [{ label: 'fraction', value: 'fraction' }],
      },
      {
        label: 'Profit Oil Tranche 4 Threshold',
        value: 'Profit Oil Tranche 4 Threshold',
        uom: [{ label: 'mbopd', value: 'mbopd' }],
      },
      {
        label: 'Profit Oil Tranche 4 Rate',
        value: 'Profit Oil Tranche 4 Rate',
        uom: [{ label: 'fraction', value: 'fraction' }],
      },
      {
        label: 'Profit Oil Tranche 5 Threshold',
        value: 'Profit Oil Tranche 5 Threshold',
        uom: [{ label: 'mbopd', value: 'mbopd' }],
      },
      {
        label: 'Profit Oil Tranche 5 Rate',
        value: 'Profit Oil Tranche 5 Rate',
        uom: [{ label: 'fraction', value: 'fraction' }],
      },
      {
        label: 'Profit Oil Tranche 6 Threshold',
        value: 'Profit Oil Tranche 6 Threshold',
        uom: [{ label: 'mbopd', value: 'mbopd' }],
      },
      {
        label: 'Profit Oil Tranche 6 Rate',
        value: 'Profit Oil Tranche 6 Rate',
        uom: [{ label: 'fraction', value: 'fraction' }],
      },
      {
        label: 'Profit Oil Tranche 7 Threshold',
        value: 'Profit Oil Tranche 7 Threshold',
        uom: [{ label: 'mbopd', value: 'mbopd' }],
      },
      {
        label: 'Profit Oil Tranche 7 Rate',
        value: 'Profit Oil Tranche 7 Rate',
        uom: [{ label: 'fraction', value: 'fraction' }],
      },
      {
        label: 'Profit Oil Tranche 8 Threshold',
        value: 'Profit Oil Tranche 8 Threshold',
        uom: [{ label: 'mbopd', value: 'mbopd' }],
      },
      {
        label: 'Profit Oil Tranche 8 Rate',
        value: 'Profit Oil Tranche 8 Rate',
        uom: [{ label: 'fraction', value: 'fraction' }],
      },
      {
        label: 'Profit Oil Tranche 9 Threshold',
        value: 'Profit Oil Tranche 9 Threshold',
        uom: [{ label: 'mbopd', value: 'mbopd' }],
      },
      {
        label: 'Profit Oil Tranche 9 Rate',
        value: 'Profit Oil Tranche 9 Rate',
        uom: [{ label: 'fraction', value: 'fraction' }],
      },
      {
        label: 'Profit Oil Tranche 10 Threshold',
        value: 'Profit Oil Tranche 10 Threshold',
        uom: [{ label: 'mbopd', value: 'mbopd' }],
      },
      {
        label: 'Profit Oil Tranche 10 Rate',
        value: 'Profit Oil Tranche 10 Rate',
        uom: [{ label: 'fraction', value: 'fraction' }],
      },
    ],
  },
  {
    label: 'Profit Oil 2',
    value: 'Profit Oil 2',
    subCategories: [
      {
        label: 'Profit Oil R-factor 1 Threshold',
        value: 'Profit Oil R-factor 1 Threshold',
        uom: [{ label: 'numeric', value: 'numeric' }],
      },
      {
        label: 'Profit Oil R-factor 1 Government Share',
        value: 'Profit Oil R-factor 1 Government Share',
        uom: [{ label: 'fraction', value: 'fraction' }],
      },
      {
        label: 'Profit Oil R-factor 2 Threshold',
        value: 'Profit Oil R-factor 2 Threshold',
        uom: [{ label: 'numeric', value: 'numeric' }],
      },
      {
        label: 'Profit Oil R-factor 2 Government Share',
        value: 'Profit Oil R-factor 2 Government Share',
        uom: [{ label: 'fraction', value: 'fraction' }],
      },
      {
        label: 'Profit Oil R-factor 3 Threshold',
        value: 'Profit Oil R-factor 3 Threshold',
        uom: [{ label: 'numeric', value: 'numeric' }],
      },
      {
        label: 'Profit Oil R-factor 3 Government Share',
        value: 'Profit Oil R-factor 3 Government Share',
        uom: [{ label: 'fraction', value: 'fraction' }],
      },
    ],
  },
  {
    label: 'Windfall Tax',
    value: 'Windfall Tax',
    subCategories: [
      {
        label: 'Windfall Tax Threshold Price Basis',
        value: 'Windfall Tax Threshold Price Basis',
        uom: [
          {
            label: 'string',
            value: 'string',
            switch: [
              {
                label: 'FOB FIELD',
                value: 'FOB FIELD',
              },
              {
                label: 'FOB Export Port',
                value: 'FOB Export Port',
              },
            ],
          },
        ],
      },
      {
        label: 'Windfall Tax Threshold Price',
        value: 'Windfall Tax Threshold Price',
        uom: [{ label: 'bbl', value: 'bbl' }],
      },
      {
        label: 'Windfall Tax Rate',
        value: 'Windfall Tax Rate',
        uom: [{ label: 'fraction', value: 'fraction' }],
      },
      {
        label: 'Base Year',
        value: 'Base Year',
        uom: [{ label: 'string', value: 'string' }],
      },
      {
        label: 'CPI at Base Year',
        value: 'CPI at Base Year',
        uom: [{ label: 'numeric', value: 'numeric' }],
      },
    ],
  },
  {
    label: 'Fiscal Taxation',
    value: 'Fiscal Taxation',
    subCategories: [
      {
        label: 'CIT Applicable',
        value: 'CIT Applicable',
        uom: [
          {
            label: 'switch',
            value: 'switch',
            switch: [
              {
                label: 'True',
                value: 'True',
              },
              {
                label: 'False',
                value: 'False',
              },
            ],
          },
        ],
      },
      {
        label: 'Deemed CIT',
        value: 'Deemed CIT',
        uom: [
          {
            label: 'switch',
            value: 'switch',
            switch: [
              {
                label: 'True',
                value: 'True',
              },
              {
                label: 'False',
                value: 'False',
              },
            ],
          },
        ],
      },
      {
        label: 'CIT on Profit Oil only',
        value: 'CIT on Profit Oil only',
        uom: [
          {
            label: 'switch',
            value: 'switch',
            switch: [
              {
                label: 'True',
                value: 'True',
              },
              {
                label: 'False',
                value: 'False',
              },
            ],
          },
        ],
      },
      {
        label: 'WHT Applicable',
        value: 'WHT Applicable',
        uom: [
          {
            label: 'switch',
            value: 'switch',
            switch: [
              {
                label: 'True',
                value: 'True',
              },
              {
                label: 'False',
                value: 'False',
              },
            ],
          },
        ],
      },
      {
        label: 'Deemed WHT',
        value: 'Deemed WHT',
        uom: [
          {
            label: 'switch',
            value: 'switch',
            switch: [
              {
                label: 'True',
                value: 'True',
              },
              {
                label: 'False',
                value: 'False',
              },
            ],
          },
        ],
      },
      {
        label: 'WHT on Profit Oil only',
        value: 'WHT on Profit Oil only',
        uom: [
          {
            label: 'switch',
            value: 'switch',
            switch: [
              {
                label: 'True',
                value: 'True',
              },
              {
                label: 'False',
                value: 'False',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    label: 'Decommissioning plan',
    value: 'Decommissioning plan',
    subCategories: [
      {
        label: 'Recoverable Reserves Threshold',
        value: 'Recoverable Reserves Threshold',
        uom: [{ label: 'fraction', value: 'fraction' }],
      },
    ],
  },
  {
    label: 'Cost recovery priority table',
    value: 'Cost recovery priority table',
    subCategories: [
      {
        label: 'Exploration Cost',
        value: 'Exploration Cost',
        uom: [
          {
            label: 'Factor',
            value: 'Factor',
            switch: [
              {
                label: '0',
                value: '0',
              },
              {
                label: '1',
                value: '1',
              },
              {
                label: '2',
                value: '2',
              },
              {
                label: '3',
                value: '3',
              },
              {
                label: '4',
                value: '4',
              },
              {
                label: '5',
                value: '5',
              },
            ],
          },
        ],
      },
      {
        label: 'Appraisal Cost',
        value: 'Appraisal Cost',
        uom: [
          {
            label: 'Factor',
            value: 'Factor',
            switch: [
              {
                label: '0',
                value: '0',
              },
              {
                label: '1',
                value: '1',
              },
              {
                label: '2',
                value: '2',
              },
              {
                label: '3',
                value: '3',
              },
              {
                label: '4',
                value: '4',
              },
              {
                label: '5',
                value: '5',
              },
            ],
          },
        ],
      },
      {
        label: 'CAPEX pre-FID',
        value: 'CAPEX pre-FID',
        uom: [
          {
            label: 'Factor',
            value: 'Factor',
            switch: [
              {
                label: '0',
                value: '0',
              },
              {
                label: '1',
                value: '1',
              },
              {
                label: '2',
                value: '2',
              },
              {
                label: '3',
                value: '3',
              },
              {
                label: '4',
                value: '4',
              },
              {
                label: '5',
                value: '5',
              },
            ],
          },
        ],
      },
      {
        label: 'Historic Cost',
        value: 'Historic Cost',
        uom: [
          {
            label: 'Factor',
            value: 'Factor',
            switch: [
              {
                label: '0',
                value: '0',
              },
              {
                label: '1',
                value: '1',
              },
              {
                label: '2',
                value: '2',
              },
              {
                label: '3',
                value: '3',
              },
              {
                label: '4',
                value: '4',
              },
              {
                label: '5',
                value: '5',
              },
            ],
          },
        ],
      },
      {
        label: 'OPEX Facilities',
        value: 'OPEX Facilities',
        uom: [
          {
            label: 'Factor',
            value: 'Factor',
            switch: [
              {
                label: '0',
                value: '0',
              },
              {
                label: '1',
                value: '1',
              },
              {
                label: '2',
                value: '2',
              },
              {
                label: '3',
                value: '3',
              },
              {
                label: '4',
                value: '4',
              },
              {
                label: '5',
                value: '5',
              },
            ],
          },
        ],
      },
      {
        label: 'OPEX Fields',
        value: 'OPEX Fields',
        uom: [
          {
            label: 'Factor',
            value: 'Factor',
            switch: [
              {
                label: '0',
                value: '0',
              },
              {
                label: '1',
                value: '1',
              },
              {
                label: '2',
                value: '2',
              },
              {
                label: '3',
                value: '3',
              },
              {
                label: '4',
                value: '4',
              },
              {
                label: '5',
                value: '5',
              },
            ],
          },
        ],
      },
      {
        label: 'OPEX GA',
        value: 'OPEX GA',
        uom: [
          {
            label: 'Factor',
            value: 'Factor',
            switch: [
              {
                label: '0',
                value: '0',
              },
              {
                label: '1',
                value: '1',
              },
              {
                label: '2',
                value: '2',
              },
              {
                label: '3',
                value: '3',
              },
              {
                label: '4',
                value: '4',
              },
              {
                label: '5',
                value: '5',
              },
            ],
          },
        ],
      },
      {
        label: 'ABEX',
        value: 'ABEX',
        uom: [
          {
            label: 'Factor',
            value: 'Factor',
            switch: [
              {
                label: '0',
                value: '0',
              },
              {
                label: '1',
                value: '1',
              },
              {
                label: '2',
                value: '2',
              },
              {
                label: '3',
                value: '3',
              },
              {
                label: '4',
                value: '4',
              },
              {
                label: '5',
                value: '5',
              },
            ],
          },
        ],
      },
      {
        label: 'Pipeline',
        value: 'Pipeline',
        uom: [
          {
            label: 'Factor',
            value: 'Factor',
            switch: [
              {
                label: '0',
                value: '0',
              },
              {
                label: '1',
                value: '1',
              },
              {
                label: '2',
                value: '2',
              },
              {
                label: '3',
                value: '3',
              },
              {
                label: '4',
                value: '4',
              },
              {
                label: '5',
                value: '5',
              },
            ],
          },
        ],
      },
      {
        label: 'Tariff Series Calculated',
        value: 'Tariff Series Calculated',
        uom: [
          {
            label: 'Factor',
            value: 'Factor',
            switch: [
              {
                label: '0',
                value: '0',
              },
              {
                label: '1',
                value: '1',
              },
              {
                label: '2',
                value: '2',
              },
              {
                label: '3',
                value: '3',
              },
              {
                label: '4',
                value: '4',
              },
              {
                label: '5',
                value: '5',
              },
            ],
          },
        ],
      },
      {
        label: 'Tariff Single',
        value: 'Tariff Single',
        uom: [
          {
            label: 'Factor',
            value: 'Factor',
            switch: [
              {
                label: '0',
                value: '0',
              },
              {
                label: '1',
                value: '1',
              },
              {
                label: '2',
                value: '2',
              },
              {
                label: '3',
                value: '3',
              },
              {
                label: '4',
                value: '4',
              },
              {
                label: '5',
                value: '5',
              },
            ],
          },
        ],
      },
      {
        label: 'CAPEX Tangible',
        value: 'CAPEX Tangible',
        uom: [
          {
            label: 'Factor',
            value: 'Factor',
            switch: [
              {
                label: '0',
                value: '0',
              },
              {
                label: '1',
                value: '1',
              },
              {
                label: '2',
                value: '2',
              },
              {
                label: '3',
                value: '3',
              },
              {
                label: '4',
                value: '4',
              },
              {
                label: '5',
                value: '5',
              },
            ],
          },
        ],
      },
      {
        label: 'CAPEX Intangible',
        value: 'CAPEX Intangible',
        uom: [
          {
            label: 'Factor',
            value: 'Factor',
            switch: [
              {
                label: '0',
                value: '0',
              },
              {
                label: '1',
                value: '1',
              },
              {
                label: '2',
                value: '2',
              },
              {
                label: '3',
                value: '3',
              },
              {
                label: '4',
                value: '4',
              },
              {
                label: '5',
                value: '5',
              },
            ],
          },
        ],
      },
      {
        label: 'Uplift',
        value: 'Uplift',
        uom: [
          {
            label: 'Factor',
            value: 'Factor',
            switch: [
              {
                label: '0',
                value: '0',
              },
              {
                label: '1',
                value: '1',
              },
              {
                label: '2',
                value: '2',
              },
              {
                label: '3',
                value: '3',
              },
              {
                label: '4',
                value: '4',
              },
              {
                label: '5',
                value: '5',
              },
            ],
          },
        ],
      },
      {
        label: 'Surface Fees',
        value: 'Surface Fees',
        uom: [
          {
            label: 'Factor',
            value: 'Factor',
            switch: [
              {
                label: '0',
                value: '0',
              },
              {
                label: '1',
                value: '1',
              },
              {
                label: '2',
                value: '2',
              },
              {
                label: '3',
                value: '3',
              },
              {
                label: '4',
                value: '4',
              },
              {
                label: '5',
                value: '5',
              },
            ],
          },
        ],
      },
      {
        label: 'Training Fees',
        value: 'Training Fees',
        uom: [
          {
            label: 'Factor',
            value: 'Factor',
            switch: [
              {
                label: '0',
                value: '0',
              },
              {
                label: '1',
                value: '1',
              },
              {
                label: '2',
                value: '2',
              },
              {
                label: '3',
                value: '3',
              },
              {
                label: '4',
                value: '4',
              },
              {
                label: '5',
                value: '5',
              },
            ],
          },
        ],
      },
      {
        label: 'VAT on CAPEX',
        value: 'VAT on CAPEX',
        uom: [
          {
            label: 'Factor',
            value: 'Factor',
            switch: [
              {
                label: '0',
                value: '0',
              },
              {
                label: '1',
                value: '1',
              },
              {
                label: '2',
                value: '2',
              },
              {
                label: '3',
                value: '3',
              },
              {
                label: '4',
                value: '4',
              },
              {
                label: '5',
                value: '5',
              },
            ],
          },
        ],
      },
      {
        label: 'RDL Contractor',
        value: 'RDL Contractor',
        uom: [
          {
            label: 'Factor',
            value: 'Factor',
            switch: [
              {
                label: '0',
                value: '0',
              },
              {
                label: '1',
                value: '1',
              },
              {
                label: '2',
                value: '2',
              },
              {
                label: '3',
                value: '3',
              },
              {
                label: '4',
                value: '4',
              },
              {
                label: '5',
                value: '5',
              },
            ],
          },
        ],
      },
      {
        label: 'IDF Contractor',
        value: 'IDF Contractor',
        uom: [
          {
            label: 'Factor',
            value: 'Factor',
            switch: [
              {
                label: '0',
                value: '0',
              },
              {
                label: '1',
                value: '1',
              },
              {
                label: '2',
                value: '2',
              },
              {
                label: '3',
                value: '3',
              },
              {
                label: '4',
                value: '4',
              },
              {
                label: '5',
                value: '5',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    label: 'Railway Development Levy',
    value: 'Railway Development Levy',
    subCategories: [
      {
        label: 'Railway Development Levy',
        value: 'Railway Development Levy',
        uom: [{ label: 'fraction', value: 'fraction' }],
      },
    ],
  },
  {
    label: 'Import Declaration Fee',
    value: 'Import Declaration Fee',
    subCategories: [
      {
        label: 'Import Declaration Fee',
        value: 'Import Declaration Fee',
        uom: [{ label: 'fraction', value: 'fraction' }],
      },
    ],
  },
  {
    label: 'VAT Rate',
    value: 'VAT Rate',
    subCategories: [
      {
        label: 'On Goods Local',
        value: 'On Goods Local',
        uom: [{ label: 'fraction', value: 'fraction' }],
      },
      {
        label: 'On Goods Imported',
        value: 'On Goods Imported',
        uom: [{ label: 'fraction', value: 'fraction' }],
      },
      {
        label: 'On Services Local',
        value: 'On Services Local',
        uom: [{ label: 'fraction', value: 'fraction' }],
      },
      {
        label: 'On Freight Transport Goods Local',
        value: 'On Freight Transport Goods Local',
        uom: [{ label: 'fraction', value: 'fraction' }],
      },
      {
        label: 'On Services Outside',
        value: 'On Services Outside',
        uom: [{ label: 'fraction', value: 'fraction' }],
      },
      {
        label: 'On Freight Transport Goods Imported',
        value: 'On Freight Transport Goods Imported',
        uom: [{ label: 'fraction', value: 'fraction' }],
      },
    ],
  },
  {
    label: 'Withholding Tax',
    value: 'Withholding Tax',
    subCategories: [
      {
        label: 'On Local Services',
        value: 'On Local Services',
        uom: [{ label: 'fraction', value: 'fraction' }],
      },
      {
        label: 'On Outside Services',
        value: 'On Outside Services',
        uom: [{ label: 'fraction', value: 'fraction' }],
      },
      {
        label: 'On Dividends',
        value: 'On Dividends',
        uom: [{ label: 'fraction', value: 'fraction' }],
      },
      {
        label: 'On Interest - External Loan',
        value: 'On Interest - External Loan',
        uom: [{ label: 'fraction', value: 'fraction' }],
      },
    ],
  },
  {
    label: 'Fiscal law',
    value: 'Fiscal law',
    subCategories: [
      {
        label: 'Thin Capitaliz. Limit (Sh. Loan / Common Stock) Max',
        value: 'Thin Capitaliz. Limit (Sh. Loan / Common Stock) Max',
        uom: [{ label: 'Multiple', value: 'Multiple' }],
      },
    ],
  },
  {
    label: 'Tax Rates',
    value: 'Tax Rates',
    subCategories: [
      {
        label: 'Corporate Income Tax in Period 1',
        value: 'Corporate Income Tax in Period 1',
        uom: [{ label: 'fraction', value: 'fraction' }],
      },
      {
        label: 'Corporate Income Tax in Period 2',
        value: 'Corporate Income Tax in Period 2',
        uom: [{ label: 'fraction', value: 'fraction' }],
      },
      {
        label: 'Corporate Income Tax in Period 3',
        value: 'Corporate Income Tax in Period 3',
        uom: [{ label: 'fraction', value: 'fraction' }],
      },
      {
        label: 'Corporate Income Tax in Add Period',
        value: 'Corporate Income Tax in Add Period',
        uom: [{ label: 'fraction', value: 'fraction' }],
      },
      {
        label: 'Period 1',
        value: 'Period 1',
        uom: [{ label: 'YEARS', value: 'YEARS' }],
      },
      {
        label: 'Period 2',
        value: 'Period 2',
        uom: [{ label: 'YEARS', value: 'YEARS' }],
      },
      {
        label: 'Period 3',
        value: 'Period 3',
        uom: [{ label: 'YEARS', value: 'YEARS' }],
      },
      {
        label: 'Add Period',
        value: 'Add Period',
        uom: [{ label: 'YEARS', value: 'YEARS' }],
      },
    ],
  },
]
