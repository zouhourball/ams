import React from 'react'
import { filter } from 'components/analytics/hoc/filter'
import ChartsPage from 'components/charts-page'
import { get } from 'lodash-es'
import product from 'immer'

export function createExtTitledChartsPage (chartsConfig, { moduleName }) {
  @filter(moduleName)
  class ExtTitledChartsPage extends React.PureComponent {
    state = {
      chartsConfig: this.updateChartsConfig(chartsConfig),
    }
    updateChartsConfig (chartsConfig, props) {
      const { filters } = props || this.props
      return product(chartsConfig, (old) => {
        ;(old || []).forEach((cat) => {
          if (cat.showInTitle) {
            let vals = cat.showInTitle
              .map((p) => get(filters, p))
              .filter((i) => i)
              .map(cat.titleFormat || ((i) => i))
            if (vals.length) {
              cat.subTitle = `${vals.join(cat.titleSeparator || ' - ')}`
            } else {
              cat.subTitle = ''
            }
          }
        })
      })
    }

    // eslint-disable-next-line camelcase
    UNSAFE_componentWillReceiveProps (newProps) {
      if (newProps.chartsConfig !== this.props.chartsConfig) {
        this.setState({
          chartsConfig: this.updateChartsConfig(newProps.chartsConfig),
        })
      } else if (newProps.filters !== this.props.filters) {
        this.setState({
          chartsConfig: this.updateChartsConfig(
            this.state.chartsConfig,
            newProps,
          ),
        })
      }
    }

    render () {
      const { chartsConfig } = this.state
      return <ChartsPage {...this.props} chartsConfig={chartsConfig} />
    }
  }
  return ExtTitledChartsPage
}
