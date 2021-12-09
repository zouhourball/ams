import DataView from 'echarts/lib/component/toolbox/feature/DataView'
import featureManager from 'echarts/lib/component/toolbox/featureManager'

class DataViewBridge extends DataView {
  show = false
  // eslint-disable-next-line no-useless-constructor
  constructor (model) {
    super(model)
  }
  onclick (ecModel, api) {
    if (this.show) {
      // api.getDom().removeChild(super._dom)
      super.remove(ecModel, api)
      this._dom = null

      this.show = false
    } else {
      super.onclick(ecModel, api)
      this.show = true
    }
  }
}
featureManager.register('dataView', DataViewBridge)
export default DataViewBridge
