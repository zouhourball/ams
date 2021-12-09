import { flatMap, flatten } from 'lodash-es'
// import i18n from "i18n-js"
// import l from "libs/langs/keys"

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
              ret[`${next.year}plan`] = next.plan
              return ret
            }, {}),
          }
        }),
      ),
    )
  })
}

export default function (rawSource) {
  const filteredSource = rawSource
    ? rawSource.content.filter((i) => i.metaData.status !== 'ARCHIVED')
    : []
  const source = flattenData(filteredSource)
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
        ...d,
      }
      let dataAry = [common]
      return r.concat(flatten(dataAry))
    }, [])
  } else {
    return []
  }
}

function flattenConfig (content) {
  let res = content.categories
  let [categories] = res
  if (res.length > 0) {
    res = categories.subCategories
    let [subCategories] = res
    if (res.length > 0) {
      res = subCategories.kpis
      let [kpis] = res
      const data = kpis.values.map((elem) => {
        return {
          groupName: elem.year,
          columns: [
            {
              name: 'PLAN',
              dataKey: `${elem.year}plan`,
              align: 'center',
            },
          ],
        }
      })
      return data
    }
  }
}
export const fypTableConfig = (data) => {
  const config = [
    {
      name: 'company',
      dataKey: 'company',
      width: 100,
      align: 'left',
    },
    {
      name: 'block',
      dataKey: 'block',
      width: 100,
      align: 'left',
    },
    {
      name: 'dataStatus',
      dataKey: 'dataStatus',
      width: 120,
      align: 'left',
    },
    {
      name: 'category',
      dataKey: 'category',
      width: 150,
      align: 'left',
    },
    {
      name: 'subCategory',
      dataKey: 'subCategory',
      width: 150,
      align: 'left',
    },
    {
      name: 'kpiGroup',
      dataKey: 'kpiGroup',
      width: 150,
      align: 'left',
    },
    {
      name: 'kpi',
      dataKey: 'kpi',
      width: 150,
      align: 'left',
    },
    {
      name: 'unit',
      dataKey: 'unit',
      width: 150,
    },
  ]
  if (Array.isArray(flattenConfig(data))) {
    return config.concat(flattenConfig(data))
  } else {
    return config.concat([
      {
        groupName: '2016',
        columns: [
          {
            name: 'plan',
            dataKey: '2016plan',
            align: 'center',
          },
        ],
      },
      {
        groupName: '2017',
        columns: [
          {
            name: 'plan',
            dataKey: '2017plan',
            align: 'center',
          },
        ],
      },
      {
        groupName: '2018',
        columns: [
          {
            name: 'plan',
            dataKey: '2018plan',
            align: 'center',
          },
        ],
      },
      {
        groupName: '2019',
        columns: [
          {
            name: 'plan',
            dataKey: '2019plan',
            align: 'center',
          },
        ],
      },
      {
        groupName: '2020',
        columns: [
          {
            name: 'plan',
            dataKey: '2020plan',
            align: 'center',
          },
        ],
      },
    ])
  }
}
