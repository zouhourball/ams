import DataView from 'echarts/lib/component/toolbox/feature/DataView'
import Model from 'echarts/lib/model/Model'
import featureManager from 'echarts/lib/component/toolbox/featureManager'
import { downloadFromBlob } from 'libs/utils/download-blob'

class DataViewBridge extends DataView {
  showing = false
  // eslint-disable-next-line no-useless-constructor
  constructor (...args) {
    super(...args)
  }

  onclick_ (ecModel, api) {
    if (this.showing) {
      super.remove(ecModel, api)
      this._dom = null
    } else {
      if (this._dom?.parentElement == null) {
        this._dom = null
      }
      super.onclick(ecModel, api)
    }
    this.showing = !this.showing
  }
  onclick (ecModel, api) {
    this.onclick_(ecModel, api)
  }
  toggle (model, api) {
    this.onclick_(model, api)
  }
  showDataView (model, api) {
    if (!this.showing) {
      this.toggle(model, api)
    }
  }
  hideDateView (ecModel, api) {
    if (this.showing) {
      this.toggle(ecModel, api)
    }
  }
}

class ExportDataView extends DataViewBridge {
  modal_ = null
  constructor (featureModel, ecModel, api) {
    const toolboxModal = featureModel.parentModel
    const featureOpts = toolboxModal.get('feature') || {}
    const model = new Model(
      featureOpts['dataView'],
      toolboxModal,
      toolboxModal.ecModel,
    )
    super(model, ecModel, api)
  }
  onclick (model, api) {
    const toolboxModal = this.model.parentModel
    const featureOpts = toolboxModal.get('feature') || {}
    this.model = new Model(
      featureOpts['dataView'],
      toolboxModal,
      toolboxModal.ecModel,
    )
    super.showDataView(model, api)
    this.exportFromTable(api.getDom())
    super.hideDateView(model, api)
  }

  getFileName () {
    const toolboxModal = this.model.parentModel
    const featureOpts = toolboxModal.get('feature') || {}
    return (
      featureOpts['SaveDataView']?.name ||
      featureOpts['saveAsImage']?.name ||
      'data'
    )
  }
  exportFromTable (dom) {
    downloadFromBlob(
      new Blob(
        [
          `<html>
        <head>
          <meta charset="UTF-8">
          <title>Data view</title>
        </head>
        <body>
          ${dom.outerHTML}
        </body>
      </html>`,
        ],
        { type: 'html' },
      ),
      this.getFileName() + '.html',
    )
  }
}

featureManager.register('SaveDataView', ExportDataView)
featureManager.register('dataView', DataViewBridge)
export default DataViewBridge
