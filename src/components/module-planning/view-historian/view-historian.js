import { navigate } from '@reach/router'
import { get } from 'lodash-es'
// import { useQuery } from 'react-query'

import TopBarDetail from 'components/top-bar-detail'
import UserInfoBySubject from 'components/user-info-by-subject'
import { getPublicUrl } from 'libs/api/api-file-manager'
import {
  getDetailPlanningById,
  getWbqProcessHistorian,
} from 'libs/api/api-planning'

import { useQuery } from 'react-query'
// import useRole from 'libs/hooks/use-role'

import './style.scss'
import { Avatar } from 'react-md'
import moment from 'moment'

const ViewHistorian = ({
  sections,
  objectId = 1,
  version = 2,
  subModule,
  returnTo = 'planning',
}) => {
  const { data: processHistorian } = useQuery(
    ['wbqProcessHistorian', objectId],
    getWbqProcessHistorian,
  )
  const { data: dataDetails } = useQuery(
    ['getDetailPlanningById', objectId, subModule],
    objectId && getDetailPlanningById,
  )
  const metaData = get(dataDetails, 'metaData')
  const detailData = {
    title: `Block ${get(metaData, 'block')}`,
    companyName: get(metaData, 'company'),
    companyAllRoles: true,
    status: get(metaData, 'status'),
  }
  const streams = {
    LOAD: 'Operator',
    TECOM_APPROVAL: 'Tecom',
    FINCOM_APPROVAL: 'Fincom',
    JMC_APPROVAL: 'JMC',
  }

  const directions = {
    '-1': '#ff7474',
    0: '#f8e5d1',
    1: '#c4f491',
  }
  const getPublicUrlPhoto = (url) => {
    let newUrl = url.split('/download/')[1]
    return getPublicUrl(newUrl)
  }
  // console.log(listVersions, 'listVersions')
  const renderPlaceholders = () => {
    const header = (
      <div className="header">
        <div className="empty-right-arrow"></div>
        <div className="sub-header" style={{ backgroundColor: 'white' }}></div>
        <div className="arrow-right" style={{ borderLeftColor: 'white' }}></div>
      </div>
    )
    let placeholder = [header]
    for (let index = 0; index < 4 - processHistorian?.length; index++) {
      placeholder.push(<div className="no-activity">No Recent Activity</div>)
    }
    return <div className="section">{placeholder}</div>
  }
  const renderSections = () =>
    processHistorian?.map((section, index) => (
      <div key={index} className="section">
        <div className="header">
          <div className="empty-right-arrow"></div>
          <div
            className="sub-header"
            style={{ backgroundColor: directions[section?.direction] }}
          >
            <h3>{streams[section?.stream]}</h3>
            <span>Iteration: {Object.keys(section?.tasks).length}</span>
          </div>
          <div
            className="arrow-right"
            style={{ borderLeftColor: directions[section?.direction] }}
          ></div>
        </div>
        {Object.keys(section?.tasks).length > 0 ? (
          <div className="contents">
            {section?.tasks?.map((el) => (
              <UserInfoBySubject key={el?.wpbId} subject={el?.user?.sub}>
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
                        <h4>{res ? res?.title : 'N/A'}</h4>
                      </div>
                    </div>
                    <div className="user-card-divider"></div>
                    <div className="card-date">
                      <span>
                        {' '}
                        Date & Time:{' '}
                        {moment(el?.time).format('DD MMM YYYY HH:mm')}
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
    <div className="view-historian">
      <TopBarDetail
        onClickBack={() => navigate(`/ams/${returnTo}`)}
        actions={[]}
        detailData={detailData}
      />
      <div className="dashboard">
        {renderSections()}
        {processHistorian?.length < 4 && renderPlaceholders()}
      </div>
    </div>
  )
}
export default ViewHistorian
ViewHistorian.defaultProps = {
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
