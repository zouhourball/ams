import React, { Fragment } from 'react'

import { Button } from 'react-md'

import './style.scss'

export default class StepperLink extends React.Component {
  renderTree = () => {
    const { tree } = this.props
    const treeData = tree || []
    return treeData.map((elem, index) => {
      return (
        <Fragment key={index}>
          {!elem.link ? (
            <span className="notClicked"> {elem.name}</span>
          ) : (
            <div className="clicked" onClick={elem.link}>
              {elem.name}
            </div>
          )}
          {elem.icon && (
            <div className="infoWrapper">
              <Button
                icon
                className="info-button clickable"
                onClick={elem.action}
              >
                {elem.icon}
              </Button>
              <div className="infoWrapper-component">{elem.compForIcon}</div>
            </div>
          )}
          {/* {index < tree.length - 1 && <span>&nbsp;&nbsp;/&nbsp;&nbsp; </span>} */}
        </Fragment>
      )
    })
  }

  render () {
    return this.renderTree()
  }
}
