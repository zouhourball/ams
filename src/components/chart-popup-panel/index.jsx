import React, { Fragment } from 'react'
import { createPortal } from 'react-dom'
import { DialogContainer, SelectionControl } from 'react-md'
import MultiSelectDropdown from '@target-energysolutions/multi-select-dropdown'
import Chart from 'components/chart-group/chart'
import { extractUniqValue } from 'libs/utils'
import imgDataInvalid from 'images/pic_plan_data_not_valid.png'
import BreadCrumb from './chart-breadcrumbs'
import { flatten, isFunction, reduce } from 'lodash-es'
import { getWH } from 'libs/utils/math-helper'
import { cls } from 'reactutils'
import SidebarDrawer from '@target-energysolutions/sidebar-drawer'
import '@target-energysolutions/sidebar-drawer/styles.css'

import './styles.scss'

const popupChartWindowMargin = 200
const topBarHeight = 0
export default class ChartPopupPanel extends React.PureComponent {
  state = {
    height: 600,
    dataDrill: this.props.drillPath ? [] : null,
    selectedFilters: this.initSelectedFilters() || {},
    selectedBlocks: this.initSelectedBlocks(),
    chartWidth: undefined,
    siderbarVisible: true,
    widthArr: [],
  }
  constructor (props) {
    super(props)
    this.rootContainer = document.body
  }

  componentDidMount () {
    this.setState({
      height:
        window.document.body.clientHeight -
        popupChartWindowMargin -
        topBarHeight,
    })
    window.addEventListener('resize', this.onResize)
  }
  onResize = () => {
    this.setState({
      height:
        window.document.body.clientHeight -
        popupChartWindowMargin -
        topBarHeight,
    })
    setTimeout(() => {
      if (this.chart) {
        this.setState({
          chartWidth: getWH(this.chart, 'width'),
        })
      }
    }, 500)
  }
  componentWillUnmount () {
    window.removeEventListener('resize', this.onResize)
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps (nextProps) {
    if (nextProps.chartData !== this.props.chartData) {
      this.setState({
        selectedFilters: this.initSelectedFilters(nextProps),
        selectedBlocks: this.initSelectedBlocks(nextProps),
      })
    }
  }

  initSelectedFilters (props = this.props) {
    const { filters, chartConfig } = props
    return (
      filters &&
      filters.reduce((result, filter) => {
        if (filter !== 'block') {
          if (!filter.defaultSelect) {
            const filterName = typeof filter === 'string' ? filter : filter.name
            let data = props.chartData
            if (isFunction(chartConfig)) {
              data = chartConfig(data)
            }
            result[filterName] = new Set(extractUniqValue(data, filterName))
          } else {
            result[filter.name] = new Set(filter.defaultSelect)
          }
        }
        return result
      }, {})
    )
  }

  initSelectedBlocks (props = this.props) {
    const companies = extractUniqValue(props.chartData, 'company')
    const initialBlocks = reduce(
      companies,
      (result, company) => {
        const blocks = extractUniqValue(
          props.chartData.filter((i) => i.company === company),
          'block',
        )
        result[company.toUpperCase()] = new Set(blocks)
        return result
      },
      {},
    )
    return initialBlocks
  }

  toggleFilters = (filter) => (value) => (selected) => {
    const set = this.state.selectedFilters[filter]
    if (selected != null) {
      if (selected) {
        set.add(value)
      } else {
        set.delete(value)
      }
    } else if (set.has(value)) {
      set.delete(value)
    } else {
      set.add(value)
    }
    this.setState({
      selectedFilters: {
        ...this.state.selectedFilters,
        [filter]: set,
      },
    })
  }
  setConfig = (filter, values) => (index) => {
    this.setState({
      selectedFilters: {
        ...this.state.selectedFilters,
        [filter]: new Set(index.map((i) => values[i])),
      },
    })
  }
  onCollapseChange = (collapsedName) => () => {
    const obj = { [collapsedName]: !this.state[collapsedName] }
    this.setState(obj)
  }

  componentDidUpdate (prevProps, prevState) {
    const { visible: prevVisible } = prevProps
    const { visible } = this.props
    const { widthArr } = this.state
    if (prevVisible && !visible && widthArr.length) {
      this.setState({
        chartWidth: widthArr.reduce((a, b) => Math.min(a, b), 2000),
      })
    }
  }

  onToggle = (e) => {
    const { widthArr } = this.state
    const width = getWH(this.chart, 'width')
    if (widthArr.indexOf(width) === -1) {
      this.setState({
        widthArr: widthArr.concat(width),
      })
    }
    this.setState({
      siderbarVisible: !this.state.siderbarVisible,
    })

    clearTimeout(this.timeoutId)
    this.timeoutId = setTimeout(() => {
      const chartWidth = getWH(this.chart, 'width')
      this.setState({
        chartWidth,
      })
    }, 500)
  }

  renderDialog = () => {
    const {
      title,
      visible,
      onHide,
      filters,
      CustComp,
      drillPath,
      refreshOnDataUpdate,
      chartConfig: config,
      chartType: type,
      chartCreator: creator,
      chartData: data,
      pinConfig,
      mainFilters,
      apiView,
    } = this.props
    const { height, dataDrill, selectedFilters, selectedBlocks, chartWidth } =
      this.state
    const chartOption = {}
    const companies = extractUniqValue(data, 'company')
    const indexOfConfigInFilter = filters
      .filter(
        (filter) => typeof filter !== 'string' && filter.forConfig === true,
      )
      .map((filter) => filters.findIndex((f) => f === filter))
    const combinedSelectedFilters = {
      ...Object.keys(selectedFilters).reduce((r, k, i) => {
        if (!indexOfConfigInFilter.includes(i)) {
          r[k] = Array.from(selectedFilters[k])
        }
        return r
      }, {}),
      block: flatten(Object.values(selectedBlocks).map((i) => Array.from(i))),
    }
    const combinedSelectedConfig = indexOfConfigInFilter
      .map((i) => filters[i].name)
      .reduce((result, filterName) => {
        result[filterName] = Array.from(selectedFilters[filterName])
        return result
      }, {})

    return (
      <DialogContainer
        id="ChartPopupPanelDialog"
        initialFocus=".chart-popup-panel-chart"
        className="chart-popup-panel"
        ref={(ref) => (this.container = ref)}
        contentClassName="chart-popup-panel-content"
        title={title}
        visible={visible}
        onHide={onHide}
      >
        <div className="chart-popup-panel-subheader">
          {dataDrill && (
            <BreadCrumb
              crumbs={dataDrill
                .concat(drillPath[dataDrill.length])
                .map((i) => ({ name: i }))}
              setDrillLevel={(ind) => {
                this.setState((prevState) => ({
                  dataDrill: prevState.dataDrill.slice(0, ind),
                }))
              }}
            />
          )}
        </div>
        <SidebarDrawer
          onToggle={this.onToggle}
          mainComp={
            <div
              className="chart-popup-panel-chart"
              ref={(ref) => (this.chart = ref)}
            >
              {chartOption ? (
                <Chart
                  width={chartWidth}
                  height={height}
                  creator={creator}
                  data={data}
                  config={config}
                  type={type}
                  filters={filters}
                  CustComp={CustComp}
                  custCompProps={this.props.custCompProps}
                  drillPath={drillPath}
                  dataDrill={dataDrill}
                  selectedFilters={combinedSelectedFilters}
                  refreshOnDataUpdate={refreshOnDataUpdate}
                  selectedConfig={combinedSelectedConfig}
                  drillUpdate={(dataDrill) => this.setState({ dataDrill })}
                  zoom
                  pinConfig={pinConfig}
                  mainFilters={mainFilters}
                  apiView={apiView}
                />
              ) : (
                <div>
                  <img src={imgDataInvalid} alt="imgDataInvalid" />
                  <div>Data not valid. </div>
                  <div>Please check filter settings.</div>
                </div>
              )}
            </div>
          }
          sidebar={
            <div
              className={cls(
                'chart-popup-panel-chart-side',
                !this.state.siderbarVisible &&
                  'chart-popup-panel-chart-side--hide',
              )}
            >
              {/* assume must have `company` and `block` in filters */}
              <header
                className="chart-popup-panel-chart-side-header"
                onClick={this.onCollapseChange('companyCollapsed')}
              >
                Companies
                <span className="chart-popup-panel-chart-side-header-sub">
                  Blocks
                </span>
              </header>
              <div>
                {this.state.selectedFilters.company &&
                  companies &&
                  companies.map((company) => {
                    const blocksInCompany = Array.from(
                      this.initSelectedBlocks()[company.toUpperCase()] || [],
                    )
                    const listOfSelectedBlockIndex = Array.from(
                      this.state.selectedBlocks[company.toUpperCase()] || [],
                    ).map((block) => blocksInCompany.indexOf(block))
                    return (
                      <section
                        key={company}
                        className="chart-popup-panel-chart-side-company-block"
                      >
                        <SelectionControl
                          className="chart-popup-panel-chart-side-company-block-company"
                          type="checkbox"
                          id={`selectbox-for-${company}`}
                          name={`toggle selection for ${company}`}
                          label={company}
                          checked={this.state.selectedFilters.company.has(
                            company,
                          )}
                          onChange={this.toggleFilters('company')(company)}
                        />
                        <MultiSelectDropdown
                          className="chart-popup-panel-chart-side-company-block-block"
                          labelDropdown
                          itemType=" "
                          name="select..."
                          width={120}
                          items={blocksInCompany}
                          selectedItems={listOfSelectedBlockIndex}
                          onChange={(selectedIndex) => {
                            const blocks = selectedIndex.map(
                              (index) => blocksInCompany[index],
                            )
                            this.setState({
                              selectedBlocks: {
                                ...this.state.selectedBlocks,
                                [company.toUpperCase()]: new Set(blocks),
                              },
                            })
                          }}
                        />
                      </section>
                    )
                  })}
              </div>
              {filters &&
              filters.filter(
                (filter) =>
                  filter !== 'company' &&
                  filter !== 'block' &&
                  (!filter.forConfig || filter.axisOverride),
              ).length > 0 ? (
                  <Fragment>
                    <header
                      onClick={this.onCollapseChange('configCollapsed')}
                      className="chart-popup-panel-chart-side-header"
                    >
                    Chart configurations
                    </header>
                    <section className="chart-popup-panel-chart-side-filter">
                      {filters &&
                      filters
                        .filter(
                          (filter) =>
                            filter !== 'company' &&
                            filter !== 'block' &&
                            (!filter.forConfig || filter.axisOverride),
                        )
                        .map((filter) => {
                          const displayName =
                            filter.label || filter.name || filter
                          let filterName
                          let values
                          if (!filter.items) {
                            filterName =
                              typeof filter === 'string' ? filter : filter.name
                            // TODO
                            if (isFunction(config)) {
                              const newData = config(data)
                              values = extractUniqValue(newData, filterName)
                            } else {
                              values = extractUniqValue(data, filterName)
                            }
                          } else {
                            filterName = filter.name
                            values = filter.items
                          }
                          return (
                            <div
                              key={filter.label}
                              className="chart-popup-panel-config-item"
                            >
                              <div>{displayName}</div>
                              <MultiSelectDropdown
                                className="chart-popup-panel-chart-side-company-block-block"
                                labelDropdown
                                singleSelect={filter.type === 'single'}
                                itemType="items"
                                name="select..."
                                // width={150}
                                items={values}
                                selectedItems={Array.from(
                                  selectedFilters[filterName],
                                ).map((i) => values.indexOf(i))}
                                onChange={this.setConfig(filterName, values)}
                              />
                            </div>
                          )
                        })}
                    </section>
                  </Fragment>
                ) : null}
            </div>
          }
        />
      </DialogContainer>
    )
  }

  render () {
    return createPortal(this.renderDialog(), this.rootContainer)
  }
}
