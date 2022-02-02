import { Component } from 'react'
import { DialogContainer, Button, SelectField } from 'react-md'
import Calendar from 'rc-calendar'

import 'rc-calendar/assets/index.css'
import './style.scss'
export default class SelectBlock extends Component {
  constructor (props) {
    super(props)
    this.state = {
      selectedDate: null,
      page: 1,
      block: '',
      action: '',
      file: [],
    }
    this.continue = this.continue.bind(this)
    this.renderContinueAction = this.renderContinueAction.bind(this)
    this.selectBlock = this.selectBlock.bind(this)
    this.selectFile = this.selectFile.bind(this)
  }

  renderContinueAction () {
    const { page, selectedDate, block } = this.state
    if (block && page === 1) {
      return false
    } else if (selectedDate && page === 2) {
      return false
    } else {
      return true
    }
  }

  selectBlock (v) {
    this.setState({ block: v })
  }

  selectFile (file) {
    const { hideDialog, getSelectBlockData } = this.props
    const { block, selectedDate } = this.state
    getSelectBlockData(file[0], block, selectedDate)
    this.setState({ page: 1, action: '', block: '' })
    hideDialog()
  }
  continue () {
    const { page, action } = this.state
    if (page === 1) {
      this.setState({ page: page + 1 })
    } else if (!action && page === 2) {
      this.file.click()
      this.setState({ action: 'upload' })
    }
  }

  hide = () => {
    const { hideDialog } = this.props
    this.setState({ page: 1, action: '', block: '', selectedDate: null })
    hideDialog()
  }

  onSelectDate = (date) => {
    this.setState({ selectedDate: date })
  }

  render () {
    const { visible, hideDialog, blockList } = this.props
    const { page, block } = this.state
    const actions = []
    actions.push(
      <Button flat onClick={this.hide} className="discard-btn">
        DISCARD
      </Button>,
    )
    actions.push(
      <Button
        flat
        primary
        swapTheming
        onClick={this.continue}
        disabled={this.renderContinueAction()}
      >
        CONTINUE
      </Button>,
    )
    return (
      <DialogContainer
        id="new-select-bloc"
        title={'Select Block'}
        visible={visible}
        onHide={hideDialog}
        actions={actions}
        className="newSelectBlock"
        disableScrollLocking={true}
      >
        <div
          className={`newSelectBlock-containerSelectField ${
            page !== 1 ? 'item-hidden' : ''
          }`}
        >
          <h4 className="select-title">Please select block</h4>
          <SelectField
            id="new-select-block-selectField"
            className="newSelectBlock-containerSelectField-selectField"
            placeholder="block"
            menuItems={blockList}
            value={block}
            onChange={(v) => this.selectBlock(v)}
            defaultValue={block}
            position={SelectField.Positions.BELOW}
            block
          />
        </div>
        <div
          className={`newSelectBlock-containerDatePicker ${
            page !== 2 ? 'item-hidden' : ''
          }`}
        >
          <Calendar
            className="DialogContainer-CalendarComponent"
            onSelect={this.onSelectDate}
          />
        </div>
        <div className="item-hidden">
          <div className="UploadFile__button">
            <input
              type="file"
              id="importFile"
              ref={(ref) => (this.file = ref)}
              // accept=".xlsx,.xls,.csv"
              onChange={(event) => this.selectFile(event.target.files)}
            />
          </div>
        </div>
      </DialogContainer>
    )
  }
}
