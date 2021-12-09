import echarts from 'echarts'
import concession from 'libs/maps/concession.json'
import { fromPairs } from 'lodash-es'
import concessionGeoData from 'libs/maps/concession-centers-converted.json'

export function init () {
  echarts.registerMap('concession', concession)
}

export const concessionGeo = fromPairs(
  Object.keys(concessionGeoData).map((key) => [
    key,
    concessionGeoData[key].map((n) => +n),
  ]),
)
