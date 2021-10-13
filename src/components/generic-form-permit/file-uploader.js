import { Component } from 'react'
import { CircularProgress, FontIcon } from 'react-md'
import Dropzone from 'react-dropzone'
import { withTranslation } from 'libs/langs'

import './style.scss'

@withTranslation
export default class FileUpload extends Component {
  constructor () {
    super()
    this.state = { files: [], spinner: false }
  }
  uploadFiles = files => {
    const { onUpload } = this.props
    this.setState({
      files,
    })
    onUpload && onUpload(files)
  }

  render () {
    const { icon } = this.props
    const { changeDisplay } = this.props
    const { files } = this.state
    const { spinner, accept, t } = this.props
    const { msg } = this.props
    const { classes } = this.props
    const defaultMsg = t('upload_msg')
    return (
      <Dropzone
        onDrop={this.uploadFiles}
        accept={accept}
      >
        {({ getRootProps, getInputProps }) => (
          <div
            className={`${classes} ${
              files.length === 0 ? 'withMargin' : ''
            }
            ${changeDisplay && files.length ? ' button-display' : ''}`}
            {...getRootProps()}
          >
            {!spinner ? (
              <>
                <input {...getInputProps()} />
                <div className="reports_dropZone_content">
                  {icon || <FontIcon>save_alt</FontIcon>}
                  {!files.length ? (
                    <p>
                      <div
                        dangerouslySetInnerHTML={{ __html: msg || defaultMsg }}
                      />
                    </p>
                  ) : (
                    <p>
                      <>
                        {files.length}
                        {files.length === 1
                          ? ' File Uploaded'
                          : ' Files Uploaded'}
                      </>
                    </p>
                  )}
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
