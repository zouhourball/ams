import React, { Fragment } from 'react'
import { Button, FontIcon } from 'react-md'
import { isEmpty } from 'lodash-es'

import StepperLink from '../../components/stepper-link'

import './style.scss'

export default class NavigateMenu extends React.Component {
  renderTree = () => {
    const { tree } = this.props
    const treeData = tree || []
    return treeData.map((elem, index) => {
      return (
        <Fragment key={index}>
          <span>{elem}</span>
          {index < treeData.length - 1 && (
            <Fragment>
              <FontIcon>keyboard_arrow_right</FontIcon>
            </Fragment>
          )}
        </Fragment>
      )
    })
  }
  renderButtons = () => {
    const { actions } = this.props
    const actionsData = actions || []
    return actionsData.map((elem, index) => {
      if (elem.isVisible) {
        return (
          <Button
            key={index}
            flat
            primary
            swapTheming={elem.swapTheming && elem.active}
            onClick={() => elem.action()}
            className="details-top-bar_actions-button"
            disabled={!elem.active}
          >
            {elem.label}
          </Button>
        )
      }
    })
  }
  renderOptionalButtons = () => {
    const { optionalActions } = this.props
    const optionalActionsData = optionalActions || []
    return optionalActionsData.map((elem, index) => {
      if (elem.isVisible) {
        return (
          <Button
            key={index}
            flat={elem.label && !elem.icon}
            primary
            swapTheming={elem.swapTheming && elem.active}
            onClick={() => elem.action()}
            className="details-top-bar_optionalActions-button"
            disabled={!elem.active}
            iconChildren={elem.icon || false}
            icon={!elem.label && elem.icon}
          >
            {elem.label || elem.icon || ''}
          </Button>
        )
      }
    })
  }
  render () {
    const { tree, showTemplateLabel, onClickPreview, actions } = this.props
    return (
      <div className="details-top-bar">
        <div className="details-top-bar_navigation">
          <StepperLink tree={tree} />
        </div>
        <div className="details-top-bar_left">
          {showTemplateLabel && (
            <div className="details-top-bar_left-template">
              <span>3 Interview Templates Attached</span>
              <Button flat primary onClick={() => onClickPreview()}>
                PREVIEW
              </Button>
            </div>
          )}
          {this.renderOptionalButtons()}
          {!isEmpty(actions) && (
            <div className="details-top-bar_actions">
              {this.renderButtons()}
            </div>
          )}
        </div>
      </div>
    )
  }
}

// example of use

//  <NavigateMenu
// showTemplateLabel
// showMemberList
// maxParticipants={5}
// tree={[
//   {
//     name: 'zone 1',
//     link: () => null,
//   },
//   {
//     name: 'zone 2',
//     link: () => null,
//   },
// ]}
// actions={[
//   {
//     label: 'Discard',
//     icon: 'mdi mdi-information',
//     isVisible: true,
//     action: () => null,
//     active: true,
//     swapTheming: false,
//   },
//   {
//     label: 'Save',
//     icon: 'mdi mdi-information',
//     isVisible: true,
//     action: () => null,
//     active: true,
//     swapTheming: false,
//   },
//   {
//     label: 'Submit',
//     icon: 'mdi mdi-information',
//     isVisible: true,
//     action: () => null,
//     active: true,
//     swapTheming: true,
//   },
// ]}
// />
