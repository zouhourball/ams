import { useCallback } from 'react'
// import { mdiAlertCircleOutline } from '@mdi/js'
// import Icon from '@mdi/react'
import { getRecommendedTime } from 'libs/api/venue'
import useSWR from 'swr'
import { map } from 'lodash-es'
import { format, sub } from 'date-fns'
import useToggle from '@rooks/use-toggle'
import ChevronUpIcon from 'mdi-react/ChevronUpIcon'
import ChevronDownIcon from 'mdi-react/ChevronDownIcon'
import AlertCircleOutlineIcon from 'mdi-react/AlertCircleOutlineIcon'
import { Button } from 'react-md'
import classnames from 'classnames'

export const RecommendedTime = ({ availableUsersParams, onChange }) => {
  const [showMore, toggleShowMore] = useToggle(false)
  const { data } = useSWR(
    [availableUsersParams, 'available-time-spans'],
    getRecommendedTime,
  )
  const setRecommendedTime = useCallback(
    (item) => () => {
      onChange &&
        onChange({
          startTime: new Date(item.startTime),
          endTime:
            format(new Date(item.endTime), 'HH:mm') === '00:00'
              ? sub(new Date(item.endTime), { minutes: 1 })
              : new Date(item.endTime),
        })
    },
    [onChange],
  )
  return (
    <div
      className={classnames('recommendedtime-container', {
        collapsed: !showMore,
      })}
    >
      <div className="recommendedtime-container-icon">
        <AlertCircleOutlineIcon
          title="User Profile"
          size={'14px'}
          color="#1979ff"
        />
      </div>
      <div className="recommendedtime-container-text">Recommended Time: </div>
      {map(data, (item) => {
        return (
          <div
            className="recommendedtime-container-time"
            tabIndex={0}
            role="button"
            onClick={setRecommendedTime(item)}
          >
            {format(new Date(item.startTime), 'HH:mm')} -{' '}
            {format(new Date(item.endTime), 'HH:mm')}
          </div>
        )
      })}
      <div className="recommendedtime-right-toggle">
        <Button icon onClick={toggleShowMore}>
          {showMore ? (
            <ChevronUpIcon size={'22px'} />
          ) : (
            <ChevronDownIcon size={'22px'} />
          )}
        </Button>
      </div>
    </div>
  )
}
