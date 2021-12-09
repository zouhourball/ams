import React from 'react'
import DataFilterSelectionDisplay from 'components/data-filter-selection-display'
import { analyticsConnect } from '../utils/connect'
import { cloneDeep, set } from 'lodash-es'
import * as act from 'modules/analytics/actions'

export function createFilterSelectionDisplay (moduleName) {
  @analyticsConnect(
    moduleName,
    ({ commonAnalytics }) => ({
      filters: commonAnalytics[moduleName].filters,
    }),
    {
      updateFilter: act.updateFilterFactory(moduleName),
    },
  )
  class ExampleDataFilterSelectionDisplay extends React.PureComponent {
    onClearClicked = ({ category, value }) => {
      const { filters, updateFilter } = this.props
      let newData = cloneDeep(filters)

      switch (category) {
        case 'QuantityMin':
        case 'QuantityMax':
          delete newData[category]
          break
        default:
          value.forEach((p) => set(newData[category], p))
      }

      updateFilter(category, newData[category])
    }

    render () {
      const { filters } = this.props

      return (
        <DataFilterSelectionDisplay
          filterData={filters}
          onClearClicked={this.onClearClicked}
        />
      )
    }
  }
  return ExampleDataFilterSelectionDisplay
}
