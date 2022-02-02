import { Component } from 'react'
import { Button } from 'react-md'
import { cls } from 'reactutils'
import uploadIcon from 'images/upload.svg'

export default class ReportCard extends Component {
  render () {
    const {
      file,
      className,
      addFile,
      onAddFile,
      onClick,
      onDownload,
      selected,
    } = this.props

    return (
      <div
        className={cls('reportCard', selected ? 'selected' : '', className)}
        onClick={() => onClick(file.id, file.filename)}
      >
        <span className="reportCard-name">{file.filename}</span>
        <span className="reportCard-actions">
          {addFile && (
            <Button
              primary
              icon
              className="add-btn"
              iconClassName="mdi mdi-plus"
              onClick={(e) => {
                e.stopPropagation()
                onAddFile(file.id)
              }}
            />
          )}
          <img
            src={uploadIcon}
            className="upload-btn"
            onClick={(e) => {
              e.stopPropagation()
              onDownload(file.fileId, file.filename)
            }}
          />
        </span>
      </div>
    )
  }
}
