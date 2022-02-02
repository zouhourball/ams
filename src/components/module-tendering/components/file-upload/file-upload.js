import { Component } from 'react'
import { CircularProgress, FontIcon } from 'react-md'
import Dropzone from 'react-dropzone'

import * as apiR from 'libs/api/api-reports'

import './style.scss'

export default class FileUpload extends Component {
  constructor () {
    super()
    this.state = { files: [], spinner: false }
  }

  uploadFiles = (files) => {
    const { onUpload } = this.props
    this.setState({
      files,
      spinner: true,
    })
    apiR.fileManagerUpload(files).then((res) => {
      if (res.success) {
        this.setState({ spinner: false })
        onUpload(res.files)
      }
    })
  }

  render () {
    const { files, spinner } = this.state
    return (
      <Dropzone className="reports_upload" onDrop={this.uploadFiles}>
        {({ getRootProps, getInputProps }) => (
          <div
            className={`reports_dropZone md-cell ${
              files.length === 0 ? 'withMargin' : ''
            }`}
            {...getRootProps()}
          >
            {!spinner ? (
              <>
                <input {...getInputProps()} />
                <div className="reports_dropZone_content">
                  <FontIcon>save_alt</FontIcon>
                  <p>
                    <b> Choose File </b> or <b> Drag </b> it here
                  </p>
                </div>
              </>
            ) : (
              <CircularProgress className="upload-spinner" />
            )}
          </div>
        )}
      </Dropzone>
    )
  }
}
