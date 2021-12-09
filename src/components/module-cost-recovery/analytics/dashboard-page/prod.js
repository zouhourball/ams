import ChartText from 'components/chart-text'
import { mcDFBySize } from 'components/analytics/utils'
import { creatorMaker } from 'components/analytics/utils/creator-maker'
import { query, eq, and, not } from 'libs/utils/query'
import {
  configMerge,
  pie,
  title,
  simpleFilter,
  toolbox,
  dataFilter,
  mapTransform,
  flattenTransform,
  fieldsTransform,
  filterByCompanyBlock,
  drill,
  card,
} from 'components/analytics/utils/charts-config-helper'
const isUSD = eq('dataType', 'usd')
const isBBL = eq('dataType', 'barrels')
const isProdu = eq('type', 'Production')
const isTotal = eq('valueCategory', 'Total Production')
const excludeTotal = not(isTotal)
const isTotalUSD = and(isTotal, isUSD)
const isTotalBBL = and(isTotal, isBBL)
const isActualLifting = eq('type', 'Lifting')
const mc21 = mcDFBySize(2, 1, ['company', 'block'])
const mc21Card = mc21('card', ChartText)
const mc21Pie = mc21('pie', null)
const mc21Bar = mcDFBySize(2, 1, ['type'])('bar', null)

const drillPath = ['valueCategory', 'valueType', 'month', 'company']
const drillPie = (filterBy, showValue) =>
  mc21Pie(
    creatorMaker({
      type: 'drillablePie',
      config: { groupHandlerName: 'sum-value', filterBy, showValue },
    }),
  )
const transformAndFlatten = configMerge(
  mapTransform([
    {
      col: 'Contractor Entitlement Cost Recovery',
      formula: '$contractorEntitlementCostRecoveryUSD',
    },
    {
      col: 'Contractor Entitlement Profit',
      formula: '$contractorEntitlementProfitUSD',
    },
    {
      col: 'Goverment Enntitlement Profit',
      formula: '$contractorEntitlementProfitUSD',
    },
    {
      col: 'unit',
      formula: "'USD'",
    },
  ]),
  flattenTransform({
    columns: [
      'Goverment Enntitlement Profit',
      'Contractor Entitlement Profit',
      'Contractor Entitlement Cost Recovery',
    ],
    typeColumn: 'valueType',
    valueColumn: 'value',
  }),
)

export default {
  title: 'Production & Lifting',
  reportType: 'PRODUCTION',
  groups: [
    {
      title: 'Production & Lifting',
      charts: [
        mc21Card(
          creatorMaker({
            type: 'card',
            config: {
              sliceByKeys: ['valueCategory'],
              groupHandlerName: 'sum-value',
              filterBy: query(and(excludeTotal, isUSD, isProdu)),
            },
          }),
          'Based on production(USD)',
          {
            pinConfig: configMerge(
              title('Based on production(USD)'),
              dataFilter({
                eq: ['type', 'dataBasedProduction'],
              }),
              transformAndFlatten,
              card({
                map: {
                  split1By: 'valueType',
                  value1Key: 'value',
                  unitKey: 'unit',
                },
              }),
              filterByCompanyBlock,
            ),
          },
          {},
        ),
        mc21Card(
          creatorMaker({
            type: 'card',
            config: {
              sliceByKeys: ['valueCategory'],
              groupHandlerName: 'sum-value',
              filterBy: query(and(excludeTotal, isUSD, isActualLifting)),
            },
          }),
          'Actual Lifting(USD)',
          {
            pinConfig: configMerge(
              title('Actual Lifting(USD)'),
              dataFilter({
                eq: ['type', 'dataActualLifting'],
              }),
              transformAndFlatten,
              card({
                map: {
                  split1By: 'valueType',
                  value1Key: 'value',
                  unitKey: 'unit',
                },
              }),
              filterByCompanyBlock,
            ),
          },
          {},
        ),
        mc21Card(
          creatorMaker({
            type: 'card',
            config: {
              sliceByKeys: ['type'],
              groupHandlerName: 'sum-value',
              filterBy: query(isTotalBBL),
            },
          }),
          'Production & Lifiting(BBL)',
          {
            pinConfig: configMerge(
              title('Production & Lifiting(BBL)'),
              mapTransform([{ col: 'unit', formula: "'BBL'" }]),
              card({
                map: {
                  split1By: 'type',
                  value1Key: 'totalProductionBarrels',
                  unitKey: 'unit',
                },
              }),
              filterByCompanyBlock,
            ),
          },
          {},
        ),
        drillPie(query(and(excludeTotal, isUSD, isProdu)))(
          'Production Cost Recovery (USD)',
          {
            drillPath,
            pinConfig: configMerge(
              title('Production Cost Recovery (USD)'),
              mapTransform([
                {
                  col: 'Contractor Entitlement Cost Recovery',
                  formula: '$contractorEntitlementCostRecoveryUSD',
                },
                {
                  col: 'Contractor Entitlement Profit',
                  formula: '$contractorEntitlementProfitUSD',
                },
                {
                  col: 'Goverment Enntitlement Profit',
                  formula: '$contractorEntitlementProfitUSD',
                },
              ]),
              flattenTransform({
                columns: [
                  'Goverment Enntitlement Profit',
                  'Contractor Entitlement Profit',
                  'Contractor Entitlement Cost Recovery',
                ],
                typeColumn: 'valueType',
                valueColumn: 'value',
              }),
              fieldsTransform(['year', 'company', 'month']),
              dataFilter({
                eq: ['type', 'dataBasedProduction'],
              }),
              pie({
                map: {
                  split1By: 'valueType',
                  value1Key: 'value',
                },
              }),
              filterByCompanyBlock,
              toolbox,
              drill(['valueType', 'month', 'company']),
            ),
          },
          {},
        ),
        drillPie(query(and(excludeTotal, isUSD, isActualLifting)))(
          'Actual Lifting Cost Recovery (USD)',
          {
            drillPath,
            pinConfig: configMerge(
              { title: 'Actual Lifting Cost Recovery (USD)' },
              filterByCompanyBlock,
              pie({
                map: {
                  split1By: 'valueType',
                  value1Key: 'value',
                },
              }),
              toolbox,
              drill(drillPath),
            ),
          },
          {},
        ),

        mc21Bar(
          creatorMaker({
            type: 'bar',
            config: {
              sliceByKeys: ['type', 'month'],
              groupHandlerName: 'sum-value',
              filterBy: query(isTotalUSD),
            },
          }),
          'Production and Lifting',
          {
            pinConfig: configMerge(
              title('Production and Lifting'),
              toolbox,
              simpleFilter([
                {
                  label: 'Type',
                  field: 'type',
                  type: 'check',
                },
              ]),
            ),
          },
          {},
        ),
      ],
    },
  ],
}
