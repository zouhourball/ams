import React from 'react'
import { Card } from 'react-md'
import PanelSelect from 'components/data-filter/panel-select'
import Section from 'components/data-filter/section'
import PanelSingleSelect from 'components/data-filter/panel-single-select'
import { extractUniqValue } from 'libs/utils'
import { filterData } from 'libs/utils/filter'
import 'components/data-filter/styles.scss'
import { filter } from 'components/analytics/hoc/filter'
import DateRange from 'components/date-range'
import { dayUnit, MonthNames } from 'libs/consts'
import './styles.scss'

@filter('production')
export default class DashboardFilter extends React.Component {
  constructor (props) {
    super(props)

    const { data, filters } = props
    const useData = data.daily

    const validData = filterData(useData, [
      {
        attr: 'company',
        value: Object.keys(filters['company'] || {}),
      },
    ])

    this.state = {
      data: useData,
      companyArray: extractUniqValue(useData, 'company'),
      blockArray: extractUniqValue(validData, 'block'),
      yearArray: extractUniqValue(useData, 'year'),
    }
  }
  handleRangeChange = (startDate, endDate) => {}

  getFilteredData = (newFilters) => {
    const reportType = newFilters['reportType']
    const filterConfig = ['company', 'block']
      .concat(reportType === 'monthly' ? 'year' : [])
      .map((key) => ({
        attr: key,
        value: Object.keys(newFilters[key] || {}).map(
          key === 'year' ? Number : (i) => i,
        ),
      }))
    const { startDate, endDate } = newFilters['date'] || {}

    const dateFilter = {
      attr: 'date',
      value: 0,
    }

    const dStartDate = Math.floor(startDate / dayUnit)
    const dEndDate = Math.floor(endDate / dayUnit)
    return filterData(
      this.state.data,
      [...filterConfig].concat(reportType === 'daily' ? dateFilter : []),
      (filterValue, value, attr) => {
        if (attr === 'date') {
          const day = Math.floor(value / dayUnit)
          return day <= dEndDate && day >= dStartDate
        }

        return !value || filterValue === value
      },
    )
  }

  onFilterUpdate = (name, data) => {
    const { updateFilter } = this.props
    if (name) {
      updateFilter(name, data)
    }
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps (newProps) {
    const { setFilteredData, data } = this.props
    const { filters } = newProps

    if (this.props.filters !== filters) {
      const useData = data[filters.reportType || 'daily']

      setFilteredData(this.getFilteredData(filters))
      const validData = filterData(useData, [
        {
          attr: 'company',
          value: Object.keys(filters['company'] || {}),
        },
      ])

      this.setState({
        data: useData,
        companyArray: extractUniqValue(useData, 'company'),
        blockArray: extractUniqValue(validData, 'block'),
        yearArray: extractUniqValue(useData, 'year'),
        monthArray: MonthNames,
      })
    }
  }

  render () {
    const { filters } = this.props
    const { reportType } = filters
    const { blockArray, companyArray, yearArray, monthArray } = this.state

    return (
      <Card className="ams-production-data-filter-dashboard">
        <Section title="Report Type" logo="filter_list">
          <PanelSingleSelect
            name="Report Type"
            items={[
              { name: 'Daily', value: 'daily' },
              { name: 'Monthly', value: 'monthly' },
            ]}
            value={filters['reportType'] || 'daily'}
            onUpdate={(d) => {
              this.onFilterUpdate('reportType', d)
              this.onFilterUpdate('year', [])
              this.onFilterUpdate('date', {})
            }}
          />
        </Section>
        {reportType === 'daily' ? (
          <Section title="Date Range">
            <DateRange
              startDate={(filters['date'] || {}).startDate}
              endDate={(filters['date'] || {}).endDate}
              dateFormat="MM/DD/YYYY"
              onRangeChange={(startDate, endDate) => {
                this.onFilterUpdate('date', {
                  startDate: startDate.getTime(),
                  endDate: endDate.getTime(),
                })
              }}
            />
          </Section>
        ) : (
          <Section title="Year">
            <PanelSelect
              items={yearArray.map((i) => ({
                name: i,
                value: i,
              }))}
              checkedItems={filters['year']}
              onUpdate={(d) => {
                this.onFilterUpdate('year', d)
              }}
            />
          </Section>
        )}
        {reportType === 'month' && (
          <Section title="Month">
            <PanelSelect
              items={monthArray.map((i) => ({
                name: i,
                value: i,
              }))}
              checkedItems={filters['month']}
              onUpdate={(d) => {
                this.onFilterUpdate('month', d)
              }}
            />
          </Section>
        )}
        <Section title="Company" logo="filter_list">
          <PanelSelect
            items={companyArray.map((i) => ({
              name: i,
              value: i,
            }))}
            checkedItems={filters['company']}
            onUpdate={(d) => {
              this.onFilterUpdate('company', d)
            }}
          />
        </Section>
        <Section title="Block">
          <PanelSelect
            items={blockArray.map((i) => ({
              name: i,
              value: i,
            }))}
            checkedItems={filters['block']}
            onUpdate={(d) => {
              this.onFilterUpdate('block', d)
            }}
          />
        </Section>
      </Card>
    )
  }
}
