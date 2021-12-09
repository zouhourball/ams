import React from 'react'
import { analyticsConnect } from '../utils/connect'
import * as act from 'modules/analytics/actions'
export function filter (moduleName) {
  return (Comp) => {
    @analyticsConnect(
      moduleName,
      ({ commonAnalytics }) => ({
        filters: commonAnalytics[moduleName].filters,
        sharedFilters: commonAnalytics.sharedFilters,
      }),
      {
        updateFilter: act.updateFilterFactory(moduleName),
        updateCompany: act.updateCompany,
        updateFilters: act.updateFiltersFactory(moduleName),
        setFilteredData: act.setFilteredDataFactory(moduleName),
        updateSharedFilter: act.updateSharedFilter,
      },
    )
    class Filter extends React.PureComponent {
      static displayName = `Filter of ${moduleName}`
      render () {
        return <Comp moduleName={moduleName} {...this.props} />
      }
    }
    return Filter
  }
}
export function data ({ moduleName, filterField, filteredDataField }) {
  return (Comp) => {
    @analyticsConnect(moduleName, ({ commonAnalytics }) => ({
      [filterField || 'filters']:
        commonAnalytics[moduleName].filter ||
        commonAnalytics[moduleName].filters,
      [filteredDataField || 'filteredData']:
        commonAnalytics[moduleName].filteredData,
    }))
    class Data extends React.PureComponent {
      static displayName = `FilterData of ${moduleName}`
      render () {
        return <Comp {...this.props} />
      }
    }
    return Data
  }
}
