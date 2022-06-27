import { useState, useEffect, useRef } from 'react'
import { TextField, Portal, SelectField, FontIcon } from 'react-md'
import { get } from 'lodash-es'
import { DatePicker } from '@target-energysolutions/date-picker'
import moment from 'moment'
import { cls } from 'reactutils'

import CustomExpansionPanel from 'components/module-agreements/components/custom-expansion-panel'
import { BlockDetailsLoader } from 'components/module-agreements/components/loaders/loaders'
import RemarksFooter from 'components/module-agreements/components/remarks-footer'
import { HeaderOption } from 'components/module-agreements/components/psa-panel'
import {
  prettifiedStringToNumber,
  numberToPrettifiedString,
} from 'libs/utils/custom-function'
import { useTranslation } from 'libs/langs'

import './style.scss'

const BlockDetails = ({
  collapsePanelLabel,
  amendedAgreement,
  leftIcon,
  iconColor,
  blockDetails,
  setBlockDetails,
  getBlocksListStatus,
  role,
  showAction,
  actions,
  agreementId,
  loading,
  updateSectionEntityStatus,
  activityId,
}) => {
  const { t } = useTranslation()
  const [updateStatus, setUpdateStatus] = useState(false)
  const [visible, setVisible] = useState({})

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
        get(blockDetails, 'section_entity.id', '') &&
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

  const remark = get(blockDetails, 'section_entity.remarks', '')

  const renderBlocksList = () => {
    const blocksList = get(getBlocksListStatus, 'data', [])
    return blocksList.map(block => {
      return { label: block.block, value: block.id }
    })
  }

  const renderCompanyName = () => {
    const blockList = get(getBlocksListStatus, 'data', [])
    const companyName = blockList.filter(
      block => block.id === blockDetails.block_id,
    )
    return companyName.map(block => ({
      label: block.company.company,
      value: block.company.id,
    }))
  }

  const blockDetailsConfig = [
    {
      type: 'select',
      dataKey: 'block_id',
      name: t('block_name'),
      items: renderBlocksList(),
      value: '',
      required: true,
      className: 'md-cell md-cell--3',
    },
    {
      type: 'blank',
      dataKey: 'blank1',
      className: 'md-cell md-cell--3',
    },
    {
      type: 'select',
      dataKey: 'operator_id',
      name: t('op_company'),
      items: renderCompanyName(),
      value: '',
      required: true,
      className: 'md-cell md-cell--3',
    },
    {
      type: 'blank',
      dataKey: 'blank1',
      className: 'md-cell md-cell--3',
    },
    {
      type: 'datePicker',
      dataKey: 'block_signature_date',
      name: t('block_sign'),
      value: '',
      required: true,
      className: 'md-cell md-cell--3',
    },
    {
      type: 'datePicker',
      dataKey: 'block_original_psc_date',
      name: t('ex_date'),
      value: '',
      minValue: 'block_signature_date',
      required: true,
      className: 'md-cell md-cell--3',
    },
    {
      type: 'datePicker',
      dataKey: 'block_effective_date',
      name: t('block_eff'),
      value: '',
      minValue: 'block_signature_date',
      required: true,
      className: 'md-cell md-cell--3',
    },
    {
      type: 'datePicker',
      dataKey: 'block_expiration_date',
      name: t('block_exp_date'),
      value: '',
      minValue: 'block_signature_date',
      required: true,
      className: 'md-cell md-cell--3',
    },
    {
      type: 'number',
      dataKey: 'area',
      name: t('area_km'),
      value: '',
      required: true,
      className: 'md-cell md-cell--3',
      precision: 3,
    },
    {
      type: 'blank',
      dataKey: 'blank1',
      className: 'md-cell md-cell--9',
    },
    {
      type: 'group',
      name: t('contract_dur'),
      className: 'md-cell md-cell--12',
      children: [
        {
          type: 'group',
          name: 'IEP',
          className: 'md-cell md-cell--4',
          children: [
            {
              type: 'group',
              name: 'Main',
              className: 'md-cell md-cell--3',
              children: [
                {
                  type: 'number',
                  dataKey: 'years',
                  parentKey: ['contract_duration', 'iep'],
                  name: '(YRS)*',
                  value: '',
                  required: true,
                  className: 'md-cell md-cell--12',
                },
              ],
            },
            {
              type: 'group',
              name: 'Extensions',
              className: 'md-cell md-cell--9',
              children: [
                {
                  type: 'number',
                  dataKey: 'ext1',
                  parentKey: ['contract_duration', 'iep'],
                  name: '(MOS)',
                  value: '',
                  required: true,
                  className: 'md-cell md-cell--4',
                },
                {
                  type: 'number',
                  dataKey: 'ext2',
                  parentKey: ['contract_duration', 'iep'],
                  name: '(MOS)',
                  value: '',
                  required: true,
                  className: 'md-cell md-cell--4',
                },
                {
                  type: 'number',
                  dataKey: 'ext3',
                  parentKey: ['contract_duration', 'iep'],
                  name: '(MOS)',
                  value: '',
                  required: true,
                  className: 'md-cell md-cell--4',
                },
              ],
            },
          ],
        },
        {
          type: 'group',
          name: 'FAEP',
          className: 'md-cell md-cell--4',
          children: [
            {
              type: 'group',
              name: 'Main',
              className: 'md-cell md-cell--3',
              children: [
                {
                  type: 'number',
                  dataKey: 'years',
                  parentKey: ['contract_duration', 'faep'],
                  name: '(YRS)*',
                  value: '',
                  required: true,
                  className: 'md-cell md-cell--12',
                },
              ],
            },
            {
              type: 'group',
              name: 'Extensions',
              className: 'md-cell md-cell--9',
              children: [
                {
                  type: 'number',
                  dataKey: 'ext1',
                  parentKey: ['contract_duration', 'faep'],
                  name: '(MOS)',
                  value: '',
                  required: true,
                  className: 'md-cell md-cell--4',
                },
                {
                  type: 'number',
                  dataKey: 'ext2',
                  parentKey: ['contract_duration', 'faep'],
                  name: '(MOS)',
                  value: '',
                  required: true,
                  className: 'md-cell md-cell--4',
                },
                {
                  type: 'number',
                  dataKey: 'ext3',
                  parentKey: ['contract_duration', 'faep'],
                  name: '(MOS)',
                  value: '',
                  required: true,
                  className: 'md-cell md-cell--4',
                },
              ],
            },
          ],
        },
        {
          type: 'group',
          name: 'SAEP',
          className: 'md-cell md-cell--4',
          children: [
            {
              type: 'group',
              name: 'Main',
              className: 'md-cell md-cell--3',
              children: [
                {
                  type: 'number',
                  dataKey: 'years',
                  parentKey: ['contract_duration', 'saep'],
                  name: '(YRS)*',
                  value: '',
                  required: true,
                  className: 'md-cell md-cell--12',
                },
              ],
            },
            {
              type: 'group',
              name: 'Extensions',
              className: 'md-cell md-cell--9',
              children: [
                {
                  type: 'number',
                  dataKey: 'ext1',
                  parentKey: ['contract_duration', 'saep'],
                  name: '(MOS)',
                  value: '',
                  required: true,
                  className: 'md-cell md-cell--4',
                },
                {
                  type: 'number',
                  dataKey: 'ext2',
                  parentKey: ['contract_duration', 'saep'],
                  name: '(MOS)',
                  value: '',
                  required: true,
                  className: 'md-cell md-cell--4',
                },
                {
                  type: 'number',
                  dataKey: 'ext3',
                  parentKey: ['contract_duration', 'saep'],
                  name: '(MOS)',
                  value: '',
                  required: true,
                  className: 'md-cell md-cell--4',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      type: 'number',
      dataKey: 'production_bonus',
      name: 'Production Bonus ($USD)',
      value: '',
      className: 'md-cell md-cell--3',
    },
    {
      type: 'number',
      dataKey: 'signature_bonus',
      name: 'Signature Bonus ($USD)',
      value: '',
      className: 'md-cell md-cell--3',
    },
    {
      type: 'blank',
      dataKey: 'blank1',
      className: 'md-cell md-cell--6',
    },
    {
      type: 'number',
      dataKey: 'social_dev_bonus_iep',
      name: 'Community Dev Fund ($/Y) - IEP',
      value: '',
      className: 'md-cell md-cell--3',
    },
    {
      type: 'number',
      dataKey: 'social_dev_bonus_faep',
      name: 'Community Dev Fund ($/Y) - FAEP',
      value: '',
      className: 'md-cell md-cell--3',
    },
    {
      type: 'number',
      dataKey: 'social_dev_bonus_saep',
      name: 'Community Dev Fund ($/Y) - SAEP',
      value: '',
      className: 'md-cell md-cell--3',
    },
    {
      type: 'number',
      dataKey: 'social_dev_bonus_dev',
      name: 'Community Dev Fund ($/Y) - DEV',
      value: '',
      className: 'md-cell md-cell--3',
    },
    {
      type: 'number',
      dataKey: 'training_fee_iep',
      name: 'Training Fee ($/Y) - IEP',
      value: '',
      className: 'md-cell md-cell--3',
    },
    {
      type: 'number',
      dataKey: 'training_fee_faep',
      name: 'Training Fee ($/Y) - FAEP',
      value: '',
      className: 'md-cell md-cell--3',
    },
    {
      type: 'number',
      dataKey: 'training_fee_saep',
      name: 'Training Fee ($/Y) - SAEP',
      value: '',
      className: 'md-cell md-cell--3',
    },
    {
      type: 'number',
      dataKey: 'training_fee_dev',
      name: 'Training Fee ($/Y) - DEV',
      value: '',
      className: 'md-cell md-cell--3',
    },
    {
      type: 'number',
      dataKey: 'surface_fee_iep',
      name: 'Surface Fee ($/KM2) - IEP',
      value: '',
      required: true,
      className: 'md-cell md-cell--3',
      precision: 2,
    },
    {
      type: 'number',
      dataKey: 'surface_fee_faep',
      name: 'Surface Fee ($/KM2) - FAEP',
      value: '',
      required: true,
      className: 'md-cell md-cell--3',
      precision: 2,
    },
    {
      type: 'number',
      dataKey: 'surface_fee_saep',
      name: 'Surface Fee ($/KM2) - SAEP',
      value: '',
      required: true,
      className: 'md-cell md-cell--3',
      precision: 2,
    },
    {
      type: 'number',
      dataKey: 'surface_fee_dev',
      name: 'Surface Fee ($/KM2) - DEV',
      value: '',
      className: 'md-cell md-cell--3',
      precision: 2,
    },
  ]
  const status = get(blockDetails, 'section_entity.status', '')
  const disableButton =
    activityId ||
    !(role && role.find(elem => elem.id === 2)) ||
    (role &&
      role.find(elem => elem.id === 2) &&
      status === 'APPROVED' &&
      !amendedAgreement)

  const renderFields = data => {
    const maxNumberLength = 12
    return data.map(
      ({
        type,
        dataKey,
        name,
        value,
        items,
        minValue,
        required,
        className,
        precision = 0,
        children,
        parentKey,
      }) => {
        const parents = parentKey && parentKey.length ? parentKey : []
        switch (type) {
          case 'text':
            return (
              <TextField
                id={`blockDetails-${[...parents, dataKey].join('-')}`}
                lineDirection="center"
                label={name}
                autoComplete="off"
                value={
                  get(blockDetails, [...parents, dataKey].join('.'), '') || ''
                }
                onChange={v => {
                  const res = {
                    ...blockDetails,
                    ...[...parents, dataKey].reverse().reduce(
                      (prev, next, index) => ({
                        ...get(
                          blockDetails,
                          parents.slice(0, parents.length - index).join('.'),
                          {},
                        ),
                        [next]: prev,
                      }),
                      v,
                    ),
                  }
                  setBlockDetails(res)
                }}
                fullWidth
                disabled={disableButton}
                className={`block-details-textField ${className || ''}`}
                required={required}
              />
            )
          case 'number':
            return (
              <TextField
                id={`blockDetails-${[...parents, dataKey].join('-')}`}
                lineDirection="center"
                type="text"
                label={name}
                autoComplete="off"
                value={get(blockDetails, [...parents, dataKey].join('.'), '')}
                onChange={value => {
                  const v = prettifiedStringToNumber(
                    value,
                    precision,
                    maxNumberLength,
                  )
                  if (v !== null) {
                    const res = {
                      ...blockDetails,
                      ...[...parents, dataKey].reverse().reduce(
                        (prev, next, index) => ({
                          ...get(
                            blockDetails,
                            parents.slice(0, parents.length - index).join('.'),
                            {},
                          ),
                          [next]: prev,
                        }),
                        v,
                      ),
                    }
                    setBlockDetails(res)
                  }
                }}
                onBlur={() => {
                  const v = numberToPrettifiedString(
                    get(blockDetails, [...parents, dataKey].join('.'), ''),
                    precision,
                  )
                  const res = {
                    ...blockDetails,
                    ...[...parents, dataKey].reverse().reduce(
                      (prev, next, index) => ({
                        ...get(
                          blockDetails,
                          parents.slice(0, parents.length - index).join('.'),
                          {},
                        ),
                        [next]: prev,
                      }),
                      v,
                    ),
                  }
                  setBlockDetails(res)
                }}
                fullWidth
                disabled={disableButton}
                className={`block-details-textField ${className || ''}`}
                required={required}
                min={0}
              />
            )
          case 'select':
            return (
              <SelectField
                id={`blockDetails-${[...parents, dataKey].join('-')}`}
                label={name}
                className={`block-details-selectField ${className || ''}`}
                menuItems={items}
                itemValue="value"
                itemLabel="label"
                required={required}
                value={get(blockDetails, [...parents, dataKey].join('.'), '')}
                position={SelectField.Positions.BELOW}
                disabled={disableButton}
                onChange={v => {
                  if (dataKey === 'block_id') {
                    setBlockDetails({
                      ...blockDetails,
                      block_id: v,
                      block_name: renderBlocksList().find(el => el.value === v)
                        .label,
                      operator_id: null,
                      operator_name: null,
                    })
                  } else if (dataKey === 'operator_id') {
                    setBlockDetails({
                      ...blockDetails,
                      operator_id: v,
                      operator_name: renderCompanyName().find(
                        el => el.value === v,
                      ).label,
                    })
                  } else {
                    const res = {
                      ...blockDetails,
                      ...[...parents, dataKey].reverse().reduce(
                        (prev, next, index) => ({
                          ...get(
                            blockDetails,
                            parents.slice(0, parents.length - index).join('.'),
                            {},
                          ),
                          [next]: prev,
                        }),
                        v,
                      ),
                    }
                    setBlockDetails(res)
                  }
                }}
              />
            )
          case 'datePicker':
            return (
              <>
                <TextField
                  id={`blockDetails-${dataKey}`}
                  lineDirection="center"
                  label={name}
                  value={
                    blockDetails[dataKey]
                      ? moment(blockDetails[dataKey]).format('DD/MM/YYYY')
                      : ''
                  }
                  onClick={() =>
                    !disableButton &&
                    !(minValue && !blockDetails[minValue]) &&
                    setVisible({ ...visible, [dataKey]: true })
                  }
                  fullWidth
                  disabled={
                    disableButton || (minValue && !blockDetails[minValue])
                  }
                  rightIcon={<FontIcon>today</FontIcon>}
                  className={`block-details-textField ${className || ''}`}
                  required={required}
                  autoComplete="off"
                />
                <Portal
                  className="datePickerWrapper"
                  visible={visible[dataKey]}
                  lastChild={true}
                  renderNode={document.body}
                >
                  <DatePicker
                    className={`block-details-textField ${className || ''}`}
                    singlePick
                    startView="year"
                    endView="day"
                    defaultView="day"
                    translation={{ update: 'select' }}
                    onUpdate={date => {
                      const newBlockDetails = {
                        ...blockDetails,
                        [dataKey]: moment(date.timestamp).format(),
                      }
                      data
                        .filter(({ minValue }) => minValue === dataKey)
                        .forEach(({ dataKey }) => {
                          if (
                            newBlockDetails[dataKey] &&
                            moment(newBlockDetails[dataKey]).isBefore(
                              moment(date.timestamp),
                            )
                          ) {
                            newBlockDetails[dataKey] = moment(
                              date.timestamp,
                            ).format()
                          }
                        })
                      setBlockDetails(newBlockDetails)
                      setVisible({ ...visible, [dataKey]: false })
                    }}
                    onCancel={() =>
                      setVisible({ ...visible, [dataKey]: false })
                    }
                    minValidDate={
                      minValue && {
                        year: moment(blockDetails[minValue])
                          // .add(1, 'days')
                          .year(),
                        month:
                          moment(blockDetails[minValue])
                            // .add(1, 'days')
                            .month() + 1,
                        day: moment(blockDetails[minValue])
                          // .add(1, 'days')
                          .date(),
                      }
                    }
                  />
                </Portal>
              </>
            )
          case 'blank':
            return <div className={className} />
          case 'group':
            return (
              <div className={`wrapper ${className} md-grid`}>
                <div className={`wrapper-label`}>{name}</div>
                {renderFields(children)}
              </div>
            )
        }
      },
    )
  }
  return (
    <CustomExpansionPanel
      defaultExpanded={agreementId}
      className={cls('block-details', updateStatus || '')}
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
          <BlockDetailsLoader />
        ) : (
          agreementId && (
            <>
              {remark && <RemarksFooter remark={remark} />}
              <div className="md-grid block-details">
                {renderFields(blockDetailsConfig)}
              </div>
            </>
          )
        )
      }
    />
  )
}

export default BlockDetails
