import { ResizeSensor } from 'css-element-queries'
import { isFinite } from 'lodash-es'
import MapWithToolbar, { enhance } from '@target-energysolutions/map'
import '@target-energysolutions/map/styles.css'
import cls from 'classnames'
import React from 'react'
import pin from 'images/pin.svg'
import './styles.scss'
const FullFeatureMap = enhance.omanConcession(MapWithToolbar, {
  type: 'wms',
  id: 'oman-concession',
  extent: [
    [51.001116, 16.497744],
    [61.611136, 26.807263],
  ],
  name: 'concessions',
  url: `${PRODUCT_APP_URL_PULSE}/mogconmain?`,
  layers: 'Conc Main',
  tiled: 'true',
  format: 'image/png8',
  CRS: 'EPSG:3857',
  serverType: 'geoserver',
})
/**
 * queryHeatMapData = []
 * queryData = [{
 * xCoord,
 * yCoord,
 * numberToDisplay
 * }]
 */
export default class extends React.PureComponent {
  static defaultProps = {
    project: 'EPSG:3857',
    heatMapProject: 'EPSG:3857',
    pinMapProject: 'EPSG:3857',
    selectedLayers: ['circle'],
    precision: 2,
  }
  state = {
    selectedLayers: [...this.props.selectedLayers, 'oman-concession'],
  }
  componentDidMount () {
    // eslint-disable-next-line no-new
    new ResizeSensor(this.container, this.onResize)
    this.onResize()
  }

  onResize = () => {
    if (this.container.clientWidth > 500 && this.container.clientHeight > 350) {
      this.setState({
        big: true,
      })
    } else {
      this.setState({
        big: false,
      })
    }
  }
  handleSelectedLayerChange = (ids) => {
    this.setState({
      selectedLayers: ids,
    })
  }

  componentWillUnmount () {
    ResizeSensor.detach(this.container)
  }
  setRef = (ref) => {
    this.container = ref
  }
  render () {
    return (
      <div
        className={cls(!this.state.big && 'ams-map-small')}
        ref={this.setRef}
      >
        <FullFeatureMap
          selectedLayers={this.state.selectedLayers}
          onSelectedLayersChange={this.handleSelectedLayerChange}
          layers={[
            !this.state.showFullFeature
              ? {
                type: 'road',
                id: 'road',
              }
              : null,
            this.props.queryData && {
              id: 'circle',
              name: 'Circle map',
              type: 'circle',
              project: this.props.project,
              items: (this.props.queryData || [])
                .filter((d) => isFinite(+d.numberToDisplay))
                .map((d) => ({
                  longitude: +d.xCoord,
                  latitude: +d.yCoord,
                  value: +(+d.numberToDisplay).toFixed(this.props.precision),
                  unit: d.unit,
                })),
            },
            this.props.queryHeatMapData && {
              id: 'heat',
              name: 'Heat map',
              type: 'heat-map',
              project: this.props.heatMapProject,
              items: (this.props.queryHeatMapData || [])
                .filter((d) => isFinite(+d.quantity))
                .map((d) => ({
                  longitude: +d.xCoord,
                  latitude: +d.yCoord,
                  value: +(+d.quantity).toFixed(this.props.precision),
                  unit: d.unit,
                })),
            },
            this.props.pinData && {
              id: 'pin',
              name: 'Pin',
              type: 'symbol',
              project: this.props.pinMapProject,
              items: this.props.pinData.map((d) => ({
                longitude: +d.xCoord,
                latitude: +d.yCoord,
                icon: {
                  src: pin,
                },
                text: {
                  text: d.text,
                  offsetY: -10,
                },
                unit: d.unit,
              })),
            },
          ].filter((i) => i)}
        />
      </div>
    )
  }
}
