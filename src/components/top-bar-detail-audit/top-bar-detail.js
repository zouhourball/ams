import { Button } from 'react-md'

import './style.scss'

const TopBarDetail = ({ detailData, actions, onClickBack, view }) => {
  const {
    title,
    purpose,
    auditId,
    date,
    scope,
    expectedDeliv,
    status,
    description,
  } = detailData
  const renderListButtons = () => {
    return actions.map((action) => action)
  }
  return (
    <div className="top-bar-detail">
      <div className="top-bar-detail-left">
        <Button
          icon
          onClick={() => {
            onClickBack && onClickBack()
          }}
          className="top-bar-detail-left-icon"
        >
          arrow_back_ios_new
        </Button>
        <div className="top-bar-detail-left-information">
          <div className="top-bar-detail-left-information-titles">
            <div className="top-bar-detail-left-information-titles-title">
              {title}
            </div>
            <div className={`status status-${status}`}>{status}</div>
          </div>

          <div className="top-bar-detail-left-information-details">
            {auditId && (
              <>
                {' '}
                <div className="top-bar-detail-left-information-details-item">
                  <div className="top-bar-detail-left-information-details-item-key">
                    Audit ID :
                  </div>
                  <div className="top-bar-detail-left-information-details-item-value">
                    {' '}
                    {auditId}
                  </div>
                </div>
              </>
            )}

            {date && (
              <div className="top-bar-detail-left-information-details-item">
                <div className="top-bar-detail-left-information-details-item-sep"></div>

                <div className="top-bar-detail-left-information-details-item-key">
                  {view === 'default' && 'Requested date :'}
                  {view === 'response' && 'Date Raised :'}
                  {view === 'actions' && 'Request Date :'}
                </div>
                <div className="top-bar-detail-left-information-details-item-value">
                  {' '}
                  {date}
                </div>
              </div>
            )}
            {purpose && (view === 'default' || view === 'actions') && (
              <>
                {' '}
                <div className="top-bar-detail-left-information-details-item">
                  <div className="top-bar-detail-left-information-details-item-sep"></div>

                  <div className="top-bar-detail-left-information-details-item-key">
                    {(view === 'default' || view === 'actions') && 'Purpose :'}
                  </div>
                  <div className="top-bar-detail-left-information-details-item-value">
                    {' '}
                    {purpose}
                  </div>
                </div>
              </>
            )}
            {description && view === 'response' && (
              <div className="top-bar-detail-left-information-details-item">
                <div className="top-bar-detail-left-information-details-item-sep"></div>

                <div className="top-bar-detail-left-information-details-item-key">
                  Short Description :
                </div>
                <div className="top-bar-detail-left-information-details-item-value">
                  {' '}
                  {description}
                </div>
              </div>
            )}
            {scope && (view === 'default' || view === 'actions') && (
              <div className="top-bar-detail-left-information-details-item">
                <div className="top-bar-detail-left-information-details-item-sep"></div>

                <div className="top-bar-detail-left-information-details-item-key">
                  {(view === 'default' || view === 'actions') && 'Scope :'}
                </div>
                <div className="top-bar-detail-left-information-details-item-value">
                  {' '}
                  {scope}
                </div>
              </div>
            )}
            {expectedDeliv && (view === 'default' || view === 'actions') && (
              <div className="top-bar-detail-left-information-details-item">
                <div className="top-bar-detail-left-information-details-item-sep"></div>
                <div className="top-bar-detail-left-information-details-item-key">
                  {' '}
                  {(view === 'default' || view === 'actions') &&
                    'Expected Deliverable :'}
                </div>
                <div className="top-bar-detail-left-information-details-item-value">
                  {' '}
                  {expectedDeliv}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="top-bar-detail-buttons">
        <div className="top-bar-detail-buttons-list">{renderListButtons()}</div>
      </div>
    </div>
  )
}

export default TopBarDetail
TopBarDetail.defaultProps = {
  detailData: {
    title: 'Annual Report',
    subTitle: 'Block 31',
    companyName: 'PDO',
    submittedBy: 'Muhammad Ahmad',
    submittedDate: '14 mins ago',
  },
  actions: [
    <Button
      key="1"
      id="save"
      className="top-bar-detail-buttons-list-item-btn"
      flat
      primary
      swapTheming
      onClick={() => {}}
    >
      Download Annual Plan
    </Button>,
    <Button
      key="2"
      id="save"
      className="top-bar-detail-buttons-list-item-btn"
      flat
      primary
      swapTheming
      onClick={() => {}}
    >
      View Documents
    </Button>,
    <Button
      key="3"
      id="save"
      className="top-bar-detail-buttons-list-item-btn"
      flat
      primary
      swapTheming
      onClick={() => {}}
    >
      Download Original File
    </Button>,
    <Button
      key="4"
      id="accept"
      className="top-bar-detail-buttons-list-item-btn"
      flat
      primary
      swapTheming
      onClick={() => {}}
    >
      Accept
    </Button>,
    <Button
      key="4"
      id="reject"
      className="top-bar-detail-buttons-list-item-btn"
      flat
      primary
      swapTheming
      onClick={() => {}}
    >
      Reject
    </Button>,
  ],
}
