import echarts from 'echarts/lib/echarts'
import ToolboxView from 'echarts/lib/component/toolbox/ToolboxView'
import { flatten } from 'lodash-es'

import 'echarts/lib/component/toolbox/feature/SaveAsImage'
import 'echarts/lib/component/toolbox/feature/Restore'
import 'echarts/lib/component/toolbox/feature/Brush'
// import "echarts/lib/component/toolbox/feature/DataView"
import './data-view-bridge'
import 'echarts/lib/component/toolbox/feature/DataZoom'
import 'echarts/lib/component/toolbox/feature/MagicType'
class ToolBoxBridge extends ToolboxView {
  ecModels = []
  models = 0
  disposed = 0
  render (toolboxModel, ecModel, api, payload) {
    let savedModel = this.getEcModle_(ecModel)
    let features = {}
    if (!savedModel) {
      savedModel = [ecModel, { api, features }]
      this.ecModels.push(savedModel)
    } else {
      features = savedModel[1].features
    }
    this._featureNames = Object.keys(features)
    this._features = features
    super.render(toolboxModel, ecModel, api, payload)
  }
  dispose (ecInstance) {
    const model = ecInstance.getModel()
    const idx = this.ecModels.findIndex((e) => e[0] === model)
    if (idx > -1) {
      this.disposed++
      this.ecModels[idx] = 0
      if (this.disposed / this.ecModels.length > 0.5) {
        this.ecModels = this.ecModels.filter((e) => e)
        this.disposed = 0
      }
    }
  }
  getFeatures (ecInstance) {
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
  getEcModle_ (ecModel) {
    return this.ecModels.find((e) => e[0] === ecModel)
  }
  click_ (ecInstance, name, iconName) {
    let savedModel = this.getEcModle_(ecInstance.getModel())
    if (savedModel) {
      let ecModel = savedModel[0]
      let { api, features } = savedModel[1]
      let fn = features[name]
      if (fn) {
        // eslint-disable-next-line
        fn.onclick.call(fn, ecModel, api, iconName)
      }
    }
  }
  click (ecInstance, name, iconName) {
    // hack saveAsImage
    if (name === 'saveAsImage') {
      let op = ecInstance.getOption()
      let old = (op.title || []).map((t) => {
        let v = t.show
        t.show = true
        return v
      })
      ecInstance.setOption(op)

      setTimeout(() => {
        this.click_(ecInstance, name, iconName)
        old.forEach((v, i) => {
          ;(op.title[i] || {}).show = v
        })
        ecInstance.setOption({
          ...op,
        })
      }, 0)
    } else {
      this.click_(ecInstance, name, iconName)
    }
  }
  magicType (ecInstance, type) {
    this.click(ecInstance, 'magicType', type)
  }
  dataView (ecInstance) {
    this.click(ecInstance, 'dataView')
  }
  dataZoom (ecInstance) {
    this.click(ecInstance, 'dataZoom', 'zoom')
  }
  dataZoomBack (ecInstance) {
    this.click(ecInstance, 'dataZoom', 'back')
  }
  restore (ecInstance) {
    this.click(ecInstance, 'restore')
  }
  saveAsImage (ecInstance) {
    this.click(ecInstance, 'saveAsImage')
  }
}
const bridge = new ToolBoxBridge()

echarts.extendComponentView({
  type: 'toolbox',
  render (...args) {
    bridge.render(...args)
  },
})

export default bridge
