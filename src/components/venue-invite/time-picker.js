/* eslint-disable react/prop-types */
import React, { useEffect } from 'react'
import {
  addMinutes,
  format,
  startOfDay,
  isValid,
  intervalToDuration,
} from 'date-fns'
import './time-picker.scss'
import Outside from 'react-outside-click-handler'
import cls from 'classnames'
import { TextField } from 'react-md'
import ClockIcon from 'mdi-react/ClockIcon'

const validateTime = (str) => {
  // time format: HH:mm
  const reg = /^(?:(?:[0-2][0-3])|(?:[0-1][0-9]))[:：][0-5][0-9]$/
  return reg.test(str)
}
export const timeMaps = (date, hidePastTime) => {
  // const start = (hidePastTime ? date : startOfDay(new Date())) || 0
  let start = 0
  var coff = 1000 * 60 * 30

  if (hidePastTime) {
    start = date
  } else {
    start = date
      ? new Date(Math.ceil(new Date() / coff) * coff).getTime()
      : startOfDay(new Date())
  }
  const maps = []
  for (
    let i = start;
    i < new Date().setHours(23, 59, 0, 0);
    i = addMinutes(i, 30)
  ) {
    maps.push(new Date(i).getTime())
  }
  return maps
}

export const TimePickerInput = ({
  value,
  label,
  formateText = 'HH:mm',
  onChange,
  hidePastTime = false,
  showDistanceTo,
  updateSelectOptions = false,
  onOutsideClick,
  onSelect,
  onKeyDown,
  error,
  dateTest,
}) => {
  const [visible, setVisible] = React.useState(false)
  const [options, setOptions] = React.useState(timeMaps(new Date()))
  const [activeInd, setActiveInd] = React.useState(
    timeMaps(new Date()).findIndex((h) => h === value),
  )
  const timeRef = React.useRef(null)
  const optionsRef = React.useRef(null)

  const handleToggle = React.useCallback(() => {
    setVisible(!visible)
    /* eslint no-unused-expressions: [2, { allowShortCircuit: true }] */
    timeRef.current && timeRef.current.select()
  }, [timeRef, visible])

  const handleOutsideClick = React.useCallback(() => {
    setVisible(false)
    onOutsideClick && onOutsideClick()
  }, [onOutsideClick])

  React.useEffect(() => {
    if (visible && !hidePastTime && optionsRef.current && activeInd > 0) {
      optionsRef.current.scrollTop = activeInd * 40
    }
  }, [visible, hidePastTime, optionsRef, activeInd])

  React.useEffect(() => {
    if (updateSelectOptions && typeof value !== 'string') {
      const newOptions = timeMaps(value, hidePastTime)
      setOptions(newOptions)
    }
  }, [updateSelectOptions, value, hidePastTime, dateTest])
  React.useEffect(() => {
    if (!updateSelectOptions && typeof value !== 'string') {
      var today = new Date().setHours(0, 0, 0, 0)
      var thatDay = dateTest.setHours(0, 0, 0, 0)
      const newOptions = timeMaps(today === thatDay ? new Date() : null)
      setOptions(newOptions)
    }
  }, [dateTest])
  React.useEffect(() => {
    if (typeof value !== 'string') {
      setActiveInd(options.findIndex((h) => h === value))
    }
  }, [options, value])

  const handleChange = React.useCallback(
    (e) => {
      onChange(e.target.value)
    },
    [onChange],
  )

  const handleKeyDown = React.useCallback(
    (e) => {
      if (e.keyCode === 13) {
        setVisible(false)
        timeRef.current && timeRef.current.blur()
      }
      onKeyDown && onKeyDown(e)
    },
    [timeRef, onKeyDown, setVisible],
  )

  const handleSelect = (h) => () => {
    onSelect(h)
    setVisible(false)
  }

  return (
    <Outside onOutsideClick={handleOutsideClick}>
      <div className="time-picker-input-container">
        <div role="button" tabIndex={0} onClick={handleToggle}>
          <TextField
            ref={timeRef}
            label={label}
            value={
              typeof value === 'string' ? value : format(value, formateText)
            }
            placeholder="HH:mm"
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            className="time-date-picker"
            rightIcon={
              <ClockIcon size={'18px'} style={{ fill: 'rgba(0,0,0,0.6)' }} />
            }
            error={!!error}
          />
        </div>

        <div
          className={cls('time-picker-input-panel', { visible })}
          ref={optionsRef}
        >
          {options.map((h, index) => {
            const id = index
            const distance =
              showDistanceTo && isValid(showDistanceTo)
                ? intervalToDuration({
                  start: new Date(showDistanceTo),
                  end: new Date(h),
                })
                : null
            const distanceText = showDistanceTo
              ? ` (${
                (distance?.hours || 0) + (distance?.minutes || 0) / 60.0
              } ${
                (distance?.hours || 0) + (distance?.minutes || 0) / 60.0 > 1
                  ? 'hours'
                  : 'hour'
              })`
              : ''
            return (
              <div
                role="button"
                tabIndex={0}
                key={id}
                className={cls(
                  'time-picker-input-panel-item',
                  activeInd === index &&
                    'time-picker-input-panel-item-selected',
                )}
                onClick={handleSelect(h)}
              >
                {format(h, formateText)}
                {distanceText}
              </div>
            )
          })}
        </div>
        <div
          style={{
            display: !error ? 'none' : 'initial',
          }}
          className="time-picker-input-error"
        >
          {error}
        </div>
      </div>
    </Outside>
  )
}

// interface ITimeType {
//   startTime: number;
//   endTime: number;
//   valid: boolean;
// }
// interface ITimePickerProps {
//   defaultStart: number;
//   defaultEnd: number;
//   onChange?: (time: ITimeType) => void;
// }

export const TimePicker = ({
  defaultStart,
  defaultEnd,
  onChange,
  dateTest,
}) => {
  const [startTime, setStartTime] = React.useState(defaultStart)
  const [endTime, setEndTime] = React.useState(defaultEnd)
  const [tempStart, setTempStart] = React.useState(null)
  const [valid, setValid] = React.useState(true)
  const [tempEnd, setTempEnd] = React.useState(null)
  useEffect(() => {
    setStartTime(defaultStart)
  }, [defaultStart])
  useEffect(() => {
    setEndTime(defaultEnd)
  }, [defaultEnd])
  React.useEffect(() => {
    setValid(startTime < endTime)
  }, [startTime, endTime])

  const handleSelect = (field) => (time) => {
    if (field === 'start') {
      setStartTime(time)
      const endOfDay = new Date(startTime).setHours(23, 59, 59, 999)
      const maxStartTime = new Date(startTime).setHours(23, 30, 0, 0)
      if (time >= maxStartTime) {
        setEndTime(endOfDay)
        onChange &&
          onChange({ startTime: time, endTime: endOfDay, valid: true })
      } else {
        setEndTime(new Date(addMinutes(time, 30)).getTime())
        onChange &&
          onChange({
            startTime: time,
            endTime: addMinutes(time, 30).getTime(),
            valid: true,
          })
      }
    } else {
      setEndTime(time)
      onChange &&
        onChange({ startTime, endTime: time, valid: startTime < time })
    }
    setValid(startTime < endTime)
  }
  const handleSave = (field) => () => {
    const str = field === 'start' ? tempStart : tempEnd
    if (typeof str !== 'string') return
    const validate = validateTime(str)
    if (validate) {
      // The colon come in two formats：or:
      const hour = str.includes(':') ? +str.split(':')[0] : +str.split('：')[0]
      const minute = str.includes(':')
        ? +str.split(':')[1]
        : +str.split('：')[1]
      const newValue = new Date().setHours(hour, minute, 0, 0)
      if (field === 'start') {
        setStartTime(newValue)
        if (hour === 23 && minute >= 30) {
          setEndTime(new Date().setHours(23, 59, 0, 0))
          onChange &&
            onChange({
              startTime: newValue,
              endTime: new Date().setHours(23, 59, 0, 0),
              valid: true,
            })
        } else {
          setEndTime(addMinutes(new Date(newValue), 30).getTime())
          onChange &&
            onChange({
              startTime: newValue,
              endTime: addMinutes(new Date(newValue), 30).getTime(),
              valid: true,
            })
        }
      } else {
        setEndTime(newValue)
        onChange &&
          onChange({
            startTime,
            endTime: newValue,
            valid: startTime < newValue,
          })
      }
      setValid(startTime < endTime)
    }
    setTempStart(null)
    setTempEnd(null)
  }

  const handleKeydown = (field) => (e) => {
    if (e.keyCode === 13) {
      handleSave(field)()
    }
  }
  const handleChange = (field) => (time) => {
    if (field === 'tempStart') {
      setTempStart(time)
    } else {
      setTempEnd(time)
    }
  }
  return (
    <div className="time-picker-container">
      <TimePickerInput
        label={'Start Time'}
        value={tempStart !== null ? tempStart : startTime}
        onChange={handleChange('tempStart')}
        onOutsideClick={handleSave('start')}
        onSelect={handleSelect('start')}
        onKeyDown={handleKeydown('start')}
        dateTest={dateTest}
      />
      <i className="time-picker-dividor" />
      <TimePickerInput
        value={tempEnd !== null ? tempEnd : endTime}
        label={'End Time'}
        onChange={handleChange('tempEnd')}
        hidePastTime
        showDistanceTo={tempStart !== null ? tempStart : startTime}
        onOutsideClick={handleSave('end')}
        onSelect={handleSelect('end')}
        onKeyDown={handleKeydown('end')}
        error={valid ? '' : `* End time should be later than start time`}
        updateSelectOptions
      />
    </div>
  )
}
