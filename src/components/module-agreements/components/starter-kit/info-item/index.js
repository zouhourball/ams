import React from 'react'
import { Avatar, FontIcon, ListItem } from 'react-md'
import cn from 'classnames'
import PropTypes from 'prop-types'

import './styles.scss'

export default function InfoItem (props) {
  const {
    profile,
    className,
    leftIcon,
    rightIcon,
    primaryText,
    ...rest
  } = props

  return (
    <ListItem
      className={cn('app-startedkit-infoitem-container', className)}
      leftAvatar={leftIcon}
      leftNodeClassName="app-startedkit-infoitem-left"
      rightNodeClassName="app-startedkit-infoitem-right"
      primaryText={primaryText}
      primaryTextClassName="app-startedkit-infoitem-primary"
      contentClassName="app-startedkit-infoitem-content"
      rightIcon={rightIcon}
      {...rest}
    />
  )
}
InfoItem.defaultProps = {
  leftIcon: <Avatar icon={<FontIcon iconClassName="mdi mdi-account-plus" />} />,
  rightIcon: <FontIcon iconClassName="mdi mdi-plus-circle-outline" />,
}
InfoItem.propTypes = {
  leftIcon: PropTypes.node,
  rightIcon: PropTypes.node,
  primaryText: PropTypes.string,
  onClick: PropTypes.func,
}
