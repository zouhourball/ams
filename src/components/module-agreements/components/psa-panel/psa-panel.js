import React from 'react'
import { ExpansionList, ExpansionPanel, FontIcon, Avatar } from 'react-md'

import './style.scss'

export const HeaderOption = props => {
  return (
    <>
      <div className="psaPanel_header_leftSide">
        {props.icon && (
          <Avatar
            src={props.icon}
            className={`psaPanel_header_leftSide-avatar ${props.iconColor}`}
            width="24px"
            role="presentation"
          />
        )}
        {props.iconClassName && (
          <FontIcon iconClassName={props.iconClassName} />
        )}
        <div className="psaPanel_label">{props.label}</div>
        <div className="statusIcon">{props.statusIcon}</div>
        {props.count && <div className="psaPanel_count">{props.count}</div>}
      </div>
      {props.showAction && (
        <div className="psaPanel_header_rightSide">{props.actions}</div>
      )}
    </>
  )
}

export const MainListPanel = props => {
  return (
    <ExpansionList className="psaPanel" {...props}>
      {props.children}
    </ExpansionList>
  )
}

export const CollapsedPanel = props => {
  return (
    <ExpansionPanel
      focused
      columnWidths={[]}
      footer={null}
      headerClassName={`psaPanel_header ${props.headerClassName}`}
      label={
        <HeaderOption
          icon={props.icon}
          iconClassName={props.iconClassName}
          label={props.label}
          iconColor={props.iconColor}
          showAction={props.showAction}
          actions={props.actions}
        />
      }
      defaultExpanded={props.defaultExpanded}
      className={props.className}
    >
      {props.children}
    </ExpansionPanel>
  )
}
