import { Component } from 'react'
import { Drawer, Button } from 'react-md'

import './style.scss'

export default class DrawerWithContent extends Component {
  renderType = () => {
    const { closeOnclickOutSide } = this.props
    if (closeOnclickOutSide) {
      return Drawer.DrawerTypes.TEMPORARY
    } else {
      return Drawer.DrawerTypes.FULL_HEIGHT
    }
  }
  render () {
    const {
      visible,
      onVisibilityChange,
      className,
      children,
      closeOnclickOutSide,
    } = this.props
    return (
      <Drawer
        id="simple-drawer-example"
        type={this.renderType()}
        visible={visible}
        onVisibilityChange={onVisibilityChange}
        className={`drawer-with-content ${className || ''}`}
        header={
          closeOnclickOutSide ? (
            ''
          ) : (
            <Button
              icon
              onClick={() => onVisibilityChange(false)}
              className="drawer-with-content-CloseButton"
            >
              close
            </Button>
          )
        }
      >
        {children}
      </Drawer>
    )
  }
}
