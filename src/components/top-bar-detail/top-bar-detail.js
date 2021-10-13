
import { Button } from 'react-md'

import './style.scss'

const TopBarDetail = ({ title, subTitle, companyName, submittedBy, submittedDate, actions, menuItems }) => {
  const renderListButtons = () => {
    return actions.map(action => action)
  }
  return (
    <div className="top-bar-detail">
      <div className="top-bar-detail-left" >
        <Button icon >arrow_back_ios_new</Button>
        <div className="top-bar-detail-left-information">
          <div className="top-bar-detail-left-information-titles">
            <div className="top-bar-detail-left-information-titles-title">
              {title}
            </div>
            <div className="top-bar-detail-left-information-titles-sub-title">/</div>
            <div className="top-bar-detail-left-information-titles-sub-title">
              {subTitle}
            </div>
          </div>

          <div className="top-bar-detail-left-information-details">
            <div className="top-bar-detail-left-information-details-item">
              <div className="top-bar-detail-left-information-details-item-key">Company :</div>
              <div className="top-bar-detail-left-information-details-item-value"> {companyName}</div>
              <div className="top-bar-detail-left-information-details-item-sep"></div>
            </div>
            <div className="top-bar-detail-left-information-details-item">
              <div className="top-bar-detail-left-information-details-item-key">Submitted by :</div>
              <div className="top-bar-detail-left-information-details-item-value"> {submittedBy}</div>
              <div className="top-bar-detail-left-information-details-item-sep"></div>
            </div>
            <div className="top-bar-detail-left-information-details-item">
              <div className="top-bar-detail-left-information-details-item-key"> Submitted Date :</div>
              <div className="top-bar-detail-left-information-details-item-value"> {submittedDate}</div>

            </div>
          </div>
        </div>
      </div>
      <div className="top-bar-detail-buttons">
        <div className="top-bar-detail-buttons-list">
          {renderListButtons()}
        </div>
      </div>
    </div>)
}

export default TopBarDetail
TopBarDetail.defaultProps = {
  title: 'Annual Report',
  subTitle: 'Block 31',
  companyName: 'PDO',
  submittedBy: 'Muhammad Ahmad',
  submittedDate: '14 mins ago',
  actions: [
    <Button
      key='1'
      id="save"
      className="top-bar-detail-buttons-list-item-btn"
      flat
      primary
      swapTheming
      onClick={() => {
      }}
    >Upload Monthly Flaring Report
    </Button>,
    <Button
      key="2"
      id="save"
      className="top-bar-detail-buttons-list-item-btn"
      flat
      primary
      swapTheming
      onClick={() => {
      }}
    >Upload Daily Flaring Report
    </Button>,
    <Button
      key="3"
      id="save"
      className="top-bar-detail-buttons-list-item-btn"
      flat
      primary
      swapTheming
      onClick={() => {
      }}
    >Upload Annual Flaring Report
    </Button>,
  ],
}