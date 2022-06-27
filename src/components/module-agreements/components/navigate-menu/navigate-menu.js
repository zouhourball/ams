import React from 'react'
import { Button } from 'react-md'
import { isEmpty } from 'lodash-es'
import StepperLink from 'components/module-agreements/components/stepper-link'
import { withTranslationEx } from 'libs/langs'

import './style.scss'

@withTranslationEx
export default class NavigateMenu extends React.Component {
  renderButtons = () => {
    const { actions } = this.props
    const actionsData = actions || []
    return actionsData.map((elem, index) => {
      if (elem.isVisible) {
        return (
          <Button
            key={index}
            // flat
            // primary
            // swapTheming={elem.swapTheming && elem.active}
            icon
            onClick={() => elem.action()}
            className="details-top-bar_actions-button"
            disabled={!elem.active}
          >
            {elem.icon}
          </Button>
        )
      }
    })
  }
  // renderOptionalButtons = () => {
  //   const { optionalActions } = this.props
  //   const optionalActionsData = optionalActions || []
  //   return optionalActionsData.map((elem, index) => {
  //     if (elem.isVisible) {
  //       return (
  //         <Button
  //           key={index}
  //           flat={elem.label && !elem.icon}
  //           primary
  //           swapTheming={elem.swapTheming && elem.active}
  //           onClick={() => elem.action()}
  //           className="details-top-bar_optionalActions-button"
  //           disabled={!elem.active}
  //           iconChildren={elem.icon || false}
  //           icon={!elem.label && elem.icon}
  //         >
  //           {elem.label || elem.icon || ''}
  //         </Button>
  //       )
  //     }
  //   })
  // }
  render () {
    const {
      tree,
      // showTemplateLabel,
      // onClickPreview,
      actions,
      // t,
    } = this.props
    return (
      <div className="details-top-bar">
        <div className="details-top-bar_navigation">
          <StepperLink tree={tree} />
        </div>
        <div className="details-top-bar_left">
          {/* {showTemplateLabel && (
            <div className="details-top-bar_left-template">
              <span>{t('interview_temp')}</span>
              <Button flat primary onClick={() => onClickPreview()}>
                {t('preview')}
              </Button>
            </div>
          )} */}
          {/* {this.renderOptionalButtons()} */}
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
