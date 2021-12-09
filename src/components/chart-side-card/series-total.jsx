import React from 'react'
import cls from 'classnames'
import humanize from 'humanize-plus'

import './styles.scss'

export default class ChatSideCart extends React.PureComponent {
  render () {
    const {
      option: { series, legengdSelected },
      echartOption,
    } = this.props
    return (
      <div className="chart-side-card-container">
        {series.map((i, index) => {
          const color = echartOption ? `${echartOption.color[index]}` : 'black'
          const value = i.data.reduce((prev, curr) => prev + curr, 0)
          return (
            <div
              key={i.name}
              className={cls(
                'chart-side-card-item',
                !legengdSelected || legengdSelected.selected[i.name]
                  ? 'chart-side-card-item-visible'
                  : 'chart-side-card-item-hidden',
              )}
              style={{ borderColor: color }}
            >
              <div className="chart-side-card-value">
                {humanize.formatNumber(value, 2)}
              </div>
              <div className="chart-side-card-item-text">
                <a href="javascript: 0" title={i.name} style={{ color }}>
                  {i.name}
                </a>
              </div>
              <div style={{ color }}>{humanize.compactInteger(value)}</div>
            </div>
          )
        })}
      </div>
    )
  }
}
