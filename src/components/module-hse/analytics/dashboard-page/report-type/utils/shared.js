import { creatorMaker } from 'components/analytics/utils/creator-maker'
import { mcDFBySize } from 'components/analytics/utils'
import ChartText from 'components/chart-text'
import Map from 'components/map'
// import DataTable from '@target-energysolutions/data-table'
// import TableWithColorHighlight from 'components/table-with-color-highlight'
import { mapData, mapCircleData } from './index'
import Mht from '@target-energysolutions/mht'

import { getDays, extractUniqValue, mapMonthNameToNumber } from 'libs/utils'
import { flatten, sumBy, flattenDeep } from 'lodash-es'
const mc11 = mcDFBySize(1, 1)
const mc21 = mcDFBySize(2, 1)
const mc21MoreFilters = (filterConf) => mcDFBySize(2, 1, filterConf)
const mc42MoreFilters = (filterConf) => mcDFBySize(4, 2, filterConf)
const mc42 = mcDFBySize(4, 2)
const mc42Bar = mc42('bar', null)
const card =
  (sizer) =>
    (sliceByKeys, filterBy, groupHandlerName = 'sum-value') =>
      sizer(
        'card',
        ChartText,
      )(
        creatorMaker({
          type: 'card',
          config: {
            sliceByKeys,
            filterBy,
            groupHandlerName,
          },
        }),
      )
export const mcS42Bar = (config, title, props) =>
  mc42Bar(
    creatorMaker({
      type: 'bar',
      config,
    }),
    title,
    props,
  )

export const mc42HighlightTable = (config, title, pinConfig, tableProps = {}) =>
  mc42(
    'table',
    Mht,
    creatorMaker({
      type: 'table',
      config,
    }),
    title,
    pinConfig,
    tableProps,
  )
export const mc42Table = (config, title, pinConfig, tableProps = {}) =>
  mc42(
    'table',
    Mht,
    creatorMaker({
      type: 'table',
      config,
    }),
    title,
    pinConfig,
    tableProps,
  )

export const mc21Map = mc21MoreFilters(['company', 'block', 'type'])('map', Map)
export const mc21MapDaily = mc21MoreFilters([
  'company',
  'block',
  {
    name: 'type',
    label: 'Type',
    items: ['routine', 'nonroutine'],
    defaultSelect: ['routine', 'nonroutine'],
  },
])('map', Map)
export const mc21MapAnnual = mc21MoreFilters([
  'company',
  'block',
  {
    name: 'name',
    label: 'Type',
    items: [
      'Gas Flared↵(Excl. Gas Conservation)',
      'Gas Flared↵(Incl. Gas Conservation)',
    ],
    defaultSelect: ['Gas Flared↵(Excl. Gas Conservation)'],
  },
])('map', Map)
export const mc21MapMonStation = mc21MoreFilters([
  'company',
  'block',
  {
    name: 'type',
    label: 'Type',
    items: ['Routine', 'Non-Routine'],
    defaultSelect: ['Routine'],
  },
])('map', Map)
export const mc21Pie = mc21('pie', null)
export const mcS42lineBar = mc42('line-bar', null)
export const mcS42StackFilterBar = mc42MoreFilters([
  'company',
  'block',
  {
    name: 'type',
    label: 'Type',
    items: ['routine', 'nonroutine'],
    defaultSelect: ['routine', 'nonroutine'],
  },
  {
    name: 'FLARE STATION',
    label: 'Station',
  },
])('stack', null)
export const mcS42BarFilter = mc42MoreFilters([
  'company',
  'block',
  {
    name: 'type',
    label: 'Type',
    // items: ["routine", "nonroutine"],
    // defaultSelect: ["routine", "nonroutine"],
  },
  {
    name: 'FLARE STATION',
    label: 'Station',
  },
])('bar', null)
export const mcS42StackBar = mc42('stack', null)
export const drillPie = (groupHandlerName, filterBy) =>
  mc21Pie(
    creatorMaker({
      type: 'drillablePie',
      config: { filterBy, groupHandlerName },
    }),
  )

export const smallCard = card(mc11)
export const midCard = card(mc21)
export const midCard2 = mc21('card', ChartText)
export const cardAveCreator =
  (titleKeyPairs, unit = '') =>
    ({ data }) => {
      const days = getDays()
      const detail = data.reduce((ret, n) => {
        for (let [t, k] of titleKeyPairs) {
          const value = n.type === k ? n.value : 0
          ret[t] = (ret[t] || 0) + (+value || 0)
        }
        return ret
      }, {})
      Object.keys(detail).forEach((i) => {
        detail[i] = detail[i] / days
      })
      return {
        detail,
        unit,
      }
    }
export const getTotalFlaringCreator =
  (filter) =>
    ({ data }) => {
      const filteredData = filter(data)
      const unit = extractUniqValue(filteredData, 'unit')
      const axisData = extractUniqValue(filteredData, 'month').sort(
        (a, b) => mapMonthNameToNumber(a) - mapMonthNameToNumber(b),
      )
      const legendData = extractUniqValue(filteredData, 'type')
      const detail = legendData.map((l) => ({
        name: l,
        stack: 'one',
        type: 'bar',
        data: axisData.map((month) => {
          return (
            sumBy(
              filteredData.filter((f) => f.type === l && f.month === month),
              (f) => f.value,
            ) || 0
          ).toFixed(2)
        }),
        textInfo: axisData.map((month) => {
          return filteredData
            .filter((f) => f.type === l && f.month === month)
            .map((f) => f.comment)
            .filter((i) => i)
            .toString()
        }),
      }))
      return {
        groupHandlerName: 'sum-value',
        zoomInside: true,
        isStack: true,
        unit,
        axisData,
        legendData,
        detail,
        tooltip: {
          trigger: 'item',
          formatter: (params) => {
            const { seriesName, value, name, color, dataIndex } = params
            return `${name}<br /> <span style="display:inline-block;margin-right:5px;
        border-radius:10px;width:9px;height:9px;background-color:${color}"></span> ${seriesName}:${value}<br />
        comment:${detail[params.seriesIndex].textInfo[dataIndex]}`
          },
        },
      }
    }

export const getTotalFlaringByStationCreator =
  (filter) =>
    ({ data }) => {
      const filteredData = filter(data)
      const axisData = extractUniqValue(filteredData, 'dateText')
      const flareStations = extractUniqValue(filteredData, 'FLARE STATION')
      const types = extractUniqValue(filteredData, 'type')
      const legendData = flatten(
        types.map((t) => {
          return flareStations.map((s) => `${s}-${t}`)
        }),
      )
      const series = legendData.map((l) => {
        const [, station, stack] = l.split(/(.*)-/)
        const items = data.filter(
          (d) => d['FLARE STATION'] === station && d.type === stack,
        )
        const textInfo = flattenDeep(
          axisData.map((x) =>
            items.filter((i) => i.dateText === x).map((i) => i.comment),
          ),
        )

        return {
          name: l,
          type: 'bar',
          stack,
          data: axisData.map((x) =>
            sumBy(
              items.filter((i) => i.dateText === x),
              (o) => o.value,
            ),
          ),
          textInfo,
        }
      })
      return {
        axisData,
        legendData,
        unit: extractUniqValue(filteredData, 'unit')[0],
        series,
        tooltip: {
          trigger: 'item',
          formatter: (params) => {
            const { seriesName, value, name, color, dataIndex } = params
            return `${name}<br /> <span style="display:inline-block;margin-right:5px;
        border-radius:10px;width:9px;height:9px;background-color:${color}"></span> ${seriesName}:${value}<br />
        comment:${series[params.seriesIndex].textInfo[dataIndex]}`
          },
        },
      }
    }
export const cardCreator =
  (titleKeyPairs, unit = '') =>
    ({ data }) => {
      const detail = data.reduce((ret, n) => {
        for (let [t, k] of titleKeyPairs) {
          const value = n.type === k ? n.value : 0
          ret[t] = (ret[t] || 0) + (+value || 0)
        }
        return ret
      }, {})
      return {
        detail,
        unit,
      }
    }

export const drillPathFull = { drillPath: ['type', 'company', 'FLARE STATION'] }
export const drillPath = { drillPath: ['company', 'FLARE STATION'] }

export const makeMap = (
  mapSizer,
  mapName,
  filterBy,
  projectios = {
    heatMapProject: 'EPSG:3440',
    pinMapProject: 'EPSG:3440',
    project: 'EPSG:3440',
  },
  props = {},
) =>
  mapSizer(
    creatorMaker({
      type: 'map',
      config: {
        filterBy,
        mapName,
        mapDataConvert: mapCircleData,
        pinDataConvert: mapData,
        queryHeatMapDataConvert: mapData,
        props: {
          selectedLayers: ['heat'],
        },
      },
    }),
    mapName,
    props,
    projectios,
  )
