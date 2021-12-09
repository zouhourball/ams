import { Component } from 'react'
import { isArray, curry, identity, flatMap } from 'lodash-es'
import { processDetail } from 'libs/consts'
import { connect } from 'react-redux'

import { setDashboardCategories } from 'modules/dashboard/actions'
import ChartLayout from 'components/chart-layout'
import { updateReportTypeForCurrentModule } from 'modules/analytics/actions'
export function chartsPageCreator (chartsConfig) {
  const wraped = (props) => {
    return <ChartsPage chartsConfig={chartsConfig} {...props} />
  }
  wraped.displayName = `ChartsPage(ChartsPage)`
  return wraped
}

@connect(
  ({ dashboard }) => ({
    selectedCategory: dashboard.selectedCategory,
  }),
  {
    setDashboardCategories,
    updateReportTypeForCurrentModule,
  },
)
export default class ChartsPage extends Component {
  static defaultProps = {
    optionCreatorArgsProvider: () => {},
  }

  componentDidMount () {
    this.props.setDashboardCategories(
      this.props.chartsConfig.map((d) => ({
        title: d.title,
        reportType: d.reportType,
      })),
    )
    this.props.updateReportTypeForCurrentModule(
      this.props.chartsConfig[0].reportType,
    )
  }
  componentWillUnmount () {
    this.props.setDashboardCategories([])
  }

  render () {
    /**
     * chartsConfig = [
     *  //categories
     *  {
     *     title: string,
     *     reportType: string,        //optional, if set only display for that type
     *     groups:[
     *       {
     *         title:string,
     *         subTitle: string,
     *         charts:[
     *           {
     *             name: string,
     *             creator: function, // echarts option creator
     *             KPIs: [string],
     *           }
     *         ]
     *       }
     *     ]
     *  }
     * ]
     */
    const {
      data,
      filters,
      chartsConfig,
      optionCreatorArgsProvider,
      selectedCategory,
      appInfo,
    } = this.props
    const { reportType } = filters || {}
    // const reportType = 'annual-resource'
    const { appName } = appInfo
    const args = optionCreatorArgsProvider()
    let apiView
    if (appName && reportType) {
      apiView = processDetail[appName][reportType]
    }

    let validChartsConfig = chartsConfig.filter(
      (c) => !c.reportType || c.reportType === reportType,
    )

    let category = selectedCategory
      ? validChartsConfig.find(({ title }) => title === selectedCategory.title)
      : null
    return (
      <div>
        <ChartLayout
          data={flatMap((category && category.groups) || [], (group) =>
            group.charts.map((chart) => ({
              refreshStamp: chart.doRefresh && new Date().getTime(),
              key: `${category.title}-${group.title}-${chart.name}`,
              title: chart.name,
              height: chart.height,
              width: chart.width,
              type: chart.type,
              filters: chart.filters,
              component: chart.component,
              data,
              creator: isArray(chart.creator)
                ? chart.creator.map((c) => (d, opts, ...rest) => {
                  const { filter } = opts
                  return c(
                    {
                      data: d,
                      configFilter: filter,
                      KPIs: chart.KPIs,
                      ...args,
                    },
                    opts,
                    ...rest,
                  )
                })
                : (d, opts, ...rest) => {
                  const { filter } = opts
                  return chart.creator(
                    {
                      data: d,
                      configFilter: filter,
                      KPIs: chart.KPIs,
                      ...args,
                    },
                    opts,
                    ...rest,
                  )
                },
              group: group.title,
              custCompProps: chart.custCompProps,
              props: {
                ...chart.props,
                mainFilters: filters,
                apiView,
              },
            })),
          )}
        />
      </div>
    )
  }
}

export const chartsConfigFilter = curry(
  (catPredict, groupPredict, chartPredict, chartsConfig) =>
    chartsConfig.filter(catPredict).map((cat) => ({
      ...cat,
      groups: cat.groups.filter(groupPredict).map((group) => ({
        ...group,
        charts: group.charts.filter(chartPredict),
      })),
    })),
)
/**
 * filter groups and charts
 */
export const filterByGroupAndCharts = chartsConfigFilter(identity)
export const filterByCharts = filterByGroupAndCharts(identity)
