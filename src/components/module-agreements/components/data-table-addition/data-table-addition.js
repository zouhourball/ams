import React, { useState } from 'react'
import { TextField, SelectField, Portal, FontIcon, Button } from 'react-md'
import Mht from '@target-energysolutions/mht'
import { DatePicker } from '@target-energysolutions/date-picker'
// import DataTable from '@target-energysolutions/react-table-wrapper'

import { TextFieldWithList } from './text-field-with-list'
import {
  prettifiedStringToNumber,
  numberToPrettifiedString,
} from 'libs/utils/custom-function'

import './data-table-addition.scss'

function DataTableAddition ({
  // title,
  config,
  data,
  canAddRows,
  onAdd,
  disabled,
  role,
  status,
  activityId,
  amendedAgreement,
}) {
  const [row, setRow] = useState({
    ...config.reduce(
      (prevValue, { key }) => Object.assign(prevValue, { [key]: '' }),
      {},
    ),
  })

  const [isDatePickerVisible, setDatePickerVisible] = useState(false)

  const formatDate = date => {
    return date.day + '/' + date.month + '/' + date.year
  }

  const handleOnUpdate = (date, key) => {
    setDatePickerVisible(false)
    const validDate = formatDate(date)
    setRow({ ...row, [key]: validDate })
  }
  const disableButton =
    activityId ||
    !(role && role.find(elem => elem.id === 2)) ||
    (role &&
      role.find(elem => elem.id === 2) &&
      status === 'APPROVED' &&
      !amendedAgreement) ||
    disabled
  const renderItems = (items, relatedTo) => {
    let data = items
    if (relatedTo && relatedTo.length) {
      data = []
      data = items.filter(
        elem =>
          relatedTo.length ===
          relatedTo
            .map(relatedToKey => elem[relatedToKey] === row[relatedToKey])
            .filter(valid => !!valid).length,
      )
    }
    return data
  }

  const renderType = (
    {
      label,
      key,
      type,
      defaultType,
      items,
      textType,
      relatedTo,
      toClearOnUpdate,
      precision = 0,
      maxNumberLength = 15,
    },
    index,
  ) => {
    switch (type) {
      case 'text':
        return (
          <TextField
            key={index}
            id={`${key}-${index}`}
            className="data-table-addition_textField "
            label={label}
            disabled={disableButton}
            value={row[key]}
            autoComplete="off"
            // type={textType || ''}
            onChange={value => {
              if (textType !== 'number') {
                setRow({ ...row, [key]: value })
              } else if (textType === 'number') {
                const res = prettifiedStringToNumber(
                  value,
                  precision,
                  maxNumberLength,
                )

                if (res !== null) {
                  setRow({ ...row, [key]: res })
                }
              }
            }}
            onBlur={() => {
              if (textType === 'number') {
                const res = numberToPrettifiedString(row[key], precision)
                setRow({ ...row, [key]: res })
              }
            }}
          />
        )
      case 'number':
        return (
          <TextField
            key={index}
            id={`${key}-${index}`}
            className="data-table-addition_textField "
            label={label}
            disabled={disableButton}
            value={row[key]}
            type="number"
            autoComplete="off"
            onChange={value => {
              setRow({ ...row, [key]: value })
            }}
          />
        )
      case 'select':
        return (
          <SelectField
            key={key}
            id={`${key}-${index}`}
            className="data-table-addition_selectField"
            label={label}
            disabled={disableButton}
            menuItems={renderItems(items, relatedTo)}
            value={row[key]}
            onChange={value => {
              setRow({ ...row, [key]: value })
            }}
            position={SelectField.Positions.BELOW}
          />
        )
      case 'autocomplete':
        return (
          <TextFieldWithList
            key={key}
            id={`${key}-${index}`}
            // className=""
            label={label}
            disabled={disableButton}
            value={row[key]}
            menuItems={renderItems(items, relatedTo)}
            onChange={value => {
              setRow(
                Object.assign(
                  {
                    ...row,
                    [key]: value,
                  },
                  toClearOnUpdate && toClearOnUpdate.length
                    ? toClearOnUpdate.reduce(
                      (prevValue, currentKey) =>
                        Object.assign(prevValue, { [currentKey]: '' }),
                      {},
                    )
                    : {},
                ),
              )
            }}
            // withFilter
          />
        )
      case 'date':
        return (
          <>
            <TextField
              id={`${key}-${index}`}
              lineDirection="center"
              label={label}
              disabled={disableButton}
              rightIcon={<FontIcon>today</FontIcon>}
              value={row[key]}
              onClick={() => !disableButton && setDatePickerVisible(true)}
              fullWidth
              autoComplete="off"
              className="data-table-addition_textField"
            />
            {isDatePickerVisible && (
              <Portal
                className="datePickerWrapper"
                visible={isDatePickerVisible}
                lastChild={true}
                renderNode={document.body}
              >
                <DatePicker
                  singlePick
                  startView="year"
                  endView="day"
                  defaultView="day"
                  translation={{ update: 'select' }}
                  onUpdate={date => handleOnUpdate(date, key)}
                  onCancel={() => setDatePickerVisible(false)}
                />
              </Portal>
            )}
          </>
        )
      case 'dynamic':
        const lastKey = relatedTo && relatedTo[relatedTo.length - 1]
        const uom = lastKey && row[lastKey]
        const newItems = renderItems(items, relatedTo)
        const booleanList = [
          { ...row, label: 'True', value: 'True' },
          { ...row, label: 'False', value: 'False' },
        ]
        return renderType(
          {
            label,
            key,
            type:
              newItems.length || uom === 'switch'
                ? 'select'
                : uom === 'Years'
                  ? 'number'
                  : 'text',
            defaultType,
            items:
              !newItems.length && uom === 'switch' ? booleanList : newItems,
            textType: uom === 'string' ? 'text' : 'number',
            relatedTo,
            toClearOnUpdate,
            precision,
            maxNumberLength,
          },
          index,
        )
      default:
        break
    }
  }

  const handleOnAddRow = () => {
    onAdd(row)
    setRow({
      ...config.reduce(
        (prevValue, { key }) => Object.assign(prevValue, { [key]: '' }),
        {},
      ),
    })
  }
  const renderConfig = () => {
    const filteredConfig = config.filter(({ hide }) => !hide)
    return filteredConfig
  }
  const hideInput =
    !(role && role.find(elem => elem.id === 2)) ||
    (role &&
      role.find(elem => elem.id === 2) &&
      status === 'APPROVED' &&
      !amendedAgreement)
  const validButton = () => {
    let isValid = true
    config.forEach(({ required, key }) => {
      if (required && !row[key]) {
        isValid = false
      }
    })
    // if (row['value'] && !/^\d+$/.test(row['value'])) {
    //   console.log('invalid form 2')
    //   isValid = false
    // }
    return isValid
  }
  return (
    <div className="data-table-addition">
      {canAddRows && !hideInput && (
        <div className="add-row">
          {config.map((elem, index) => renderType(elem, index))}
          <Button
            className={`add-row-btn add-row-btn${
              !validButton() ? '_disabled' : '_enabled'
            }`}
            icon
            primary
            onClick={handleOnAddRow}
            disabled={!validButton()}
          >
            <FontIcon>add</FontIcon>
          </Button>
        </div>
      )}
      <Mht
        selectedLanguage="en"
        // title={title}
        configs={renderConfig()}
        tableData={data}
        withColumnResize
        // withSearch
        // commonActions
        // onExpand={data => {
        //   setCurrentUser(data)
        //   setVisibleMemberDetails(true)
        // }}
        // onSearch={() => {}}
        onSelectRows={() => {}}
      />

      {/* <DataTable
        title={title}
        data={data}
        columnsConfig={renderConfig()}
        tableClassName="react-table-fixed-header"
        rowsPerPage={5}
        hideSearchBar
      /> */}
    </div>
  )
}

export default DataTableAddition
