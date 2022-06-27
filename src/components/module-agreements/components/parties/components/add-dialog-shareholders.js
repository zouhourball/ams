/* eslint-disable camelcase */
import { useState } from 'react'
import {
  Button,
  DialogContainer,
  TextField,
  SelectField,
  Portal,
  Slider,
  FontIcon,
} from 'react-md'
import moment from 'moment'
import { DatePicker } from '@target-energysolutions/date-picker'
import { flatMap, get } from 'lodash-es'

import AutocompleteWithButton from 'components/module-agreements/components/autocomplete-with-button'

import { getPublicUrl } from 'libs/utils/custom-function'
import avatarCompany from 'components/module-agreements/images/avatarCompany.png'

import './add-dialog-shareholders.scss'
import CompaniesInfoById from 'components/module-agreements/components/company-info-by-id'

import { useTranslation } from 'libs/langs'

const AddDialogShareholders = ({
  visible,
  onHide,
  companies,
  onSave,
  shareholdersList,
  organizationID,
  onSearchShareHolders,
}) => {
  const { t } = useTranslation()
  const [percentage, setPercentage] = useState('')
  const [item, setItem] = useState(null)
  const [companiesList, setCompaniesList] = useState(companies)
  const [startEndDate, setStartEndDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [startDate, setStartDate] = useState('')
  const [visibleDatePicker, setVisibleDatePicker] = useState(false)
  const handleCancelDatePicker = () => {
    setVisibleDatePicker(false)
  }

  const handleStartEndDate = (startDate, endDate) => {
    const validStartDate = moment
      .utc(
        `${startDate.day}/${startDate.month}/${startDate.year}`,
        'DD/MM/YYYY',
      )
      .format()
    const validEndDate = moment
      .utc(`${endDate.day}/${endDate.month}/${endDate.year}`, 'DD/MM/YYYY')
      .format()
    setEndDate(validEndDate)
    setStartDate(validStartDate)
    setStartEndDate(
      `${moment(validStartDate).format('DD/MM/YYYY')} - ${moment(
        validEndDate,
      ).format('DD/MM/YYYY')}`,
    )
    setPercentage('')
    setItem('')
    setVisibleDatePicker(false)
  }
  const renderValidPercentage = () => {
    const valid = companiesList
      .filter(
        ({ start_date, end_date }) =>
          moment().valueOf() >= moment(start_date).valueOf() &&
          moment().valueOf() <= moment(end_date).valueOf(),
      )
      .reduce((total, next) => total + parseInt(next.percentage), 0)
    return valid
  }
  const onAddCompany = () => {
    setCompaniesList([
      ...companiesList,
      {
        id: item && item.id,
        company_name: item && item.label,
        company_industry: 'oil & gas company',
        percentage,
        start_date: startDate,
        end_date: endDate,
        company_id: parseInt(item.company_id),
      },
    ])
    setStartDate('')
    setEndDate('')
    setStartEndDate('')
    setPercentage('')
    setItem('')
  }

  const concernedPeriods = companiesList.filter(
    ({ start_date, end_date }) =>
      !(
        moment(startDate).valueOf() >= moment(end_date).valueOf() ||
        moment(endDate).valueOf() <= moment(start_date).valueOf()
      ),
  )
  const validShareholdersPercentage = () => {
    let maxValue = 0
    flatMap(
      concernedPeriods.map(({ start_date, end_date, percentage }) => [
        { date: start_date, sign: '+', value: percentage },
        { date: end_date, sign: '-', value: percentage },
      ]),
      e => e,
    )
      .sort((a, b) => moment(a.date).valueOf() - moment(b.date).valueOf())
      .reduce((prevValue, nextValue) => {
        const newValue =
          nextValue.sign === '+'
            ? prevValue + nextValue.value
            : prevValue - nextValue.value
        if (nextValue.sign === '+') {
          maxValue = Math.max(newValue, prevValue)
        }
        return newValue
      }, 0)
    // console.log('concernedPeriods', concernedPeriods, maxValue)
    return 100 - maxValue
    // concernedPeriods.map(({ start_date, end_date }) =>)
    // for (let index = 0; index < companiesList.length; index++) {
    //   const { start_date, end_date, percentage } = companiesList[index]
    //   if (
    //     startEndDate &&
    //     moment(startDate).valueOf() >= moment(start_date).valueOf() &&
    //     moment(endDate).valueOf() <= moment(end_date).valueOf()
    //   ) {
    //     return 100 - percentage
    //   }
    // }
    // return 100
  }

  const validPercentage =
    percentage && percentage <= validShareholdersPercentage() && percentage > 0

  const actions = []
  actions.push({
    children: t('discard'),
    onClick: () => {
      onHide()
      setCompaniesList([])
    },
  })
  actions.push(
    <Button
      flat
      primary
      onClick={() => {
        onSave(companiesList)
        setCompaniesList([])
        onHide()
      }}
    >
      Save
    </Button>,
  )

  const list =
    shareholdersList &&
    shareholdersList
      .filter(({ id }) => !concernedPeriods.find(company => company.id === id))
      .map(({ name, id, companyLogo, company_id }) => ({
        id,
        label: name,
        img: get(companyLogo, 'aPIID', null),
        company_id,
      }))

  return (
    <DialogContainer
      className="add-dialog-shareholders"
      id="add-dialog-shareholders"
      visible={visible}
      onHide={() => null}
      actions={actions}
      title={`${t('add')} shareholders`}
    >
      <div className="form">
        <TextField
          required
          id="start-end-date"
          className="add-dialog_textField"
          label={t('select_start')}
          value={startEndDate}
          onClick={() => setVisibleDatePicker(true)}
          position={SelectField.Positions.BELOW}
          rightIcon={<FontIcon> today </FontIcon>}
          onChange={() => null}
          autoComplete="off"
        />
        <AutocompleteWithButton
          useForOrgs={true}
          onTextChange={text => {
            onSearchShareHolders(text)
          }}
          onClickItem={newList => {
            setItem(
              newList && newList.length
                ? list.find(({ id }) => id === newList[0])
                : null,
            )
          }}
          className="add-dialog_selectField"
          textFieldClassName="add-dialog_textField"
          singlePick // or multiplePick
          selectedItemsArray={item ? [item.id] : []}
          label={`${t('select')} shareholders*`}
          items={startEndDate ? list : []}
        />

        {visibleDatePicker && (
          <Portal
            className="datePickerWrapper datePickerWrapper-parties"
            visible={visibleDatePicker}
            lastChild={true}
            renderNode={document.body}
          >
            <DatePicker
              required
              startView="year"
              endView="day"
              defaultView="day"
              translation={{ update: 'select' }}
              onUpdate={handleStartEndDate}
              onCancel={handleCancelDatePicker}
            />
          </Portal>
        )}

        <TextField
          required
          id="simple-action-dialog-field"
          className="add-dialog_textField"
          label={t('add_percentage')}
          type="number"
          value={percentage !== '' ? +percentage : ''}
          onChange={percentage => {
            setPercentage(+percentage)
          }}
          autoComplete="off"
          disabled={!startEndDate}
          error={!validPercentage}
          errorText={
            percentage &&
            `Percentage must be between 1 and ${validShareholdersPercentage()}`
          }
        />

        <Button
          disabled={!item || !startEndDate || !validPercentage}
          icon
          primary
          onClick={onAddCompany}
        >
          add
        </Button>
      </div>

      <div className="add-dialog-shareholders-slider">
        <div className="add-dialog-shareholders-slider-cover"></div>
        <Slider
          id="add-dialog-shareholders-slider"
          className="add-dialog-shareholders-slider-percentage md-cell md-cell--11"
          min={0}
          max={100}
          step={1}
          value={renderValidPercentage()}
          onChange={() => null}
        />
        <div className="add-dialog-shareholders-slider-percentageText md-cell md-cell--1">
          {renderValidPercentage()}%
        </div>
      </div>

      <div className="md-grid">
        <CompaniesInfoById
          organisationIDs={companiesList.map(elem =>
            elem.company_id.toString(),
          )}
        >
          {organizations =>
            renderCards(companiesList, setCompaniesList, organizations)
          }
        </CompaniesInfoById>
      </div>
    </DialogContainer>
  )
}

const renderCards = (companiesList, setCompaniesList, organizations) => {
  return (
    companiesList &&
    companiesList.map((el, key) => (
      <>
        <div key={key} className="card md-cell md-cell--6">
          <img
            src={
              get(organizations[key], 'companyLogo.aPIID', null)
                ? getPublicUrl(organizations[key].companyLogo.aPIID)
                : avatarCompany
            }
            width={50}
            height={50}
          />
          <div className="card-details">
            <div className="card-header">
              <h5>{el.company_name} </h5>
              <Button
                icon
                className="deleteButton"
                iconClassName="mdi mdi-close"
                onClick={() =>
                  setCompaniesList(
                    companiesList.filter((elem, position) => position !== key),
                  )
                }
              />
            </div>
            <div>{el.company_industry} </div>
            <div className="card-footer">
              <label className="card-footer-label">
                <i className="mdi mdi-calendar-text" />
                {moment.utc(el.start_date).format('DD/MM/YYYY') +
                  ' - ' +
                  moment.utc(el.end_date).format('DD/MM/YYYY')}
              </label>
              <span
                className={`card-footer-percentage ${
                  !moment().isBetween(
                    moment.utc(el.start_date),
                    moment.utc(el.end_date),
                  )
                    ? 'grey'
                    : ''
                }`}
              >
                {el.percentage}%
              </span>
            </div>
          </div>
        </div>
      </>
    ))
  )
}

export default AddDialogShareholders
