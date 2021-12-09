import { createAnalytics } from 'components/analytics'
import createFilter from 'components/analytics/filter'
import { getReservesData } from 'libs/api/api-dashboard'
import {
  processAnnualResData,
  processFYFData,
  processReservesData,
} from './processors'
import Charts from './charts'

const reservesFilters = [
  {
    type: 'check',
    label: 'check',
    field: 'year',
  },
  {
    type: 'check',
    label: 'Hydrocarbon Type',
    field: 'hydrocarbonType',
    validForReportType: ['annual-resource'],
  },
  {
    type: 'check',
    label: 'Cluster',
    field: 'cluster',
    filterBy: 'block',
    validForReportType: ['annual-resource'],
  },
  {
    type: 'check',
    label: 'Field',
    field: 'field',
    filterBy: 'block',
    validForReportType: ['annual-resource'],
  },
  {
    type: 'check',
    label: 'Group',
    field: 'group',
    filterBy: 'block',
    validForReportType: ['annual-resource'],
  },
  {
    type: 'check',
    label: 'Formation',
    field: 'formation',
    filterBy: 'block',
    validForReportType: ['annual-resource'],
  },
  {
    type: 'check',
    label: 'Member',
    field: 'member',
    filterBy: 'block',
    validForReportType: ['annual-resource'],
  },
]
export default createAnalytics({
  moduleName: 'reserves',
  filter: createFilter('reserves', {
    config: reservesFilters,
  }),
  list: [
    {
      name: 'company',
      dataKey: 'company',
      width: 150,
    },
    {
      name: 'block',
      dataKey: 'block',
      width: 150,
    },
    {
      name: 'field',
      dataKey: 'field',
      width: 150,
    },
    {
      name: 'Year',
      dataKey: 'Year',
      width: 70,
    },
    {
      name: 'reservesReportType',
      dataKey: 'reservesReportType',
      width: 250,
    },
    {
      name: 'hydrocarbonType',
      dataKey: 'hydrocarbonType',
      width: 250,
    },
    {
      name: 'item',
      dataKey: 'item',
      width: 450,
    },
    {
      name: 'unit',
      dataKey: 'unit',
      width: 120,
    },
    {
      name: 'value',
      dataKey: 'value',
      width: 120,
    },
  ],
  dashboardPage: Charts,
  dataPuller: async (params = {}) => {
    return {
      reserves: processReservesData({
        content: await getReservesData('annual', params.id),
      }),
      'annual-resource': processAnnualResData({
        content: await getReservesData('annualResource', params.id),
      }),
      'H & F': processFYFData({
        content: await getReservesData('fyf', params.id),
      }),
    }
  },
})
