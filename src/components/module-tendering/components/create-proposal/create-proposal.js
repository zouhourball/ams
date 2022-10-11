import { useEffect, useState } from 'react'
import {
  SelectField,
  TextField,
  FontIcon,
  CircularProgress,
  Button,
} from 'react-md'
import { get } from 'lodash-es'
import mutate from 'libs/hocs/mutate'
import moment from 'moment'
import Dropzone from 'react-dropzone'
import { graphql } from 'react-apollo'

import { DatePicker } from '@target-energysolutions/date-picker'

// import meCompanies from './helper.js'
import File from './file'

import { getBlocksList } from 'libs/api/api-tendering'
import { fileManagerUpload } from 'libs/api/api-file-manager'
import meOrganizations from 'libs/queries/me-organizations.gql'

import './style.scss'
const CreateProposal = ({
  onSubmitReview,
  onCancel,
  proposal = {},
  mutations: { getBlocksList },
  onEditProposal,
  getBlocksListStatus,
  onDelete,
  setProposal,
  canSubmitReview,
  meCompanies,
  handleExistProposal,
  proposalId,
  setIsVisibleTopBar,
}) => {
  useEffect(() => {
    getBlocksList()
  }, [])
  useEffect(() => {
    setIsVisibleTopBar && setIsVisibleTopBar(true)
  }, [])

  const [canDisplayStartDate, setCanDisplayStartDate] = useState(false)
  const [canDisplayEndDate, setCanDisplayEndDate] = useState(false)
  const [options, setOptions] = useState(
    proposal.estimatedDurationPerPeriodOptionValue
      ? [...proposal.estimatedDurationPerPeriodOptionValue]
      : [],
  )
  const [spinner, setSpinner] = useState(false)
  const {
    companyName,
    referenceNumber,
    blockNumber,
    contractType,
    threadHoldLevel,
    tenderStatus,
    budgetApprovedByJMC,
    originalCostEstimate,
    title,
    estimatedDurationPerPeriodType,
    estimatedDurationPerPeriodFirmStartValue,
    estimatedDurationPerPeriodFirmEndValue,
  } = proposal

  const validInput = () => {
    const refNumber = referenceNumber.split('/')[1]
    const validPerPeriod =
      estimatedDurationPerPeriodType === 'Firm'
        ? estimatedDurationPerPeriodFirmStartValue &&
          estimatedDurationPerPeriodFirmEndValue
        : true
    if (
      companyName &&
      blockNumber &&
      contractType &&
      threadHoldLevel &&
      tenderStatus &&
      budgetApprovedByJMC &&
      originalCostEstimate &&
      refNumber &&
      title &&
      validPerPeriod
    ) {
      return false
    }
    return true
  }

  const renderCompany = () => {
    return meCompanies.map((cmp) => {
      return {
        companyId: cmp.ID,
        companyName: cmp.Name,
      }
    })
  }

  const renderBlocs = () => {
    const listBlock = get(getBlocksListStatus, 'data', [])
    const currentBlock = listBlock.filter(
      (block) => block.company?.id === +proposal.companyId,
    )
    return currentBlock.filter(({ block }) => block).map((blk) => blk.block)
  }

  const handleStartDate = (startDate) => {
    onEditProposal &&
      onEditProposal(
        'estimatedDurationPerPeriodFirmStartValue',
        startDate.timestamp,
      )
    setCanDisplayStartDate(false)
  }
  const handleEndDate = (endDate) => {
    onEditProposal &&
      onEditProposal(
        'estimatedDurationPerPeriodFirmEndValue',
        endDate.timestamp,
      )
    setCanDisplayEndDate(false)
  }

  const onChangeOptions = (key, value) => {
    options[key] = value
    setOptions([...options])
    onEditProposal('estimatedDurationPerPeriodOptionValue', [...options])
  }

  const uploadFiles = (listFiles) => {
    setSpinner(true)
    fileManagerUpload(listFiles).then((res) => {
      if (res.success) {
        setSpinner(false)
        onEditProposal('fileAttachment', [
          ...proposal.fileAttachment,
          ...res.files,
        ])
      }
    })
  }

  const renderListOfFiles = (files) => {
    return (
      files &&
      files.map((file, index) => {
        return <File key={index} file={file} onDelete={() => onDelete(file)} />
      })
    )
  }
  const onEditCompany = (companyId) => {
    const companyList = meCompanies.map((cmp) => {
      return {
        companyId: cmp.ID,
        companyName: cmp.Name,
      }
    })
    const findCompany =
      companyList.find((el) => el.companyId === companyId) || {}
    setProposal({
      ...proposal,
      companyId: findCompany.companyId,
      companyName: findCompany.companyName,
      referenceNumber: `${findCompany.companyName}/`,
    })
  }

  // useEffect(() => {
  //   setProposal({ ...proposal, originalCostEstimate: 100 })
  // }, [proposal])

  const OBJECT_ITEMS = [
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
    'Affiliate',
    'Asset Transfer',
  ]
  const tenderStatusItems = [
    'Tender Strategy',
    'Technical Evaluation',
    'Commercial Evaluation & Award Recommendation',
    'For Notification',
    'VTC',
    'Annual Review',
    'Closing of Contract',
    'Request For Meeting',
  ]

  const maxCost = (compCost, singleCost) => {
    const type = contractType.replace(/\s+/g, '')
    switch (type) {
      case 'Competitive':
        if (threadHoldLevel === 'Minor' && originalCostEstimate <= compCost) {
          return threadHoldLevel === 'Minor' && originalCostEstimate <= compCost
        } else if (
          threadHoldLevel === 'Major' &&
          originalCostEstimate >= compCost
        ) {
          return threadHoldLevel === 'Major' && originalCostEstimate >= compCost
        } else {
          return false
        }
      case 'Singlesource':
        if (threadHoldLevel === 'Minor' && originalCostEstimate <= singleCost) {
          return true
        } else if (
          threadHoldLevel === 'Major' &&
          originalCostEstimate >= singleCost
        ) {
          return (
            threadHoldLevel === 'Major' && originalCostEstimate >= singleCost
          )
        } else {
          return false
        }
      default:
        return true
    }
  }
  const minorCost = () => {
    const type = companyName.replace(/\s+/g, '')
    switch (type) {
      case 'Daleel':
        return 250000
      case 'OQ':
        return 500000
      case 'ARA':
        return 100000
      case 'MOGC':
        return 500000
      case 'HCFHydroCarban':
        return 100000
      case 'APex':
        return 100000
      case 'MOL':
        return 100000
      case 'Medco':
        return 100000
      case 'PetroTel':
        return 100000
      case 'OmanLasso':
        return 100000
      case 'PetroLeb':
        return 100000
      case 'Tythesoil':
        return 100000
      case 'MasirahOil':
        return 100000
      case 'CCE':
        return 100000
      default:
        return 0
    }
  }

  const majorCost = () => {
    const type = companyName.replace(/\s+/g, '')
    switch (type) {
      case 'Daleel':
        return 1000000
      case 'OQ':
        return 2000000
      case 'ARA':
        return 5000000
      case 'MOGC':
        return 2000000
      case 'HCFHydroCarban':
        return 5000000
      case 'APex':
        return 5000000
      case 'MOL':
        return 5000000
      case 'Medco':
        return 5000000
      case 'PetroTel':
        return 5000000
      case 'OmanLasso':
        return 5000000
      case 'PetroLeb':
        return 5000000
      case 'Tythesoil':
        return 5000000
      case 'MasirahOil':
        return 5000000
      case 'CCE':
        return 1000000
      default:
        return 0
    }
  }
  const companyCost = () => {
    const type = companyName.replace(/\s+/g, '')
    if (
      [
        'Tender Strategy',
        'Technical Evaluation',
        'Commercial Evaluation & Award Recommendation',
      ].includes(tenderStatus)
    ) {
      switch (type) {
        case 'Daleel':
          return maxCost(1000000, 250000)
        case 'OQ':
          return maxCost(2000000, 500000)
        case 'ARA':
          return maxCost(500000, 100000)
        case 'MOGC':
          return maxCost(2000000, 500000)
        case 'HCFHydroCarban':
          return maxCost(500000, 100000)
        case 'APex':
          return maxCost(500000, 100000)
        case 'MOL':
          return maxCost(500000, 100000)
        case 'Medco':
          return maxCost(500000, 100000)
        case 'PetroTel':
          return maxCost(500000, 100000)
        case 'OmanLasso':
          return maxCost(500000, 100000)
        case 'PetroLeb':
          return maxCost(500000, 100000)
        case 'Tythesoil':
          return maxCost(500000, 100000)
        case 'MasirahOil':
          return maxCost(500000, 100000)
        case 'CCE':
          return maxCost(1000000, 100000)
        default:
          return 1
      }
    } else {
      return ![
        'Tender Strategy',
        'Technical Evaluation',
        'Commercial Evaluation & Award Recommendation',
      ].includes(tenderStatus)
    }
  }

  useEffect(() => {
    let type = `${companyName}-${blockNumber}-${contractType?.replace(' ', '')}`
    switch (type) {
      case 'OQ-60-Competitive':
        onEditProposal('originalCostEstimate', 2000000)
        break
      case 'OQ-48-Competitive':
        onEditProposal('originalCostEstimate', 2000000)
        break
      case 'OQ-60-Singlesource':
        onEditProposal('originalCostEstimate', 500000)
        break
      case 'OQ-48-Singlesource':
        onEditProposal('originalCostEstimate', 500000)
        break
      case 'Daleel-5-Competitive':
        onEditProposal('originalCostEstimate', 1000000)
        break
      case 'Daleel-5-Singlesource':
        onEditProposal('originalCostEstimate', 250000)
        break
      case 'CCED-3&4-Competitive':
        onEditProposal('originalCostEstimate', 1000000)
        break
      case 'CCED-3&4-Singlesource':
        onEditProposal('originalCostEstimate', 100000)
        break
      case 'ARA-44-Competitive':
        onEditProposal('originalCostEstimate', 500000)
        break
      case 'ARA-44-Singlesource':
        onEditProposal('originalCostEstimate', 100000)
        break
      case 'ARA-31-Competitive':
        onEditProposal('originalCostEstimate', 500000)
        break
      case 'ARA-31-Singlesource':
        onEditProposal('originalCostEstimate', 100000)
        break
      case 'HCF-7-Competitive':
        onEditProposal('originalCostEstimate', 500000)
        break
      case 'HCF-7-Singlesource':
        onEditProposal('originalCostEstimate', 100000)
        break
      case 'HCF-15-Competitive':
        onEditProposal('originalCostEstimate', 500000)
        break
      case 'HCF-15-Singlesource':
        onEditProposal('originalCostEstimate', 100000)
        break
      case 'MOGC-8-Competitive':
        onEditProposal('originalCostEstimate', 2000000)
        break
      case 'MOGC-8-Singlesource':
        onEditProposal('originalCostEstimate', 500000)
        break
      case 'APEX-36-Competitive':
        onEditProposal('originalCostEstimate', 500000)
        break
      case 'APEX-36-Singlesource':
        onEditProposal('originalCostEstimate', 100000)
        break
      case 'MOL-66-Competitive':
        onEditProposal('originalCostEstimate', 500000)
        break
      case 'MOL-66-Singlesource':
        onEditProposal('originalCostEstimate', 100000)
        break
      case 'PTO-17-Competitive':
        onEditProposal('originalCostEstimate', 500000)
        break
      case 'PTO-17-Singlesource':
        onEditProposal('originalCostEstimate', 100000)
        break
      case 'PTO-40-Competitive':
        onEditProposal('originalCostEstimate', 500000)
        break
      case 'PTO-40-Singlesource':
        onEditProposal('originalCostEstimate', 100000)
        break
      case 'PTO-39-Competitive':
        onEditProposal('originalCostEstimate', 500000)
        break
      case 'PTO-39-Singlesource':
        onEditProposal('originalCostEstimate', 100000)
        break
      case 'PTO-67-Competitive':
        onEditProposal('originalCostEstimate', 500000)
        break
      case 'PTO-67-Singlesource':
        onEditProposal('originalCostEstimate', 100000)
        break
      case 'MEDCO-56-Competitive':
        onEditProposal('originalCostEstimate', 500000)
        break
      case 'MEDCO-56-Singlesource':
        onEditProposal('originalCostEstimate', 100000)
        break
      case 'MASIRAH OIL-50-Competitive':
        onEditProposal('originalCostEstimate', 500000)
        break
      case 'MASIRAH OIL-50-Singlesource':
        onEditProposal('originalCostEstimate', 100000)
        break
      case 'OMAN LASSO-54-Competitive':
        onEditProposal('originalCostEstimate', 500000)
        break
      case 'OMAN LASSO-54-Singlesource':
        onEditProposal('originalCostEstimate', 100000)
        break
      case 'TYTHES TOM-49-Competitive':
        onEditProposal('originalCostEstimate', 500000)
        break
      case 'TYTHES TOM-49-Singlesource':
        onEditProposal('originalCostEstimate', 100000)
        break
      case 'PETROLEB-57-Competitive':
        onEditProposal('originalCostEstimate', 500000)
        break
      case 'PETROLEB-57-Singlesource':
        onEditProposal('originalCostEstimate', 100000)
        break
      default:
        onEditProposal('originalCostEstimate', null)
        break
    }
  }, [companyName, blockNumber, contractType])

  return (
    <div className="createProposal">
      <div className="createProposal_topBar">
        <div className="createProposal_topBar_title">New Proposal</div>
        <div className="createProposal_topBar_actions">
          <Button
            flat
            className="createProposal_topBar_actions_cancel"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button
            flat
            primary
            swapTheming={canSubmitReview && !validInput() && companyCost()}
            className="createProposal_topBar_actions_submit"
            onClick={onSubmitReview}
            disabled={!canSubmitReview || validInput() || !companyCost()}
          >
            {!proposalId ? 'Submit For Review' : 'Resubmit For Review'}
          </Button>
        </div>
      </div>
      <div className="createProposal_container">
        <div className="createProposal_section md-grid">
          <div className="createProposal_section_header md-cell md-cell--12">
            Proposal Details
          </div>
          <SelectField
            id="companyName"
            label={'company Name'}
            placeholder="Company Name"
            menuItems={renderCompany()}
            position={SelectField.Positions.BELOW}
            itemLabel="companyName"
            itemValue="companyId"
            block
            className="createProposal_section_selectField md-cell md-cell--6"
            value={proposal.companyId}
            onChange={(v) => onEditCompany(v)}
            required
          />
          <TextField
            id="referenceNumber"
            label={'Reference Number'}
            className="createProposal_section_textField md-cell md-cell--6"
            value={proposal.referenceNumber}
            onChange={(v) =>
              new RegExp(`^${proposal.companyName}\\/.*`, 'g').test(v)
                ? onEditProposal('referenceNumber', v)
                : null
            }
            onKeyDown={(e) =>
              e.keyCode === 13 &&
              !proposalId &&
              handleExistProposal(referenceNumber)
            }
            required
          />
          <SelectField
            id="block-number"
            className="createProposal_section_selectField md-cell md-cell--6"
            position={SelectField.Positions.BELOW}
            menuItems={renderBlocs()}
            value={blockNumber.toString()}
            onChange={(v) => {
              onEditProposal('blockNumber', v)
            }}
            placeholder={'Block Number *'}
            label={'Block Number'}
            required
          />
          <SelectField
            id="contract-type"
            className="newProposal-selectFields md-cell md-cell--6 "
            position={SelectField.Positions.BELOW}
            menuItems={contractTypeItems}
            value={proposal.contractType}
            onChange={(v) => {
              onEditProposal('contractType', v)
            }}
            placeholder={'Proposal Type'}
            label={'Proposal Type'}
            required
          />{' '}
          <SelectField
            id="threadHoldLevel-Level"
            className="createProposal_section_selectField md-cell md-cell--6"
            position={SelectField.Positions.BELOW}
            menuItems={OBJECT_ITEMS}
            value={proposal.threadHoldLevel}
            onChange={(v) => {
              onEditProposal('threadHoldLevel', v)
            }}
            placeholder={'threadHoldLevel Level'}
            label={'ThreadHoldLevel Level'}
            required
          />
          <SelectField
            id="Tender-Status"
            className="createProposal_section_selectField md-cell md-cell--6"
            position={SelectField.Positions.BELOW}
            menuItems={tenderStatusItems}
            value={proposal.tenderStatus}
            onChange={(v) => onEditProposal('tenderStatus', v)}
            placeholder={'Tender Status'}
            label={'Tender Status'}
            required
          />
          <TextField
            id="title"
            className="createProposal_section_textField textArea md-cell md-cell--6"
            value={proposal.title}
            onChange={(v) => onEditProposal('title', v)}
            label={'Proposal Title'}
            required
          />
          <TextField
            id="comment"
            className="createProposal_section_textField textArea md-cell md-cell--6"
            value={proposal.comment}
            onChange={(v) => onEditProposal('comment', v)}
            label={'Description'}
          />
          <TextField
            id="Budget Approved by JMC"
            className="createProposal_section_textField md-cell md-cell--12"
            value={proposal.budgetApprovedByJMC}
            onChange={(v) => onEditProposal('budgetApprovedByJMC', v)}
            label={'Budget Approved by JMC (USD)*'}
            required
            type="number"
          />
          <TextField
            id="Original Cost Estimate"
            className="createProposal_section_textField md-cell md-cell--12"
            value={originalCostEstimate || ''}
            onChange={(v) => {
              // eslint-disable-next-line no-useless-escape
              let pattern = /\d*([.,\/]?\d+)/
              if (
                (pattern.test(v) || v === '') &&
                contractType &&
                threadHoldLevel
              ) {
                onEditProposal('originalCostEstimate', v)
              }
            }}
            label={'Original Cost Estimate (USD)*'}
            error={
              [
                'Tender Strategy',
                'Technical Evaluation',
                'Commercial Evaluation & Award Recommendation',
              ].includes(tenderStatus) && !companyCost()
            }
            min={0}
            errorText={
              [
                'Tender Strategy',
                'Technical Evaluation',
                'Commercial Evaluation & Award Recommendation',
              ].includes(tenderStatus) &&
              threadHoldLevel &&
              originalCostEstimate
                ? `Original Estimate Cost should be ${
                  threadHoldLevel === 'Major' ? 'Greater than' : 'Less than'
                } ${
                  contractType === 'Competitive' ? majorCost() : minorCost()
                }`
                : ''
            }
            required
            type="number"
          />
        </div>
        <div className="createProposal_section md-grid">
          <div className="createProposal_section_header md-cell md-cell--12">
            Estimated Duration (Firm/Option)
          </div>
          <SelectField
            id="estimatedDurationPerPeriodType"
            className="createProposal_section_selectField md-cell md-cell--12"
            position={SelectField.Positions.BELOW}
            menuItems={['Firm', 'Option']}
            value={proposal.estimatedDurationPerPeriodType}
            onChange={(v) =>
              onEditProposal('estimatedDurationPerPeriodType', v)
            }
            placeholder={'Type'}
            label={'Per Period'}
            required
          />
          <>
            {proposal.estimatedDurationPerPeriodType === 'Option' ? (
              <>
                <TextField
                  id="estimatedDurationPerPeriodOption_1"
                  className="createProposal_section_textField md-cell md-cell--4"
                  label="Year"
                  placeholder="Year"
                  value={options && +options[0]}
                  onChange={(v) => onChangeOptions(0, v)}
                  type="number"
                  block
                />
                <TextField
                  id="estimatedDurationPerPeriodOption_2"
                  className="createProposal_section_textField md-cell md-cell--4"
                  label="Year"
                  value={options && +options[1]}
                  onChange={(v) => onChangeOptions(1, v)}
                  type="number"
                  block
                />
                <TextField
                  id="estimatedDurationPerPeriodOption_3"
                  className="createProposal_section_textField md-cell md-cell--4"
                  label="Year"
                  value={options && +options[2]}
                  onChange={(v) => onChangeOptions(2, v)}
                  type="number"
                  block
                />
              </>
            ) : (
              <>
                <TextField
                  id={'start-date'}
                  required
                  label={'Start Date'}
                  className="createProposal_section_textField md-cell md-cell--6"
                  rightIcon={<FontIcon>today</FontIcon>}
                  onClick={() => setCanDisplayStartDate(true)}
                  value={
                    proposal.estimatedDurationPerPeriodFirmStartValue
                      ? moment(
                        proposal.estimatedDurationPerPeriodFirmStartValue,
                      ).format('DD/MM/YYYY')
                      : ''
                  }
                  block
                />
                <TextField
                  id={'end-date'}
                  required
                  label={'End Date'}
                  className="createProposal_section_textField md-cell md-cell--6"
                  rightIcon={<FontIcon>today</FontIcon>}
                  onClick={() => setCanDisplayEndDate(true)}
                  value={
                    proposal.estimatedDurationPerPeriodFirmEndValue
                      ? moment(
                        proposal.estimatedDurationPerPeriodFirmEndValue,
                      ).format('DD/MM/YYYY')
                      : ''
                  }
                  block
                />
              </>
            )}
          </>
          {canDisplayStartDate && (
            <div className="datePicker-wrapper">
              <DatePicker
                singlePick
                startView="year"
                endView="day"
                defaultView="day"
                translation={{ update: 'select' }}
                onUpdate={handleStartDate}
                onCancel={() => setCanDisplayStartDate(false)}
                // minValidDate={{ timestamp: new Date().getTime() }}
              />
            </div>
          )}
          {canDisplayEndDate && (
            <div className="datePicker-wrapper">
              <DatePicker
                singlePick
                startView="year"
                endView="day"
                defaultView="day"
                translation={{ update: 'select' }}
                onUpdate={handleEndDate}
                onCancel={() => setCanDisplayEndDate(false)}
                minValidDate={
                  estimatedDurationPerPeriodFirmStartValue
                    ? { timestamp: estimatedDurationPerPeriodFirmStartValue }
                    : { timestamp: new Date().getTime() }
                }
              />
            </div>
          )}
          <TextField
            id="estimatedDurationPerJob"
            value={proposal.estimatedDurationPerJob}
            onChange={(v) => onEditProposal('estimatedDurationPerJob', v)}
            placeholder=""
            label="Per Job"
            className="createProposal_section_textField md-cell md-cell--12"
          />
        </div>
        <div className="createProposal_section md-grid">
          <div className="createProposal_section_header md-cell md-cell--12">
            Attachments
          </div>
          <Dropzone
            className="createProposal_section_download"
            onDrop={uploadFiles}
          >
            {({ getRootProps, getInputProps }) => (
              <div
                className={`createProposal_section_dropZone md-cell md-cell--12 ${
                  proposal.fileAttachment &&
                  renderListOfFiles(proposal.fileAttachment).length === 0
                    ? 'withMargin'
                    : ''
                }`}
                {...getRootProps()}
              >
                {!spinner ? (
                  <>
                    <input {...getInputProps()} />
                    <div className="createProposal_section_dropZone_content">
                      <p>Attach Proposal & Other Related Documents</p>
                      <FontIcon>save_alt</FontIcon>
                    </div>
                  </>
                ) : (
                  <CircularProgress className="upload-spinner" />
                )}
              </div>
            )}
          </Dropzone>
          <div className="createProposal_section_fileWrapper md-grid">
            {renderListOfFiles(proposal.fileAttachment)}
          </div>
        </div>
      </div>
    </div>
  )
}
export default mutate({
  moduleName: 'infos',
  mutations: { getBlocksList },
})(
  graphql(meOrganizations, {
    options: () => {
      return {
        notifyOnNetworkStatusChange: true,
        context: {
          uri: `${PRODUCT_WORKSPACE_URL}/graphql`,
        },
      }
    },

    props: ({ data }) => {
      return { meCompanies: get(data, 'meOrganizations', []) }
    },
  })(CreateProposal),
)
