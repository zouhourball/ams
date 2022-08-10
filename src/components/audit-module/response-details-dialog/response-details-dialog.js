import { Button, DialogContainer, FontIcon } from 'react-md'
import { handlePrint } from 'components/module-permitting/print-component'
import { getPublicUrl } from 'libs/utils/custom-function'

import './style.scss'

const ResponseDetailsDialog = ({
  visible,
  onHide,
  // readOnly,
  onReject,
  onAccept,
  role,
  title,
  descriptionLabel,
  descriptionValue,
  file = {},
  status,
  onDownload,
  onSubmit,
  view,
}) => {
  const auActions = [
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
  const fpActionsView = [
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
  const fpActions = [
    <Button id="1" key="1" flat onClick={onHide}>
      Discard
    </Button>,
    <Button id="2" key="2" primary flat onClick={onSubmit}>
      Submit
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
        role === 'AU' && status === 'SUBMITTED' // status !== 'ACCEPTED' && status !== 'REJECTED' &&
          ? auActions
          : role === 'FP' &&
            status !== 'SUBMITTED' &&
            status !== 'PROPOSED' &&
            view === 'response'
            ? fpActions
            : view === 'resolutions' &&
            role === 'FP' &&
            status !== 'ACCEPTED' &&
            status !== 'REJECTED'
              ? fpActionsView
              : [
                <Button id="1" key="1" flat onClick={onHide}>
                Discard
                </Button>,
                <Button
                  id="2"
                  key="2"
                  flat
                  onClick={() => handlePrint('Details', '', '', '', 'details')}
                >
                Print
                </Button>,
              ]
      }
      title={
        <>
          {title}
          {status && <div className={`status status-${status}`}>{status}</div>}
        </>
      }
      className="response-details-dialog"
    >
      {' '}
      <div id="details">
        <h4 className="response-details-dialog-title">{descriptionLabel}</h4>
        <div className="response-details-dialog-value">{descriptionValue}</div>
        {file?.id && (
          <>
            <h4 className="response-details-dialog-title">Attached Document</h4>
            <div className="attachment-detail">
              <div className="attachment-detail-docs-icon-area">
                {renderDocumentIcon(file?.type)}
                <div className="attachment-detail-info">
                  <div className="name">{file?.filename}</div>
                  <div className="size">{file?.size}</div>
                </div>
              </div>
              <Button
                icon
                className="attachment-btn"
                onClick={() => {
                  window.open(getPublicUrl(file?.url))
                }}
              >
                save_alt
              </Button>
            </div>
          </>
        )}
      </div>
    </DialogContainer>
  )
}

export default ResponseDetailsDialog

ResponseDetailsDialog.defaultProps = {
  title: 'Resolution Details',
  descriptionLabel: 'Resolution Description',
  descriptionValue: 'text',
  file: {},
  // readOnly:true,
  status: 'new',
}
