import { createDualAxisChartCreator } from 'components/analytics/utils'
import { query, eq } from 'libs/utils/query'

export const createQTvsVariCreator = createDualAxisChartCreator({
  rotateLabel: true,
  sliceBy: 'formCompany',
  confL: {
    name: 'Quota(MT)',
    dataKey: 'value',
    unit: 'Quota(MT)',
    filterBy: query(eq('type', 'quota')),
  },
  confR: {
    name: 'Variance(MT)',
    dataKey: 'value',
    unit: 'Variance(MT)',
    filterBy: query(eq('type', 'variance')),
  },
})

export const createTLvsVariCreator = createDualAxisChartCreator({
  rotateLabel: true,
  sliceBy: 'formCompany',
  confL: {
    name: 'Total Lifted(MT)',
    dataKey: 'value',
    unit: 'MT',
    filterBy: query(eq('type', 'totalLifted')),
  },
  confR: {
    name: 'Variance(MT)',
    dataKey: 'value',
    unit: '',
    filterBy: query(eq('type', 'variance')),
  },
})
