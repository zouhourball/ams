import React from 'react'
import onClickOutside from 'react-onclickoutside'
import { Paper, Card, FontIcon } from 'react-md'
import cls from 'classnames'
import echarts from 'echarts/lib/echarts'
import '@target-energysolutions/charts-enhance'
import { addToast } from 'modules/app/actions'
import { connect } from 'react-redux'
import { merge, isEqual, isArray, get } from 'lodash-es'
import ChartPopupPanel from 'components/chart-popup-panel'
import { extractUniqValue } from 'libs/utils'
import { getProcessedFilters } from 'libs/utils/process-filter'

import 'components/chart-group/chart/styles.scss'
import produce from 'immer'
import { getOption } from 'libs/utils/custom-chart-option'
import MultiSelectDropdown from '@target-energysolutions/multi-select-dropdown'
import { query, includedIn } from 'libs/utils/query'
import '@target-energysolutions/multi-select-dropdown/styles.css'
import './toolbox-view.js'
import update from 'immutability-helper'
import Toolbox from './toolbox'
import { pinToWorkSpace } from 'libs/api/api-pin'

import { AMS_BI_CHART_THEME } from 'libs/consts'

function getSelectionWithExtractor (extractor) {
  return function (filterDefs, selectedItems) {
    return filterDefs.filter(extractor).reduce((r, def) => {
      const attrName = def.name || def
      r[attrName] = (selectedItems[attrName] || []).map((i, index) => ({
        index,
        name: String(i),
      }))
      return r
    }, {})
  }
}
const getFilterSelection = getSelectionWithExtractor((d) => !d.forConfig)
const getConfigSelection = getSelectionWithExtractor((d) => d.forConfig)

function getDefaultFilterSelection (filterDefs, filterItems, forConfig) {
  let obj = {}
  if (filterDefs) {
    filterDefs.forEach((i) => {
      if (forConfig) {
        if (!i.forConfig) {
          return
        }
      } else if (i.forConfig) {
        return
      }

      const filterName = i.name || i
      const defaultSelect = i.defaultSelect
      const items = filterItems[filterName]

      obj[filterName] = (
        defaultSelect ? items.filter((i) => defaultSelect.includes(i)) : items
      ).map((a, index) => ({
        index,
        name: `${a}`,
      }))
    })
  }

  return obj
}

function getFilterItems (filterDefs, data) {
  return (
    filterDefs &&
    filterDefs.reduce((r, f) => {
      const filterName = f.name || f
      const items = f.items

      r[filterName] = items || extractUniqValue(data, filterName)
      return r
    }, {})
  )
}

@onClickOutside
class FilterComp extends React.PureComponent {
  handleClickOutside = this.props.hide

  render () {
    const { filters, filterData, filterConfig, filterItems, changeFilter } =
      this.props
    const selected = { ...filterData, ...filterConfig }

    return (
      <Card className="ams-chartgroupchart-filters">
        {filters.map((f) => {
          const filterName = f.name || f
          const filterLabel = f.label || f.name || f
          const filterType = f.type
          return (
            <MultiSelectDropdown
              key={filterName}
              singleSelect={filterType === 'single'}
              itemType="sections"
              label={filterLabel}
              labelDropdown
              selectedItems={
                selected[filterName]
                  ? selected[filterName].map((i) =>
                    (f.items || filterItems[filterName]).findIndex(
                      (item) => i.name === item,
                    ),
                  )
                  : []
              }
              onChange={(e) => changeFilter(e, filterName, f.forConfig)}
              items={f.items || filterItems[filterName]}
            />
          )
        })}
      </Card>
    )
  }
}
// @withRouter
@connect(
  ({ app, query, commonAnalytics }) => ({
    theme: app.theme,
    me: query.DEFAULT.me,
    customThemes: app.customThemes,
    sharedFilters: commonAnalytics.sharedFilters,
  }),
  {
    addToast,
  },
)
export default class ChartGroupChart extends React.Component {
  static defaultProps = {
    events: {},
    btnDefs: [],
  }
  constructor (props) {
    super(props)
    const { selectedFilters, selectedConfig, filters, data } = this.props
    const filterItems = getFilterItems(filters, data)
    this.state = {
      // [{key: {string}, value: {string|number}}]
      dataDrill: [],
      themeVisible: false,
      theme: this.props.theme,
      data: this.props.data,
      option:
        getOption(
          this.props.creator &&
            this.invokeCreator(
              this.props.creator,
              this.props.data,
              getDefaultFilterSelection(filters, filterItems, true),
            ),
          this.props.type,
        ) || {},
      viewVisible: false,
      viewOption: {},
      viewName: '',
      echartOption: this.chart && this.chart.getOption(),
      viewCreator: null,
      viewData: null,
      toolboxVisible: false,
      filterVisible: false,
      filterData: getDefaultFilterSelection(
        filters,
        selectedFilters || filterItems,
      ),
      filterItems,
      validData: data,
      height: this.props.height,
      chartExt: getDefaultFilterSelection(
        filters,
        selectedConfig || filterItems,
        true,
      ),
      zoomHeaderHeight: 102,
    }
  }

  handleCancelClick = () => {
    this.setState({ themeVisible: false })
  }
  handleZoomClick = ({ option, title, data, creator }) => {
    this.setState({
      viewVisible: true,
      viewOption: option,
      viewName: title,
      viewCreator: creator,
      viewData: data,
    })
  }
  toggleChartViewVisible = () => {
    this.setState(() => ({
      viewVisible: !this.state.viewVisible,
    }))
  }
  handleApplyClick = (theme) => {
    const { option, chartId } = this.props
    const themeName = `${chartId}`
    const customThemes =
      JSON.parse(localStorage.getItem(AMS_BI_CHART_THEME)) || {}
    const chartType =
      option && option.series && option.series[0] && option.series[0].type
    if (!customThemes['themes']) {
      customThemes['themes'] = {}
    }
    if (!customThemes['config']) {
      customThemes['config'] = {}
    }
    customThemes['themes'][chartId] = theme
    customThemes['config'][chartId] = { type: chartType, theme: themeName }

    echarts.registerTheme(themeName, theme)
    this.setState({
      theme: themeName,
      themeVisible: false,
    })
    localStorage.setItem(AMS_BI_CHART_THEME, JSON.stringify(customThemes))
  }

  toggleChartFilter = (givenState) => {
    const { filterVisible } = this.state
    this.setState({
      filterVisible: givenState !== undefined ? givenState : !filterVisible,
    })
  }

  updateData = () => {
    const { filterData, chartExt } = this.state
    const { data, creator, type, custom } = this.props
    const validData = Object.keys(filterData).reduce(
      (r, k) =>
        query(
          includedIn(
            k,
            filterData[k].map((i) => i.name),
          ),
          r,
        ),
      data,
    )
    const filter = Object.keys(chartExt).reduce(
      (pre, cur) => ({ [cur]: chartExt[cur].map((i) => i.name), ...pre }),
      chartExt,
    )

    this.setState({
      validData,
      option: this.rawOption(
        getOption(this.invokeCreator(creator, validData, filter), type),
        custom,
      ),
    })
  }

  changeFilter = (selected, key, forConfig) => {
    const { filterItems } = this.state
    if (!forConfig) {
      this.setState(
        {
          filterData: {
            ...this.state.filterData,
            [key]: selected.map((i) => ({
              index: i,
              name: filterItems[key][i].toString(),
            })),
          },
        },
        this.updateData,
      )
    } else {
      this.setState(
        update(this.state, {
          chartExt: {
            [key]: {
              $set: selected.map((i) => ({
                index: i,
                name: filterItems[key][i].toString(),
              })),
            },
          },
        }),
        this.updateData,
      )
    }
  }

  toolItemmyPinClick = () => {
    this.onPin()
  }

  componentWillUnmount () {
    this.destroyEcharts()
  }
  render () {
    const {
      title,
      subTitle,
      chartStyle,

      className,
      chartConfig: config,
      type,
      filters,
      CustComp,
      drillPath,
      creator,
      width,
      data,
      zoom,
      refreshOnDataUpdate,
      height,
      btnDefs,
      pinConfig,
      mainFilters,
      apiView,
    } = this.props
    const {
      filterData,
      option,
      viewVisible,
      viewOption,
      viewName,
      viewCreator,
      viewData,
      filterVisible,
      toolboxVisible,
      filterItems,
      validData,
      chartExt,
    } = this.state
    const SideCardComp = null
    return (
      <Paper className={cls('ams-chartgroupchart', 'md-box-shadow', className)}>
        <div className="ams-chartgroupchart-title-container">
          {title && <div className="ams-chartgroupchart-title">{title}</div>}
          {subTitle && (
            <div className="ams-chartgroupchart-sub-title">{subTitle}</div>
          )}
          <div className="ams-chartgroupchart-top-toolbar">
            {!zoom && filters && (
              <FontIcon
                iconClassName={cls(
                  'mdi mdi-dots-vertical',
                  toolboxVisible && 'mdi-show',
                )}
                onClick={() =>
                  this.setState({ toolboxVisible: !this.state.toolboxVisible })
                }
              />
            )}
            {!zoom && (
              <FontIcon
                iconClassName="mdi mdi-arrow-expand"
                onClick={() =>
                  this.handleZoomClick({
                    option,
                    title,
                    data,
                    creator,
                  })
                }
              />
            )}
          </div>
        </div>
        {filters && filterVisible && (
          <FilterComp
            {...{
              filters,
              filterData,
              filterConfig: chartExt,
              filterItems,
              changeFilter: this.changeFilter,
              hide: () => setTimeout(() => this.toggleChartFilter(false), 1),
            }}
          />
        )}
        {(toolboxVisible || zoom) && (
          <Toolbox
            chart={this.chart}
            btnDefs={btnDefs.map((i) => ({
              ...i,
              onClick: this[`toolItem${i.name}Click`] || i.onClick,
            }))}
          />
        )}
        <div
          className="ams-chartgroupchart-content-wrapper"
          style={{
            display: SideCardComp ? 'flex' : 'block',
          }}
        >
          <div className="ams-chartgroupchart-content">
            {CustComp ? (
              <div
                className="ams-chartgroupchart-content-cust-comp"
                style={{ width, height }}
              >
                {type === 'table' && zoom ? (
                  <CustComp
                    {...this.props.custCompProps}
                    {...this.invokeCreator(creator, validData, chartExt)}
                    rowsPerPage={null}
                    footerComponents={[]}
                    readonly
                    hideSearchBar={false}
                  />
                ) : (
                  <CustComp
                    {...this.props.custCompProps}
                    {...this.invokeCreator(creator, validData, chartExt)}
                  />
                )}
              </div>
            ) : (
              <div
                style={{ ...chartStyle, width, height }}
                ref={(ref) => (this.node = ref)}
              />
            )}
          </div>
          {SideCardComp && (
            <div className="ams-chartgroupchart-side-card">
              <SideCardComp
                option={option || {}}
                echartOption={this.chart && this.chart.getOption()}
              />
            </div>
          )}
        </div>
        <ChartPopupPanel
          id={viewName}
          title={viewName}
          chartOption={viewOption}
          chartCreator={viewCreator}
          chartData={viewData}
          chartConfig={config}
          chartType={type}
          visible={viewVisible}
          filters={filters}
          onHide={this.toggleChartViewVisible}
          custCompProps={this.props.custCompProps}
          CustComp={CustComp}
          drillPath={drillPath}
          refreshOnDataUpdate={refreshOnDataUpdate}
          pinConfig={pinConfig}
          mainFilters={mainFilters}
          apiView={apiView}
        />
      </Paper>
    )
  }

  onClick = (clickParam) => {
    // handle drill
    const { drillPath, drillUpdate } = this.props
    const { dataDrill } = this.state
    const { name } = clickParam
    if (drillPath && drillPath.length > dataDrill.length + 1 && name) {
      if (drillUpdate) drillUpdate(dataDrill.concat(name))
      this.setState({ dataDrill: dataDrill.concat(name) }, this.updateData)
    }

    // handle external click
    const { onClick } = this.props
    const { option } = this.state
    if (onClick) {
      onClick(clickParam, option, this.setState.bind(this))
    }
  }

  onLegendselectchanged = (param) => {
    this.setState({
      option: {
        ...this.state.option,
        legengdSelected: param,
      },
      legengdSelected: param,
    })
  }

  componentDidMount () {
    const { custom, chartId } = this.props
    const { option } = this.state
    if (!this.initEcharts()) return

    this.chart.setOption(this.rawOption(option, custom), true)

    if (this.chart) this.chart.on('click', this.onClick)
    this.setState({
      echartOption: this.chart && this.chart.getOption(),
    })
    if (custom) {
      const customThemes =
        JSON.parse(localStorage.getItem(AMS_BI_CHART_THEME)) || {}
      const chartType =
        option && option.series && option.series[0] && option.series[0].type
      if (customThemes['themes']) {
        Object.keys(customThemes['themes']).forEach((key) => {
          if (key !== 'all') {
            echarts.registerTheme(key, customThemes['themes'][key])
          }
        })
      }

      if (customThemes['all'] && customThemes['all'][chartType]) {
        this.props.setCustomChartTheme(
          chartType,
          customThemes['all'][chartType],
        )
        // this.setState({ theme: customThemes["all"][chartType] })
      }
      if (
        customThemes['config'] &&
        customThemes['config'][chartId] &&
        customThemes['config'][chartId].theme
      ) {
        this.setState({ theme: customThemes['config'][chartId].theme })
      }
    }
  }

  onPin = async () => {
    const {
      pinConfig,
      mainFilters,
      apiView,
      location: { pathname },
      // addToast,
      sharedFilters,
    } = this.props
    // process filter to match backend std
    const processedFilters = getProcessedFilters(mainFilters, sharedFilters)
    const appName = pathname.split('/')[2]
    const chartName = get(pinConfig, 'title')
    const { dateRange } = sharedFilters
    const startDate = get(dateRange, 'startDate')
    const endDate = get(dateRange, 'endDate')
    let dateRangeDifinition = {}
    let newConfig = Object.assign({}, pinConfig)
    if (startDate && endDate && pinConfig.hasDatePicker) {
      dateRangeDifinition = {
        type: 'dateRange',
        label: 'Date Range',
        field: 'reportDate',
        startDate: new Date(startDate).toString(),
        endDate: new Date(endDate).toString(),
      }
      newConfig = produce(newConfig, (draft) => {
        if (draft.filter) {
          draft.filter.definition.push(dateRangeDifinition)
        } else {
          draft.filter = {
            type: 'simple',
            definition: [dateRangeDifinition],
          }
        }
      })
    }
    try {
      const res = await pinToWorkSpace({
        appName,
        metaData: {
          config: newConfig,
          dataConfig: {
            url: `${PRODUCT_APP_URL_PULSE}/docs/api/v2/${apiView}/filter`,
            body: processedFilters,
          },
        },
        name: chartName,
      })
      if (res) {
        // addToast(i18n.t(l.ping_success), i18n.t(l.hide))
      }
    } catch (e) {
      // addToast(e, i18n.t(l.hide))
    }
  }

  rawOption = (option, custom) => {
    const { onDuplicationClick, onEditClick, title, drillPath, pinConfig } =
      this.props

    let rawOption =
      option && option.baseOption
        ? merge({}, option, {
          baseOption: {
            toolbox: {
              feature: {
                myRestore: {
                  show: true,
                  title: 'Restore',
                  icon: 'path://M554.666667,128a384,384,0,0,0-384,384H42.666667l165.973333,165.973333,2.986667,5.973334L384,512H256c0-165.12,133.546667-298.666667,298.666667-298.666667s298.666667,133.546667,298.666666,298.666667-133.546667,298.666667-298.666666,298.666667c-82.346667,0-157.013333-33.706667-210.773334-87.893334l-60.586666,60.586667A382.037333,382.037333,0,0,0,554.666667,896a384,384,0,0,0,0-768z,m-42.666667,213.333333v213.333334l182.613333,108.373333,30.72-51.626667-149.333333-88.746666V341.333333H512z',
                  onclick: () => {
                    this.setState({ option: this.state.option })
                  },
                },
              },
            },
          },
          title: {
            text: title,
          },
        })
        : merge({}, custom ? {} : option, {
          toolbox: {
            feature: {
              myRestore: {
                show: Boolean(drillPath),
                title: 'Restore',
                icon: 'path://M554.666667,128a384,384,0,0,0-384,384H42.666667l165.973333,165.973333,2.986667,5.973334L384,512H256c0-165.12,133.546667-298.666667,298.666667-298.666667s298.666667,133.546667,298.666666,298.666667-133.546667,298.666667-298.666666,298.666667c-82.346667,0-157.013333-33.706667-210.773334-87.893334l-60.586666,60.586667A382.037333,382.037333,0,0,0,554.666667,896a384,384,0,0,0,0-768z,m-42.666667,213.333333v213.333334l182.613333,108.373333,30.72-51.626667-149.333333-88.746666V341.333333H512z',
                onclick: () => {
                  if (this.props.drillUpdate) this.props.drillUpdate([])
                  this.setState({ dataDrill: [] }, this.updateData)
                },
              },
              myPin: {
                show: !!pinConfig,
                onclick: this.onPin,
              },
              myDuplication: {
                show: !!custom,
                onclick: (opt) => {
                  if (onDuplicationClick) {
                    onDuplicationClick(opt)
                  }
                },
              },
              myEdit: {
                show: !!custom,
                onclick: (opt) => {
                  if (onEditClick) {
                    onEditClick(opt)
                  }
                },
              },
              myPie: {
                show: false,
                onclick: (opt) => {
                  // TODO: Switch to Pie Chart
                },
              },
              myTheme: {
                show: !!custom,
                onclick: (opt) => {
                  this.setState({
                    themeVisible: true,
                  })
                },
              },
              SaveDataView: {
                show: true,
                icon: 'path://M13,9H18.5L13,3.5V9M6,2H14L20,8V20A2,2 0 0,1 18,22H6C4.89,22 4,21.1 4,20V4C4,2.89 4.89,2 6,2M15,18V16H6V18H15M18,14V12H6V14H18Z',
              },
            },
          },
          title: {
            show: false,
            text: title,
          },
        })
    const baseColorOptions = {
      color: [
        '#4F69FF',
        '#4DB6AC',
        '#FF5B5A',
        '#93E196',
        '#C1CAFF',
        '#FCA532',
        '#37C4F4',
        '#9C63F8',
        '#E1E124',
        '#E558FF',
        '#CF45B2',
        '#1DBB5F',
        '#D44731',
        '#21A1C9',
        '#5B39CC',
      ],
    }
    if (this.props.type === 'stack') {
      baseColorOptions.color = [
        '#4DB6AC',
        '#84DDD5',
        '#854CC8',
        '#C79FF5',
        '#92E196',
        '#D9FCDA',
        '#4F69FF',
        '#C1CAFF',
      ]
    }
    if (this.props.type === 'scatter') {
      baseColorOptions.color = [
        '#00C7FF',
        '#93E196',
        '#FFCA28',
        '#4F69FF',
        '#FF5B5A',
      ]
    }
    if (this.props.zoom) {
      let zoomOption = {
        yAxis: [
          {
            nameTextStyle: {
              fontSize: 20,
            },
          },
          {
            nameTextStyle: {
              fontSize: 20,
            },
          },
        ],
        title: [
          {
            top: '1%',
            text: title,
          },
        ],
        grid: {
          top: '14%',
        },
        toolbox: {
          showTitle: true,
          feature: {
            saveAsImage: { show: true },
          },
        },
        xAxis: {
          axisLabel: {
            formatter: null,
          },
        },
      }
      if (
        rawOption &&
        rawOption.series &&
        rawOption.series[0] &&
        (rawOption.series[0].type === 'pie' ||
          rawOption.series[0].type === 'gauge' ||
          rawOption.series[0].type === 'heatmap' ||
          rawOption.series[0].type === 'map' ||
          rawOption.series[0].type === 'scatter' ||
          rawOption.series[0].type === 'radar')
      ) {
        delete zoomOption.xAxis
        delete zoomOption.yAxis
      }
      if (rawOption.baseOption) {
        delete zoomOption.xAxis
      }
      return option && option.baseOption
        ? merge(baseColorOptions, rawOption, { baseOption: zoomOption })
        : merge(baseColorOptions, rawOption, zoomOption)
    } else {
      const zoomoutAddOnOptions = {
        legend: null,
        // xAxis: [{ axisLabel: { fontSize: 10 } }],
        // yAxis: [{ axisLabel: { fontSize: 10 } }],
      }

      return merge(
        rawOption,
        zoomoutAddOnOptions,
        // {
        //   legend:
        //     get(rawOption, 'legend.data.length', 0) < 5
        //       ? {
        //           top: includes(
        //             ['line-bar', 'stack', 'bar', 'scatter', 'washline'],
        //             this.props.type,
        //           )
        //             ? 0
        //             : 'bottom',
        //           left: 'center',
        //         }
        //       : null,
        // },
        baseColorOptions,
      )
    }
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps (nextProps) {
    const { custom, option } = this.state
    if (nextProps.theme && !custom && nextProps.theme !== this.props.theme) {
      this.setState({
        theme: nextProps.theme,
      })
    }
    if (custom && nextProps.customThemes) {
      const chartType =
        option && option.series && option.series[0] && option.series[0].type
      const typeTheme = nextProps.customThemes[chartType]
      if (typeTheme) {
        this.setState({
          theme: typeTheme,
        })
      }
    }
    if (nextProps.creator && nextProps.creator !== this.props.creator) {
      this.setState({
        option: this.rawOption(
          getOption(
            this.invokeCreator(
              nextProps.creator,
              nextProps.data,
              this.state.chartExt,
            ),
            nextProps.type,
          ),
          nextProps.custom,
        ),
      })
    }
    if (
      !isEqual(nextProps.data, this.props.data) ||
      !isEqual(nextProps.filters, this.props.filters)
    ) {
      const { filters, data } = nextProps
      const filterItems = getFilterItems(filters, data)
      this.setState({
        filterData: getDefaultFilterSelection(filters, filterItems),
        filterItems,
        validData: nextProps.data,
        data: nextProps.data,
      })
    }
    if (!isEqual(nextProps.selectedFilters, this.props.selectedFilters)) {
      const { filters } = nextProps
      this.setState(
        {
          filterData: getFilterSelection(filters, nextProps.selectedFilters),
        },
        this.updateData,
      )
    }
    if (!isEqual(nextProps.selectedConfig, this.props.selectedConfig)) {
      const { filters } = nextProps

      this.setState(
        {
          chartExt: getConfigSelection(filters, nextProps.selectedConfig),
        },
        this.updateData,
      )
    }
  }

  componentDidUpdate (prevProps, prevState) {
    const {
      group,
      width,
      height,
      refreshStamp,
      custom,
      refreshOnDataUpdate,
      dataDrill,
    } = this.props
    const { theme, option, legengdSelected } = this.state
    if (
      prevProps.dataDrill &&
      dataDrill.length !== prevProps.dataDrill.length
    ) {
      this.setState({ dataDrill }, this.updateData)
    }

    if (prevProps.refreshStamp !== refreshStamp) {
      this.destroyEcharts()
      this.initEcharts()
      if (this.chart) {
        this.chart.setOption(this.rawOption(option, custom), true)
      }
    }

    if (theme) {
      this.destroyEcharts()
      this.initEcharts()
      if (this.chart) {
        this.chart.setOption(this.rawOption(option, custom), true)
      }
    }

    if (
      isEqual(prevState.legengdSelected, legengdSelected) &&
      !isEqual(prevState.option, option)
    ) {
      if (refreshOnDataUpdate) {
        this.destroyEcharts()
        this.initEcharts()
      }
      if (this.chart) {
        this.chart.setOption(this.rawOption(option, custom), true)
      }
    }

    if (prevProps.group !== group) {
      this.chart.group = group
    }

    if (prevProps.width !== width || prevProps.height !== height) {
      if (this.chart) this.chart.resize({ width, height })
    }
  }

  setOption (option) {
    const { expend } = this.state
    // It seams that echarts will change the context of onclick,so bind setState to this
    let setState = this.setState.bind(this)
    let expendFeature = {
      myExpend: {
        show: true,
        title: 'Expend',
        icon: 'path://M198.608,246.104L382.664,62.04c5.068-5.056,7.856-11.816,7.856-19.024c0-7.212-2.788-13.968-7.856-19.032l-16.128-16.12    C361.476,2.792,354.712,0,347.504,0s-13.964,2.792-19.028,7.864L109.328,227.008c-5.084,5.08-7.868,11.868-7.848,19.084    c-0.02,7.248,2.76,14.028,7.848,19.112l218.944,218.932c5.064,5.072,11.82,7.864,19.032,7.864c7.208,0,13.964-2.792,19.032-7.864    l16.124-16.12c10.492-10.492,10.492-27.572,0-38.06L198.608,246.104z',
        onclick: () => {
          setState({
            expend: true,
          })
        },
      },
    }
    let foldFeature = {
      myExpend: {
        show: true,
        title: 'Fold',
        icon: 'path://M382.678,226.804L163.73,7.86C158.666,2.792,151.906,0,144.698,0s-13.968,2.792-19.032,7.86l-16.124,16.12    c-10.492,10.504-10.492,27.576,0,38.064L293.398,245.9l-184.06,184.06c-5.064,5.068-7.86,11.824-7.86,19.028    c0,7.212,2.796,13.968,7.86,19.04l16.124,16.116c5.068,5.068,11.824,7.86,19.032,7.86s13.968-2.792,19.032-7.86L382.678,265    c5.076-5.084,7.864-11.872,7.848-19.088C390.542,238.668,387.754,231.884,382.678,226.804z',
        onclick: () => {
          setState({
            expend: false,
          })
        },
      },
    }
    if (!option.toolbox && (!option.baseOption || !option.baseOption.toolbox)) {
      this.chart.setOption(option, true)
      return
    }
    let optionToModify = option
    if (option.baseOption) {
      optionToModify = optionToModify.baseOption
    }

    let finalOption, modified
    if (!expend) {
      modified = update(optionToModify, {
        toolbox: {
          feature: {
            $set: expendFeature,
          },
        },
      })
    } else {
      modified = update(optionToModify, {
        toolbox: {
          feature: {
            $apply (value) {
              return {
                ...value,
                ...foldFeature,
              }
            },
          },
        },
      })
    }
    if (option.baseOption) {
      finalOption = {
        ...option,
        baseOption: modified,
      }
    } else {
      finalOption = modified
    }

    if (this.chart) this.chart.setOption({ ...finalOption }, true)
  }

  invokeCreator (creator, data, filter) {
    const initalDataDrill = this.state ? this.state.dataDrill : []
    const dataDrill = initalDataDrill.map((i) => i.split(': ')[0])
    const chartExt = this.state ? this.state.chartExt : {}
    const { drillPath, filters } = this.props
    const configSelection =
      chartExt &&
      Object.keys(chartExt).map((k) => ({
        config: filters.find((f) => (f.name || f) === k),
        selections: chartExt[k].map((i) => i.name),
      }))
    const creatorFunc = isArray(creator) ? creator[dataDrill.length] : creator
    return (
      creatorFunc &&
      creatorFunc(data, { dataDrill, drillPath, filter, configSelection })
    )
  }

  initEcharts () {
    if (this.props.CustComp) return false

    const { width, height, group } = this.props
    const { theme } = this.state
    this.chart = echarts.init(this.node, theme, {
      // renderer: "svg",
      width,
      height,
    })
    if (this.chart) {
      this.chart.on('click', this.onClick)
      this.chart.on('legendselectchanged', this.onLegendselectchanged)
    }

    this.chart.group = group

    return true
  }

  destroyEcharts () {
    if (this.chart && !this.chart.isDisposed()) {
      // this.chart.off("click")
      this.chart.dispose()
      this.chart = null
    }
  }
}
