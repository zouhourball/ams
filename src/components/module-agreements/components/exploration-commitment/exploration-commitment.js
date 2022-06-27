import {
  useState,
  useCallback,
  useRef,
  useEffect,
  Fragment,
} from 'react'
import { TextField, FontIcon, Portal, Button } from 'react-md'
import { DatePicker } from '@target-energysolutions/date-picker'
// import DataTable from '@target-energysolutions/react-table-wrapper'
import moment from 'moment'
import { get, flatMap } from 'lodash-es'
import Mht from '@target-energysolutions/mht'
import { cls } from 'reactutils'

import { HeaderOption } from 'components/module-agreements/components/psa-panel'
import SelectFieldWithButton from 'components/module-agreements/components/select-field-with-button'
import CustomExpansionPanel from 'components/module-agreements/components/custom-expansion-panel'
import RemarksFooter from 'components/module-agreements/components/remarks-footer'
import { ExplorationCommitmentLoader } from 'components/module-agreements/components/loaders/loaders'

import { listTypes } from './helpers'
import {
  prettifiedStringToNumber,
  numberToPrettifiedString,
} from 'libs/utils/custom-function'
import { useTranslation } from 'libs/langs'

import './style.scss'

const ExplorationCommitment = ({
  explorationCommitmentData,
  handleExplorationCommitmentData,
  role,
  getBlocksListStatus,
  amendedAgreement,
  collapsePanelLabel,
  leftIcon,
  iconColor,
  showAction,
  actions,
  agreementId,
  loading,
  updateSectionEntityStatus,
  activityId,
}) => {
  const { t } = useTranslation()
  const [visibleStartDate, setVisibleStartDate] = useState(false)
  const [visibleEndDate, setVisibleEndDate] = useState(false)
  const [updateStatus, setUpdateStatus] = useState(false)
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [commitmentType, setCommitmentType] = useState(null)
  const [editMode, setEditMode] = useState(false)

  const usePrevious = value => {
    const ref = useRef()
    useEffect(() => {
      ref.current = value
    })
    return ref.current
  }
  const prevUpdateSectionEntityStatus = usePrevious({
    ...updateSectionEntityStatus,
  })
  useEffect(() => {
    if (
      updateSectionEntityStatus &&
      updateSectionEntityStatus.data &&
      updateSectionEntityStatus.data.section ===
        get(explorationCommitmentData, 'section_entity.id', '') &&
      prevUpdateSectionEntityStatus &&
      !updateSectionEntityStatus.pending &&
      prevUpdateSectionEntityStatus.pending
    ) {
      setUpdateStatus(
        !updateSectionEntityStatus.data.error ? 'success' : 'error',
      )
      setTimeout(() => {
        setUpdateStatus(false)
      }, 10000)
    }
  }, [updateSectionEntityStatus])

  const remark = get(explorationCommitmentData, 'section_entity.remarks', '')
  const status = get(explorationCommitmentData, 'section_entity.status', '')

  const defaultConfig = useCallback(
    (id, start, end, currentValue) => {
      const precision = 2
      const selectedType = listTypes.find(type => type.id === id)
      return selectedType
        ? selectedType.units.map(elem => {
          const unitValues =
              currentValue.find(({ unit }) => unit === elem.unit) || {}
          return Object.assign(
            {},
            elem,
            Array.from(
              { length: end - start + 1 },
              (e, i) => start + i,
            ).reduce(
              (prev, next) =>
                Object.assign(prev, {
                  [next]: get(
                    unitValues,
                    next,
                    numberToPrettifiedString(0, precision),
                  ),
                }),
              {},
            ),
          )
        })
        : []
    },
    [listTypes],
  )

  const columnsConfig = useCallback(
    commitmentType => {
      const keys = flatMap(
        get(
          explorationCommitmentData,
          `values.${commitmentType}`,
          [],
        ).map(({ unit, ...years }) => Object.keys(years)),
        e => e.map(year => +year),
      )
      const start = Math.min(...keys)
      const end = Math.max(...keys)
      const yearsConfig = Array.from(
        { length: end - start + 1 },
        (data, index) => {
          const year = start + index
          return {
            label: year,
            key: year,
            render: row =>
              !disableButton ? (
                <CustomTextField
                  key={year}
                  row={row}
                  year={year}
                  commitmentType={commitmentType}
                  explorationCommitmentData={explorationCommitmentData}
                  handleExplorationCommitmentData={
                    handleExplorationCommitmentData
                  }
                />
              ) : (
                row[year] || ''
              ),
            width: 200,
          }
        },
      )
      return [{ label: t('unit'), key: 'unit', width: 200 }, ...yearsConfig]
    },
    [...listTypes.map(({ id }) => explorationCommitmentData.values[id])],
  )

  const showStartDate = () => {
    setVisibleStartDate(true)
  }
  const showEndDate = () => {
    setVisibleEndDate(true)
  }
  const handleCancelStartDate = () => {
    setVisibleStartDate(false)
  }
  const cancelEndDate = () => {
    setVisibleEndDate(false)
  }
  const handleStartDate = date => {
    const validDate = moment
      .utc()
      .year(date.year)
      .startOf('year')
    setStartDate(validDate)
    setEndDate(validDate)
    setVisibleStartDate(false)
  }
  const handleEndDate = date => {
    const validDate = moment
      .utc()
      .year(date.year)
      .endOf('year')
    setEndDate(validDate)
    setVisibleEndDate(false)
  }

  const disableButton =
    activityId ||
    !(role && role.find(elem => elem.id === 2)) ||
    (role &&
      role.find(elem => elem.id === 2) &&
      status === 'APPROVED' &&
      !amendedAgreement)
  // const blocksList = get(getBlocksListStatus, 'data', []).map(block => {
  //   return { label: block.block, value: block.id }
  // })

  const onConfirmExplorationCommitment = () => {
    handleExplorationCommitmentData(
      Object.assign({}, explorationCommitmentData, {
        values: Object.assign({}, explorationCommitmentData.values, {
          [commitmentType]: defaultConfig(
            commitmentType,
            moment(startDate).year(),
            moment(endDate).year(),
            get(explorationCommitmentData, `values.${commitmentType}`, []),
          ),
        }),
      }),
    )
    setEditMode(false)
    setStartDate(null)
    setEndDate(null)
    setCommitmentType(null)
  }
  const onEditExplorationCommitment = id => {
    const keys = flatMap(
      get(
        explorationCommitmentData,
        `values.${id}`,
        [],
      ).map(({ unit, ...years }) => Object.keys(years)),
      e => e.map(year => +year),
    )
    const start = Math.min(...keys)
    const end = Math.max(...keys)
    setEditMode(true)
    setStartDate(
      moment
        .utc()
        .year(start)
        .startOf('year'),
    )
    setEndDate(
      moment
        .utc()
        .year(end)
        .endOf('year'),
    )
    setCommitmentType(id)
  }
  const onDeleteExplorationCommitment = id => {
    const newValues = Object.assign({}, explorationCommitmentData.values)
    delete newValues[id]
    handleExplorationCommitmentData(
      Object.assign({}, explorationCommitmentData, {
        values: newValues,
      }),
    )
    setEditMode(false)
    setStartDate(null)
    setEndDate(null)
    setCommitmentType(null)
  }
  const renderFields = () => {
    return (
      <>
        <div className="md-grid">
          <TextField
            id="start-date"
            lineDirection="center"
            label={t('start_date')}
            rightIcon={<FontIcon>today</FontIcon>}
            value={startDate ? startDate.format('YYYY') : ''}
            onFocus={!disableButton && showStartDate}
            fullWidth
            className="block-details-textField md-cell md-cell--3"
            disabled={disableButton}
            autoComplete="off"
            readOnly
          />
          {visibleStartDate && (
            <Portal
              className="datePickerWrapper"
              visible={visibleStartDate}
              lastChild={true}
              renderNode={document.body}
            >
              <DatePicker
                singlePick
                startView="year"
                endView="year"
                defaultView="year"
                translation={{ update: 'select' }}
                onUpdate={handleStartDate}
                onCancel={handleCancelStartDate}
                maxValidDate={
                  endDate
                    ? {
                      year: moment(endDate).year(),
                      month: moment(endDate).month() + 1,
                      day: moment(endDate).date(),
                    }
                    : {}
                }
              />
            </Portal>
          )}
          <TextField
            id="end-date"
            lineDirection="center"
            label={t('end_date')}
            rightIcon={<FontIcon>today</FontIcon>}
            value={endDate ? moment(endDate).format('YYYY') : ''}
            onFocus={!disableButton && showEndDate}
            fullWidth
            className="block-details-textField md-cell md-cell--3"
            disabled={disableButton || !endDate}
            autoComplete="off"
            readOnly
          />
          {visibleEndDate && (
            <Portal
              className="datePickerWrapper"
              visible={visibleEndDate}
              lastChild={true}
              renderNode={document.body}
            >
              <DatePicker
                singlePick
                startView="year"
                endView="year"
                defaultView="year"
                translation={{ update: 'select' }}
                onUpdate={handleEndDate}
                onCancel={cancelEndDate}
                minValidDate={
                  startDate
                    ? {
                      year: moment(startDate).year(),
                      month: moment(startDate).month() + 1,
                      day: moment(startDate).date(),
                    }
                    : {}
                }
              />
            </Portal>
          )}
          <SelectFieldWithButton
            // id="commitment-type"
            label={t('commitment_type')}
            className="select-field-with-button md-cell md-cell--4"
            items={listTypes.filter(
              ({ id }) =>
                !Object.keys(
                  get(explorationCommitmentData, 'values', {}),
                ).includes(id),
            )}
            singlePick
            selectedItemsArray={commitmentType ? [commitmentType] : []}
            onClickItem={([type]) => {
              setCommitmentType(type)
            }}
            selectedItems={
              commitmentType
                ? listTypes
                  .filter(({ id }) => commitmentType === id)
                  .map(({ name }) => name)
                  .join(', ')
                : []
            }
            textFieldClassName="block-details-textField"
            disabled={disableButton || editMode}
          />
          <div className="buttonWrapper md-cell md-cell--2">
            <Button
              primary
              swapTheming={
                !disableButton && startDate && endDate && commitmentType
              }
              icon
              className=""
              onClick={onConfirmExplorationCommitment}
              disabled={
                disableButton || !startDate || !endDate || !commitmentType
              }
            >
              {editMode ? 'check' : 'add'}
            </Button>
            {editMode && (
              <Button
                secondary
                swapTheming
                icon
                className=""
                onClick={() => {
                  setEditMode(false)
                  setStartDate(null)
                  setEndDate(null)
                  setCommitmentType(null)
                }}
              >
                clear
              </Button>
            )}
          </div>
        </div>
        <div className="exploration-commitment-data-table">
          {listTypes.map(({ id, name }) => (
            <Fragment key={id}>
              {Object.keys(
                get(explorationCommitmentData, 'values', {}),
              ).includes(id) && (
                <>
                  <div className="exploration-commitment-data-table-header">
                    <h2>{name}</h2>
                    {!disableButton && (
                      <Button
                        icon
                        className="iconButton"
                        onClick={() => onEditExplorationCommitment(id)}
                      >
                        edit
                      </Button>
                    )}
                    {!disableButton && (
                      <Button
                        icon
                        className="iconButton"
                        onClick={() => onDeleteExplorationCommitment(id)}
                      >
                        delete
                      </Button>
                    )}
                  </div>
                  <Mht
                    selectedLanguage="en"
                    configs={columnsConfig(id)}
                    tableData={explorationCommitmentData.values[id] || []}
                    rowsPerPage={3}
                    className="exploration-commitment-data-table-margin"
                  />
                </>
              )}
            </Fragment>
          ))}
        </div>
      </>
    )
  }
  return (
    <CustomExpansionPanel
      defaultExpanded={agreementId}
      className={cls('exploration-commitment', updateStatus || '')}
      header={
        <HeaderOption
          icon={leftIcon}
          label={collapsePanelLabel}
          iconColor={iconColor}
          showAction={showAction}
          actions={actions}
        />
      }
      body={
        loading ? (
          <ExplorationCommitmentLoader />
        ) : (
          agreementId && (
            <>
              {remark && <RemarksFooter remark={remark} />}
              <div className="exploration-commitment">{renderFields()}</div>
            </>
          )
        )
      }
    />
  )
}

export default ExplorationCommitment

const CustomTextField = ({
  row,
  year,
  commitmentType,
  explorationCommitmentData,
  handleExplorationCommitmentData,
}) => {
  const precision = 2
  const maxNumberLength = 12
  const [temporary, setTemporary] = useState(row[year] || '')
  return (
    <TextField
      placeholder="Type here"
      value={temporary}
      type="text"
      autoComplete="off"
      onChange={value => {
        const res = prettifiedStringToNumber(value, precision, maxNumberLength)
        if (res !== null) {
          setTemporary(res)
        }
      }}
      onBlur={() => {
        const v = numberToPrettifiedString(temporary, precision)
        const newExplorationCommitmentSubData = explorationCommitmentData.values[
          commitmentType
        ].map(elem => (elem.unit === row.unit ? { ...elem, [year]: v } : elem))
        setTemporary(v)
        handleExplorationCommitmentData({
          ...explorationCommitmentData,
          values: {
            ...explorationCommitmentData.values,
            [commitmentType]: newExplorationCommitmentSubData,
          },
        })
      }}
    />
  )
}
