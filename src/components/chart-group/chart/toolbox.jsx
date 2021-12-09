import React from 'react'
import { cls } from 'reactutils'
import { uniqBy } from 'lodash-es'
import FontIcon from 'react-md/lib/FontIcons'
import echartsBridge from './echarts-bridge.js'
import { Card } from 'react-md'

const iconCollection = {
  myPin: 'mdi-pin',
  myRestore: 'mdi-update',
  dataView: 'mdi-border-all',
  saveAsImage: 'mdi-file-import',
}

export default class Toolbox extends React.PureComponent {
  render () {
    const { chart, btnDefs } = this.props
    let chartBtns = chart
      ? echartsBridge.getFeatures(chart).map((i) => ({ name: i }))
      : []
    chartBtns = btnDefs ? uniqBy([...chartBtns, ...btnDefs], 'name') : chartBtns
    return (
      <Card className="ams-chartgroupchart-toolbox">
        {chartBtns.map((def, k) => (
          <FontIcon
            key={k}
            iconClassName={cls(
              'mdi',
              'ams-chartgroupchart-toolbox-item',
              def.icon || iconCollection[def.name],
            )}
            onClick={() =>
              def.onClick
                ? def.onClick()
                : echartsBridge.click(chart, def.name, def.type)
            }
          />
        ))}
      </Card>
    )
  }
}
