import React, { useState, useEffect, cloneElement } from 'react'

import './styles.scss'
import { FontIcon } from 'react-md'

const ExpandTabs = ({
  className,
  position, // top, bottom, left or right : default left
  expand,
  onChange,
  children,
}) => {
  const [expanded, setExpanded] = useState(expand)
  const [newChildren, setNewChildren] = useState([])

  useEffect(() => {
    let clones = React.Children.map(children, (child, index) => {
      return cloneElement(child, {
        key: index,
        style: { ['margin' + capitalize(flip(position))]: 0 },
      })
    })
    setNewChildren(clones)
  }, [children])

  useEffect(() => {
    setExpanded(expand)
  }, [expand])

  const capitalize = s => s.charAt(0).toUpperCase() + s.slice(1)
  const flip = s => {
    switch (s) {
      case 'left':
        return 'right'
      case 'right':
        return 'left'
      case 'top':
        return 'bottom'
      case 'bottom':
        return 'top'
    }
  }

  const arrow = s => {
    switch (s) {
      case 'top':
        return 'up'
      case 'bottom':
        return 'down'
      default:
        return s
    }
  }

  const getClass = () => {
    if (['top', 'bottom'].includes(position)) {
      return 'height-element'
    } else {
      return 'width-element'
    }
  }

  return (
    <div
      className={`expand-tabs ${className || ''} ${position}-tab 
      ${expanded ? '' : 'closed'} ${getClass()}`}
    >
      <div className="expand-tabs-content">
        <div className="expand-tabs-block">{newChildren}</div>
      </div>
      <div
        className="expend-btn"
        onClick={() => {
          setExpanded(!expanded)
          onChange && onChange(!expanded)
        }}
      >
        <FontIcon>{`keyboard_arrow_${arrow(position)}`}</FontIcon>
      </div>
    </div>
  )
}

export default ExpandTabs

ExpandTabs.defaultProps = {
  position: 'left',
  expand: true,
}
