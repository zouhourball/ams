import { useState, useEffect } from 'react'
import {
  DialogContainer,
  Button,
  TextField,
  SelectField,
  FontIcon,
  CircularProgress,
} from 'react-md'
import Dropzone from 'react-dropzone'
import moment from 'moment'
import { get } from 'lodash-es'

import mutate from 'libs/hocs/mutate'
import { fileManagerUpload } from 'libs/api/api-file-manager'

import { getCompanies, getBlocksList } from 'libs/api/api-tendering'
import {
  DatePicker,
  // DatePickerInput,
} from '@target-energysolutions/date-picker'

import File from './file'

import './styles.scss'

function CreateNewProposal ({
  mutations: { getCompanies, getBlocksList },
  getCompaniesStatus,
  getBlocksListStatus,
  visible = true,
  onHideDialog,
  onSubmitDialog,
  onEditProposal,
  proposal,
  onDelete,
  blocs,
  isEdit = false,
  ongoing,
  company,
}) {
  // const [displayOriginalDuration, setDisplayOriginalDuration] = useState(false)
  // const [displayEstimatedDuration, setDisplayEstimatedDuration] = useState(
  //   false,
  // )
  // const [
  //   displayEstimatedDurationPerDay,
  //   setDisplayEstimatedDurationPerDay,
  // ] = useState(false)
  const [spinner, setSpinner] = useState(false)
  const [canDisplayDateRange, setCanDisplayDateRange] = useState(false)
  const [options, setOptions] = useState(
    proposal.estimatedDurationPerPeriodOptionValue
      ? proposal.estimatedDurationPerPeriodOptionValue
      : [],
  )
  // const [
  //   displayEstimatedDurationPerPeriodFirm,
  //   setDisplayEstimatedDurationPerPeriodFirm,
  // ] = useState(false)
  // const [
  //   displayEstimatedDurationPerPeriodOption,
  //   setDisplayEstimatedDurationPerPeriodOption,
  // ] = useState(false)

  useEffect(() => {
    getBlocksList()
    getCompanies()
  }, [])

  const submitCreateProposal = () => {
    onSubmitDialog()
  }

  const OBJECT_ITEMS = [
    // {
    //   label: 'Tender Strategy',
    //   value: 'Tender Strategy',
    // },
    // {
    //   label: 'Technical Evaluation',
    //   value: 'Technical Evaluation',
    // },
    // {
    //   label: 'Commercial Evaluation',
    //   value: 'Commercial Evaluation',
    // },
    // {
    //   label: 'Techno-Commercial',
    //   value: 'Techno-Commercial',
    // },
    // {
    //   label: 'Cancel Tender',
    //   value: 'Cancel Tender',
    // },
    {
      label: 'Major',
      value: 'Major',
    },
    {
      label: 'Minor',
      value: 'Minor',
    },
  ]

  const contractTypeItems = [
    'Competitive',
    'Single source',
    // 'VTC',
    'affiliate',
    'Asset Transfer',
  ]

  const tenderStatusItems = [
    'Tender Strategy',
    'Technical Evaluation',
    'Commercial Evaluation & Award Recommendation',
    'For Information',
    'VTC',
    'Annual Review',
    'Closing of Contract',
    // 'Contract Cancellation',
  ]

  const actions = []
  actions.push(
    <div>
      <Button flat className="md-text--secondary" onClick={onHideDialog}>
        DISCARD
      </Button>
      <Button
        flat
        primary
        disabled={
          !proposal.company ||
          !proposal.referenceNumber ||
          !proposal.block ||
          !proposal.contractTitle ||
          !proposal.contractType ||
          !proposal.threadSholdLevel ||
          !proposal.budgetApprovedByJMC ||
          !proposal.originalCostEstimate ||
          !proposal.estimatedDurationPerJob ||
          !proposal.estimatedDurationPerPeriod ||
          // !proposal.originalACVApproved ||
          // !proposal.originalDuration ||
          // !proposal.estimatedDuration ||
          // !proposal.tenderObjective ||
          !proposal.tenderStatus
          // proposal.fileAttachment.length === 0
        }
        onClick={submitCreateProposal}
      >
        {isEdit ? 'SAVE' : 'SUBMIT'}
      </Button>
    </div>,
  )

  const renderListOfFiles = (files) => {
    return (
      files &&
      files.map((file, index) => {
        return <File key={index} file={file} onDelete={() => onDelete(file)} />
      })
    )
  }
  const uploadFiles = (listFiles) => {
    setSpinner(true)
    fileManagerUpload(listFiles).then((res) => {
      if (res.success) {
        setSpinner(false)
        onEditProposal('fileAttachment', [
          // hamdi 9al mahich mutation
          // ...proposal.fileAttachment,
          ...res.files,
        ])
      }
    })
  }

  // const displayDate = (
  //   source,
  //   canDisplay,
  //   setCanDisplay,
  //   placeholder,
  //   value,
  //   setValue,
  //   endView,
  //   size,
  // ) => {
  //   const handleDate = date => {
  //     if (source === 'original' || source === 'estimated') {
  //       setValue(date.timestamp)
  //     } else setValue(date.year)

  //     setCanDisplay(false)
  //   }
  //   return (
  //     <>
  //       <TextField
  //         id={placeholder}
  //         required
  //         label={placeholder}
  //         className={`newProposal-textField ${size}`}
  //         rightIcon={<FontIcon>today</FontIcon>}
  //         onChange={setValue}
  //         onClick={() => setCanDisplay(true)}
  //         value={
  //           value && (source === 'original' || source === 'estimated')
  //             ? moment(value).format('YYYY-MM-DD')
  //             : value
  //         }
  //         block
  //       />
  //       {canDisplay ? (
  //         <div className="layover">
  //           {' '}
  //           <DatePicker
  //             singlePick
  //             translation={{ update: 'select' }}
  //             onUpdate={date => handleDate(date)}
  //             minValidDate={{ timestamp: new Date().getTime() }}
  //             onCancel={() => setCanDisplay(false)}
  //             startView="year"
  //             endView={endView}
  //           />{' '}
  //         </div>
  //       ) : (
  //         ''
  //       )}
  //     </>
  //   )
  // }
  const handleDateRange = (startDate, endDate) => {
    if (startDate && endDate) {
      onEditProposal('estimatedDurationPerPeriodFirmValue', {
        start: startDate.timestamp,
        end: endDate.timestamp,
      })
      setCanDisplayDateRange(false)
    }
  }
  // const displayRangeDate = (startValue, setRangeDate, size, endValue) => {
  //   const handleDate = (startDate, endDate) => {
  //     if (startDate && endDate) {
  //       setRangeDate({ start: startDate.timestamp, end: endDate.timestamp })
  //     }
  //   }

  //   return (
  //     <div className="date-range md-cell md-cell--12">
  //       <DatePickerInput
  //         onChange={handleDate}
  //         startDate={
  //           startValue
  //             ? {
  //               year: moment(startValue).format('YYYY'),
  //               month: moment(startValue).format('MM'),
  //               day: moment(startValue).format('DD'),
  //             }
  //             : {}
  //         }
  //         endDate={
  //           endValue
  //             ? {
  //               year: moment(endValue).format('YYYY'),
  //               month: moment(endValue).format('MM'),
  //               day: moment(endValue).format('DD'),
  //             }
  //             : {}
  //         }
  //         minValidDate={{
  //           year: new Date().getFullYear(),
  //           month: new Date().getMonth(),
  //           day: new Date().getDay(),
  //           timestamp: new Date().getTime(),
  //         }}
  //       />
  //     </div>
  //   )
  // }
  const renderCompany = () => {
    return get(getCompaniesStatus, 'data', []).map((comp) => comp.company)
  }
  const renderBlocs = () => {
    return get(getBlocksListStatus, 'data', []).map((blk) => blk.block)
  }

  const onChangeOptions = (key, value) => {
    options[key] = value
    setOptions([...options])
    onEditProposal('estimatedDurationPerPeriodOptionValue', [...options])
  }
  return (
    <DialogContainer
      id="newProposal-dialog"
      title={
        ongoing
          ? 'Ongoing Proposal'
          : isEdit
            ? 'Edit Proposal'
            : 'Create New Proposal'
      }
      className="newProposal"
      visible={visible}
      onHide={() => null}
      actions={actions}
    >
      <div className="newProposal-dialog-body">
        <div className="md-grid">
          <SelectField
            id="companyName"
            label={'company Name'}
            placeholder="Company Name"
            menuItems={renderCompany()}
            position={SelectField.Positions.BELOW}
            block
            className="newProposal-selectFields md-cell md-cell--6"
            value={proposal.company}
            onChange={(v) => onEditProposal('company', v)}
            required
          />
          <TextField
            id="referenceNumber"
            label={'Reference Number'}
            className="newProposal-textField md-cell md-cell--6"
            value={proposal.referenceNumber}
            onChange={(v) => onEditProposal('referenceNumber', v)}
            required
          />
          <TextField
            id="contractType"
            label={'Contract Title'}
            className="newProposal-textField md-cell md-cell--12"
            value={proposal.contractTitle}
            onChange={(v) => onEditProposal('contractTitle', v)}
            required
          />
          <SelectField
            id="block-number"
            className="newProposal-selectFields md-cell md-cell--6 "
            position={SelectField.Positions.BELOW}
            menuItems={renderBlocs()}
            value={proposal.block}
            onChange={(v) => onEditProposal('block', v)}
            placeholder={'Block Number'}
            label={'Block Number'}
            required
          />
          <SelectField
            id="contract-type"
            className="newProposal-selectFields md-cell md-cell--6 "
            position={SelectField.Positions.BELOW}
            menuItems={contractTypeItems}
            value={proposal.contractType}
            onChange={(v) => onEditProposal('contractType', v)}
            placeholder={'Contract Type'}
            label={'Contract Type'}
            required
          />{' '}
          <SelectField
            id="Threadshold-Level"
            className="newProposal-selectFields md-cell md-cell--6 "
            position={SelectField.Positions.BELOW}
            menuItems={OBJECT_ITEMS}
            value={proposal.threadSholdLevel}
            onChange={(v) => onEditProposal('threadSholdLevel', v)}
            placeholder={'Threadshold Level'}
            label={'Threadshold Level'}
            required
          />{' '}
          <SelectField
            id="Tender-Status"
            className="newProposal-selectFields md-cell md-cell--6 "
            position={SelectField.Positions.BELOW}
            menuItems={tenderStatusItems}
            value={proposal.tenderStatus}
            onChange={(v) => onEditProposal('tenderStatus', v)}
            placeholder={'Tender Status'}
            label={'Tender Status'}
            required
          />{' '}
          <TextField
            id="Budget Approved by JMC"
            className="newProposal-textField md-cell md-cell--6 "
            value={proposal.budgetApprovedByJMC}
            onChange={(v) => onEditProposal('budgetApprovedByJMC', v)}
            label={'Budget Approved by JMC'}
            required
            type="number"
          />
          <TextField
            id="Original Cost Estimate"
            className="newProposal-textField md-cell md-cell--6 "
            value={proposal.originalCostEstimate}
            onChange={(v) => onEditProposal('originalCostEstimate', v)}
            label={'Original Cost Estimate'}
            required
            type="number"
          />
          {/* <TextField
            id="Original ACV Approved"
            className="newProposal-textField md-cell md-cell--6 "
            value={proposal.originalACVApproved}
            onChange={v => onEditProposal('originalACVApproved', v)}
            label={'Original ACV Approved'}
            required
            type="number"
          /> */}
          {/* {displayDate(
            'original',
            displayOriginalDuration,
            setDisplayOriginalDuration,
            'Original Duration',
            proposal.originalDuration,
            v => onEditProposal('originalDuration', v),
            'day',
          )} */}
          {/* {displayDate(
            'estimated',
            displayEstimatedDuration,
            setDisplayEstimatedDuration,
            'Estimated Duration',
            proposal.estimatedDuration,
            v => onEditProposal('estimatedDuration', v),
            'day',
            'md-cell md-cell--6',
          )} */}
          {/* <TextField
            id="Tender Objective"
            label={'Tender Objective'}
            className="newProposal-textField md-cell md-cell--12"
            value={proposal.tenderObjective}
            onChange={v => onEditProposal('tenderObjective', v)}
          /> */}
          {/* <p className="md-cell md-cell--12">Estimated duration</p>
          {displayDate(
            'original',
            displayEstimatedDurationPerDay,
            setDisplayEstimatedDurationPerDay,
            'Per Job',
            proposal.estimatedDurationPerDay,
            v => onEditProposal('estimatedDurationPerDay', v),
            'day',
            'md-cell md-cell--6',
          )}
          <SelectField
            id="Tender-Status"
            className="newProposal-selectFields md-cell md-cell--6 "
            position={SelectField.Positions.BELOW}
            menuItems={['Firm', 'Option']}
            value={proposal.estimatedDurationPerPeriod}
            onChange={v => onEditProposal('estimatedDurationPerPeriod', v)}
            placeholder={'Per Period'}
            label={'Per Period'}
            required
          /> */}
          <div className="wrapper md-cell md-cell--12 md-grid">
            <div className="wrapper-label">Estimated duration</div>
            {/* {displayDate(
              'original',
              displayEstimatedDurationPerDay,
              setDisplayEstimatedDurationPerDay,
              'Per Job',
              proposal.estimatedDurationPerDay,
              v => onEditProposal('estimatedDurationPerDay', v),
              'day',
              'md-cell md-cell--12',
            )} */}
            <div className="wrapper md-cell md-cell--12 md-grid">
              <div className="wrapper-label">Per Period</div>
              <SelectField
                id="Tender-Status"
                className="newProposal-selectFields md-cell md-cell--12 "
                position={SelectField.Positions.BELOW}
                menuItems={['Firm', 'Option']}
                value={proposal.estimatedDurationPerPeriod}
                onChange={(v) =>
                  onEditProposal('estimatedDurationPerPeriod', v)
                }
                placeholder={'Type'}
                // label={'Per Period'}
                required
              />
              {proposal.estimatedDurationPerPeriod === 'Option' ? (
                <>
                  <TextField
                    id="estimatedDurationPerPeriodOption_1"
                    className="newProposal-textField md-cell md-cell--4"
                    label="Option 1"
                    placeholder="Year"
                    value={options && options[0]}
                    onChange={(v) => onChangeOptions(0, v)}
                    type="number"
                    block
                  />
                  <TextField
                    id="estimatedDurationPerPeriodOption_2"
                    className="newProposal-textField md-cell md-cell--4"
                    label="Option 2"
                    value={options && options[1]}
                    onChange={(v) => onChangeOptions(1, v)}
                    type="number"
                    block
                  />
                  <TextField
                    id="estimatedDurationPerPeriodOption_3"
                    className="newProposal-textField md-cell md-cell--4"
                    label="Option 3"
                    value={options && options[2]}
                    onChange={(v) => onChangeOptions(2, v)}
                    type="number"
                    block
                  />
                </>
              ) : (
                <>
                  {/* {displayRangeDate(
                    proposal.estimatedDurationPerPeriodFirmStartValue,
                    v =>
                      onEditProposal('estimatedDurationPerPeriodFirmValue', v),
                    'md-cell md-cell--6',
                    proposal.estimatedDurationPerPeriodFirmEndValue,
                  )} */}
                  <TextField
                    id={'date-range'}
                    required
                    label={'Date Range'}
                    className={`newProposal-textField md-cell md-cell--12`}
                    rightIcon={<FontIcon>today</FontIcon>}
                    // onChange={setValue}
                    onClick={() => setCanDisplayDateRange(true)}
                    value={
                      proposal.estimatedDurationPerPeriodFirmStartValue
                        ? `${moment(
                          proposal.estimatedDurationPerPeriodFirmStartValue,
                        ).format('DD/MM/YYYY')} - ${moment(
                          proposal.estimatedDurationPerPeriodFirmEndValue,
                        ).format('DD/MM/YYYY')}`
                        : ``
                    }
                    block
                  />
                  {canDisplayDateRange && (
                    <DatePicker
                      startView="year"
                      endView="day"
                      defaultView="day"
                      translation={{ update: 'select' }}
                      // multiplePick
                      // singlePick={false}
                      onUpdate={handleDateRange}
                      onCancel={() => setCanDisplayDateRange(false)}
                      minValidDate={{ timestamp: new Date().getTime() }}
                      //  startDate={{ year: moment(proposal.estimatedDurationPerPeriodFirmStartValue).format('YYYY'),
                      //    month: moment(proposal.estimatedDurationPerPeriodFirmStartValue).format('MM'),
                      //    day: moment(proposal.estimatedDurationPerPeriodFirmStartValue).format('DD') }}
                      //  endDate={{ year: moment(proposal.estimatedDurationPerPeriodFirmEndValue).format('YYYY'),
                      //    month: moment(proposal.estimatedDurationPerPeriodFirmEndValue).format('MM'),
                      //    day: moment(proposal.estimatedDurationPerPeriodFirmEndValue).format('DD') }}
                    />
                  )}
                </>
              )}
            </div>
            <TextField
              id="estimatedDurationPerJob"
              value={proposal.estimatedDurationPerJob}
              onChange={(v) => onEditProposal('estimatedDurationPerJob', v)}
              type="number"
              placeholder="Year"
              label="Per Job"
              className="newProposal-textField md-cell md-cell--12"
            />
          </div>
          {/* <div className="wrapper md-cell md-cell--12 md-grid">
              <div className="wrapper-label">Per Period</div>
              {displayDate(
                'original',
                displayEstimatedDurationPerPeriodFirm,
                setDisplayEstimatedDurationPerPeriodFirm,
                'Firm',
                proposal.estimatedDurationPerPeriodFirm,
                v => onEditProposal('estimatedDurationPerPeriodFirm', v),
                'day',
                'md-cell md-cell--6',
              )}
              {displayDate(
                'original',
                displayEstimatedDurationPerPeriodOption,
                setDisplayEstimatedDurationPerPeriodOption,
                'Option',
                proposal.estimatedDurationPerPeriodOption,
                v => onEditProposal('estimatedDurationPerPeriodOption', v),
                'day',
                'md-cell md-cell--6',
              )}

            </div> */}
          <div className="newProposal-tooltip-section md-cell md-cell--12">
            <p>Attach Proposal & Other Related Documents</p>
            <div className="inform">
              <FontIcon iconClassName="mdi mdi-information-outline" />
              <div className="inform-tooltip">
                <ul>
                  <li>Tender Strategy </li>
                  <li>Technical Evaluation Results & Sheets</li>
                  <li>Commercial Evaluation & Sheets</li>
                  <li>Supporting Evidence</li>
                  <li>Pre-Qualification Reports</li>
                  <li>Any other general supporting documents</li>
                  <li>ITT Documents</li>
                  <li>T&C Documents</li>
                </ul>
              </div>
            </div>
          </div>
          <Dropzone
            className="newProposal-details-download "
            onDrop={uploadFiles}
          >
            {({ getRootProps, getInputProps }) => (
              <div
                className={`newProposal_dropZone md-cell md-cell--12 ${
                  ''
                  // renderListOfFiles(proposal.fileAttachment).length === 0
                  //   ? 'withMargin'
                  //   : ''
                }`}
                {...getRootProps()}
              >
                {!spinner ? (
                  <>
                    <input {...getInputProps()} />
                    <div className="newProposal_dropZone_content">
                      <FontIcon>save_alt</FontIcon>
                      <p>
                        <b> Choose File </b> or <b> Drag </b> it here
                      </p>
                    </div>
                  </>
                ) : (
                  <CircularProgress className="upload-spinner" />
                )}
              </div>
            )}
          </Dropzone>
          <div className="newProposal-fileWrapper md-grid">
            {renderListOfFiles(proposal.fileAttachment)}
          </div>
        </div>
      </div>
    </DialogContainer>
  )
}

export default mutate({
  moduleName: 'infos',
  mutations: { getBlocksList, getCompanies },
})(CreateNewProposal)
