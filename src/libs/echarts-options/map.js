import { baseOption } from './index'
import { merge } from 'lodash-es'
import centers from 'libs/maps/concession-centers-converted.json'
import { compose } from 'redux'
import { format as d3format } from 'd3-format'

const formatNum = compose(
  (s) => (s === '0.00' ? 0 : s),
  (s) => s.replace(/G$/, 'B'),
  d3format('.3s'),
)

function convertData (data) {
  return data.map(({ name, value }) => ({
    name,
    value: centers[name] ? centers[name].concat(value) : null,
  }))
}

const mapOption = ({ onZoomClick, data }) =>
  merge(
    baseOption({
      onZoomClick,
    }),
    {
      geo: {
        show: true,
        map: 'concession',
        roam: true,
      },
      series: [
        {
          type: 'map',
          geoIndex: 0,
          data,
        },
        {
          type: 'scatter',
          coordinateSystem: 'geo',
          data: convertData(data),
          itemStyle: {
            normal: {
              color: '#05c3f9',
            },
          },
          tooltip: {
            formatter: (params) => {
              let value = `${params.value[2] || 0}`.split('.')
              value = value[0].replace(/(\d{1,3})(?=(?:\d{3})+(?!\d))/g, '$1,')
              return `${params.seriesName}<br/>${params.name}: ${value}`
            },
          },
        },
        {
          type: 'scatter',
          coordinateSystem: 'geo',
          data: convertData(data),
          symbol: 'pin',
          z: 6,
          itemStyle: {
            normal: {
              color: '#f62157',
            },
          },
          label: {
            normal: {
              show: true,
              textStyle: {
                color: '#fff',
                fontSize: 9,
              },
              formatter: (params) => formatNum(params.value[2]),
            },
          },
          tooltip: {
            formatter: (params) => {
              let value = `${params.value[2] || 0}`.split('.')
              value = value[0].replace(/(\d{1,3})(?=(?:\d{3})+(?!\d))/g, '$1,')
              return `${params.seriesName}<br/>${params.name}: ${value}`
            },
          },
        },
      ],
      visualMap: [
        {
          left: 'right',
          min: 0,
          max: 6000000,
          text: ['High', 'Low'],
          calculable: true,
          seriesIndex: [0],
          inRange: {
            color: ['#3B5077', '#031525'],
          },
        },
        {
          show: false,
          min: 0,
          max: 6000000,
          seriesIndex: [1],
          inRange: {
            symbolSize: [10, 50],
          },
        },
        {
          show: false,
          min: 0,
          max: 6000000,
          seriesIndex: [2],
          inRange: {
            symbolSize: [50, 100],
          },
        },
      ],
      tooltip: {
        trigger: 'item',
      },
    },
  )
export default mapOption
