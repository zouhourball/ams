import { navigate } from '@reach/router'
// import { useQuery } from 'react-query'
// import { viewVersions } from 'libs/api/api-planning'

import TopBarDetail from 'components/top-bar-detail'
// import useRole from 'libs/hooks/use-role'

import './style.scss'

const ViewHistorian = ({ sections, objectId = 1, version = 2, subModule }) => {
  /* const { data: listVersions, refetch: refetchListVersions } = useQuery(
    ['viewVersions', objectId, version, subModule],
    objectId && viewVersions,
  ) */

  const detailData = {
    title: 'Block 55',
    companyName: 'company',
    companyAllRoles: true,
    status: 'gggg',
  }
  // console.log(listVersions, 'listVersions')
  const renderSections = () =>
    sections.map((section, index) => (
      <div key={index} className="section">
        <div className="header">
          <div className="empty-right-arrow"></div>
          <div className="sub-header">
            <h2>{section?.role}</h2>
            <span>Iteration: {section?.iterationNum}</span>
          </div>
          <div className="arrow-right"></div>
        </div>
        {section?.iterationNum ? (
          <div className="card">
            <div className="label">
              {section?.avatar}
              <div className="text">
                <span>{section?.name}</span>
                <span>{section?.position}</span>
              </div>
            </div>
            <span>Date & Time</span>
            {section?.date}
          </div>
        ) : (
          <div className="no-activity">No Recent Activity</div>
        )}
      </div>
    ))
  return (
    <div className="view-historian">
      <TopBarDetail
        onClickBack={() => navigate('/ams/planning')}
        actions={[]}
        detailData={detailData}
      />
      <div className="dashboard">{renderSections()}</div>
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
