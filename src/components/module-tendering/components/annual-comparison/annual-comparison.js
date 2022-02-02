import { useRef, useEffect, useState } from 'react'
import { Button } from 'react-md'
import echarts from 'echarts'
import Slider from 'react-slick'

import Checkbox from '../../components/checkbox'

import {
  chart1,
  chart2,
  chart3,
  chart4,
  chart5,
  chart6,
  comparison,
} from './helper'

import './styles.scss'

const AnnualComparison = ({ onClickCheckbox }) => {
  const [selectedItem, setSelected] = useState([])

  useEffect(() => {
    onClickCheckbox(selectedItem)
  }, [selectedItem])

  const settings = {
    dots: false,
    infinite: false,
    speed: 800,
    slidesToShow: 10,
    slidesToScroll: 1,
  }
  const addItem = (id) => {
    let selected = {}
    selected = selectedItem.find((elem) => elem.id === id)
    if (!selected) {
      setSelected([...selectedItem, { id }])
    } else {
      const newSelected = selectedItem.filter((item) => item.id !== id)
      setSelected(newSelected)
    }
  }

  return (
    <div className="page">
      <Slider {...settings} className="member-list">
        {comparison.map((item, index) => {
          return (
            <Checkbox
              key={index}
              index={index}
              data={item}
              onCheck={addItem}
              clicked={
                selectedItem.find((elem) => elem.id === item.id)
                  ? 'clicked'
                  : ''
              }
            />
          )
        })}
      </Slider>

      <div className="annual-comparison-container">
        <div className="annual-comparison-container-header">
          Plan Vs Execution of Cost Estimate &amp; Budget
        </div>
        <div className="annual-comparison-container-body">
          <div className="md-grid">
            <div className="md-cell md-cell--6">
              <ChartContainer
                option={chart1}
                title={'Plan Budget Vs Executed Budget'}
              />
            </div>
            <div className="md-cell md-cell--6">
              <ChartContainer
                option={chart2}
                title={'Plan Budget Vs Executed Budget'}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="annual-comparison-container">
        <div className="annual-comparison-container-header">
          Financial Comparison
        </div>
        <div className="annual-comparison-container-body">
          <div className="md-grid">
            <div className="md-cell md-cell--6">
              <ChartContainer
                option={chart3}
                title={'Plan Budget Vs Executed Budget'}
              />
            </div>
            <div className="md-cell md-cell--6">
              <ChartContainer
                option={chart4}
                title={'Plan Budget Vs Executed Budget'}
              />
            </div>
            <div className="md-cell md-cell--6">
              <ChartContainer
                option={chart5}
                title={'Plan Budget Vs Executed Budget'}
              />
            </div>
            <div className="md-cell md-cell--6">
              <ChartContainer
                option={chart6}
                title={'Plan Budget Vs Executed Budget'}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const ChartContainer = ({ option, heightRatio = 0.5, title }) => {
  const [height, setHeight] = useState(400)
  let chart = useRef(null)

  const initChart = () => {
    if (chart.current) {
      let myChart = echarts.init(chart.current)
      myChart.setOption(option)
      myChart.resize()
    }
  }

  useEffect(() => {
    initChart()
  }, [chart.current, option, height])

  useEffect(() => {
    if (chart.current && chart.current.offsetWidth) {
      setHeight(chart.current.offsetWidth * heightRatio)
    }
  }, [chart.current && chart.current.offsetWidth])

  return (
    <div className="annual-comparison-chart">
      <div className="annual-comparison-chart-header">
        {title && <div className="title">{title}</div>}
        <div className="controls">
          <Button icon iconClassName="mdi mdi-poll-box" />
          <Button icon className="three-bars">
            <span></span>
            <span></span>
            <span></span>
          </Button>
        </div>
      </div>
      <div className="annual-comparison-chart-body">
        <div
          onClick={initChart}
          style={{
            height: `${height}px`,
            width: '100%',
          }}
          ref={chart}
        />
      </div>
    </div>
  )
}

export default AnnualComparison
