import { Button, DialogContainer, FontIcon } from 'react-md'

import './style.scss'

const ResponseDetailsDialog = ({
  visible,
  onHide,
  readOnly,
  onReject,
  onAccept,
  title,
  descriptionLabel,
  descriptionValue,
  file,
  status,
  onDownload,
}) => {
  const actions = [
    <Button id="1" key="1" flat onClick={onHide}>
      Discard
    </Button>,
    <Button id="2" key="2" className={'reject'} onClick={onReject} flat>
      Reject
    </Button>,
    <Button id="3" key="3" className={'accept'} onClick={onAccept} flat>
      Accept
    </Button>,
  ]
  const renderDocumentIcon = (type) => {
    switch (type) {
      case 'doc':
        return (
          <FontIcon
            icon
            iconClassName={`mdi mdi-file-word`}
            className="color-mdi-office"
          />
        )
      case 'xlsx':
        return (
          <FontIcon
            icon
            iconClassName={`mdi mdi-file-excel`}
            className="color-mdi-xls"
          />
        )
      case 'pdf':
        return (
          <FontIcon
            icon
            iconClassName={`mdi mdi-file-pdf`}
            className="color-mdi-file-pdf"
          />
        )
      case 'zip':
        return (
          <FontIcon
            icon
            iconClassName={`mdi mdi-zip-box`}
            className="color-mdi-zip-box"
          />
        )
      default:
        return <FontIcon icon iconClassName={`mdi mdi-file`} />
    }
  }
  return (
    <DialogContainer
      id="response-details-dialog"
      visible={visible}
      onHide={() => onHide && onHide()}
      actions={
        !readOnly
          ? actions
          : [
            <Button id="1" key="1" flat onClick={onHide}>
                Discard
            </Button>,
          ]
      }
      title={
        <>
          {title}
          <div className={`status status-${status}`}>{status}</div>
        </>
      }
      className="response-details-dialog"
    >
      <h4 className="response-details-dialog-title">{descriptionLabel}</h4>
      <div className="response-details-dialog-value">{descriptionValue}</div>
      <h4 className="response-details-dialog-title">Attached Document</h4>
      <div className="attachment-detail">
        <div className="attachment-detail-docs-icon-area">
          {renderDocumentIcon(file.type)}
          <div className="attachment-detail-info">
            <div className="name">{file.filename}</div>
            <div className="size">{file.size}</div>
          </div>
        </div>
        <Button
          icon
          className="attachment-btn"
          onClick={() => {
            onDownload(file.id)
          }}
        >
          save_alt
        </Button>
      </div>
    </DialogContainer>
  )
}

export default ResponseDetailsDialog

ResponseDetailsDialog.defaultProps = {
  title: 'Resolution Details',
  descriptionLabel: 'Resolution Description',
  descriptionValue: 'text',
  file: {
    id: '44',
    type: 'xlsx',
    filename: 'New Resolution.xlsx',
    size: '2 MB',
  },
  // readOnly:true,
  status: 'new',
}