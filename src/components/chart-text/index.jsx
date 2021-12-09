import { PureComponent } from 'react'
import { COLOR_MAP } from 'libs/consts'
import { isArray } from 'lodash-es'
import './styles.scss'

export default class ChartText extends PureComponent {
  render () {
    const { detail, unit, ...rest } = this.props
    return (
      <div className="ams-charttext-container" {...rest}>
        {Object.keys(detail).map((key, i) => (
          <div className="ams-charttext-item" key={key}>
            <span
              className="ams-charttext-field ams-charttext-name"
              style={{
                color: COLOR_MAP[(key || '').toLowerCase()],
              }}
            >
              {key}
            </span>
            <span className="ams-charttext-field ams-charttext-value">
              {(detail[key].toFixed
                ? Number(detail[key])
                : detail[key]
              ).toLocaleString()}
            </span>
            <span className="ams-charttext-field ams-charttext-unit">
              {isArray(unit) ? unit[i] : unit}
            </span>
          </div>
        ))}
      </div>
    )
  }
}
