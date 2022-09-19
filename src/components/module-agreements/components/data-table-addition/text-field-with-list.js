import { useState, useEffect, useRef } from 'react'
import { TextField, FontIcon, List, ListItem } from 'react-md'

import './text-field-with-list.scss'
export const TextFieldWithList = ({
  id,
  className,
  label,
  disableButton,
  value,
  menuItems,
  onChange,
  withFilter = false,
}) => {
  const myRef = useRef(null)
  const [listVisibility, setListVisibility] = useState(false)

  useEffect(() => {
    document.addEventListener('mousedown', outSideClick)
    return () => {
      document.removeEventListener('mousedown', outSideClick)
    }
  }, [])

  const outSideClick = (e) => {
    if (myRef.current && myRef.current.contains(e.target)) {
      return
    }
    setListVisibility(false)
  }

  const expr = new RegExp(value, 'i')
  return (
    <div
      className={`data-table-addition_autocomplete ${className || ''}`}
      ref={myRef}
    >
      <TextField
        id={id}
        className="data-table-addition_autocomplete_textField"
        label={label}
        disabled={disableButton}
        value={value}
        onChange={onChange}
        autoComplete="off"
        rightIcon={<FontIcon>arrow_drop_down</FontIcon>}
        onClick={() => setListVisibility(true)}
      />
      {listVisibility && (
        <List className="data-table-addition_autocomplete-list md-paper--1">
          {(withFilter
            ? menuItems.filter(({ label }) => expr.test(label))
            : menuItems
          ).map(({ label, value }, key) => (
            <ListItem
              key={key}
              primaryText={label}
              onClick={() => {
                onChange(value)
                setListVisibility(false)
              }}
            />
          ))}
        </List>
      )}
    </div>
  )
}
