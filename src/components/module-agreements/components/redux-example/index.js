import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { hot } from 'react-hot-loader'

import { increment, decrement } from 'modules/app/actions'

const ReduxExample = ({ count, increment, decrement }) => (
  <Fragment>
    <button
      onClick={() => {
        decrement()
      }}
    >
      -
    </button>
    <span>{count}</span>
    <button
      onClick={() => {
        increment()
      }}
    >
      +
    </button>
  </Fragment>
)
ReduxExample.propTypes = {
  count: PropTypes.number.isRequired,
  increment: PropTypes.func.isRequired,
  decrement: PropTypes.func.isRequired,
}

export default hot(module)(
  connect(
    state => ({
      count: state.app.count,
    }),
    {
      increment,
      decrement,
    },
  )(ReduxExample),
)
