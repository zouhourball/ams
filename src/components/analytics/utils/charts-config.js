import { curry, camelCase } from 'lodash-es'
import { chartSizes } from './consts'

export const makeCharts = curry(
  (size, type, component, filters, creator, name, props = null) => {
    return {
      name,
      type,
      creator,
      filters,
      component,
      width: size[0],
      height: size[1],
      props,
    }
  },
)

/**
 * (type,component,filters,creator,name,props)
 */
export const mcSize1 = makeCharts([chartSizes.width1, chartSizes.height1])
export const mcSize21 = makeCharts([chartSizes.width2, chartSizes.height1])
export const mcSize2s1 = makeCharts([chartSizes.width2s, chartSizes.height1])
export const mcSize42 = makeCharts([chartSizes.width4, chartSizes.height2])

/**
 * component,filters,create,name,props
 */
const size = { mcSize1, mcSize21, mcSize2s1, mcSize42 }
const types = ['line-bar', 'card', 'pie', 'table', 'scatter', 'stack']
const functions = {}

Object.keys(size).forEach((s) => {
  for (let t of types) {
    functions[`${s}${camelCase(t)}`] = size[s](t)
  }
})

export default functions
