import { useState, useEffect } from 'react'
import {
  DialogContainer,
  Button,
  TextField,
  FontIcon,
  SelectField,
} from 'react-md'
import { DatePicker } from '@target-energysolutions/date-picker'
import Dropzone from 'react-dropzone'
import { get } from 'lodash-es'
import { useQuery } from 'react-query'
import { graphql } from 'react-apollo'

import { getBlocksList, getUploadToken } from 'libs/api/api-tendering'
import mutate from 'libs/hocs/mutate'
import { uploadFileTus } from 'libs/api/tus-upload'
import meOrganizations from 'libs/queries/me-organizations.gql'

import File from './file'

import './styles.scss'

function CreateNewAnnualPlan ({
  visible = true,
  onHideDialog,
  onSubmitDialog,
  mutations: { getBlocksList },
  getBlocksListStatus,
  meCompanies,
  disabled,
}) {
  const [operatorName, setOperatorName] = useState('')
  const [blockNumber, setBlockNumber] = useState('')
  const [reportingYear, setReportingYear] = useState('')
  const [fileAttachment, setFileAttachment] = useState(null)
  const [files, setFiles] = useState([])
  const [fileUrl, setFileUrl] = useState('')
  const [displayReportingYear, setDisplayReportingYear] = useState(false)
  useEffect(() => {
    getBlocksList()
  }, [])
  const { data: uploadToken } = useQuery(['getUploadToken'], getUploadToken)

  const renderBlocs = () => {
    const listBlock = get(getBlocksListStatus, 'data', [])
    const currentBlock = listBlock.filter(
      (block) => block.company?.id === +operatorName,
    )
    return currentBlock.filter(({ block }) => block).map((blk) => blk.block)
  }

  const companyName = () => {
    const findCompany =
      meCompanies.find((comp) => comp.ID === operatorName) || {}
    return findCompany.Name || ''
  }
  const validDialog = () => {
    if (
      operatorName &&
      blockNumber &&
      fileUrl &&
      fileAttachment &&
      reportingYear &&
      !disabled
    ) {
      return false
    }
    return true
  }

  const submitCreateProposal = () => {
    onSubmitDialog({
      operatorName: companyName(),
      reportingYear,
      blockNumber,
      file: fileAttachment,
      fileUrl,
    })
  }

  const actions = []
  actions.push(
    <div>
      <Button flat className="md-text--secondary" onClick={onHideDialog}>
        DISCARD
      </Button>
      <Button
        flat
        primary
        disabled={validDialog()}
        onClick={submitCreateProposal}
      >
        SUBMIT
      </Button>
    </div>,
  )

  const onDelete = (file) => {
    const newFiles = files.filter((item) => item.name !== file.name)
    setFiles(newFiles)
  }
  const renderListOfFiles = () => {
    return (
      files &&
      files.map((file, index) => {
        return (
          <File key={index} file={file} onDelete={(file) => onDelete(file)} />
        )
      })
    )
  }
  const uploadFiles = (fileUploaded) => {
    setFileAttachment(fileUploaded[0])

    uploadFileTus(fileUploaded[0], uploadToken?.token).then((res) => {
      if (res.url) {
        setFileUrl(get(res, 'url', ''))
      }
    })
    setFiles(fileUploaded)
  }

  const displayDate = (
    canDisplay,
    setCanDisplay,
    placeholder,
    value,
    setValue,
  ) => {
    return (
      <>
        <TextField
          id={placeholder}
          required
          label={placeholder}
          className="newAnnualPlan-textField md-cell md-cell--6"
          rightIcon={<FontIcon>today</FontIcon>}
          onChange={setValue}
          onClick={() => setCanDisplay(true)}
          value={value ? new Date(value).getFullYear() : ''}
        />
        {canDisplay ? (
          <div className="layover">
            {' '}
            <DatePicker
              singlePick
              translation={{ update: 'select' }}
              onUpdate={(date) => {
                setValue(date.timestamp)
                setCanDisplay(false)
              }}
              minValidDate={{ timestamp: new Date().getTime() }}
              onCancel={() => setCanDisplay(false)}
              startView="year"
              endView="year"
            />{' '}
          </div>
        ) : (
          ''
        )}
      </>
    )
  }
  return (
    <DialogContainer
      id="newAnnualPlan-dialog"
      title={'Create New Annual Plan'}
      className="newAnnualPlan"
      visible={visible}
      onHide={onHideDialog}
      actions={actions}
    >
      <div className="newAnnualPlan-dialog-body">
        <div className="md-grid">
          <SelectField
            id="Company Name"
            label={'Company Name'}
            className="newAnnualPlan-selectFields md-cell md-cell--12"
            value={operatorName}
            menuItems={meCompanies}
            onChange={setOperatorName}
            position={SelectField.Positions.BELOW}
            itemLabel="Name"
            itemValue="ID"
            block
            required
            simplifiedMenu={false}
          />
          <SelectField
            id="Block Number"
            label={'Block Number'}
            className="newAnnualPlan-selectFields md-cell md-cell--6"
            value={blockNumber}
            position={SelectField.Positions.BELOW}
            block
            menuItems={renderBlocs()}
            onChange={setBlockNumber}
            simplifiedMenu={false}
            required
            disabled={!operatorName}
          />

          {displayDate(
            displayReportingYear,
            setDisplayReportingYear,
            'Reporting Year',
            reportingYear,
            setReportingYear,
          )}
          <Dropzone
            className="newAnnualPlan-details-download"
            onDrop={(acceptedFiles) => uploadFiles(acceptedFiles)}
          >
            {({ getRootProps, getInputProps }) => (
              <div
                className="newAnnualPlan_dropZone md-cell md-cell--12"
                {...getRootProps()}
              >
                <input {...getInputProps()} />
                <div className="newAnnualPlan_dropZone_content">
                  <p>Attach Related Documents</p>
                  <FontIcon>save_alt</FontIcon>
                </div>
              </div>
            )}
          </Dropzone>
          <div className="newAnnualPlan-fileWrapper md-grid">
            {renderListOfFiles()}
          </div>
        </div>
      </div>
    </DialogContainer>
  )
}

export default graphql(meOrganizations, {
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
})(
  mutate({
    moduleName: 'block',
    mutations: { getBlocksList },
  })(CreateNewAnnualPlan),
)

// export default compose(
//   graphql(meOrganizations, {
//     options: () => {
//       return {
//         notifyOnNetworkStatusChange: true,
//         context: {
//           uri: `${PRODUCT_WORKSPACE_URL}/graphql`,
//         },
//       }
//     },

//     props: ({ data }) => {
//       return { meCompanies: get(data, 'meOrganizations', []) }
//     },
//   }),
// )(
//   mutate({
//     moduleName: 'block',
//     mutations: { getBlocksList },
//   })(CreateNewAnnualPlan),
// )
