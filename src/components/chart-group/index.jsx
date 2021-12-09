import React from 'react'
import { ResizeSensor } from 'css-element-queries'
import ChartGroupChart from 'components/chart-group/chart'
import managedCollapsible from 'libs/hocs/managed-collapsible'
import GridDND from '@target-energysolutions/grid-dnd'
import { FontIcon, Collapse } from 'react-md'
import { cls } from 'reactutils'
import 'echarts/theme/dark'
import 'echarts/theme/infographic'
import 'echarts/theme/vintage'
import 'echarts/theme/macarons'
import 'echarts/theme/shine'
import 'echarts/theme/roma'
import 'components/chart-group/styles.scss'

const CHART_HEIGHT = 200
const DESKTOP_BREAKPOINT = 970 // 1200px
const MARGIN = 10 // 10px
const PADDING = 40 // 20px

@managedCollapsible
export default class ChartGroup extends React.PureComponent {
  state = {
    numCharts: 2,
    chartWidth: 200,
  }

  renderContent = (chartData) => {
    const { chartWidth } = this.state
    return (
      <ChartGroupChart
        refreshStamp={chartData.refreshStamp}
        events={chartData.events}
        title={chartData.title}
        type={chartData.type || 'line'}
        filters={chartData.filters}
        data={chartData.data}
        creator={chartData.creator}
        group={chartData.group}
        width={chartData.width || chartWidth}
        height={chartData.height || CHART_HEIGHT}
        CustComp={chartData.component}
        custCompProps={chartData.custCompProps || {}}
        btnDefs={chartData.type === 'map' ? [{ name: 'myPin' }] : []}
        {...chartData.props}
      />
    )
  }

  render () {
    const { title, collapsed, handleCollapseClicked, layout } = this.props
    const { numCharts } = this.state
    let data = this.props.data
    if (data && data.length % numCharts > 0) {
      data = data.concat(
        new Array(numCharts - (data.length % numCharts)).fill(null),
      )
    }
    return (
      <div>
        <div className="ams-chartgroup" ref={(ref) => (this.container = ref)}>
          {title && (
            <div
              className="ams-chartgroup-title"
              onClick={handleCollapseClicked}
            >
              <FontIcon className="ams-chartgroup-collapsed-arrow">
                {collapsed ? 'expand_more' : 'expand_less'}
              </FontIcon>
              {title}
            </div>
          )}
          <Collapse collapsed={collapsed}>
            <div className={cls('ams-chartgroup-charts')}>
              <GridDND directSwap gutter={10}>
                {data != null &&
                  data.map((chartData, i) =>
                    chartData && chartData.type ? (
                      <div
                        className={cls(
                          'ams-chartgroup-item',
                          layout !== 'float' ? 'ams-chartgroup-item-flex' : '',
                        )}
                        key={`${title}-${
                          chartData.key || chartData.title
                        }-${i}`}
                      >
                        {this.renderContent(chartData)}
                      </div>
                    ) : null,
                  )}
              </GridDND>
            </div>
          </Collapse>
        </div>
      </div>
    )
  }

  componentDidMount () {
    // eslint-disable-next-line no-new
    new ResizeSensor(this.container, this.onResize)
    this.onResize()
  }

  componentWillUnmount () {
    ResizeSensor.detach(this.container)
  }

  onResize = () => {
    const width = this.container.clientWidth
    this.setState({
      numCharts: width >= DESKTOP_BREAKPOINT ? 3 : 2,
      chartWidth:
        width >= DESKTOP_BREAKPOINT
          ? (width - MARGIN * 2 - PADDING) / 3
          : (width - MARGIN - PADDING) / 2,
    })
  }
}
