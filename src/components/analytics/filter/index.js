import React from 'react'
import Filter from './filter'
import { filter as fitlerFn } from './utils'

import { filter } from 'components/analytics/hoc/filter'
import './style.scss'

export default function createFilter (moduleName, { config, props } = {}) {
  @filter(moduleName)
  class SFilter extends React.PureComponent {
    render () {
      const { filters, data } = this.props
      return (
        <Filter
          className="ams-simple-data-filter-dashboard"
          config={config}
          filter={fitlerFn}
          {...props}
          {...this.props}
          // for compatibility
          {...(filters.reportType == null
            ? {
              data: { report: data },
              filters: {
                ...filters,
                reportType: 'report',
              },
            }
            : {})}
        />
      )
    }
  }
  return SFilter
}
