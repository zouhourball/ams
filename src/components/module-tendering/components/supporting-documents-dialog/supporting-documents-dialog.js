import { DialogContainer, Button, FontIcon } from 'react-md'

// import getFileIcon from './helper'

import './style.scss'

const SupportingDocumentsDialog = ({
  className,
  visible,
  onHide,
  onDownloadAll,
  onDownloadFile,
  onDeleteFile,
  list,
}) => {
  const renderDocumentIcon = (type) => {
    let extension = type.split('/')
    if (extension[1] === 'doc') {
      return (
        <div className="docs-icon-area">
          <FontIcon
            icon
            iconClassName={`mdi mdi-file-word mdi-36px`}
            className="color-mdi-office"
          />
        </div>
      )
    }
    if (extension[1] === 'pdf') {
      return (
        <div className="docs-icon-area">
          <FontIcon
            icon
            iconClassName={`mdi mdi-file-pdf mdi-36px`}
            className="color-mdi-file-pdf"
          />
        </div>
      )
    }
    if (extension[1] === 'zip') {
      return (
        <div className="docs-icon-area">
          <FontIcon
            icon
            iconClassName={`mdi mdi-zip-box mdi-36px`}
            className="color-mdi-zip-box"
          />
        </div>
      )
    }
    if (extension[1] === 'js') {
      return (
        <div className="docs-icon-area">
          <FontIcon
            icon
            iconClassName={`mdi mdi-language-javascript mdi-36px`}
          />
        </div>
      )
    }
    if (extension[1] === 'html') {
      return (
        <div className="docs-icon-area">
          <FontIcon icon iconClassName={`mdi mdi-language-html5 mdi-36px`} />
        </div>
      )
    } else {
      return (
        <div className="docs-icon-area">
          <FontIcon icon iconClassName={`mdi mdi-file mdi-36px`} />
        </div>
      )
    }
  }

  const actions = []
  actions.push(
    <Button
      flat
      className="closebtn"
      onClick={() => {
        onHide()
      }}
    >
      Close
    </Button>,
  )
  actions.push(
    <Button
      flat
      primary
      swapTheming
      className="uploadAll"
      onClick={() => {
        onDownloadAll()
        onHide()
      }}
    >
      Download All
    </Button>,
  )

  const DocumentList = list.map(({ id, icon, name, size, type }, i) => {
    return (
      <div className="documents md-cell md-cell--12" key={i}>
        <div className="documents_container">
          <div className="documents_container_file-details">
            {renderDocumentIcon(icon)}
            <div className="file-name">
              <div className="title">{name}</div>
              <div className="file-size">{size}</div>
            </div>
          </div>
          <div className="documents_container_file-actions">
            <Button
              icon
              className="uploadButton"
              iconClassName="mdi mdi-upload"
              onClick={() => {
                onDownloadFile(id)
              }}
            ></Button>
            <Button
              icon
              className="deleteButton"
              iconClassName="mdi mdi-delete"
              onClick={() => {
                onDeleteFile(id)
              }}
            ></Button>
          </div>
        </div>
      </div>
    )
  })

  return (
    <div className={`supporting-documents-dialog ${className}`}>
      <DialogContainer
        id="supporting-documents-dialog"
        visible={visible}
        onHide={onHide}
        actions={actions}
        title="View Supporting Documents"
      >
        {DocumentList}
      </DialogContainer>
    </div>
  )
}

export default SupportingDocumentsDialog
