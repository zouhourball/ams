import { config2MhtConfig } from 'components/module-production/analytics/utils/production-chart-option-creators'
import { flatten, isArray, ceil, map, filter } from 'lodash-es'
import { createFromNDResult } from './creator-maker'
export function createTableResult ({
  dataFormatter,
  columnsConfig,
  columnsConfigOnData,
  getColumnsConfig,
  getColumnsConfigOnData,
  rowsPerPage,
}) {
  return ({ data }) => {
    const configs = config2MhtConfig(
      columnsConfig ||
        (getColumnsConfig && getColumnsConfig()) ||
        (columnsConfigOnData && columnsConfigOnData(data)) ||
        (getColumnsConfigOnData && getColumnsConfigOnData(data)),
    )
    const groupedHeaders = filter(configs, (i) => i.columns)
    return {
      // data: dataFormatter ? dataFormatter(data) : data,
      // columnsConfig: columnsConfigOnData
      //   ? columnsConfigOnData(data)
      //   : columnsConfig,

      // getColumnsConfig: getColumnsConfigOnData
      //   ? getColumnsConfigOnData(data)
      //   : getColumnsConfig,
      // rowsPerPage,
      // hideSearchBar: true,

      configs,
      commonActions: true,
      withDownloadCsv: true,
      withSubColumns: !!groupedHeaders.length,
      // defaultCsvFileTitle: '',
      hideTotal: true,
      withFooter: false,
      withSearch: true,
      tableData: map(dataFormatter ? dataFormatter(data) : data, (d) => {
        const result = Object.assign({}, d)
        groupedHeaders.forEach((g) => {
          result[g.key] = map(g.columns, (gc) => ({
            [gc.subKey]: result[gc.subKey],
          }))
        })
        return result
      }),
    }
  }
}

export function createHeatMapResult ({ xKey, yKey, valueKey, filterBy }) {
  return ({ data }) => {
    let max = 0
    const detail = (data || []).map((d) => {
      const x = d[xKey]
      const y = d[yKey]
      let value = +d[valueKey] || 0
      if (value > max) {
        max = value
      }
      return [x, y, value]
    })
    return {
      detail,
      max,
    }
  }
}

export function createMapResult ({
  mapScroll = false,
  mapName,
  mapDataConvert,
  pinDataConvert,
  queryHeatMapDataConvert,
  props,
}) {
  return ({ data }) => {
    return {
      mapScroll,
      mapName,
      baseLayerName: 'Bing Road',
      queryData: mapDataConvert && mapDataConvert(data),
      pinData: pinDataConvert && pinDataConvert(data),
      queryHeatMapData:
        queryHeatMapDataConvert && queryHeatMapDataConvert(data),
      ...props,
    }
  }
}

export const createCardResult = createFromNDResult(
  (
    keys,
    data,
    unit,
    { showUnit = true, unit: customUnit, precision, ...rest },
  ) => {
    return {
      detail: keys[0].reduce(
        (r, k, i) => ({
          ...r,
          [k]: precision ? ceil(data[i], precision) : data[i],
        }),
        {},
      ),
      unit: showUnit ? customUnit || unit : '',
    }
  },
)

export const createPieResult = createFromNDResult(
  (keys, data, calcuUnit, { showValue, showUnit, precision, ...rest }) => {
    const usingUnit = rest.hasOwnProperty('unit')
      ? rest.unit
      : isArray(calcuUnit)
        ? calcuUnit[0]
        : calcuUnit
    return {
      precision,
      detail: keys[0].reduce((r, k, i) => ({ ...r, [k]: data[i] }), {}),
      unit: usingUnit,
      showValue,
      showUnit,
    }
  },
)

export const createGaugeResult = createFromNDResult((keys, data, unit) => {
  return {
    detail: {
      [keys[0][0]]: data[0],
      [keys[0][1]]: data[1],
    },
    unit: isArray(unit) ? unit[0] : unit,
  }
})

export const createStackBarResult = createFromNDResult(
  (keys, data, unit, config) => {
    const [stacks, groups, xAxis] = keys
    const initalSeries = flatten(
      stacks.map((stack, s) =>
        groups.map((group, g) => ({
          name: `${group}-${stack}`,
          type: 'bar',
          stack,
          data: xAxis.map((_, x) => data[s][g][x]),
        })),
      ),
    )
    const series = config.createSeries
      ? config.createSeries(initalSeries)
      : initalSeries
    return {
      axisData: xAxis,
      legendData: config.legendData || series.map((s) => s.name),
      unit: isArray(unit) ? unit[0] : unit,
      series,
    }
  },
)

export const createBarResult = createFromNDResult(
  (keys, data, unit, config) => {
    const [groups, xAxis] = keys
    return {
      ...config,
      unit: config.unit ? config.unit : isArray(unit) ? unit[0] : unit,
      axisData: xAxis,
      legendData: groups,
      detail: groups.reduce(
        (r, group, gi) => ({ ...r, [group]: data[gi] }),
        {},
      ),
    }
  },
)

export const createWashlineResult = createFromNDResult(
  (keys, data, unit, config) => {
    const [xAxis] = keys
    const { precision } = config
    // exclude ratio data
    for (let i = 0; i < xAxis.length; ++i) {
      if (xAxis[i] && xAxis[i].toLowerCase().includes('ratio')) {
        xAxis.splice(i, 1)
        data.splice(i, 1)
        break
      }
    }

    let incomeData = []
    let outcomeData = []

    xAxis.forEach((item, i) => {
      if (i === 0 || i === xAxis.length - 1) {
        return
      }

      const val = data[i]
      if (val < 0) {
        outcomeData.push(val)
        incomeData.push(0)
      } else {
        outcomeData.push(0)
        incomeData.push(val)
      }
    })

    return {
      unit: isArray(unit) ? unit[0] : unit,
      xAxisLabels: xAxis,
      initValue: data[0],
      endValue: data[data.length - 1],
      incomeData,
      outcomeData,
      precision,
    }
  },
)

export const createLineResult = createFromNDResult((keys, data, unit) => {
  const [groups, xAxis] = keys

  const series = flatten(
    groups.map((group, g) => ({
      name: `${group}`,
      type: 'bar',
      data: xAxis.map((_, x) => data[g][x]),
    })),
  )

  return {
    axisData: xAxis,
    legendData: series.map((s) => s.name),
    unit: isArray(unit) ? unit[0] : unit,
    series,
  }
})
