import React, { Component, Fragment } from 'react'
import { hot } from 'react-hot-loader'
import { memoize } from 'lodash-es'

import { expensiveCompute } from 'libs/utils/example/expensive-compute'
import worker from 'worker!libs/utils/example/expensive-compute'

import './style.scss'

const { expensiveCompute: computeInAnotherThread } = worker()

const normalCompute = memoize(expensiveCompute)
const niceCompute = memoize(computeInAnotherThread)

@hot(module)
class MultiThread extends Component {
  state = {
    time: new Date(),
    resultFromSingleThread: null,
    resultFromMultiThread: null,
  }

  timer = null

  componentDidMount () {
    this.timer = setInterval(() => {
      this.setState({
        time: new Date(),
      })
    }, 100)
  }

  componentWillUnmount () {
    clearInterval(this.timer)
  }

  handleSingleButtonClick = () => {
    this.setState({
      resultFromSingleThread: '(computing...)',
    })
    const result = normalCompute(350)
    this.setState({
      resultFromSingleThread: result,
    })
  }

  handleMultiButtonClick = async () => {
    this.setState({
      resultFromMultiThread: '(computing...)',
    })
    const result = await niceCompute(350)
    this.setState({
      resultFromMultiThread: result,
    })
  }

  render () {
    const minutes = this.state.time.getMinutes()
    const seconds = this.state.time.getSeconds()
    const milliseconds = parseInt(this.state.time.getMilliseconds() / 100, 10)
    return (
      <Fragment>
        <h1>
          Time: {minutes} : {seconds} : {milliseconds}
        </h1>
        <div className="compare-result">
          <div className="single-thread">
            <button onClick={this.handleSingleButtonClick}>
              compute in main thread
            </button>
            <br />
            <p>result: {this.state.resultFromSingleThread}</p>
          </div>
          <div className="multi-thread">
            <button onClick={this.handleMultiButtonClick}>
              compute in another thread
            </button>
            <br />
            <p>result: {this.state.resultFromMultiThread}</p>
          </div>
        </div>
      </Fragment>
    )
  }
}

export default MultiThread
