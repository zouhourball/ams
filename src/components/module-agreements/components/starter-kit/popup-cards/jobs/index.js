import React from 'react'
import CardLayout from '../card-layout'
import jobsSVG from 'images/jobs.svg'
import viewAllJobsSVG from 'images/view-all-jobs.svg'
import searchJobsSVG from 'images/search-jobs.svg'

const JobsCard = ({
  onSearch,
  onSearchBtn,
  onView,
  onViewBtn,
  className,
  ...rest
}) => {
  const actions = [
    {
      label: 'Search Jobs at your Location',
      iconSrc: searchJobsSVG,
      onClick: () => {
        onSearch && onSearch()
      },
      onBtnClick: () => {
        onSearchBtn && onSearchBtn()
      },
    },
    {
      label: 'View All Jobs',
      iconSrc: viewAllJobsSVG,
      onClick: () => {
        onView && onView()
      },
      onBtnClick: () => {
        onViewBtn && onViewBtn()
      },
    },
  ]
  return (
    <CardLayout
      actions={actions}
      title="Jobs"
      background="#fa1a27"
      description="Meera Jobs is an open jobs center and human resources market. You can create your own profile, find your interested jobs from your target company. Or as an business owner, you can post new position for hiring."
      iconSrc={jobsSVG}
      {...rest}
    />
  )
}

export default JobsCard
