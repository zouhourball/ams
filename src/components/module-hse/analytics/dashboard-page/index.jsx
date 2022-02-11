import { chartsPageCreator } from 'components/charts-page'
import monthlyStationCharts from './report-type/monthly-station'
import dailyCharts from './report-type/daily'
import annualForecast from './report-type/annual-forecast'

export const chartsToDraw = [
  {
    title: 'Monthly Stations Flaring',
    reportType: 'MONTHLY STATION',
    groups: [
      {
        title: 'Summary',
        layout: 'float',
        charts: monthlyStationCharts,
      },
    ],
  },
  {
    title: 'Daily Flaring',
    reportType: 'DAILY',
    groups: [
      {
        title: 'Summary',
        layout: 'float',
        charts: dailyCharts,
      },
    ],
  },
  {
    title: 'Annual Flaring Forecast',
    reportType: 'ANNUAL FORECAST',
    groups: [
      {
        title: 'Summary',
        layout: 'float',
        charts: annualForecast,
      },
    ],
  },
]

export default chartsPageCreator(chartsToDraw)
