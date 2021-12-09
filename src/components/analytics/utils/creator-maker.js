import { compose } from 'redux'
import { isFunction, isArray, curry } from 'lodash-es'
import { extractUniqValue } from 'libs/utils'
import { query, eq, and } from 'libs/utils/query'
import {
  createPieResult,
  createTableResult,
  createStackBarResult,
  createMapResult,
  createBarResult,
  createGaugeResult,
  createLineResult,
  createWashlineResult,
  createCardResult,
  createHeatMapResult,
} from './creator-impl'

const getHandler = (name, precision = 2) => {
  const [cat, value] = name.split('-')
  if (cat === 'sum') {
    return (dataAry) => {
      let sum = dataAry
        ? dataAry.reduce((r, d) => r + (Number(d[value]) || 0), 0)
        : 0
      return +sum.toFixed(precision)
    }
  } else if (cat === 'count') {
    return (dataAry) => (dataAry ? dataAry.reduce((r) => r + 1, 0) : 0)
  }

  return () => 0
}

const enhanceCreatorParams =
  (enhancer) =>
    (creatorMaker) =>
      (...makerParams) =>
        (...creatorParams) =>
          creatorMaker(...makerParams)(...enhancer({ creatorParams, makerParams }))

const makeDrillable = ({
  creatorParams: [{ data }, { dataDrill, drillPath, ...rest }],
}) => {
  const drillLevel = dataDrill.length
  const drillQueryCond = and(
    ...new Array(drillLevel)
      .fill()
      .map((_, i) => eq(drillPath[i], dataDrill[i])),
  )
  const validData = drillLevel ? query(drillQueryCond)(data) : data

  return [
    { data: validData },
    { overrideSliceByKeys: [drillPath[drillLevel]], ...rest },
  ]
}

const makeAixsConfigable = ({
  creatorParams: [{ data }, { configSelection, ...rest }],
}) => {
  return [
    { data },
    {
      overrideSliceByKeys: configSelection.map((c) => c.selections[0]),
      ...rest,
    },
  ]
}

const makeFilterable = ({
  makerParams: [{ filterBy }],
  creatorParams: [{ data }, ...rest],
}) => [{ data: filterInitialData(data, filterBy) }, ...rest]

const makePreprocessable = ({
  makerParams: [{ preprocessor }],
  creatorParams: [{ data }, ...rest],
}) => [{ data: preprocessor ? preprocessor(data) : data }, ...rest]

const drillable = enhanceCreatorParams(makeDrillable)
const axisConfigable = enhanceCreatorParams(makeAixsConfigable)
const applyFilterToMaker = enhanceCreatorParams(makeFilterable)
const applyPreprocessorToMaker = enhanceCreatorParams(makePreprocessable)

function filterInitialData (data, filterBy) {
  return filterBy
    ? (isFunction(filterBy)
      ? filterBy
      : query(and(...Object.keys(filterBy).map((k) => eq(k, filterBy[k])))))(
      data,
    )
    : data
}

const dimensionUpBy = curry((key, preset, data) =>
  (preset || extractUniqValue(key)).map((k) => query(eq(key, k))(data)),
)

const actThru = curry((act, data) => {
  return data && (isArray(data[0]) ? data.map(actThru(act)) : act(data))
})

const dimensionUpWithFixedAxis = (axisKeys) => (data, key, index) =>
  actThru(dimensionUpBy(key, axisKeys[index]), data)

function createNDResult ({ sliceByKeys, groupHandlerName, precision }) {
  return ({ data }, { overrideSliceByKeys } = {}) => {
    const slicingKeys = overrideSliceByKeys
      ? overrideSliceByKeys
        .map((k, i) => k || sliceByKeys[i])
        .concat((sliceByKeys || []).slice(overrideSliceByKeys.length))
      : sliceByKeys
    const keyMatrix = slicingKeys
      ? slicingKeys.map((key) => extractUniqValue(data, key))
      : [['']]
    const dataND = slicingKeys
      ? slicingKeys.reduce(dimensionUpWithFixedAxis(keyMatrix), data)
      : [data]
    const unitArr = Array.from(new Set(data.map((i) => i.unit)))
    const unit =
      unitArr.length > 1
        ? data.map((i) => i.unit)
        : (data[0] && data[0].unit) || ''

    return {
      keys: keyMatrix,
      data: actThru(getHandler(groupHandlerName, precision), dataND),
      unit,
    }
  }
}

export function createFromNDResult (impl) {
  return (config) => {
    const dataRigger = createNDResult(config)
    return (...params) => {
      const riggedData = dataRigger(...params)
      const { postNDProcess } = config
      const { keys, data, unit } = postNDProcess
        ? postNDProcess(riggedData)
        : riggedData

      return impl(keys, data, unit, config)
    }
  }
}

const creatorEnum = {
  drillablePie: { enhancers: [drillable], runner: createPieResult },
  bar: { enhancers: [axisConfigable], runner: createBarResult },
  pie: createPieResult,
  card: createCardResult,
  table: createTableResult,
  stack: createStackBarResult,
  line: createLineResult,
  map: createMapResult,
  gauge: createGaugeResult,
  washline: createWashlineResult,
  heatmap: createHeatMapResult,
}

const commonEnhancer = [applyFilterToMaker, applyPreprocessorToMaker]

export const creatorMaker = ({ type, config }) => {
  const maker = creatorEnum[type]
  const enhancer = compose(...[...(maker.enhancers || []), ...commonEnhancer])
  return maker && enhancer(maker.runner || maker)(config)
}
