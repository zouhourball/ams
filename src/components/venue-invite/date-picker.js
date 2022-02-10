import React, { useCallback } from 'react'
import { format, isBefore } from 'date-fns'
import cls from 'classnames'
import OutsideClick from 'react-outside-click-handler'
import CalendarIcon from 'mdi-react/CalendarIcon'
import './date-picker.scss'
import DayPicker from 'react-day-picker'
import 'react-day-picker/lib/style.css'
import { TextField } from 'react-md'

export const DatePicker = ({
  textFormat = 'dd MMM yyyy',
  onChange,
  defaultValue,
  className,
  error,
  errorText,
  maxDate,
}) => {
  const [datePickerVisible, setDatePickerVisible] = React.useState(false)
  const handleUpdate = useCallback(
    (date) => {
      if (!maxDate || !isBefore(date, maxDate)) {
        onChange && onChange(date)
        setDatePickerVisible(false)
      }
    },
    [onChange, maxDate],
  )

  const handleFieldClick = useCallback(() => {
    setDatePickerVisible(!datePickerVisible)
  }, [datePickerVisible])

  const formattedTime = format(new Date(defaultValue), textFormat)
  const handleOutsideClick = useCallback(() => {
    setDatePickerVisible(false)
  }, [])
  return (
    <OutsideClick onOutsideClick={handleOutsideClick}>
      <div
        role="button"
        tabIndex={0}
        onClick={handleFieldClick}
        className={cls(className, 'clsprefix-date-picker-wrap')}
      >
        <TextField
          value={formattedTime}
          className="time-date-picker"
          label={'Date'}
          rightIcon={
            <CalendarIcon size={'18px'} style={{ fill: 'rgba(0,0,0,0.6)' }} />
          }
          error={error}
        />
        <div
          className={cls(
            'clsprefix-date-picker-content',
            datePickerVisible ? 'clsprefix-date-picker-content--active' : '',
          )}
          role="button"
          tabIndex={0}
          // eslint-disable-next-line react/jsx-no-bind
          onClick={(e) => e.stopPropagation()}
        >
          <DayPicker
            selectedDays={defaultValue}
            onDayClick={handleUpdate}
            // eslint-disable-next-line react/jsx-no-bind
            disabledDays={
              maxDate ? (date) => isBefore(date, maxDate) : undefined
            }
          />
        </div>
        <div
          style={{
            display: !error ? 'none' : 'initial',
          }}
          className="date-picker-input-error"
        >
          {errorText || ''}
        </div>
      </div>
    </OutsideClick>
  )
}
