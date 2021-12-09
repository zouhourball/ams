import { sumBy, curry } from 'lodash-es'
import { concessionGeo } from 'libs/maps'
import { extractUniqValue } from 'libs/utils'
import { query, eq } from 'libs/utils/query'
import { chartSizes } from './consts'

export function mapDataCvtCreator ({
  blockField,
  valueField,
  preprocessor = (i) => i,
}) {
  return (input) => {
    const data = preprocessor(input)
    return extractUniqValue(data, blockField).map((b) => {
      const [xCoord, yCoord] = concessionGeo[b] || concessionGeo['Vacant']
      return {
        xCoord,
        yCoord,
        numberToDisplay: sumBy(query(eq(blockField, b), data), valueField),
        querySymbology: 'default',
        fillColor: '#00996d',
        unit: data[0].unit,
      }
    })
  }
}

export const makeCharts = curry(
  (
    size,
    filters,
    type,
    component,
    creator,
    name,
    props = null,
    custCompProps = {},
  ) => {
    return {
      name,
      type,
      creator,
      filters,
      component,
      width: size[0],
      height: size[1],
      props,
      custCompProps,
    }
  },
)

export const mcDFBySize = (w, h, filters = ['company', 'block']) => {
  return makeCharts(
    [chartSizes[`width${w}`], chartSizes[`height${h}`]],
    filters,
  )
}

export const createGenDualAxisChartCreator =
  ({ sliceBy, unitL, unitR, precision, rotateLabel, series }) =>
    ({ data }) => {
      const axisData = extractUniqValue(data, sliceBy)
      const sumUpDataBy = (xAxis, name, sourceData, filter = (a) => a) =>
        xAxis.map((cat) =>
          sumBy(query(eq(sliceBy, cat))(filter(sourceData)), name),
        )
      const detail = series.reduce(
        (r, i) => ({
          ...r,
          [i.name]: {
            data: sumUpDataBy(axisData, i.dataKey, data, i.filterBy),
            unit: i.unit,
          },
        }),
        {},
      )

      return {
        axisData,
        precision,
        rotateLabel,
        units: [{ name: unitL }, { name: unitR }],
        detail,
        zoomInside: true,
      }
    }

export const createDualAxisChartCreator = ({
  sliceBy,
  confL,
  confR,
  precision,
  rotateLabel,
}) => {
  return createGenDualAxisChartCreator({
    precision,
    rotateLabel,
    sliceBy,
    unitL: confL.unit,
    unitR: confR.unit,
    series: [confL, confR],
  })
}
