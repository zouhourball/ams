import React from 'react'
import {
  pullAt,
  difference,
  overEvery,
  isObject,
  toPairs,
  overSome,
  isArray,
  isString,
  isNumber,
  isDate,
} from 'lodash-es'
import MultiSelectDropdown from '@target-energysolutions/multi-select-dropdown'
import '@target-energysolutions/multi-select-dropdown/styles.css'
import './styles.scss'

const needWrapWithArray = overSome(isString, isNumber, isDate)
const needConvert2Array = overEvery(isObject, (a) => !isArray(a))
const seperator = '/'
/*
Convert object to key tree
[key1,[ke2,[ ... ]]]

*/
function convert2keyTree (obj) {
  return toPairs(obj)
    .map(([key, value]) => {
      if (needConvert2Array(value)) {
        return [key, ...convert2keyTree(value)]
      }
      if (value) return key
    })
    .filter((i) => i)
}
function convert2keyArray (obj, sep = seperator) {
  let pathStr = []
  let pathArr = []
  travel(['root', ...convert2keyTree(obj)], [], ([r, ...path]) => {
    pathStr.push(path.join(sep))
    pathArr.push(path)
  })
  return {
    path: pathArr,
    pathJoined: pathStr,
  }
}

function travel ([root, ...children], path, visitor) {
  for (let ele of children) {
    if (isArray(ele)) {
      travel(ele, [...path, root], visitor)
    } else {
      visitor([...path, root, ele])
    }
  }
}

export default class DataFilterSelectionDisplay extends React.PureComponent {
  static defaultProps = {
    labels: {},
  }

  handleChange = (category, value) => (inds) => {
    const { onClearClicked } = this.props
    if (onClearClicked) {
      let all = Array.from(value).map((_, i) => i)
      let clear = difference(all, inds)
      onClearClicked({
        category,
        value: pullAt(value, clear),
      })
    }
  }

  render () {
    const { filterData, labels } = this.props

    return (
      <div className="data-filter-selection-display">
        {Object.keys(filterData)
          .map((k) => {
            let value = filterData[k]
            let items = value
            if (needWrapWithArray(value)) {
              value = [value]
              items = value
            } else if (needConvert2Array(value)) {
              // path array
              let ret = convert2keyArray(value)
              items = ret.pathJoined
              value = ret.path
            } else {
              // value is falsely
              return
            }
            if (!value.length) {
              return
            }

            return (
              <MultiSelectDropdown
                className="data-filter-selection-item"
                key={k}
                labelDropdown
                selectedItems={Array.from(value).map((_, i) => i)}
                onChange={this.handleChange(k, value)}
                showTotalChecked
                label={`${labels[k] || `Selected ${k}`}: `}
                items={items}
              />
            )
          })
          .filter((i) => i)}
      </div>
    )
  }
}
