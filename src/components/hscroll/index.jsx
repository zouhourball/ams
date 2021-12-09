import React from 'react'
import cls from 'classnames'
import 'components/hscroll/styles.scss'

export default class HScroll extends React.PureComponent {
  state = {
    startIndex: 0,
  }

  changeStartIndex = (change) => {
    let startIndex = this.state.startIndex + change
    if (startIndex < 0) {
      startIndex = 0
    }
    if (startIndex >= this.props.items.length) {
      startIndex = this.props.items.length - 1
    }
    this.setState({ startIndex })
  }

  render () {
    const { leftArrow, rightArrow, items, className } = this.props
    const { startIndex } = this.state
    return (
      <div className={cls('ams-hscroll', className)}>
        {leftArrow({
          onClick: () => this.changeStartIndex(-1),
          disabled: startIndex === 0,
        })}
        <div className="ams-hscroll-items">{items.slice(startIndex)}</div>
        {rightArrow({
          onClick: () => this.changeStartIndex(1),
          disabled: startIndex === items.length - 1,
        })}
      </div>
    )
  }
}
