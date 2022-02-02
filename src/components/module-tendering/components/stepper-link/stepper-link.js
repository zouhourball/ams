import React, { Fragment } from 'react'

import { Button, FontIcon } from 'react-md'

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
            <div onClick={elem.link}>{elem.name}</div>
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
          {index < tree.length - 1 && (
            <FontIcon className="arrowIcon">keyboard_arrow_right</FontIcon>
          )}
        </Fragment>
      )
    })
  }

  render () {
    return this.renderTree()
  }
}
