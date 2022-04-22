import echarts from 'echarts/lib/echarts'
import ToolboxView from 'echarts/lib/component/toolbox/ToolboxView'

import 'echarts/lib/component/toolbox/feature/SaveAsImage'
import 'echarts/lib/component/toolbox/feature/Restore'
import 'echarts/lib/component/toolbox/feature/Brush'
// import "echarts/lib/component/toolbox/feature/DataView"
import './data-view'
import 'echarts/lib/component/toolbox/feature/DataZoom'
import 'echarts/lib/component/toolbox/feature/MagicType'

echarts.extendComponentView({
  type: 'toolbox',
  render (...args) {
    ToolboxView.prototype.render.call(this, ...args)
    // hide toolbox items because we render it by react
    this.group.hide()
  },
})
