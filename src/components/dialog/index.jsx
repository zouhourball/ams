import { PureComponent } from 'react'
import { createPortal } from 'react-dom'

import { DialogContainer as MdDialog } from 'react-md'

import './styles.scss'

export default class Dialog extends PureComponent {
  constructor (props) {
    super(props)
    this.portalContainer = document.createElement('div')
    // this.portalContainer.className = 'ams-dialog-container'
    document.body.appendChild(this.portalContainer)
  }

  componentWillUnmount () {
    this.portalContainer.parentElement.removeChild(this.portalContainer)
  }

  renderPortal () {
    return <MdDialog {...this.props} />
  }

  render () {
    return createPortal(this.renderPortal(), this.portalContainer)
  }
}
