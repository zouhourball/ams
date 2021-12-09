import { PureComponent, Fragment } from 'react'
import { DialogContainer } from 'react-md'

import DataTable from '@target-energysolutions/data-table'

import './table-with-color-highlight.scss'

export default class TableWithColorHighlight extends PureComponent {
  state = {
    showHighlight: true,
    showDialog: false,
  }

  toggleDialog = () => {
    this.setState(({ showDialog }) => ({
      showDialog: !showDialog,
    }))
  }

  toggleHighlight = () => {
    this.setState(({ showHighlight }) => ({
      showHighlight: !showHighlight,
    }))
  }

  render () {
    const { getColumnsConfig, ...otherProps } = this.props
    return (
      <Fragment>
        <DataTable
          {...otherProps}
          columnsConfig={getColumnsConfig(this.state.showHighlight)}
        />
        <DialogContainer
          id="dialog for highlight"
          visible={this.state.showDialog}
          dialogClassName="ams-highlight-table-dialog"
          onHide={this.toggleDialog}
          focusOnMount={false}
        >
          <header className="ams-highlight-table-dialog-header">
            Matching Rule Information
          </header>
          <section className="ams-highlight-table-dialog-color-intro">
            <div className="ams-highlight-table-dialog-color-intro-block ams-highlight-table-dialog-color-intro-block-red" />
            Actual production does not meet target
          </section>
          <section className="ams-highlight-table-dialog-color-intro">
            <div className="ams-highlight-table-dialog-color-intro-block ams-highlight-table-dialog-color-intro-block-green" />
            Actual production meets/exceeds target
          </section>
        </DialogContainer>
      </Fragment>
    )
  }
}
