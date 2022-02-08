import { flatMap, flatten, flattenDeep } from 'lodash-es'
import { MonthNames, MonthNameLabels } from 'libs/consts'
import { fixNbr } from 'libs/utils'

function flattenData (content) {
  return flatMap(content, ({ categories, metaData }) => {
    const { year, company, block } = metaData
    return flatMap(categories, ({ name, subCategories }) =>
      flatMap(subCategories, (sub) =>
        flatMap(sub.kpis, (kpiInfo) => {
          return {
            year,
            company,
            block,
            category: name,
            subCategory: sub.name,
            kpiId: kpiInfo.id,
            kpi: kpiInfo.name,
            kpiGroup: kpiInfo.kpiGroup,
            unit: kpiInfo.unit,
            ...kpiInfo.values.reduce((ret, next) => {
              ret[`${next.month}-Plan`] = next.data.PLAN
              ret[`${next.month}-Actual`] = next.data.ACTUAL
              return ret
            }, {}),
          }
        }),
      ),
    )
  })
}
export function converFypPlanningData ({ content }) {
  if (content) {
    return flatMap(content, ({ categories, metaData }) => {
      const { company, block } = metaData
      return flatMap(categories, ({ name, subCategories }) =>
        flatMap(subCategories, (sub) =>
          flatMap(sub.kpis, (kpiInfo) => {
            const { values } = kpiInfo
            const base = {
              company,
              block,
              category: name,
              subCategory: sub.name,
              kpiId: kpiInfo.id,
              kpi: kpiInfo.name,
              kpiGroup: kpiInfo.kpiGroup,
              unit: kpiInfo.unit,
            }
            const years = values.map((i) => i.year)
            return years.map((y) => ({
              ...base,
              year: y,
              type: 'PLAN',
              value: fixNbr(values.find((v) => v.year === y).plan),
            }))
          }),
        ),
      )
    })
  }
}

export function converBudgetaryPlanningData ({ content }) {
  return flattenDeep(
    content.map((report) => {
      const { data, metaData } = report
      return data.map((d) => {
        const { years } = d
        return years.map((year) => ({
          year: year.year,
          value: year.value,
          block: metaData.block,
          company: metaData.company,
          unit: d.unit,
          sector: d.sector,
          item: d.item,
        }))
      })
    }),
  )
}

export default function ({ content }) {
  const source = flattenData(content)
  if (source && source.length) {
    return source.reduce((r, d) => {
      const common = {
        category: d.category,
        subCategory: d.subCategory,
        unit: d.unit,
        block: d.block,
        year: d.year,
        company: d.company,
        kpiGroup: d.kpiGroup,
        kpi: d.kpi,
      }

      let dataAry = MonthNames.map((i, k) => [
        {
          ...common,
          month: i,
          value:
            Number(d[`${MonthNameLabels[k].toUpperCase()}-Actual`]).toFixed(
              3,
            ) || 0,
          dataStatus: 'ACTUAL',
        },
        {
          ...common,
          month: i,
          value:
            Number(d[`${MonthNameLabels[k].toUpperCase()}-Plan`]).toFixed(3) ||
            0,
          dataStatus: 'PLAN',
        },
      ])

      return r.concat(flatten(dataAry))
    }, [])
  } else {
    return []
  }
}
