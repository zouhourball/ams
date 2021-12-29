import { chartsPageCreator } from 'components/charts-page'
import { mcDFBySize, mapDataCvtCreator } from 'components/analytics/utils'
import { creatorMaker } from 'components/analytics/utils/creator-maker'
import ChartText from 'components/chart-text'
// import DataTable from '@target-energysolutions/data-table'
import Mht from '@target-energysolutions/mht'

import Map from 'components/map'

// import i18n from 'i18n-js'
// import l from 'libs/langs/keys'
import { query, eq } from 'libs/utils/query'
// import { wellObjective2Text } from "components/ams-permit/analytics/processors"
import {
  configMerge,
  filterByCompanyBlock,
  card,
  title,
  mapTransform,
  dataFilter,
  toolbox,
  pie,
  drill,
  table as pinTable,
  stack,
} from 'components/analytics/utils/charts-config-helper'

const drillPath = ['permitType', 'company', 'block']
const drillShore = ['onShoreOffShore', 'permitType', 'company', 'block']

const drillWell = ['wellType', 'permitType', 'company', 'block']
const drillObjective = ['wellObjective', 'permitType', 'company', 'block']
const mc11 = mcDFBySize(1, 1)
const mc21 = mcDFBySize(2, 1)
const mc42 = mcDFBySize(4, 2)
const mc42MoreFilters = mcDFBySize(4, 2, ['company', 'block', 'permitType'])
const mc21Pie = mc21('pie', null)
const mc42Table = mc42('table', Mht)
const mc42Stack = mc42('stack', null)
const mc42Map = mc42MoreFilters('map', Map)
const mc42Bar = (filterBy) =>
  mc42Stack(
    creatorMaker({
      type: 'stack',
      config: {
        sliceByKeys: ['wellType', 'company', 'permitType'],
        groupHandlerName: 'sum-aFECost',
        filterBy,
      },
    }),
  )

const makeSmallCard = (groupHandlerName) => (filterBy) =>
  mc11(
    'card',
    ChartText,
    creatorMaker({
      type: 'card',
      config: {
        showUnit: false,
        filterBy,
        groupHandlerName,
      },
    }),
  )
const smallCard = makeSmallCard('count')
const smallCardAFE = makeSmallCard('sum-aFECost')
const drillPie = (sizedPie, groupHandlerName, unit) => {
  const config = { groupHandlerName }
  if (unit !== undefined) {
    config.unit = unit
  }
  return sizedPie(
    creatorMaker({
      type: 'drillablePie',
      config,
    }),
  )
}
const table = ({ columnsConfig }) => {
  return mc42Table(
    creatorMaker({
      type: 'table',
      config: { columnsConfig, rowsPerPage: 12 },
    }),
  )
}
const columnsConfig = [
  {
    name: 'Submitted Date',
    dataKey: 'appliedDateFormatted',
    width: 120,
  },
  {
    name: 'submittedBy',
    dataKey: 'submittedBy',
    width: 150,
  },
  {
    name: 'company',
    dataKey: 'company',
    width: 80,
  },
  {
    name: 'block',
    dataKey: 'block',
    width: 70,
  },
  {
    name: 'permitType',
    dataKey: 'permitType',
    width: 150,
  },
  {
    name: 'wellType',
    dataKey: 'wellType',
    width: 150,
  },
  {
    name: 'Well Name',
    dataKey: 'wellName',
    width: 150,
  },
  {
    name: 'Field Name',
    dataKey: 'fieldName',
    width: 150,
  },
  {
    name: 'WellObjective',
    dataKey: 'wellObjective',
    width: 150,
  },
  {
    name: 'AFECost',
    dataKey: 'aFECost',
    width: 150,
  },
]

const pinColumnsConfig = [
  {
    name: 'Submitted Date',
    dataKey: 'createdAt',
    width: 120,
  },
  {
    name: 'SUBMITTED BY',
    dataKey: 'createdBy',
    width: 150,
  },
  {
    name: 'COMPANY',
    dataKey: 'company',
    width: 80,
  },
  {
    name: 'Block',
    dataKey: 'block',
    width: 70,
  },
  {
    name: 'Permit Type',
    dataKey: 'permitType',
    width: 150,
  },
  {
    name: 'Well Type',
    dataKey: 'Well Type',
    width: 150,
  },
  {
    name: 'Well Objective',
    dataKey: 'Well Objective',
    width: 150,
  },
  {
    name: 'AFE Cost',
    dataKey: 'AFE Cost, mm$',
    width: 150,
  },
]

const toolboxAndFilter = configMerge(toolbox, filterByCompanyBlock)

const mapCardSumBy = (key) =>
  card({
    map: {
      split1By: '-',
      value1Key: key,
    },
    setting: {
      hideLabel: true,
    },
  })
const aFECostPinconfig = (t) =>
  configMerge(
    title(t),
    toolboxAndFilter,
    stack({
      map: {
        split1By: 'Well Type',
        split2By: 'company',
        split3By: 'permitType',
        value1Key: 'AFE Cost, mm$',
        value2Key: 'AFE Cost, mm$',
        value3Key: 'AFE Cost, mm$',
      },
    }),
  )

export const chartsToDraw = [
  {
    title: 'Permit',
    groups: [
      {
        title: 'Summary',
        layout: 'float',
        charts: [
          smallCard({ status: 'SUBMITTED' })(
            'Waiting for Approval',
            {
              pinConfig: configMerge(
                title('Waiting for Approval'),
                mapTransform([{ col: 'count-1', formula: '1' }]),
                mapCardSumBy('count-1'),
                dataFilter({
                  eq: ['status', 'SUBMITTED'],
                }),
              ),
            },
            {},
          ),
          smallCard({ status: 'ISSUED' })(
            'Total Approved',
            {
              pinConfig: configMerge(
                title('Total Approved'),
                mapTransform([{ col: 'count-1', formula: '1' }]),
                mapCardSumBy('count-1'),
                dataFilter({
                  eq: ['status', 'ISSUED'],
                }),
              ),
            },
            {},
          ),
          smallCard({ status: 'REJECTED' })(
            'Total Rejected',
            {
              pinConfig: configMerge(
                title('Total Rejected'),
                mapTransform([{ col: 'count-1', formula: '1' }]),
                mapCardSumBy('count-1'),
                dataFilter({
                  eq: ['status', 'REJECTED'],
                }),
              ),
            },
            {},
          ),
          smallCardAFE({ permitType: 'Drill' })(
            'Total AFE Cost Drill (MM$)',
            {
              pinConfig: configMerge(
                title('Total AFE Cost Drill (MM$)'),
                mapCardSumBy('AFE Cost, mm$'),
                dataFilter({
                  eq: ['permitType', 'Drill'],
                }),
              ),
            },
            {},
          ),
          drillPie(mc21Pie, 'sum-aFECost')(
            'Total AFE',
            {
              drillPath,
              pinConfig: configMerge(
                title('Total AFE'),
                toolboxAndFilter,
                mapTransform([{ col: 'unit', formula: "'MM$'" }]),
                drill(['permitType', 'company', 'block']),
                pie({
                  map: {
                    split1By: 'permitType',
                    value1Key: 'AFE Cost, mm$',
                    unitKey: 'unit',
                  },
                }),
              ),
            },
            {},
          ),
          drillPie(mc21Pie, 'count', '')(
            'Total Permits',
            {
              drillPath,
              pinConfig: configMerge(
                title('Total Permits'),
                toolboxAndFilter,
                mapTransform([{ col: 'count-1', formula: '1' }]),
                drill(['permitType', 'company', 'block']),
                pie({
                  map: {
                    split1By: 'permitType',
                    value1Key: 'count-1',
                  },
                }),
              ),
            },
            {},
          ),
          smallCardAFE({ permitType: 'Abandon' })(
            'Total Abandonment Cost (MM$)',
            {
              pinConfig: configMerge(
                title('Total Abandonment Cost (MM$)'),
                mapCardSumBy('Abandonment Cost,$'),
                dataFilter({
                  eq: ['permitType', 'Abandon'],
                }),
              ),
            },
            {},
          ),
          smallCardAFE({ permitType: 'Suspend' })(
            'Total Suspension Cost (MM$)',
            {
              pinConfig: configMerge(
                title('Total Suspension Cost (MM$)'),
                mapCardSumBy('AFE Cost, mm$'),
                dataFilter({
                  eq: ['permitType', 'Suspend'],
                }),
              ),
            },
            {},
          ),
          drillPie(mc21Pie, 'count', '')(
            'Onshore/Offshore',
            {
              drillPath: drillShore,
              pinConfig: configMerge(
                title('Onshore/Offshore'),
                toolboxAndFilter,
                mapTransform([{ col: 'count-1', formula: '1' }]),
                drill(['Onshore/Offshore', 'permitType', 'company', 'block']),
                pie({
                  map: {
                    split1By: 'Onshore/Offshore',
                    value1Key: 'count-1',
                  },
                }),
              ),
            },
            {},
          ),
          smallCard({ onShoreOffShore: 'Onshore' })(
            'Onshore Wells',
            {
              pinConfig: configMerge(
                title('Onshore Wells'),
                mapTransform([{ col: 'count-1', formula: '1' }]),
                mapCardSumBy('count-1'),
                dataFilter({
                  eq: ['Onshore/Offshore', 'Onshore'],
                }),
              ),
            },
            {},
          ),
          smallCard({ onShoreOffShore: 'Offshore' })(
            'Offshore Wells',
            {
              pinConfig: configMerge(
                title('Offshore Wells'),
                mapTransform([{ col: 'count-1', formula: '1' }]),
                mapCardSumBy('count-1'),
                dataFilter({
                  eq: ['Onshore/Offshore', 'Offshore'],
                }),
              ),
            },
            {},
          ),
          drillPie(mc21Pie, 'count', '')(
            'Well Type',
            {
              drillPath: drillWell,
              pinConfig: configMerge(
                title('Well Type'),
                toolboxAndFilter,
                mapTransform([{ col: 'count-1', formula: '1' }]),
                drill(['Well Type', 'permitType', 'company', 'block']),
                pie({
                  map: {
                    split1By: 'Well Type',
                    value1Key: 'count-1',
                  },
                }),
              ),
            },
            {},
          ),
          smallCard({ wellType: 'horizontal' })(
            'Horizontal Wells',
            {
              pinConfig: configMerge(
                title('Horizontal Wells'),
                mapTransform([{ col: 'count-1', formula: '1' }]),
                mapCardSumBy('count-1'),
                dataFilter({
                  eq: ['Well Type', 'horizontal'],
                }),
              ),
            },
            {},
          ),
          smallCard({ wellType: 'vertical' })(
            'Vertical Wells',
            {
              pinConfig: configMerge(
                title('Vertical Wells'),
                mapTransform([{ col: 'count-1', formula: '1' }]),
                mapCardSumBy('count-1'),
                dataFilter({
                  eq: ['Well Type', 'vertical'],
                }),
              ),
            },
            {},
          ),
          smallCard({ wellType: 'deviated' })(
            'Deviated Wells',
            {
              pinConfig: configMerge(
                title('Deviated Wells'),
                mapTransform([{ col: 'count-1', formula: '1' }]),
                mapCardSumBy('count-1'),
                dataFilter({
                  eq: ['Well Type', 'deviated'],
                }),
              ),
            },
            {},
          ),
          drillPie(mc21Pie, 'count', '')(
            'Well Objective',
            {
              drillPath: drillObjective,
              pinConfig: configMerge(
                title('Well Type'),
                toolboxAndFilter,
                mapTransform([{ col: 'count-1', formula: '1' }]),
                drill(['Well Type', 'permitType', 'company', 'block']),
                pie({
                  map: {
                    split1By: 'Well Type',
                    value1Key: 'count-1',
                  },
                }),
              ),
            },
            {},
          ),
          // smallCard({ wellObjective: wellObjective2Text.oildevelopment })(
          //   "Oil Development Well",
          // ),
          // smallCard({ wellObjective: wellObjective2Text.oilexploration })(
          //   "Oil Exploration Well",
          // ),
          // smallCard({ wellObjective: wellObjective2Text.waterinjector })(
          //   "Water injector Well",
          // ),
          // smallCard({ wellObjective: wellObjective2Text.oilappraisal })(
          //   "Oil Appraisal Well",
          // ),
          // smallCard({ wellObjective: wellObjective2Text.gasdevelopment })(
          //   "Gas Development Well",
          // ),
          // smallCard({ wellObjective: wellObjective2Text.other })("other Well"),
          // smallCard({ wellObjective: wellObjective2Text.steaminjector })(
          //   "Steam Injector Well",
          // ),
          // smallCard({ wellObjective: wellObjective2Text.gasexploration })(
          //   "Gas Exploration Well",
          // ),
          // smallCard({ wellObjective: wellObjective2Text.gasappraisal })(
          //   "Gas Appraisal Well",
          // ),
          mc42Bar(query(eq('permitType', 'Drill')))(
            'AFE Drill cost',
            {
              pinConfig: aFECostPinconfig('AFE Drill cost'),
            },
            {},
          ),
          mc42Bar(query(eq('permitType', 'Suspend')))(
            'AFE Suspend cost',
            {
              pinConfig: aFECostPinconfig('AFE Suspend cost'),
            },
            {},
          ),
          mc42Bar(query(eq('permitType', 'Abandon')))(
            'AFE Abandon cost',
            {
              pinConfig: aFECostPinconfig('AFE Abandon cost'),
            },
            {},
          ),
          table({ columnsConfig })(
            'Permit Data',
            {
              pinConfig: configMerge(
                title('Permit Data'),
                pinTable({
                  setting: {
                    columns: pinColumnsConfig,
                    showSearchBar: true,
                  },
                }),
              ),
            },
            {
              exportFileName: 'permit-data',
            },
          ),
          mc42Map(
            creatorMaker({
              type: 'map',
              config: {
                mapName: 'permit map',
                mapDataConvert: mapDataCvtCreator({
                  blockField: 'block',
                  valueField: 'aFECost',
                }),
              },
            }),
            'Permits AFE Costs',
            {
              pinConfig: configMerge(filterByCompanyBlock, {
                type: 'GisMap',
                title: 'Permits AFE Costs',
                map: {
                  blockBy: 'block',
                  value1Key: 'AFE Cost, mm$',
                },
                filter: {
                  type: 'simple',
                  definition: [
                    {
                      type: 'check',
                      label: 'Type',
                      field: 'permitType',
                    },
                  ],
                },
              }),
            },
            {},
          ),
        ],
      },
    ],
  },
]

export default chartsPageCreator(chartsToDraw)
