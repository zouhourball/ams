import { Component } from 'react'
import { DialogContainer, Button, FontIcon, CircularProgress } from 'react-md'
import { get } from 'lodash-es'

import * as apiR from 'libs/api/api-reports'
import mutate from 'libs/hocs/mutate'
import uploadIcon from 'images/upload.svg'
import deleteIcon from 'images/delete-icon.svg'

import './style.scss'

@mutate({
  moduleName: 'previewFile',
  mutations: {
    getPreviewPDFFile: apiR.getPreviewPDFFile,
    getPreviewFile: apiR.getPreviewFile,
  },
})
export default class ReportsFilePreview extends Component {
  hide = () => {
    const { hideDialog } = this.props
    hideDialog()
  }
  componentDidMount () {
    const {
      file,
      mutations: { getPreviewPDFFile, getPreviewFile },
    } = this.props
    if (file.contentType === 'application/pdf') {
      getPreviewPDFFile(file.fileId)
    } else {
      getPreviewFile(file.fileId)
    }
  }

  // componentDidUpdate(prevProps) {
  //   const {
  //     file,
  //     mutations: { getPreviewPDFFile, getPreviewFile },
  //   } = this.props
  //   if (file && prevProps.file !== file) {
  //     if (file.contentType === 'application/pdf') {
  //       getPreviewPDFFile(file.fileId)
  //     } else {
  //       getPreviewFile(file.fileId)
  //     }
  //   }
  // }

  renderUrl = () => {
    const { getPreviewPDFFileStatus, getPreviewFileStatus, file } = this.props
    if (file && file.contentType === 'application/pdf') {
      return get(getPreviewPDFFileStatus, 'data.blobURL', '')
    } else {
      return get(getPreviewFileStatus, 'data.blobURL', '')
    }
  }
  renderLoading = () => {
    const { getPreviewPDFFileStatus, getPreviewFileStatus, file } = this.props
    if (file && file.contentType === 'application/pdf') {
      return get(getPreviewPDFFileStatus, 'pending', false)
    } else {
      return get(getPreviewFileStatus, 'pending', false)
    }
  }
  render () {
    const { visible, hideDialog, file, deleteFile, downloadFile } = this.props

    return (
      <DialogContainer
        id="reports-file-preview"
        title={''}
        visible={visible}
        onHide={hideDialog}
        actions={[]}
        className="reportsFilePreview"
        disableScrollLocking={true}
      >
        <div className="reportsFilePreview-header">
          <div className="reportsFilePreview-header-right">
            <h3>{file && file.filename}</h3>
            <div>
              <span className="reportsFilePreview-header-right-size">
                <label>Size: </label>
                <span>{file && file.size}</span>
              </span>
              <span className="reportsFilePreview-header-right-updatedBy">
                <label>Updated By: </label>
                <span>{file && file.author}</span>
              </span>
            </div>
          </div>
          <div className="reportsFilePreview-header-left">
            <img
              src={deleteIcon}
              className="delete-btn"
              onClick={() => deleteFile(file.id)}
            />
            <img
              src={uploadIcon}
              className="upload-btn"
              onClick={() => downloadFile(file.fileId, file.filename)}
            />

            <Button
              icon
              iconClassName="mdi mdi-close"
              onClick={this.hide}
              className="close-btn"
            />
          </div>
        </div>
        <FilePreview
          fileBlobLink={this.renderUrl()}
          isLoading={this.renderLoading()}
        />
      </DialogContainer>
    )
  }
}
class FilePreview extends Component {
  render () {
    const { fileBlobLink, isLoading } = this.props
    return !fileBlobLink ? (
      <div className="noPreviewAvailable">
        <FontIcon>insert_drive_file</FontIcon>
        <p>No Preview Available.</p>
      </div>
    ) : isLoading ? (
      <div className="noPreviewAvailable">
        <CircularProgress />
      </div>
    ) : fileBlobLink ? (
      <embed
        width="100%"
        height="850"
        className="pdfObject"
        src={fileBlobLink}
        // type="application/pdf"
        internalinstanceid="88"
      />
    ) : (
      <div className="empty-content">
        Something went wrong in the online Preview! Please download the file and
        check it locally
      </div>
    )
  }
}
