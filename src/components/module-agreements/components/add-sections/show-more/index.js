import React, { Component } from 'react'
import { FontIcon, Button } from 'react-md'
import cls from 'classnames'
import PropTypes from 'prop-types'

import './styles.scss'
export default class ShowMore extends Component {
  static propTypes = {
    data: PropTypes.arrayOf(PropTypes.shape()),
    maxCount: PropTypes.number,
    className: PropTypes.string,
    renderItem: PropTypes.func,
    listClassName: PropTypes.string,
  }
  static defaultProps = {
    data: [],
    maxCount: 2,
  }
  state = {
    visible: false,
  }
  handleClick = () => {
    this.setState(state => {
      return { visible: !state.visible }
    })
  }
  render () {
    const { data, className, maxCount, renderItem, listClassName } = this.props
    const { visible } = this.state
    return (
      <div
        className={cls(
          `${
            data.length - maxCount > 0
              ? 'profile-showmore-container--visible'
              : 'profile-showmore-container'
          }`,
          className,
        )}
      >
        <ul className={listClassName}>
          {data.slice(0, maxCount).map(renderItem)}
          {visible && data.slice(maxCount).map(renderItem)}
        </ul>
        {data.length - maxCount > 0 && (
          <Button
            flat
            primary
            onClick={this.handleClick}
            className="profile-showmore-button"
          >
            <FontIcon
              iconClassName={`mdi ${
                visible ? 'mdi-chevron-double-up' : 'mdi-chevron-double-down'
              }`}
            />
            {visible ? 'Hide' : `${'Show more'} (${data.length - maxCount})`}
          </Button>
        )}
      </div>
    )
  }
}
