import React from 'react'
import { List, Avatar, FontIcon } from 'react-md'
import jobsIcon from 'images/apps/jobs.svg'
import InfoItem from '../info-item'
import PropTypes from 'prop-types'

import './styles.scss'

export default function BlockJobs (props) {
  const { title, desc, ...rest } = props
  const infoList = [
    {
      iconClassName: 'mdi mdi-search-web',
      label: 'Search Jobs at your Location',
    },
  ]
  return (
    <section className="app-starterkit-blockjobs-container" {...rest}>
      <div className="app-starterkit-blockjobs-content">
        <section className="app-starterkit-blockjobs-iconwrapper">
          <img className="app-starterkit-blockjobs-icon" src={jobsIcon} />
        </section>
        <section>
          <h2 className="app-starterkit-blockjobs-title">{title}</h2>
          <p className="app-starterkit-blockjobs-desc">{desc}</p>
        </section>
      </div>

      <List className="app-starterkit-blockjobs-infolist">
        {infoList.map(m => (
          <InfoItem
            key={m.label}
            className="app-starterkit-blockjobs-infoitem"
            tileClassName="app-starterkit-blockjobs-infoitem-tile"
            leftAvatar={
              <Avatar icon={<FontIcon iconClassName={m.iconClassName} />} />
            }
            rightIcon={null}
            primaryText={m.label}
          />
        ))}
      </List>
    </section>
  )
}

BlockJobs.defaultProps = {
  title: 'Jobs',
  desc: 'Meera Jobs will help you progress your career',
}

BlockJobs.propTypes = {
  title: PropTypes.string,
  desc: PropTypes.string,
}
