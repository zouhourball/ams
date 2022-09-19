import { useState, Fragment } from 'react'
import moment from 'moment'
import { Button } from 'react-md'

// import { activities } from '../activities/helper'
import './style.scss'

export const Activities = ({ activities, onClickIndicator, onClickToday }) => {
  const [
    zoom,
    // setZoom,
  ] = useState(1)
  const dumbData = []
  const minDate = moment.min(activities.map(({ date }) => moment(date)))
  const maxDate = moment.max(activities.map(({ date }) => moment(date)))
  const lastDate = moment({
    year: maxDate.year(),
    month: maxDate.month(),
    day: maxDate.date(),
  }).add(4, 'days')
  const firstDate = moment.min(
    moment({
      year: minDate.year(),
      month: minDate.month(),
      day: minDate.date(),
    }).subtract(1, 'days'),
    moment(lastDate).subtract(1, 'months'),
  )
  for (let date = firstDate; date.isBefore(lastDate); date.add(1, 'days')) {
    dumbData.push(moment(date.valueOf()))
  }
  return (
    <div className="activities">
      {/* NOTE zoom feature */}
      {/* <div onClick={() => zoom < 8 ? setZoom(zoom + 1) : null}>zoom In</div>
      <div onClick={() => zoom > 1 ? setZoom(zoom - 1) : null}>zoom Out</div> */}
      <div className="activities-scale">
        {dumbData.map(date => {
          const activitiesToShow = activities.filter(activity => {
            const res = moment(activity.date).isBetween(
              date.valueOf(),
              moment(date.valueOf())
                .add(1, 'days')
                .valueOf(),
            )
            return res
          })
          return (
            <ActivitiesColumn
              key={date.valueOf()}
              date={date}
              zoom={zoom}
              activitiesToShow={activitiesToShow}
              onClickToday={onClickToday}
              onClickIndicator={onClickIndicator}
            />
          )
        })}
      </div>
    </div>
  )
}

const ActivitiesColumn = ({
  date,
  zoom,
  activitiesToShow,
  onClickToday,
  onClickIndicator,
}) => {
  const [isHovered, setIsHovered] = useState(false)
  return (
    <div
      className="activities-scale-coll"
      onMouseLeave={() => setIsHovered(false)}
    >
      <Month date={date} zoom={zoom} />
      <div className="activities-bar" onMouseOver={() => setIsHovered(true)} />

      {activitiesToShow.map((activity, index, self) => {
        const distance = Math.round(
          (100 * (activity.date - date.valueOf())) /
            (moment(date.valueOf())
              .add(1, 'days')
              .valueOf() -
              date.valueOf()),
        )
        return (
          <Fragment key={index}>
            {activity.id === 'today' ? (
              <Button
                onMouseOver={() => setIsHovered(true)}
                className={`activities-today color-${activity.color}`}
                style={{ left: `${distance}%` }}
                icon
                onClick={() => onClickToday(activity)}
                tooltipLabel="Today"
                tooltipPosition="top"
              >
                done
              </Button>
            ) : (
              <div
                onMouseOver={() => setIsHovered(true)}
                className={`activities-indicator color-${activity.color}`}
                style={{ left: `${distance}%` }}
                onClick={() =>
                  activitiesToShow.length === 1 && onClickIndicator(activity)
                }
              />
            )}
            {activity.id !== 'today' && self.length === 1 && (
              <div key={index} className={`activities-details`}>
                <div> {activity.title}</div>
                {/* <div> ID:{activity.id}</div> */}
                {/* <div>
                {moment(activity.date).format('DD/MM/YYYY HH:mm:ss')}
              </div> */}
              </div>
            )}
            {/* {activity.id !== 'today' && self.length !== 1 && index === 0 && !isHovered && (
            <div key={index} className={`activities-details`}>
              {self.length}
            </div>
          )} */}
          </Fragment>
        )
      })}
      {activitiesToShow.length > 1 && isHovered && (
        <div className="activities-details">
          {activitiesToShow
            .filter(({ id }) => id !== 'today')
            .map((activity, index) => (
              <div
                key={index}
                className="activities-details-list"
                onClick={() => onClickIndicator(activity)}
              >
                <div
                  className={`activities-details-list-marker color-${activity.color}`}
                />
                <div>{activity.title}</div>
              </div>
            ))}
        </div>
      )}
    </div>
  )
}

const Month = ({ date, zoom }) => {
  // console.log('date', date.date())
  // let label = ''
  // console.log('date formatted', date.format('DD-MM-YYYY HH:mm:ss'))
  // switch (date.month() + 1) {
  //   case 1:
  //     label = date.year()
  //     break
  //   case 4:
  //     label = 'Q2'
  //     break
  //   case 7:
  //     label = 'Q3'
  //     break
  //   case 10:
  //     label = 'Q4'
  //     break
  //   default:
  //     label = ''
  // }
  return (
    <div className="month">
      {date.date() === 1
        ? date.month() === 0
          ? date.year()
          : date.format('MMM')
        : date.date()}
    </div>
  )
}
