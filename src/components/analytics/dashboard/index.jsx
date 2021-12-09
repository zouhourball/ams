import React from 'react'
import './styles.scss'
import { connect } from 'react-redux'
import { analyticsConnect } from '../utils/connect'
import { updateCompanyBlockMap } from 'libs/data/company-block'
import { get, findIndex } from 'lodash-es'
import {
  resetFilters,
  updateReportTypeForCurrentModule,
  updateValidFilter,
} from 'modules/analytics/actions'
import NavBar from 'components/nav-bar'
import { selectCategory } from 'modules/dashboard/actions'
import { getValidFilterKeys } from 'libs/utils/process-filter'

export default function createDashboardAnalytics (moduleName, Page) {
  // const FilterSelection = createFilterSelectionDisplay(moduleName)
  @connect(
    ({ query, dashboard }) => ({
      apps: get(query.DEFAULT, 'getInfosUser.data.apps'),
      categories: dashboard.categories,
      selectedCategory: dashboard.selectedCategory,
    }),
    {
      resetFilters,
      updateReportTypeForCurrentModule,
      selectCategory,
      updateValidFilter,
    },
  )
  @analyticsConnect(moduleName, ({ commonAnalytics }) => ({
    filteredData: commonAnalytics[moduleName].filteredData,
    filters: commonAnalytics[moduleName].filters,
  }))
  class DashboardAnalytics extends React.Component {
    constructor (props) {
      super(props)

      this.updateCTBMap(props)
    }

    extractAppInfo (props) {
      const { apps } = props || this.props
      return apps
        ? apps.find((app) => app.appName.toLowerCase().indexOf(moduleName) >= 0)
        : {}
    }

    updateCTBMap (props) {
      updateCompanyBlockMap(this.extractAppInfo(props).companies)
    }

    // eslint-disable-next-line camelcase
    UNSAFE_componentWillReceiveProps (nextProps) {
      const { apps } = nextProps
      if (apps !== this.props.apps) {
        this.updateCTBMap(nextProps)
      }
    }

    setActiveTab = (index) => {
      const {
        updateReportTypeForCurrentModule,
        selectCategory,
        categories,
        updateValidFilter,
      } = this.props
      selectCategory(categories[index])
      updateReportTypeForCurrentModule(categories[index].reportType)
      updateValidFilter(
        moduleName,
        getValidFilterKeys(categories[index].reportType),
      )
    }

    render () {
      const { filteredData, filter, filters, categories, selectedCategory } =
        this.props
      return (
        <div className="ams-dashboard-analytics-tabs">
          <div className="dashboard-nav">
            <NavBar
              tabsList={categories.map((c) => c.title)}
              activeTab={findIndex(
                categories,
                (i) => i.title === selectedCategory.title,
              )}
              setActiveTab={this.setActiveTab}
            />
          </div>
          {filter}
          {Page && (
            <Page
              data={filteredData || []}
              filters={filters}
              appInfo={this.extractAppInfo()}
            />
          )}
        </div>
      )
    }
  }
  return DashboardAnalytics
}
