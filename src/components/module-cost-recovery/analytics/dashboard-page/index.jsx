import { chartsPageCreator } from 'components/charts-page'
import { mcDFBySize } from 'components/analytics/utils'
import prod from './prod'
import ChartText from 'components/chart-text'
import { creatorMaker } from 'components/analytics/utils/creator-maker'
import { query, eq, and, or } from 'libs/utils/query'
import {
  configMerge,
  pie,
  title,
  vbar,
  stack,
  gauge,
  toolbox,
  monthTableComparer,
  mapTransform,
  flattenTransform,
  fieldsTransform,
  filterByCompanyBlock,
  dataFilter,
  card,
} from 'components/analytics/utils/charts-config-helper'

const mc21 = mcDFBySize(2, 1, ['company', 'block', 'group'])
const mc21SubCat = mcDFBySize(2, 1, ['company', 'block', 'subCategory'])
const mc11 = mcDFBySize(1, 1)
const mc11Card = mc11('card', ChartText)
const mc21Pie = mc21('pie', null)
const mc21Bar = mc21('bar', null)
const mc11Gauge = mc11('gauge', null)
const mc21StackBar = mc21('stack', null)
const mc21SubCatStackBar = mc21SubCat('stack', null)
const queryType = eq('type')
const isTotalUSD = queryType('totalUSD')
const isManHoursEstimate = queryType('manHoursEstimate')
const isApprovedAmount = queryType('approvedAmount')
const isActualSpent = queryType('actualSpent')
const queryCategory = eq('category')
const isTotal = queryCategory('TOTAL COSTS')
const isOPEX = queryCategory('OPERATING COST ')
const isCAPEX = queryCategory('CAPITAL COSTS')
const oIsCAPEX = {
  eq: ['category', 'CAPITAL COSTS'],
}
const oIsOPEX = {
  eq: ['category', 'OPERATING COST '],
}
const isActual = queryType('actual')
const isPlan = queryType('plan')
const isOutlook = queryType('outlook')
const querySubCate = eq('subCategory')
const isRecovery = querySubCate('RECOVERABLE COSTS')
const isNoRecovery = querySubCate('NON RECOVERABLE COSTS')
const actualVsPlanTrans = configMerge(
  mapTransform([
    { col: 'Plan', formula: '$yplan' },
    { col: 'Actual', formula: '$yactual' },
  ]),
  flattenTransform({
    columns: ['Plan', 'Actual'],
  }),
)
const cardMap = (split1By) =>
  card({
    map: {
      split1By,
      value1Key: 'value',
      unitKey: 'unit',
    },
  })
const generateMonthlyAndYearlyConfig = (queryData, condition, name) => {
  return [
    mc21StackBar(
      creatorMaker({
        type: 'stack',
        config: {
          filterBy: query(queryData),
          sliceByKeys: ['group', 'type', 'month'],
          groupHandlerName: 'sum-value',
        },
      }),
    )(
      `Monthly Group ${name} Summary`,
      {
        chartConfig: query(queryData),
        pinConfig: configMerge(
          title(`Monthly Group ${name} Summary`),
          toolbox,
          actualVsPlanTrans,
          filterByCompanyBlock,
          dataFilter(condition),
          monthTableComparer,
          stack({
            map: {
              seriesBy: 'type',
              groupBy: 'group',
              splitSortBy: 'monTable',
              splitBy: 'month',
              value1Key: 'value',
            },
          }),
        ),
      },
      {},
    ),
    mc21StackBar(
      creatorMaker({
        type: 'stack',
        config: {
          filterBy: query(queryData),
          sliceByKeys: ['type', 'company', 'group'],
          groupHandlerName: 'sum-value',
        },
      }),
      `Yearly Group ${name} Summary`,
      {
        chartConfig: query(queryData),
        pinConfig: configMerge(
          title(`Yearly Group ${name} Summary`),
          toolbox,
          actualVsPlanTrans,
          dataFilter(condition),
          filterByCompanyBlock,
          vbar({
            map: {
              seriesBy: 'type',
              split1By: 'group',
              value1Key: 'value',
            },
          }),
        ),
      },
      {},
    ),
    mc21SubCatStackBar(
      creatorMaker({
        type: 'stack',
        config: {
          filterBy: query(queryData),
          sliceByKeys: ['subCategory', 'type', 'month'],
          groupHandlerName: 'sum-value',
        },
      }),
    )(
      `Monthly Sub-Category ${name} Summary`,
      {
        chartConfig: query(queryData),
        pinConfig: configMerge(
          title(`Monthly Sub-Category ${name} Summary`),
          toolbox,
          actualVsPlanTrans,
          dataFilter(condition),
          filterByCompanyBlock,
          monthTableComparer,
          stack({
            map: {
              seriesBy: 'type',
              groupBy: 'subCategory',
              splitBy: 'month',
              splitSortBy: 'monTable',
              value1Key: 'value',
            },
          }),
        ),
      },
      {},
    ),
    mc21SubCatStackBar(
      creatorMaker({
        type: 'stack',
        config: {
          filterBy: query(queryData),
          sliceByKeys: ['type', 'company', 'subCategory'],
          groupHandlerName: 'sum-value',
        },
      }),
      `Yearly Sub-Category ${name} Summary`,
      {
        pinConfig: configMerge(
          title(`Yearly Sub-Category ${name} Summary`),
          toolbox,
          filterByCompanyBlock,
          actualVsPlanTrans,
          dataFilter(condition),
          vbar({
            map: {
              split1By: 'subCategory',
              seriesBy: 'type',
              value1Key: 'value',
            },
          }),
        ),
        chartConfig: query(queryData),
      },
      {},
    ),
  ]
}

const actualVsPlanGuage = configMerge(
  toolbox,
  filterByCompanyBlock,
  actualVsPlanTrans,
  gauge({
    map: {
      split1By: 'type',
      value1Key: 'value',
    },
  }),
)
const breadcrumbBasedBar = configMerge(
  toolbox,
  actualVsPlanTrans,
  monthTableComparer,
  vbar({
    map: {
      split1By: 'month',
      split1SortBy: 'monTable',
      value1Key: 'value',
      seriesBy: 'type',
    },
  }),
)

export const chartsToDraw = [
  prod,
  {
    title: 'Affiliate',
    reportType: 'AFFILIATE',
    groups: [
      {
        title: 'Summary',
        layout: 'float',
        charts: [
          mc21Pie(
            creatorMaker({
              type: 'pie',
              config: {
                sliceByKeys: ['nameService'],
                groupHandlerName: 'sum-value',
                filterBy: query(isManHoursEstimate),
              },
            }),
          )(
            'Man Hours Estimate',
            {
              pinConfig: configMerge(
                title('Man Hours Estimate'),
                toolbox,
                filterByCompanyBlock,
                pie({
                  map: {
                    split1By: 'nameService',
                    value1Key: 'manHoursEstimate',
                  },
                }),
              ),
            },
            {},
          ),
          mc21Pie(
            creatorMaker({
              type: 'pie',
              config: {
                sliceByKeys: ['nameService'],
                groupHandlerName: 'sum-value',
                filterBy: query(isTotalUSD),
              },
            }),
          )(
            'Total (USD)',
            {
              pinConfig: configMerge(
                title('Total (USD)'),
                toolbox,
                filterByCompanyBlock,
                pie({
                  map: {
                    split1By: 'nameService',
                    value1Key: 'totalUSD',
                  },
                }),
              ),
            },
            {},
          ),
          mc21Bar(
            creatorMaker({
              type: 'bar',
              config: {
                groupHandlerName: 'sum-value',
                sliceByKeys: ['type', 'nameService'],
                filterBy: query(isTotalUSD),
              },
            }),
          )(
            'Total (USD)',
            {
              pinConfig: configMerge(
                title('Total (USD)'),
                mapTransform([
                  {
                    col: 'Total USD',
                    formula: '$totalUSD',
                  },
                  {
                    col: 'Man Hours Estimate',
                    formula: '$manHoursEstimate',
                  },
                ]),
                flattenTransform({
                  columns: ['Total USD', 'Man Hours Estimate'],
                }),
                vbar({
                  map: {
                    seriesBy: 'type',
                    split1By: 'nameService',
                    value1Key: 'value',
                  },
                }),
              ),
            },
            {},
          ),
        ],
      },
    ],
  },
  {
    title: 'Contracts',
    reportType: 'CONTRACTS',
    groups: [
      {
        title: 'Summary',
        layout: 'float',
        charts: [
          mc21Pie(
            creatorMaker({
              type: 'pie',
              config: {
                sliceByKeys: ['vendorName'],
                groupHandlerName: 'sum-value',
                filterBy: query(isApprovedAmount),
              },
            }),
          )(
            'Approved Amount(USD)',
            {
              pinConfig: configMerge(
                title('Approved Amount(USD)'),
                filterByCompanyBlock,
                toolbox,
                pie({
                  map: {
                    split1By: 'vendorName',
                    value1Key: 'approvedAmount',
                  },
                }),
              ),
            },
            {},
          ),
          mc21Pie(
            creatorMaker({
              type: 'pie',
              config: {
                sliceByKeys: ['vendorName'],
                groupHandlerName: 'sum-value',
                filterBy: query(isActualSpent),
              },
            }),
          )(
            'Actual spent(USD)',
            {
              pinConfig: configMerge(
                title('Actual spent(USD)'),
                filterByCompanyBlock,
                toolbox,
                pie({
                  map: {
                    split1By: 'vendorName',
                    value1Key: 'actualSpent',
                  },
                }),
              ),
            },
            {},
          ),
          mc21Bar(
            creatorMaker({
              type: 'bar',
              config: {
                sliceByKeys: ['type', 'vendorName'],
                groupHandlerName: 'sum-value',
              },
            }),
          )(
            'Approved Amount VS Actual spent ',
            {
              pinConfig: configMerge(
                title('Approved Amount VS Actual spent'),
                toolbox,
                fieldsTransform([
                  'approvedAmount',
                  'actualSpent',
                  'vendorName',
                ]),
                flattenTransform({
                  columns: ['approvedAmount', 'actualSpent'],
                }),
                vbar({
                  map: {
                    seriesBy: 'type',
                    split1By: 'vendorName',
                    value1Key: 'value',
                  },
                }),
                filterByCompanyBlock,
              ),
            },
            {},
          ),
        ],
      },
    ],
  },
  {
    title: 'Annual Cost',
    reportType: 'FINANCIALS',
    groups: [
      {
        title: 'GRAND TOTALS',
        layout: 'float',
        charts: [
          mc11Card(
            creatorMaker({
              type: 'card',
              config: {
                filterBy: query(and(isTotal, or(isPlan, isActual))),
                groupHandlerName: 'sum-value',
                sliceByKeys: ['type'],
              },
            }),
          )(
            'Plan and Actual',
            {
              pinConfig: configMerge(
                title('Plan and Actual'),
                cardMap('type'),
                filterByCompanyBlock,
                dataFilter({ eq: ['category', 'TOTAL COSTS'] }),
                flattenTransform({
                  columns: ['yplan', 'yactual'],
                }),
                mapTransform([{ col: 'unit', formula: "'USD'" }]),
              ),
            },
            {},
          ),
          mc11Gauge(
            creatorMaker({
              type: 'gauge',
              config: {
                filterBy: query(and(isTotal, or(isPlan, isActual))),
                groupHandlerName: 'sum-value',
                sliceByKeys: ['type'],
              },
            }),
          )(
            'Plan Vs Actual',
            {
              pinConfig: configMerge(
                title('Plan Vs Actual'),
                actualVsPlanGuage,
              ),
            },
            {},
          ),
          mc21Pie(
            creatorMaker({
              type: 'pie',
              config: {
                sliceByKeys: ['subCategory'],
                groupHandlerName: 'sum-value',
                filterBy: query(
                  and(isTotal, isActual, or(isRecovery, isNoRecovery)),
                ),
              },
            }),
          )(
            'Recovery vs Nonrecovery',
            {
              pinConfig: configMerge(
                title('Recovery VS Norecovery'),
                toolbox,
                filterByCompanyBlock,
                pie({
                  map: {
                    split1By: 'subCategory',
                    value1Key: 'yactual',
                  },
                }),
                dataFilter({
                  or: [
                    {
                      eq: ['subCategory', 'RECOVERABLE COSTS'],
                    },
                    {
                      eq: ['subCategory', 'NON RECOVERABLE COSTS'],
                    },
                  ],
                }),
              ),
            },
            {},
          ),
          mc21Pie(
            creatorMaker({
              type: 'pie',
              config: {
                sliceByKeys: ['type'],
                groupHandlerName: 'sum-value',
                filterBy: query(and(isTotal, or(isPlan, isOutlook))),
              },
            }),
          )(
            'Approved - Outlook - Yt',
            {
              pinConfig: configMerge(
                title('Approved - Outlook - Yt'),
                toolbox,
                filterByCompanyBlock,
                mapTransform([
                  { col: 'Plan', formula: '$yplan' },
                  { col: 'Outlook', formula: '$youtlook' },
                ]),
                flattenTransform({
                  columns: ['Plan', 'Outlook'],
                }),
                pie({
                  map: {
                    split1By: 'type',
                    value1Key: 'value',
                  },
                }),
              ),
            },
            {},
          ),
        ],
      },
      {
        title: 'CAPEX',
        layout: 'float',
        charts: [
          mc11Gauge(
            creatorMaker({
              type: 'gauge',
              config: {
                filterBy: query(isCAPEX),
                groupHandlerName: 'sum-value',
                sliceByKeys: ['type'],
              },
            }),
          )(
            'Total Capex',
            {
              pinConfig: configMerge(
                title('Total Capex'),
                actualVsPlanGuage,
                dataFilter(oIsCAPEX),
              ),
            },
            {},
          ),
          mc21StackBar(
            creatorMaker({
              type: 'stack',
              config: {
                filterBy: query(isCAPEX),
                sliceByKeys: ['type', 'company', 'group'],
                groupHandlerName: 'sum-value',
              },
            }),
          )(
            'Total Capex Summary Benchmark',
            {
              chartConfig: query(isCAPEX),
              pinConfig: configMerge(
                title('Total Capex Summary Benchmark'),
                breadcrumbBasedBar,
                dataFilter(oIsCAPEX),
              ),
            },
            {},
          ),
        ],
      },
      {
        title: 'OPEX',
        layout: 'float',
        charts: [
          mc11Gauge(
            creatorMaker({
              type: 'gauge',
              config: {
                filterBy: query(isOPEX),
                groupHandlerName: 'sum-value',
                sliceByKeys: ['type'],
              },
            }),
          )(
            'Total Opex',
            {
              pinConfig: configMerge(
                title('Total Opex'),
                actualVsPlanGuage,
                dataFilter(oIsOPEX),
              ),
            },
            {},
          ),
          mc21StackBar(
            creatorMaker({
              type: 'stack',
              config: {
                filterBy: query(isOPEX),
                sliceByKeys: ['type', 'company', 'group'],
                groupHandlerName: 'sum-value',
              },
            }),
          )(
            'Total Opex Summary Benchmark',
            {
              chartConfig: query(isOPEX),
              pinConfig: configMerge(
                title('Total Opex Summary Benchmark'),
                breadcrumbBasedBar,
                dataFilter(oIsOPEX),
              ),
            },
            {},
          ),
        ],
      },
      {
        title: 'Monthly & Yearly Bar Chart Displays Capex',
        layout: 'float',
        charts: generateMonthlyAndYearlyConfig(isCAPEX, oIsCAPEX, 'Capex'),
      },
      {
        title: 'Monthly & Yearly Bar Chart Displays Opex',
        layout: 'float',
        charts: generateMonthlyAndYearlyConfig(isOPEX, oIsOPEX, 'Opex'),
      },
    ],
  },
]

export default chartsPageCreator(chartsToDraw)
