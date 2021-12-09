import { PureComponent, Fragment } from 'react'
import { Button } from 'react-md'

import './chart-breadcrumbs.scss'

export default class ChartBreadCrumbs extends PureComponent {
  renderCrumbs () {
    const { crumbs, setDrillLevel } = this.props

    return (
      <Fragment>
        {crumbs.map((crumb, crumbIndex) => (
          <Fragment key={crumbIndex}>
            <Button
              flat
              onClick={() => {
                if (crumbIndex !== crumbs.length - 1 && setDrillLevel) {
                  setDrillLevel(crumbIndex)
                }
              }}
            >
              {crumb.title || crumb.name}
            </Button>
            {crumbIndex !== crumbs.length - 1 && (
              <span className="ams-chart-breadcrumbs-separator">&gt;</span>
            )}
          </Fragment>
        ))}
      </Fragment>
    )
  }

  render () {
    const { crumbs } = this.props

    return (
      <div className="ams-chart-breadcrumbs">
        {crumbs.length > 1 ? (
          this.renderCrumbs()
        ) : (
          <p className="ams-chart-breadcrumbs-description">
            Click on the chart to get more details
          </p>
        )}
      </div>
    )
  }
}
