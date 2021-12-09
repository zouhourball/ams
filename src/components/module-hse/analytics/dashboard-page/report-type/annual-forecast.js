import { mcS42lineBar, mc42Table, makeMap, mc21MapAnnual } from './utils/shared'
import { query, eq, or } from 'libs/utils/query'
import { extractUniqValue } from 'libs/utils'
import { createExclVsInclCreator } from './utils'

import {
  configMerge,
  title,
  filterByCompanyBlock,
  dataFilter,
  toolbox,
  filterByType,
  vbarline,
  table,
} from 'components/analytics/utils/charts-config-helper'

const filterByName = dataFilter({
  or: [
    {
      eq: ['name', 'Gas Flared\n(Excl. Gas Conservation)'],
    },
    {
      eq: ['name', 'Gas Flared\n(Incl. Gas Conservation)'],
    },
  ],
})
const transFormType = {
  transform: [
    {
      type: 'rule',
      rule: {
        fields: [
          'value',
          'status',
          'reportYear',
          'company',
          'block',
          'unit',
          'name',
          'year',
        ],
        map: [
          {
            col: 'type',
            formula:
              " $name=='Gas Flared\n(Excl. Gas Conservation)' ? 'Excl' : 'Incl' ",
          },
        ],
      },
    },
  ],
}

const inclOrExclGasConservation = or(
  eq('name', 'Gas Flared\n(Excl. Gas Conservation)'),
  eq('name', 'Gas Flared\n(Incl. Gas Conservation)'),
)

export default [
  mcS42lineBar(
    createExclVsInclCreator,
    'Annual Flaring Forecast',
    {
      pinConfig: configMerge(
        title('Annual Flaring Forecast'),
        filterByCompanyBlock,
        toolbox,
        filterByName,
        transFormType,
        vbarline,
        {
          setting: {
            showLegend: true,
            showDataZoomSlider: true,
            unit: 'MMscf/d',
            barSeries: ['Excl'],
            lineSeries: ['Incl'],
          },
          map: {
            seriesBy: 'type',
            split1By: 'year',
            value1Key: 'value',
          },
        },
      ),
    },
    {},
  ),
  mc42Table(
    {
      dataFormatter: (data) => {
        const arr = []
        extractUniqValue(data, 'name').forEach((name) => {
          query(eq('name', name), data).forEach(({ year, value, ...rest }) => {
            if (arr.some((i) => i.name === name)) {
              const item = arr.find((i) => i.name === name)
              item[year] = value
              item.total += value
            } else {
              arr.push({
                ...rest,
                [year]: value,
                total: value,
              })
            }
          })
        })
        return arr
      },
      columnsConfigOnData: (data) => {
        const yearArr = extractUniqValue(data, 'year')
        return [
          {
            name: 'Production',
            dataKey: 'name',
          },
        ]
          .concat(
            yearArr.map((i) => ({
              name: i,
              dataKey: i,
            })),
          )
          .concat({
            name: 'total',
            dataKey: 'total',
          })
      },
    },
    'Annual Flaring Forecast Summary',
    {
      pinConfig: configMerge(
        title('Annual Flaring Forecast Summary'),
        table({
          transform: [
            {
              type: 'javascript',
              code: `function transform(data) {
                const arr = []
                function extractUniqValue(d, key) {
                  let  obj = {}
                  return d.reduce((acc, cur) => {
                    if(!obj[cur[key]]){
                      obj[cur[key]] = 1
                      return acc.concat([cur[key]])
                    }
                    return acc
                  }, [])
                }
                extractUniqValue(data, "name").forEach(name => {
                  data.filter(i => i.name === name).forEach(({ year, value, ...rest }) => {
                    if (arr.some(i => i.name === name)) {
                      const item = arr.find(i => i.name === name)
                      item[year] = value
                      item.total += value || 0
                    } else {
                      arr.push({
                        ...rest,
                        [year]: value,
                        total: value,
                      })
                    }
                  })
                })
                return arr
              }`,
            },
          ],
          setting: {
            columns: [
              {
                name: 'Production',
                dataKey: 'name',
              },
              {
                name: 'Total',
                dataKey: 'total',
              },
            ],
            columnsConfigsOnData: [
              {
                where: 1,
                extractKey: 'year',
                column: {
                  name: '()',
                  dataKey: '()',
                },
              },
            ],
            showSearchBar: true,
          },
        }),
      ),
    },
    {
      exportFileName: 'flaring-monthly-station',
    },
  ),
  makeMap(
    mc21MapAnnual,
    'Annual Flaring Forecast',
    query(inclOrExclGasConservation),
    null,
    {
      pinConfig: configMerge(
        title('Annual Flaring Forecast'),
        filterByCompanyBlock,
        filterByType,
        filterByName,
        transFormType,
        {
          type: 'GisMap',
          map: {
            blockBy: 'block',
            value1Key: 'value',
          },
        },
      ),
    },
  ),
]
