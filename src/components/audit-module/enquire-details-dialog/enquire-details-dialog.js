import { Button, DialogContainer, FontIcon, Avatar } from 'react-md'

import './style.scss'

const EnquireDetailsDialog = ({
  visible,
  onHide,
  descriptionValue,
  file,
  auditValue,
  status,
  assignee,
  onDownload,
}) => {
  const actions = [
    <Button id="1" key="1" flat onClick={onHide}>
      Discard
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
      id="enquire-details-dialog"
      visible={visible}
      onHide={() => onHide && onHide()}
      actions={actions}
      title={
        <div className="enquire-details-dialog-header">
          <div className="title">Enquire Details</div>
          <div className={`chip ${status}`}>{status}</div>
        </div>
      }
      className="enquire-details-dialog"
      disableScrollLocking
      modal
    >
      <div className="enquire-details-dialog-title">Audit ID</div>
      <div className="enquire-details-dialog-value">{auditValue}</div>
      <div className="enquire-details-dialog-title">Enquiry Description</div>
      <div className="enquire-details-dialog-value">{descriptionValue}</div>
      <div className="enquire-details-dialog-title">Enquiry Description</div>
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
      <div className="enquire-details-dialog-title">Assignee</div>
      <div>
        <Avatar src={assignee.avatar} />
        <div>{assignee.name}</div>
      </div>
    </DialogContainer>
  )
}

export default EnquireDetailsDialog

EnquireDetailsDialog.defaultProps = {
  auditValue: '54521154',
  descriptionValue: 'text',
  file: {
    id: '44',
    type: 'xlsx',
    filename: 'New Resolution.xlsx',
    size: '2 MB',
  },
  assignee: {
    avatar: 'https://randomuser.me/api/portraits/men/97.jpg',
    name: 'Tariq',
  },
  status: 'Assigned',
}
