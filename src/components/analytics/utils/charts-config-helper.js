import { isFunction } from 'lodash-es'
import { infHoF } from '@target-energysolutions/utils'

export const symbols = {
  mergeByType: Symbol('merge by type'),
  ...infHoF.symbols,
}

export function drill (path) {
  return {
    interaction: [
      {
        type: 'drill',
        path,
      },
    ],
  }
}
infHoF.registerMergeByField(symbols.mergeByType, 'type')
/**
 * Infinite High Order Function Generagtor
 */
export const infHOFngen = infHoF.infHOFgen
const definitionByCompanyBlock = [
  {
    type: 'check',
    label: 'company',
    field: 'company',
  },
  {
    type: 'check',
    label: 'block',
    field: 'block',
    filterBy: 'company',
  },
]
export const filterByCompanyBlock = () => ({
  filter: {
    type: 'simple',
    definition: definitionByCompanyBlock,
  },
})
export const filterByComBlockBeforeTransform = () => ({
  filter: {
    type: 'simple',
    phase: 'before transform',
    definition: definitionByCompanyBlock,
  },
})

export const filterByMaterialCategory = () => ({
  filter: {
    type: 'simple',
    definition: [
      {
        type: 'check',
        label: 'company',
        field: 'company',
      },
      {
        type: 'check',
        label: 'block',
        field: 'block',
        filterBy: 'company',
      },
      {
        type: 'check',
        label: 'Material Category',
        field: 'Material Category',
      },
    ],
  },
})

export const filterByType = () => ({
  filter: {
    type: 'simple',
    definition: [
      {
        type: 'check',
        label: 'Type',
        field: 'type',
      },
    ],
  },
})

export const chartConfig = infHOFngen((config) => config)
export const pie = chartConfig({ type: 'Pie' })
export const card = chartConfig({ type: 'Card' })
export const table = chartConfig({ type: 'HighLightTable' })
export const pinWashline = chartConfig({ type: 'WashLine' })
export const scatter = chartConfig({
  type: 'Scatter',
})
export const hasDatePicker = {
  hasDatePicker: true,
}
export const vbar = chartConfig({ type: 'VBar' })
export const vbarline = chartConfig({ type: 'VBarLine' })
export const hbar = chartConfig({ type: 'HBar' })
export const stack = chartConfig({ type: 'VBarStack' })

export const line = chartConfig({ type: 'Line' })
export const gauge = chartConfig({ type: 'PerGauge' })

export const dataFilter = (objCond) => ({
  dataFilter: `json://${JSON.stringify(objCond)}`,
})

const ruleTransform = (rule) =>
  chartConfig({
    transform: [
      symbols.mergeByType,
      {
        type: 'rule',
        rule: {
          ...rule,
        },
      },
    ],
  })

/**
 * map:[{
 *   col,
 *   formula
 * }]
 */
export const mapTransform = (map) =>
  ruleTransform({
    map,
  })
export const flattenTransform = ({
  columns,
  typeColumn = 'type',
  valueColumn = 'value',
}) =>
  ruleTransform({
    flatten: {
      columns,
      typeColumn,
      valueColumn,
    },
  })
export const splitTransform = ({ columns, splitColumn, valueColumn }) =>
  ruleTransform({
    split: {
      columns,
      splitColumn,
      valueColumn,
    },
  })

/**
 * fields:[string]
 */
export const fieldsTransform = (fields) =>
  ruleTransform({
    fields,
  })

export const simpleFilter = (definition) =>
  chartConfig({
    filter: {
      type: 'simple',
      definition,
    },
  })
export const toolbox = {
  toolbox: [
    {
      name: 'dataView',
      position: 'dropdown',
      title: 'Data View',
    },
    {
      name: 'saveAsImage',
      position: 'dropdown',
      title: 'Export',
      settings: {
        type: 'png',
        backgroundColor: '#00fea1',
      },
    },
  ],
}
export const formatter = {
  formatter: [
    {
      name: 'DD/MM/YYYY',
      type: 'dateFmt',
      params: ['DD/MM/YYYY'],
    },
    {
      name: 'numberFmt',
      type: 'toFixed',
      params: [2],
    },
  ],
}
export const title = (title) => ({ title })
export const comparer = {
  comparer: [
    {
      type: 'date',
      name: 'dateCmp',
    },
  ],
}
export const monthComparer = {
  comparer: [
    {
      name: 'month-str',
      type: 'month',
    },
  ],
}
export const monthTableComparer = {
  comparer: [
    {
      type: 'table',
      name: 'monTable',
      ignoreCase: true,
      table: {
        jan: 1,
        feb: 2,
        mar: 3,
        apr: 4,
        may: 5,
        jun: 6,
        jul: 7,
        aug: 8,
        sep: 9,
        oct: 10,
        nov: 11,
        dec: 12,
      },
    },
  ],
}

export function configMerge (...configs) {
  let ret = {}
  for (let f of configs) {
    if (isFunction(f)) {
      ret = infHoF.merge(ret, f({ [infHoF.symbols.apply]: true }))
    } else {
      ret = infHoF.merge(ret, f)
    }
  }
  return ret
}
