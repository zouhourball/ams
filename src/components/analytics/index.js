import React, { Fragment } from 'react'
import createDashboard from './dashboard'
import createFilter from './filter'
import { CircularProgress } from 'react-md'
import TopBar from 'components/top-bar'
// import { createFilterSelectionDisplay } from './filter-selection-display'
import { connect } from 'react-redux'
import { setCurrentModule } from 'modules/analytics/actions'

export function createAnalytics (
  /* @type {createAnalytics} */ {
    moduleName,
    // Component which has a data props, <Dashboard data={FilteredData} />
    dashboardPage,
    // Component decorated by @filter
    filterSelection,
    // Filter Component
    filter,
    // A list component or a columnConfig of a DataTable
    list,
    dataPuller,
    // { dataConvertor:({filteredData,sourceData})=>[], ...props2map  }
    map = {},
  },
) {
  const Dashboard = createDashboard(
    moduleName,
    dashboardPage || (() => <div>Need a Compoent to show filteredData</div>),
  )
  // const DashboardFilterComp =
  //   filter && (filter instanceof React.Component || isFunction(filter))
  //     ? filter
  //     : createFilter(moduleName, filter)
  const DashboardFilterComp =
    filter && filter.displayName ? filter : createFilter(moduleName, filter)
  @connect(null, { setCurrentModule })
  class Analytics extends React.PureComponent {
    state = {
      pulledData: null,
    }
    constructor (props, ...args) {
      super(props, ...args)
      props.setCurrentModule(moduleName)
    }

    componentDidMount = async () => {
      // const { match } = this.props
      // const { params } = match
      if (dataPuller) {
        const pulledData = await dataPuller()
        this.setState({ pulledData })
      }
    }

    render () {
      let data = this.props.data || this.state.pulledData

      // const { match } = this.props
      // const { params } = match
      return (
        <Fragment>
          <TopBar
            title={`${moduleName} Reporting(Analytics)`}
            actions={null}
            currentView={'dashboard'}
          />
          {data ? (
            <div className="dashboard-container">
              <Dashboard filter={<DashboardFilterComp data={data} />} />
            </div>
          ) : (
            <CircularProgress id={`${moduleName}-analytics-loading`} />
          )}
        </Fragment>
      )
    }
  }
  return Analytics
}
