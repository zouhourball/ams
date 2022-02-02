export const chart1 = {
  xAxis: {
    type: 'category',
    data: ['Block 1', 'Block 2', 'Block 3', 'Block 4', 'Block 5', 'Block 6'],
    axisLine: {
      show: false,
    },
    axisTick: {
      show: false,
    },
  },
  yAxis: {
    type: 'value',
    axisLabel: {
      formatter: '$ {value}',
    },
    axisLine: {
      show: false,
    },
    axisTick: {
      show: false,
    },
  },
  color: ['#2844ce', '#41d8d0'],
  legend: {
    data: ['Plan Budget', 'Executed Budget'],
    icon: 'circle',
    left: 0,
  },
  series: [
    {
      name: 'Plan Budget',
      data: [77, 154, 410, 885, 1187, 1404],
      type: 'bar',
      barGap: '0%',
      label: {
        show: true,
        position: 'top',
        color: '#555',
      },
    },
    {
      name: 'Executed Budget',
      data: [17, 106, 147, 205, 311, 791],
      type: 'bar',
      label: {
        show: true,
        position: 'top',
        color: '#777',
      },
    },
  ],
}

export const chart2 = {
  xAxis: {
    type: 'category',
    data: ['Block 1', 'Block 2', 'Block 3', 'Block 4', 'Block 5', 'Block 6'],
    axisLine: {
      show: false,
    },
    axisTick: {
      show: false,
    },
  },
  yAxis: {
    type: 'value',
    axisLabel: {
      formatter: '$ {value}',
    },
    axisLine: {
      show: false,
    },
    axisTick: {
      show: false,
    },
  },
  color: ['#506eff', '#ff9945'],
  legend: {
    data: ['Plan Budget', 'Executed Budget'],
    icon: 'circle',
    left: 0,
  },
  series: [
    {
      name: 'Plan Budget',
      data: [77, 154, 410, 885, 1187, 1404],
      type: 'bar',
      barGap: '0%',
      label: {
        show: true,
        position: 'top',
        color: '#555',
      },
    },
    {
      name: 'Executed Budget',
      data: [17, 106, 147, 205, 311, 791],
      type: 'bar',
      label: {
        show: true,
        position: 'top',
        color: '#777',
      },
    },
  ],
}

export const chart3 = {
  xAxis: {
    type: 'category',
    data: ['Block 1', 'Block 2', 'Block 3', 'Block 4', 'Block 5', 'Block 6'],
    axisLine: {
      show: false,
    },
    axisTick: {
      show: false,
    },
  },
  yAxis: {
    type: 'value',
    axisLabel: {
      formatter: '$ {value}',
    },
    axisLine: {
      show: false,
    },
    axisTick: {
      show: false,
    },
  },
  color: ['#21c9f7', '#fecc3f'],
  legend: {
    data: ['Plan Budget', 'Executed Budget'],
    icon: 'circle',
    left: 0,
  },
  series: [
    {
      name: 'Plan Budget',
      data: [77, 154, 410, 885, 1187, 1404],
      type: 'bar',
      barGap: '0%',
      label: {
        show: true,
        position: 'top',
        color: '#555',
      },
    },
    {
      name: 'Executed Budget',
      data: [17, 106, 147, 205, 311, 791],
      type: 'bar',
      label: {
        show: true,
        position: 'top',
        color: '#777',
      },
    },
  ],
}

export const chart4 = {
  tooltip: {
    trigger: 'item',
    formatter: '{b} : {c} ({d}%)',
  },
  legend: {
    icon: 'circle',
    type: 'scroll',
    orient: 'horizontal',
    right: 10,
    top: 20,
    bottom: 'auto',
    left: 10,
    data: ['Total Discount', 'Discount Availed'],
  },
  series: [
    {
      name: 'title',
      type: 'pie',
      radius: ['30%', '70%'],
      center: ['50%', '60%'],
      data: [
        {
          name: 'Discount Availed',
          value: 700,
          itemStyle: {
            color: '#9ce4fc',
          },
        },
        {
          name: 'Total Discount',
          value: 300,
          itemStyle: {
            color: '#fce343',
          },
        },
      ],
      label: { color: '#555', fontSize: 26, formatter: '{d}% ' },
      itemStyle: {
        emphasis: {
          shadowColor: 'rgba(0, 0, 0, 0)',
        },
      },
    },
  ],
}

const val = 50
export const chart5 = {
  series: [
    {
      type: 'gauge',
      radius: '100%',
      startAngle: 180,
      endAngle: 0,
      detail: { fontSize: 30, fontWeight: '600', formatter: '{value}%' },
      title: { color: '#333', fontSize: 13, offsetCenter: [0, '53%'] },

      data: [
        {
          value: val,
          name: `Cost Optimization Left ${100 - val}%`,
        },
      ],
      splitNumber: 1,
      pointer: { width: 15, length: '55%' },
      axisLine: {
        lineStyle: {
          color: [
            [val / 100, '#3764ce'],
            [1, '#e6ecfe'],
          ],
        },
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        color: '#333',
        fontSize: 15,
        fontWeight: '600',
      },
    },
  ],
}

export const chart6 = {
  xAxis: {
    type: 'category',
    data: [],
  },
  yAxis: {
    type: 'value',
  },
  legend: {
    show: true,
    icon: 'circle',
    left: 0,
    data: ['Actual Spend', 'Saving', 'Over Spend'],
    selected: { 'Over Spend': false },
  },
  series: [
    {
      name: 'Over Spend',
      type: 'bar',
      data: [0],

      label: {
        normal: {
          show: true,
          position: 'bottom',
          distance: 20,
          color: '#333',
          formatter: '{a}',
        },
      },

      itemStyle: {
        color: '#fecc3f',
      },
    },
    {
      name: 'Saving',
      type: 'bar',
      data: [15],

      label: {
        normal: {
          show: true,
          position: 'bottom',
          distance: 20,
          color: '#333',
          formatter: '{a}',
        },
      },

      itemStyle: {
        color: '#2f9b95',
      },
    },
    {
      name: 'Actual Spend',
      type: 'bar',
      data: [24],

      label: {
        show: true,
        position: 'bottom',
        distance: 20,
        color: '#333',
        formatter: '{a}',
      },

      itemStyle: {
        color: '#2356a6',
      },
    },
  ],
}

export const comparison = [
  { id: '1', key: 'BP', value: '61' },
  { id: '2', key: 'BQ', value: '62' },
  { id: '3', key: 'FG', value: '63' },
  { id: '4', key: 'OK', value: '64' },
  { id: '5', key: 'AB', value: '65' },
  { id: '6', key: 'MO', value: '66' },
  { id: '7', key: 'GJ', value: '67' },
  { id: '8', key: 'KL', value: '68' },
]
