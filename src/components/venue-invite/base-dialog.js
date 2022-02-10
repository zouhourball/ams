import React, { isValidElement } from 'react'
import { createPortal } from 'react-dom'
import { DialogContainer, Button } from 'react-md'
import cls from 'classnames'
import CloseIcon from 'mdi-react/CloseIcon'
import { map } from 'lodash-es'
import './base-dialog.scss'

const renderAction = (action, index) => {
  if (isValidElement(action)) {
    const {
      outline = true,
      swapTheming,
      children,
      className,
      primary,
      secondary,
      ...rest
    } = action.props

    const ActionType = action.type

    return (
      <ActionType
        className={cls('app--base-dialog--btn-action', className, {
          'app--base-dialog--btn-outline': outline,
          'md-background--primary md-background--primary-hover': swapTheming,
          'app--base-dialog--btn-primary': primary,
          'app--base-dialog--btn-secondary': secondary,
          'app--base-dialog--btn-swap': swapTheming,
        })}
        {...rest}
      >
        {children}
      </ActionType>
    )
  }
  const {
    label,
    children,
    outline = true,
    className,
    disabled,
    primary,
    secondary,
    swapTheming,
    ...otherAction
  } = action
  const props = {
    ...otherAction,
    className: cls('app--base-dialog--btn-action', className, {
      'app--base-dialog--btn-outline': outline,
      'app--base-dialog--btn-disabled': disabled,
      'app--base-dialog--btn-primary': primary,
      'app--base-dialog--btn-secondary': secondary,
      'app--base-dialog--btn-swap': swapTheming,
    }),
    disabled,
  }
  return (
    <Button key={index} {...props}>
      {label || children}
    </Button>
  )
}
const BaseDialogComp = ({
  id,
  actions,
  onHide,
  className,
  dialogClassName,
  titleClassName,
  contentClassName,
  footerClassName,
  hideClose,
  ...other
}) => {
  const portalContainer = document.body

  return createPortal(
    <DialogContainer
      id={id}
      disableScrollLocking
      onHide={onHide}
      lastChild
      onClick={(e) => e.stopPropagation()}
      renderNode={portalContainer}
      actions={map(actions, renderAction)}
      className={className}
      dialogClassName={cls('app--base-dialog--container', dialogClassName)}
      titleClassName={cls('app--base-dialog--title', titleClassName)}
      contentClassName={cls('app--base-dialog--content', contentClassName)}
      footerClassName={cls('app--base-dialog--footer', footerClassName)}
      focusOnMount={false}
      modal
      {...other}
    >
      {!hideClose && (
        <Button icon onClick={onHide} className="base-dialog-close">
          <CloseIcon size={20}></CloseIcon>
        </Button>
      )}
      {other.children}
    </DialogContainer>,
    document.body,
  )
}
export const BaseDialog = React.memo(BaseDialogComp)
