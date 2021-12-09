import { merge } from 'lodash-es'
import { baseOption } from 'libs/echarts-options'

export default ({
  /* In format of:
    [{
        title: {
            text: 'Title'
        },
        series: [
            {
                data: [{name: 'name', value: 123}]
            }
        ]
    }]
    * */
  timelineData,
  timelineLables,
  legend,
  option,
  subtitle,
  radius,
  ...rest
}) =>
  merge(
    {},
    { baseOption: baseOption() },
    {
      baseOption: {
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
        },
        timeline: {
          // y: 0,
          axisType: 'category',
          // realtime: false,
          // loop: false,
          autoPlay: true,
          // currentIndex: 2,
          playInterval: 2000,
          // controlStyle: {
          //     position: 'left'
          // },
          data: timelineLables,
        },
        title: {
          subtext: subtitle,
        },
        tooltip: {},
        /* currently toolbox doesnt work
        toolbox: toolBoxConfig({
          onZoomClick,
          optionToContent: singleColDataTable,
        }),
        */
        legend: {
          type: scroll,
          right: 10,
          top: '15%',
          data: legend,
        },
        calculable: true,

        series: [
          {
            type: 'pie',
            radius: radius || '80%',
            center: ['40%', '50%'],
          },
        ],
        ...option,
      },
      options: timelineData,
      ...rest,
    },
  )
