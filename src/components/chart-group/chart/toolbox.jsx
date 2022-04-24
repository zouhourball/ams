import React from 'react'
import { cls } from 'reactutils'
import { uniqBy, flatten } from 'lodash-es'
import FontIcon from 'react-md/lib/FontIcons'
import { Card } from 'react-md'

const iconCollection = {
  myPin: 'mdi-pin',
  myRestore: 'mdi-update',
  SaveDataView: 'mdi-import',
  dataView: 'mdi-border-all',
  saveAsImage: 'mdi-file-import',
}

function applyToolBoxItemClick (chart, name) {
  const toolbox = chart.getModel().getComponent('toolbox')
  const api = toolbox.ecModel.scheduler.api
  const toolboxView = api.getViewOfComponentModel(toolbox)
  const feature = toolboxView._features[name]
  feature.onclick(feature.model.ecModel, api)
}
function getFeatures (ecInstance) {
  const opt = ecInstance.getOption()

  return flatten(
    (opt.toolbox || []).reduce((r, e) => {
      if (e.feature) {
        r.push(Object.keys(e.feature).filter((f) => e.feature[f].show))
      }
      return r
    }, []),
  )
}

export default class Toolbox extends React.PureComponent {
  render () {
    const { chart, btnDefs } = this.props
    let chartBtns = chart ? getFeatures(chart).map((i) => ({ name: i })) : []
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
                : applyToolBoxItemClick(chart, def.name)
            }
          />
        ))}
      </Card>
    )
  }
}
