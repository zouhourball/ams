import { PureComponent, Fragment } from 'react'
import { Button } from 'react-md'
import PT from 'prop-types'
import Dialog from 'components/dialog'
import NormalFilter from '../normal-filter'
import SettingIcon from 'mdi-react/CogOutlineIcon'
import { dateRangeModules, hideDateRangeRePortType } from 'libs/consts'
import { extractUniqValue, mapMonthNameToNumber } from 'libs/utils'
import { groupBy, get, intersection } from 'lodash-es'
import './styles.scss'
import { OrgBlockPicker } from 'components/dashboard/org-block-picker'
import Picker from 'components/date-picker'

const DatePicker = ({ startDate, endDate, updateDateRange }) => {
  return (
    <Button
      // onClick={toggle}
      className="ams-analytics-filter-daterange-btn"
    >
      {/* <CalenderIcon /> */}
      <Picker
        startDate={startDate}
        endDate={endDate}
        updateDateRange={updateDateRange}
      ></Picker>
    </Button>
  )
}
export default class Filter extends PureComponent {
  static propTypes = {
    filters: PT.shape({
      reportType: PT.string,
    }),
    sharedFilter: PT.shape({
      companies: PT.shape({
        // [name]:{selectedBlocks}
      }),
    }),
    config: PT.array,
    // (field,value)
    updateFilter: PT.func,
    updateFilters: PT.func,
    data: PT.oneOfType([
      PT.arrayOf(
        PT.shape({
          company: PT.string,
          block: PT.string,
        }),
      ),
      PT.object,
    ]),
    // {data,config,filters} => data
    filter: PT.func,
  }

  state = {
    showOtherFilter: false,
  }

  getFilterSections () {
    let { data, config, filters, sharedFilters, moduleName } = this.props
    let { reportType } = filters
    const data4Report = data[reportType]
    return config
      .filter(
        (c) =>
          !c.validForReportType || c.validForReportType.includes(reportType),
      )
      .map((c) => {
        if (c.type === 'radio' || c.type === 'select' || c.type === 'check') {
          let data = c.data || extractUniqValue(data4Report, c.field)
          if (c.field === 'month') {
            data.sort(
              (a, b) =>
                mapMonthNameToNumber(a.toUpperCase()) -
                mapMonthNameToNumber(b.toUpperCase()),
            )
          }
          return {
            ...c,
            value:
              get(sharedFilters, `${moduleName}-${reportType}`, {})[c.field] ||
              filters[c.field] ||
              [],
            data,
          }
        }
        return {
          ...c,
          value:
            get(sharedFilters, `${moduleName}-${reportType}`, {})[c.field] ||
            filters[c.field] ||
            [],
        }
      })
  }

  filtersValue_ = {}

  handleFilterChange = (section, value) => {
    const {
      updateFilters,
      filters: { reportType },
      updateSharedFilter,
      moduleName,
      sharedFilters,
    } = this.props
    updateFilters({
      [section.field]: value,
    })
    updateSharedFilter({
      [`${moduleName}-${reportType}`]: {
        ...get(sharedFilters, `${moduleName}-${reportType}`, {}),
        [section.field]: value,
      },
    })
  }
  handleApplyFilter = () => {
    this.setState({
      showOtherFilter: false,
    })
  }

  hideNormalFilter = () => {
    this.setState({
      showOtherFilter: false,
    })
  }

  updateFilteredData = () => {
    const {
      filter,
      sharedFilters,
      data,
      config,
      filters: { reportType },
      filters,
      setFilteredData,
      moduleName,
    } = this.props

    setFilteredData(
      filter({
        data,
        sharedFilters,
        config,
        filters: get(sharedFilters, `${moduleName}-${reportType}`)
          ? {
            reportType,
            ...get(sharedFilters, `${moduleName}-${reportType}`),
          }
          : filters,
      }),
    )
  }

  getCompanies ({ filters, sharedFilters, data }) {
    const { reportType } = filters
    const groupedData = groupBy(data[reportType], 'company')
    return Object.keys(groupedData).map((c) => {
      const blocks = extractUniqValue(groupedData[c], 'block')
      const selectedBlocks = get(
        sharedFilters,
        ['companies', c, 'selectedBlocks'],
        [],
      )
      return {
        name: c,
        /**
         * selectedBlocks are shared filter, so there may other blocks
         */
        selectedBlocks: intersection(blocks, selectedBlocks),
        blocks,
      }
    })
  }
  handleCompanyChange = (data) => {
    const { updateCompany } = this.props
    updateCompany(data)
  }
  showFilter = () => {
    this.setState({
      showOtherFilter: true,
    })
  }

  componentDidUpdate (preProps) {
    if (
      preProps.sharedFilters !== this.props.sharedFilters ||
      preProps.filters !== this.props.filters ||
      preProps.data !== this.props.data ||
      preProps.config !== this.props.config
    ) {
      this.updateFilteredData()
    }
  }

  componentDidMount () {
    this.updateFilteredData()
  }

  isFilterBtnVisible = () => {
    const { filters, config } = this.props
    return (
      config &&
      config.some(
        (i) =>
          !i.validForReportType ||
          i.validForReportType.includes(filters.reportType),
      )
    )
  }
  hasDatePicker = () => {
    const { moduleName, filters } = this.props
    const haveDateRange = dateRangeModules.includes(moduleName)
    const haveDateRange2 = !hideDateRangeRePortType.includes(
      get(filters, `reportType`),
      '',
    )
    return haveDateRange && haveDateRange2
  }

  updateDateRange = (e) => {
    this.props.updateSharedFilter({
      dateRange: {
        startDate: e.startDate,
        endDate: e.endDate,
      },
    })
  }

  render () {
    return (
      <Fragment>
        <OrgBlockPicker
          onChange={this.handleCompanyChange}
          orgs={this.getCompanies(this.props)}
        />
        <div className="ams-analytics-filter-container">
          {this.hasDatePicker() && (
            <DatePicker
              startDate={get(this.props, 'sharedFilters.dateRange.startDate')}
              endDate={get(this.props, 'sharedFilters.dateRange.endDate')}
              updateDateRange={this.updateDateRange}
            />
          )}
          {this.isFilterBtnVisible() && (
            <Button
              onClick={this.showFilter}
              className="ams-analytics-filter-btn"
            >
              <SettingIcon />
            </Button>
          )}
        </div>
        {this.state.showOtherFilter && (
          <Dialog
            id="filter dialog"
            className="ams-analytics-filter-dialog"
            title={'Apply Filter'}
            onHide={this.hideNormalFilter}
            width={400}
            actions={[
              <Button key="discard" flat onClick={this.hideNormalFilter}>
                {'discard'}
              </Button>,
              <Button key="apply" flat primary onClick={this.handleApplyFilter}>
                {'apply'}
              </Button>,
            ]}
            visible
          >
            <NormalFilter
              sections={this.getFilterSections()}
              onChange={this.handleFilterChange}
            />
          </Dialog>
        )}
      </Fragment>
    )
  }
}
