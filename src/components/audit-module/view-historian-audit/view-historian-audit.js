import { navigate } from '@reach/router'
import { get, isEmpty, capitalize } from 'lodash-es'
// import { useQuery } from 'react-query'

import TopBarDetail from 'components/top-bar-detail'
import UserInfoBySubject from 'components/user-info-by-subject'
import { getPublicUrl } from 'libs/api/api-file-manager'

import { getAuditHistory, getAuditByID } from 'libs/api/api-audit'

import { useQuery } from 'react-query'
// import useRole from 'libs/hooks/use-role'

import './style.scss'
import { Avatar } from 'react-md'
import moment from 'moment'

const ViewHistorianAudit = ({
  objectId = 1,
  subModule,
  returnTo = 'planning',
}) => {
  const { data: auditProcessHistorian } = useQuery(
    ['getAuditHistory', objectId],
    getAuditHistory,
  )

  const renderProcessHistorianList = (stream) => {
    let list = []
    if (auditProcessHistorian && !isEmpty(auditProcessHistorian?.data)) {
      ;(auditProcessHistorian?.data || []).forEach((el) => {
        if (el?.stream === stream) {
          list.push({
            subject: el?.subject,
            status: el?.status,
            action: el?.action,
            date: el?.date,
          })
        }
      })
    }
    return list
  }

  const renderProcessHistorian = () => {
    let processHistorian = [
      {
        list: renderProcessHistorianList('AUDIT_REQUEST'),
        title: 'Audit Request',
      },
      {
        list: renderProcessHistorianList('INVITE_PARTICIPANT'),
        title: 'Invite Participant',
      },
      {
        list: renderProcessHistorianList('ACKNOWLEDGE_OF_PARTICIPANT'),
        title: 'Acknowledged Of Participant',
      },
      {
        list: renderProcessHistorianList('NONE'),
        title: 'Status Of Request',
      },
    ]
    return processHistorian
  }
  const { data: dataDetails } = useQuery(
    ['getDetailPlanningById', objectId],
    objectId && getAuditByID,
  )

  const metaData = get(dataDetails, 'data')
  const detailData = {
    title: `${get(metaData, 'title')}`,
    requestDate: moment(metaData?.createdAt).format('DD MMM YYYY HH:mm'),
    auditId: `${get(metaData, 'id')}`,
  }

  // const directions = {
  //   '-1': '#ff7474',
  //   0: '#f8e5d1',
  //   1: '#c4f491',
  // }
  const getPublicUrlPhoto = (url) => {
    let newUrl = url.split('/download/')[1]
    return getPublicUrl(newUrl)
  }

  const renderAction = (action) => {
    return capitalize(action.replace(/_/g, ' ').toLowerCase())
  }
  const renderSections = () =>
    renderProcessHistorian()?.map((section, index) => (
      <div key={index} className="section">
        <div className="header">
          <div className="empty-right-arrow"></div>
          <div
            className="sub-header"
            // style={{ backgroundColor: directions[section?.direction] }}
          >
            <h3>{section.title}</h3>
          </div>
          <div className="arrow-right"></div>
        </div>
        {section?.list.length > 0 ? (
          <div className="contents">
            {section?.list?.map((el) => (
              <UserInfoBySubject key={el?.subject} subject={el?.subject}>
                {(res) => (
                  <div className="user-card">
                    <div className="user-info">
                      <div className="user-avatar">
                        <Avatar
                          src={
                            get(res, 'photo.aPIURL', null)
                              ? getPublicUrlPhoto(res?.photo?.aPIURL)
                              : null
                          }
                        >
                          {get(res, 'photo.aPIURL', null)
                            ? null
                            : get(res, 'fullName.0', '')}
                        </Avatar>
                      </div>
                      <div className="user-details">
                        <h3> {res ? res?.fullName : 'N/A'} </h3>
                        <h4>{renderAction(el?.action)}</h4>
                      </div>
                    </div>
                    <div className="user-card-divider"></div>
                    <div className="card-date">
                      <span>
                        {' '}
                        Date & Time:{' '}
                        {moment(el?.date).format('DD MMM YYYY HH:mm')}
                      </span>
                    </div>
                  </div>
                )}
              </UserInfoBySubject>
            ))}
          </div>
        ) : (
          <div className="no-activity">No Recent Activity</div>
        )}
      </div>
    ))

  return (
    <div className="view-historian-audit">
      <TopBarDetail
        onClickBack={() => navigate(`/ams/${returnTo}`)}
        actions={[]}
        detailData={detailData}
      />
      <div className="dashboard">{renderSections()}</div>
    </div>
  )
}
export default ViewHistorianAudit
ViewHistorianAudit.defaultProps = {
  sections: [
    {
      role: 'Operator',
      iterationNum: 1,
      name: 'name',
      avatar: 'avatar',
      position: 'developer',
      date: '27 sep 2021',
    },
    {
      role: 'Tecom',
      iterationNum: 1,
      name: 'name',
      avatar: 'avatar',
      position: 'developer',
      date: '27 sep 2021',
    },
    {
      role: 'Fincom',
      iterationNum: 0,
      name: 'name',
      avatar: 'avatar',
      position: 'developer',
      date: '27 sep 2020',
    },
    {
      role: 'JMC',
      iterationNum: 0,
      name: 'name',
      avatar: 'avatar',
      position: 'developer',
      date: '27 sep 2021',
    },
  ],
}
