import { abbr } from 'libs/utils'
import { renderToString } from 'react-dom/server'
import { isArray, isNumber, merge, round } from 'lodash-es'

export const colors = ['#5793f3', '#d14a61', '#675bba']

export const baseOption = () => ({
  title: {
    show: false,
    x: 'center',
    textStyle: {
      fontSize: 12,
      fontWeight: 'bold',
    },
  },
  grid: {
    left: '3%',
    right: '4%',
    top: '25%',
    bottom: '10%',
    containLabel: true,
  },
  toolbox: {
    itemSize: 16,
    right: '20',
    itemGap: 15,
    showTitle: false,
    iconStyle: {
      color: '#1565c0',
      normal: {
        borderWidth: 0,
        color: '#666',
      },
      emphasis: {
        color: '#1565c0',
      },
    },
    feature: {
      myPin: {
        show: true,
        title: 'Pin to home page',
        icon: 'M16,12V4H17V2H7V4H8V12L6,14V16H11.2V22H12.8V16H18V14L16,12Z',
      },
      myDuplication: {
        show: false,
        title: 'Dumplication',
        icon: 'path://M16,9H21.5L16,3.5V9M7,2H17L23,8V18A2,2 0 0,1 21,20H7C5.89,20 5,19.1 5,18V4A2,2 0 0,1 7,2M3,6V22H21V24H3A2,2 0 0,1 1,22V6H3Z',
      },
      myEdit: {
        show: false,
        title: 'Edit',
        icon: 'path://M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z',
      },

      myTheme: {
        show: false,
        title: 'Change Theme',
        icon: 'path://M17.5,12A1.5,1.5 0 0,1 16,10.5A1.5,1.5 0 0,1 17.5,9A1.5,1.5 0 0,1 19,10.5A1.5,1.5 0 0,1 17.5,12M14.5,8A1.5,1.5 0 0,1 13,6.5A1.5,1.5 0 0,1 14.5,5A1.5,1.5 0 0,1 16,6.5A1.5,1.5 0 0,1 14.5,8M9.5,8A1.5,1.5 0 0,1 8,6.5A1.5,1.5 0 0,1 9.5,5A1.5,1.5 0 0,1 11,6.5A1.5,1.5 0 0,1 9.5,8M6.5,12A1.5,1.5 0 0,1 5,10.5A1.5,1.5 0 0,1 6.5,9A1.5,1.5 0 0,1 8,10.5A1.5,1.5 0 0,1 6.5,12M12,3A9,9 0 0,0 3,12A9,9 0 0,0 12,21A1.5,1.5 0 0,0 13.5,19.5C13.5,19.11 13.35,18.76 13.11,18.5C12.88,18.23 12.73,17.88 12.73,17.5A1.5,1.5 0 0,1 14.23,16H16A5,5 0 0,0 21,11C21,6.58 16.97,3 12,3Z',
      },
      dataView: {
        show: true,
        readOnly: true,
        lang: ['Data View', 'Close'],
        icon: 'path://M13,9H18.5L13,3.5V9M6,2H14L20,8V20A2,2 0 0,1 18,22H6C4.89,22 4,21.1 4,20V4C4,2.89 4.89,2 6,2M15,18V16H6V18H15M18,14V12H6V14H18Z',
      },
      magicType: {
        show: false,
        type: ['bar'],
        icon: {
          bar: 'path://M22,21H2V3H4V19H6V10H10V19H12V6H16V19H18V14H22V21Z',
          stack:
            'path://M3,15H21V13H3V15M3,19H21V17H3V19M3,11H21V9H3V11M3,5V7H21V5H3Z',
          line: 'path://M16,11.78L20.24,4.45L21.97,5.45L16.74,14.5L10.23,10.75L5.46,19H22V21H2V3H4V17.54L9.5,8L16,11.78Z',
          tiled:
            'path://M9,3V21H11V3H9M5,3V21H7V3H5M13,3V21H15V3H13M19,3H17V21H19V3Z',
        },
      },
      myPie: {
        show: false,
        title: 'Switch to Pie Chart',
        icon: 'path://M21,11H13V3A8,8 0 0,1 21,11M19,13C19,15.78 17.58,18.23 15.43,19.67L11.58,13H19M11,21C8.22,21 5.77,19.58 4.33,17.43L10.82,13.68L14.56,20.17C13.5,20.7 12.28,21 11,21M3,13A8,8 0 0,1 11,5V12.42L3.83,16.56C3.3,15.5 3,14.28 3,13Z',
      },
      restore: { show: false },
      saveAsImage: {
        show: true,
        icon: 'path://M5,20H19V18H5M19,9H15V3H9V9H5L12,16L19,9Z',
      },
    },
  },
})

export const toolBoxConfig = (
  { optionToContent, onPieClick },
  overrideFeatureOptions,
) => ({
  itemSize: 16,
  right: '20',
  iconStyle: {
    normal: {
      borderWidth: 0,
      color: 'rgba(0,0,0,.5)',
    },
    emphasis: {
      color: '#1565c0',
    },
  },
  feature: Object.assign(
    {
      dataView: {
        show: true,
        readOnly: true,
        lang: ['Data View', 'Close'],
        optionToContent,
        icon: 'path://M13,9H18.5L13,3.5V9M6,2H14L20,8V20A2,2 0 0,1 18,22H6C4.89,22 4,21.1 4,20V4C4,2.89 4.89,2 6,2M15,18V16H6V18H15M18,14V12H6V14H18Z',
      },
      magicType: {
        show: false,
        type: ['bar', 'line'],
        icon: {
          bar: 'path://M22,21H2V3H4V19H6V10H10V19H12V6H16V19H18V14H22V21Z',
        },
      },
      myPie: {
        show: false,
        title: 'Switch to Pie Chart',
        icon: 'path://M21,11H13V3A8,8 0 0,1 21,11M19,13C19,15.78 17.58,18.23 15.43,19.67L11.58,13H19M11,21C8.22,21 5.77,19.58 4.33,17.43L10.82,13.68L14.56,20.17C13.5,20.7 12.28,21 11,21M3,13A8,8 0 0,1 11,5V12.42L3.83,16.56C3.3,15.5 3,14.28 3,13Z',
        onclick: (opt) => {
          if (onPieClick) {
            onPieClick(opt.getOption())
          }
        },
      },
      restore: { show: false },
      saveAsImage: {
        show: true,
        icon: 'path://M5,20H19V18H5M19,9H15V3H9V9H5L12,16L19,9Z',
      },
    },
    overrideFeatureOptions,
  ),
})
export const singleColDataTable = (opt) => {
  const axisData = opt.yAxis[0].data
  const series = opt.series
  let table = `<table style="width:100%;text-align:center; border: 1px solid #eee;"><tbody>
    <tr style="background-color: #1565c0; color: #FFFFFF">
      <td> Type </td>
      <td> Value </td>
    </tr>`
  for (let i = 0, l = axisData.length; i < l; i++) {
    table += `<tr ${i % 2 ? 'style="background-color: #EEEEEE"' : ''}>
             <td> ${axisData[i]}  </td>
             <td>  ${series[0].data[i].toFixed(2)}  </td>
             </tr>`
  }
  table += '</tbody></table>'
  return table
}
const pieOptionToContent = (opt) => {
  const data = opt.series[0] && opt.series[0].data
  let table = `<table style="width:100%;text-align:center; border: 1px solid #eee;"><tbody>
    <tr style="background-color: #1565c0; color: #FFFFFF">
      <td> Type </td>
      <td> Value </td>
    </tr>`
  for (let i = 0, l = data.length; i < l; i++) {
    table += `<tr ${i % 2 ? 'style="background-color: #EEEEEE"' : ''}>
             <td> ${data[i].name}  </td>
             <td>  ${data[i].value.toFixed(2)}  </td>
             </tr>`
  }
  table += '</tbody></table>'
  return table
}
export const doubleColDataTable = (opt) => {
  const axisData = opt.xAxis && opt.xAxis[0].data
  const yAxisData = opt.yAxis && opt.yAxis[0].data

  const realData = axisData || yAxisData || []

  const series = opt.series
  let rootEle = (
    <table
      style={{
        width: '100%',
        textAlign: 'center',
        border: '1px solid #eee',
      }}
    >
      <tbody>
        <tr
          style={{
            backgroundColor: '#1565c0',
            color: '#FFFFFF',
          }}
        >
          <td>Type</td>
          {Array(Math.max(series.length))
            .fill(0)
            .map((item, i) => {
              return <td key={i}>{(series[i] && series[i].name) || 'Value'}</td>
            })}
        </tr>
        {realData.map((item, i) => (
          <tr key={i}>
            <td>{realData[i]}</td>
            {series.map((item, j) => (
              <td key={j}>
                {item &&
                  item.data &&
                  item.data[i] &&
                  (isArray(item.data[i]) ? item.data[i][0] : item.data[i])}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
  return renderToString(rootEle)
}

export const radarColDataTable = (opt) => {
  const realData = opt.radar && opt.radar[0].indicator

  const series = opt.series && opt.series[0] && opt.series[0].data
  let rootEle = (
    <table
      style={{
        width: '100%',
        textAlign: 'center',
        border: '1px solid #eee',
      }}
    >
      <tbody>
        <tr
          style={{
            backgroundColor: '#1565c0',
            color: '#FFFFFF',
          }}
        >
          <td>Type</td>
          {Array(series.length)
            .fill(0)
            .map((item, i) => {
              return <td key={i}>{series[i] && series[i].name}</td>
            })}
        </tr>
        {realData.map((item, i) => (
          <tr key={i}>
            <td>{realData[i] && realData[i].name}</td>
            {series.map((item, j) => (
              <td key={j}>
                {item &&
                  item.value &&
                  item.value[i] &&
                  item.value[i].toFixed(2)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
  return renderToString(rootEle)
}
export const makeToolTipFormatter = ({ precision }) => {
  const toFix = isNumber(precision) ? precision : 3
  return (params) => {
    let tmpParams = []
    if (!isArray(params)) {
      tmpParams = [params]
    } else {
      tmpParams = params
    }
    let result = tmpParams[0].name
    tmpParams.forEach((item) => {
      result += '<br/>'
      result += `<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:${item.color}"></span>`
      result += `${item.seriesName}: `
      result += isNaN(item.value)
        ? 0
        : (+(isArray(item.value) ? item.value[0] : item.value).toFixed(
          toFix,
        )).toLocaleString()
    })
    return result
  }
}
export const toolTipFormatter = makeToolTipFormatter({
  precision: 3,
})

export const barOption = ({ useAbbr, yData, option }) =>
  merge(
    {},
    {
      title: { show: false },
      toolbox: toolBoxConfig({
        optionToContent: singleColDataTable,
      }),
      xAxis: {
        axisTick: { show: false },
        nameLocation: 'center',
        nameGap: 25,
        axisLabel: {
          formatter: (value, index) => {
            return `${value}`
          },
          fontSize: '8px',
        },
        boundaryGap: [0, 0.01],
        axisLine: {
          show: false,
        },
      },
      grid: { x: 50 },
      yAxis: [
        {
          data: yData,
          splitLine: { show: false },
          type: 'category',
          axisLabel: {
            rotate: 10,
            fontWeight: 'bold',
            fontSize: '8px',
            interval: 0,
            margin: 8,
            formatter: abbr,
          },
        },
      ],
      tooltip: {
        trigger: 'axis',
      },
      series: [
        {
          type: 'bar',
          data: [],
          itemStyle: {
            normal: {
              // color(params) {
              //   const colorList = [
              //     '#C1232B',
              //     '#B5C334',
              //     '#FCCE10',
              //     '#E87C25',
              //     '#27727B',
              //     '#FE8463',
              //     '#9BCA63',
              //     '#FAD860',
              //     '#F3A43B',
              //     '#60C0DD',
              //     '#D7504B',
              //     '#C6E579',
              //     '#F4E001',
              //     '#F0805A',
              //     '#26C0C0',
              //   ]
              //   return colorList[params.dataIndex]
              // },
            },
          },
        },
      ],
    },
    option,
  )

export const lineChartOption = ({ data, option, onZoomClick }) =>
  merge(
    {},
    baseOption(),
    {
      toolbox: {
        feature: {
          dataView: {
            optionToContent: doubleColDataTable,
          },
          magicType: {
            show: true,
            type: ['bar', 'line', 'stack', 'tiled'],
            iconStatus: { line: 'emphasis', tiled: 'emphasis' },
            option: {
              bar: {
                xAxis: {
                  type: 'category',
                  axisLabel: {
                    fontWeight: 'bold',
                    fontSize: '8px',
                    interval: 0,
                    rotate: -25,
                    formatter: abbr,
                  },
                  data,
                  series: [
                    {
                      name: 'Plan',
                      type: 'bar',
                      data: [],
                    },
                    {
                      name: 'Actual',
                      type: 'bar',
                      data: [],
                    },
                  ],
                },
              },
            },
          },
        },
      },
      tooltip: {
        axisPointer: {
          type: 'cross',
        },
        formatter: toolTipFormatter,
      },
      legend: {
        data: ['Actual', 'Plan'],
      },
      xAxis: [
        {
          type: 'category',
          axisTick: {
            alignWithLabel: true,
          },
          boundaryGap: false,
          axisPointer: {
            label: {
              formatter (params) {
                return `Actual:  ${params.value}${
                  params.seriesData.length
                    ? `：${params.seriesData[0].data}`
                    : ''
                }`
              },
            },
          },
          data,
        },
      ],
      yAxis: [
        {
          type: 'value',
          nameGap: '20',
          nameTextStyle: {
            fontSize: '8px',
          },
        },
      ],
      series: [
        {
          name: 'Plan',
          type: 'line',
          data: [],
        },
        {
          name: 'Actual',
          type: 'line',
          data: [],
        },
      ],
    },
    option,
  )

export const gaugeChartOption = ({ axisLabelValue }) =>
  merge({}, baseOption(), {
    tooltip: {
      show: true,
    },
    series: [
      {
        name: 'Cost',
        type: 'gauge',
        radius: '75%',
        center: ['50%', '70%'], // 默认全局居中
        min: 0,
        max: 400,
        startAngle: 135,
        endAngle: 45,
        splitNumber: 2,
        axisLine: {
          lineStyle: {
            width: 16,
          },
        },
        axisTick: {
          // 坐标轴小标记
          splitNumber: 5,
          length: 24, // 属性length控制线长
          lineStyle: {
            // 属性lineStyle控制线条样式
            color: 'auto',
          },
        },
        axisLabel: {
          fontSize: 20,
          distance: -65,
          formatter (v) {
            return v === axisLabelValue && axisLabelValue !== 0
              ? `Plan\n${axisLabelValue}`
              : ''
          },
        },
        splitLine: {
          // 分隔线
          length: 25, // 属性length控制线长
          lineStyle: {
            // 属性lineStyle（详见lineStyle）控制线条样式
            color: 'auto',
          },
        },
        pointer: {
          width: 3,
          length: '90%',
        },
        title: {
          offsetCenter: ['100%', '-120%'],
        },
        detail: {
          offsetCenter: ['0', 30],
          fontSize: 20,
          formatter: 'Actual\n{value}',
        },
        tooltip: {
          formatter: '{c} $MM',
        },
        data: [{ value: 175, name: '64%\n$MM' }],
      },
    ],
  })

export const customGaugeOption = ({ option, axisLabelValue }) =>
  merge(
    {},
    baseOption(),
    {
      tooltip: {
        show: true,
      },
      series: [
        {
          name: 'Cost',
          type: 'gauge',
          radius: '75%',
          center: ['50%', '70%'], // 默认全局居中
          min: 0,
          max: 400,
          startAngle: 135,
          endAngle: 45,
          splitNumber: 2,
          axisLine: {
            lineStyle: {
              width: 16,
            },
          },
          axisTick: {
            // 坐标轴小标记
            splitNumber: 5,
            length: 24, // 属性length控制线长
            lineStyle: {
              // 属性lineStyle控制线条样式
              color: 'auto',
            },
          },
          axisLabel: {
            fontSize: 20,
            distance: -65,
            formatter (v) {
              return v === axisLabelValue && axisLabelValue !== 0
                ? `Plan\n${axisLabelValue}`
                : ''
            },
          },
          splitLine: {
            // 分隔线
            length: 25, // 属性length控制线长
            lineStyle: {
              // 属性lineStyle（详见lineStyle）控制线条样式
              color: 'auto',
            },
          },
          pointer: {
            width: 3,
            length: '90%',
          },
          title: {
            offsetCenter: ['100%', '-120%'],
          },
          detail: {
            offsetCenter: ['0', 30],
            fontSize: 20,
            formatter: 'Actual\n{value}',
          },
          tooltip: {
            formatter: '{c} $MM',
          },
          data: [{ value: 175, name: '64%\n$MM' }],
        },
      ],
    },
    option,
  )
/**
 * @typedef {object} params
 * @property {array} Params.data x axis lables
 *
 */
export const vBarOption = (
  /* @type {params}  */ { data, useAbbr, onPieClick, option },
) =>
  merge(
    {},
    baseOption(),
    {
      toolbox: {
        feature: {
          dataView: {
            optionToContent: doubleColDataTable,
          },
          magicType: {
            show: true,
            type: ['bar', 'line'],
            iconStatus: { bar: 'emphasis' },
          },
        },
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
          label: {
            show: true,
          },
        },
        formatter: toolTipFormatter,
      },
      legend: {
        data: ['Plan', 'Actual'],
      },
      xAxis: {
        type: 'category',
        axisLabel: {
          fontWeight: 'bold',
          fontSize: '8px',
          interval: 0,
          rotate: -25,
          formatter: useAbbr ? abbr : null,
        },
        data,
      },
      yAxis: {
        type: 'value',
        minInterval: 1,
        nameGap: '20',
        nameTextStyle: {
          fontSize: '8px',
        },
      },
      series: [
        {
          name: 'Plan',
          type: 'bar',
          data: [],
        },
        {
          name: 'Actual',
          type: 'bar',
          data: [],
        },
      ],
    },
    option,
  )

export const customBarOption = ({ xData, option, useAbbr, precision }) =>
  merge(
    {},
    baseOption(),
    {
      toolbox: {
        feature: {
          dataView: {
            optionToContent: doubleColDataTable,
          },
          magicType: {
            iconStatus: { bar: 'emphasis', tiled: 'emphasis' },
          },
        },
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
          label: {
            show: true,
          },
        },
        formatter: makeToolTipFormatter({
          precision,
        }),
      },
      xAxis: {
        type: 'category',
        axisLabel: {
          fontWeight: 'bold',
          fontSize: '8px',
          interval: 0,
          rotate: -25,
          formatter: useAbbr ? abbr : null,
        },
        barWidth: '50%',
        data: xData,
      },
      yAxis: {
        type: 'value',
        minInterval: 1,
        nameGap: '20',
        nameTextStyle: {
          fontSize: '8px',
        },
      },
    },
    option,
  )
export const customStackOption = ({ xData, option, useAbbr = true }) =>
  merge(
    {},
    baseOption(),
    {
      legend: {
        type: 'scroll',
      },
      toolbox: {
        feature: {
          dataView: {
            optionToContent: doubleColDataTable,
          },
        },
      },
      tooltip: {
        trigger: 'item',
        axisPointer: {
          type: 'shadow',
          label: {
            show: true,
          },
        },
        formatter: toolTipFormatter,
      },
      xAxis: {
        type: 'category',
        axisLabel: {
          fontWeight: 'bold',
          fontSize: '8px',
          interval: 'auto',
          rotate: -20,
          formatter: useAbbr ? (value) => abbr(value) : null,
        },
        barWidth: '50%',
        data: xData,
      },
      yAxis: {
        type: 'value',
        minInterval: 1,
        nameGap: '20',
        nameTextStyle: {
          fontSize: '8px',
        },
      },
    },
    option,
  )
export const customLineOption = ({ xData, option, precision, rotateLabel }) =>
  merge(
    {},
    baseOption(),
    {
      toolbox: {
        feature: {
          dataView: {
            optionToContent: doubleColDataTable,
          },
          magicType: {
            show: true,
            type: ['bar', 'line', 'stack', 'tiled'],
            iconStatus: { line: 'emphasis', tiled: 'emphasis' },
            option: {
              bar: {
                xAxis: {
                  type: 'category',
                  axisLabel: {
                    fontWeight: 'bold',
                    fontSize: '8px',
                    interval: 0,
                    rotate: -25,
                    formatter: abbr,
                  },
                  xData,
                },
              },
            },
          },
        },
      },
      tooltip: {
        axisPointer: {
          type: 'cross',
        },
        formatter: makeToolTipFormatter({
          precision,
        }),
      },
      xAxis: [
        {
          type: 'category',
          data: xData,
          // boundaryGap: false,
          axisPointer: {
            type: 'shadow',
          },
          ...(rotateLabel
            ? {
              axisLabel: {
                fontWeight: 'bold',
                fontSize: '8px',
                interval: 0,
                rotate: -25,
              },
            }
            : {}),
          // axisLine: { onZero: true },
        },
      ],
      yAxis: [
        {
          type: 'value',
          nameGap: '20',
          nameTextStyle: {
            fontSize: '8px',
          },
        },
      ],
    },
    option,
  )

export const radalOption = () => ({
  tooltip: {
    trigger: 'axis',
  },
  toolbox: toolBoxConfig({
    optionToContent: radarColDataTable,
  }),

  legend: {
    data: ['Actual', 'Plan'],
  },
  radar: {
    radius: '50%',
    name: {
      textStyle: {
        fontSize: 10,
      },
    },
    nameGap: 5,
    indicator: [
      /**
       * {
       *  name:string,
       *  max: number
       * }
       */
    ],
  },
  series: [
    {
      name: '',
      type: 'radar',
      symbolSize: 0,
      data: [
        {
          value: [
            /* number */
          ],
          tooltip: {
            trigger: 'item',
          },
          name: 'Actual',
          itemStyle: { normal: { areaStyle: { type: 'default' } } },
        },
        {
          value: [
            /* number */
          ],
          tooltip: {
            trigger: 'item',
          },
          name: 'Plan',
          itemStyle: { normal: { areaStyle: { type: 'default' } } },
        },
      ],
    },
  ],
})

export const mapOption = ({ mapName, data }) => ({
  tooltip: {
    trigger: 'item',
    showDelay: 0,
    transitionDuration: 0.2,
    formatter: (params) => {
      let value = `${params.value || 0}`.split('.')
      value = value[0].replace(/(\d{1,3})(?=(?:\d{3})+(?!\d))/g, '$1,')
      return `${params.seriesName}<br/>${params.name}:${value}`
    },
  },
  visualMap: {
    left: 'right',
    min: 0,
    max: 6000000,
    text: ['High', 'Low'], // 文本，默认为数值文本
    calculable: true,
  },
  series: [
    {
      name: mapName,
      type: 'map',
      map: mapName || 'default',
      scaleLimit: 1,
      itemStyle: {
        emphasis: { label: { show: false } },
      },
      data: data || [],
    },
  ],
})

/**
 *
 * @param {Object} params: {
 *   data: [{Object}] - {value: 0, name: {String}, field: {String}}
 * }
 */
export const pieOption = ({ data, onPieClick, option }) => {
  const result = merge(
    {},
    baseOption(),
    {
      legend: {
        type: 'scroll',
      },
      toolbox: {
        feature: {
          dataView: {
            optionToContent: pieOptionToContent,
          },
        },
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} {per|{d}%}',
      },
      series: [
        {
          type: 'pie',
          radius: '55%',
          center: ['50%', '50%'],
          data,
          label: {
            normal: {
              formatter: ({ data: { name, value }, percent }) => {
                return `{b|${name}} \n{hr|}\n   {c|${value.toLocaleString()}}  {per|${percent}}% `
              },
              backgroundColor: '#eee',
              borderColor: '#aaa',
              borderWidth: 1,
              borderRadius: 4,
              rich: {
                b: {
                  align: 'center',
                  lineHeight: 22,
                },
                hr: {
                  borderColor: '#aaa',
                  width: '100%',
                  borderWidth: 0.5,
                  height: 0,
                },
                c: {
                  lineHeight: 22,
                },
                per: {
                  color: '#eee',
                  backgroundColor: '#334455',
                  padding: [2, 4],
                  borderRadius: 2,
                },
              },
            },
          },
          labelLine: {
            smooth: 0.2,
            length: 20,
            length2: 20,
          },
          itemStyle: {
            normal: {
              shadowBlur: 200,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
          animationType: 'scale',
          animationEasing: 'elasticOut',
          animationDelay: (idx) => {
            return Math.random() * 200
          },
        },
      ],
    },
    ...option,
  )
  return result
}

export const waterfall = ({
  xAxisLabels,
  onPieClick,
  stack = 'total',
  incomeLabel = 'Addition',
  outcomeLabel = 'Subtraction',
  incomeData,
  outcomeData,
  unit,
  initValue = 0,
  precision = 2,
  // NOTE: endValue 会被计算出来
  endValue = 0,
}) => {
  /* eslint-disable */
  if (incomeData.length > outcomeData.length) {
    outcomeData = outcomeData.concat(
      new Array(incomeData.length - outcomeData.length).fill(0),
    )
  }
  if (outcomeData.length > incomeData.length) {
    incomeData = incomeData.concat(
      new Array(outcomeData.length - incomeData.length).fill(0),
    )
  }

  /* eslint-enable */

  if (incomeData.length !== outcomeData.length) {
    throw new Error('Invalid wafterfall data.')
  }
  let stackData = []
  let stackTotal = initValue
  for (let i = 0; i < incomeData.length; i++) {
    outcomeData[i] = Math.abs(outcomeData[i])
    stackTotal += incomeData[i] - outcomeData[i]
    // if(outcomeData[i]===0){
    //   outcomeData[i]='-'
    // }
    // if (incomeData[i] === 0) {
    //   incomeData[i] = '-'
    // }
    stackData.push(stackTotal)
  }
  stackData = stackData.map((e, i) => e - incomeData[i])
  /* eslint-disable */
  outcomeData = outcomeData.map((e) => (e ? e : '-'))
  incomeData = incomeData.map((e) => (e ? e : '-'))
  /* eslint-disable */
  let total = new Array(stackData.length + 1).fill('-')
  total[0] = initValue
  total.push(endValue) //stackTotal) //如果需要显示真实的endValue，需要绘制[initValue ... stackTotal]
  console.log([...stackData])

  return merge(baseOption(), {
    legend: {
      data: [incomeLabel, outcomeLabel],
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: xAxisLabels,
      axisLabel: {
        rotate: -25,
        fontSize: 11,
      },
    },
    yAxis: [
      {
        type: 'value',
        name: unit,
      },
    ],
    toolbox: {
      feature: {
        dataView: {
          optionToContent: (opt) => {
            const series = opt.series
            const axisData = opt.xAxis[0]
            const titleData = axisData.data
            let titleContent = ''
            let content = ''
            for (let i = 0; i < series.length; i++) {
              if (series[i].name) {
                titleContent += '<td>' + series[i].name + '</td>'
              }
            }
            for (let i = 0; i < titleData.length; i++) {
              let contentData = '<td>' + titleData[i] + '</td>'
              for (let j = 1; j < series.length; j++) {
                contentData += '<td>' + series[j].data[i] + '</td>'
              }
              content += '<tr>' + contentData + '</tr>'
            }
            let table =
              '<table style="width:100%;text-align:center"><tbody><tr>' +
              `<td>${axisData.type}</td>` +
              titleContent +
              content +
              '</tr>'
            table += '</tbody></table>'
            return table
          },
        },
      },
    },
    series: [
      {
        name: null,
        type: 'bar',
        stack,
        itemStyle: {
          normal: {
            barBorderColor: 'rgba(0,0,0,0)',
            color: 'rgba(0,0,0,0)',
          },
          emphasis: {
            barBorderColor: 'rgba(0,0,0,0)',
            color: 'rgba(0,0,0,0)',
          },
        },
        data: ['-', ...stackData.map((d) => round(d, precision)), '-'],
      },
      {
        name: incomeLabel,
        type: 'bar',
        stack,
        itemStyle: {
          normal: {
            color: 'green',
          },
        },
        label: {
          normal: {
            show: true,
            position: 'top',
          },
        },
        barWidth: '100%',
        data: ['-', ...incomeData.map((d) => round(d, precision)), '-'],
      },
      {
        name: outcomeLabel,
        type: 'bar',
        stack,
        label: {
          normal: {
            show: true,
            position: 'top',
          },
        },
        data: ['-', ...outcomeData.map((d) => round(d, precision)), '-'],
      },

      {
        name: 'Total',
        type: 'bar',
        label: {
          normal: {
            show: true,
            position: 'top',
          },
        },
        barWidth: '100%',
        data: total.map((d) => round(d, precision)),
        barGap: '-100%',
        itemStyle: {
          normal: {
            color: '#0277BD',
          },
        },
      },
    ],
  })
}

/**
 * @param data {Array}
 *    A 4D array follows this format [xData, yData, zData, name]
 *
 * */
export const scatterOption = ({
  option,
  data,
  legend,
  lableX,
  lableY,
  lableZ,
}) => {
  return merge(
    baseOption(),
    {
      tooltip: {
        trigger: 'item',
        axisPointer: {
          type: 'cross',
        },
        formatter: (series) => {
          const { seriesName, data } = series
          return `${seriesName || ''}
                <br> ${lableX}: ${data[0]}
                <br> ${lableY}: ${data[1].toLocaleString()}
                <br> ${lableZ ? `${lableZ}: ${data[2].toLocaleString()}` : ''}
        `
        },
      },
      xAxis: {
        type: 'value',
        splitLine: {
          lineStyle: {
            type: 'dashed',
          },
        },
        name: lableX,
      },
      yAxis: {
        type: 'value',
        splitLine: {
          lineStyle: {
            type: 'dashed',
          },
        },
        name: lableY,
      },
    },
    option,
  )
}
