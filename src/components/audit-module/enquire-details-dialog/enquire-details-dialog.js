import { Button, DialogContainer, FontIcon, Avatar } from 'react-md'
import { get } from 'lodash-es'
import { getPublicUrl } from 'libs/utils/custom-function'

import UserInfoBySubject from 'components/user-info-by-subject'

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
  title,
  enquiryDetails,
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
        <>
          {title}
          <div className={`status status-${enquiryDetails?.status}`}>
            {enquiryDetails?.status}
          </div>
        </>
      }
      className="enquire-details-dialog"
      disableScrollLocking
      modal
    >
      <h4 className="enquire-details-dialog-title">Audit ID</h4>
      <div className="enquire-details-dialog-value">
        {enquiryDetails?.auditID}
      </div>
      <h4 className="enquire-details-dialog-title">Enquiry Description</h4>
      <div className="enquire-details-dialog-value">
        {enquiryDetails?.description?.replace(/<\/?[^>]+(>|$)/g, '')}
      </div>
      <h4 className="enquire-details-dialog-title">
        Attached Enquiry Document
      </h4>
      <div className="attachment-detail">
        <div className="attachment-detail-docs-icon-area">
          {renderDocumentIcon(enquiryDetails?.enquiryDocuments[0]?.type)}
          <div className="attachment-detail-info">
            <div className="name">
              {enquiryDetails?.enquiryDocuments[0]?.filename}
            </div>
            <div className="size">
              {enquiryDetails?.enquiryDocuments[0]?.size}
            </div>
          </div>
        </div>
        <Button
          icon
          className="attachment-btn"
          onClick={() => {
            onDownload(enquiryDetails?.enquiryDocuments[0]?.id)
          }}
        >
          save_alt
        </Button>
      </div>
      <h4 className="enquire-details-dialog-title">Assignee</h4>
      <div className="assignee">
        <UserInfoBySubject subject={enquiryDetails?.participants[0]}>
          {(res) => (
            <div className="submittedBy">
              <Avatar
                src={
                  get(res, 'photo.aPIURL', null)
                    ? getPublicUrl(res.photo.aPIURL)
                    : null
                }
              >
                {get(res, 'photo.aPIURL', null)
                  ? null
                  : get(res, 'fullName.0', '')}
              </Avatar>
              {res ? res.fullName : 'N/A'}
            </div>
          )}
        </UserInfoBySubject>
        {/* <Avatar src={assignee.avatar} />
        <div className="assignee-name">{enquiryDetails?.participants}</div> */}
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
