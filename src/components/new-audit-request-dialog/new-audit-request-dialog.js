import {
  DialogContainer,
  TextField,
  FontIcon,
  Button,
  CircularProgress,
} from 'react-md'
import { useDropzone } from 'react-dropzone'
import { useState } from 'react'
import { DatePicker } from '@target-energysolutions/date-picker'
import moment from 'moment'
import { get } from 'lodash-es'

import { fileManagerUpload } from 'libs/api/api-file-manager'

import uploadIcon from './upload-icon.svg'

import HtmlEditor from 'components/html-editor'

import './style.scss'

const NewAuditRequestDialog = ({ title, visible, onHide, onSave }) => {
  const [files, setFiles] = useState([])
  const [fileLoader, setFileLoader] = useState(false)
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [auditData, setAuditData] = useState({})

  const onUploadDocument = (file) => {
    setFileLoader(true)
    fileManagerUpload(file).then((res) => {
      setFiles([...files, ...res.files])
      setFileLoader(false)
    })
  }
  const {
    getRootProps: getOptionalRootProps,
    getInputProps: getOptionalInputProps,
  } = useDropzone({
    /* accept:
      'application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', */
    onDrop: onUploadDocument,
  })
  const uploadBtn = {
    children: 'Submit',
    primary: true,
    flat: true,

    onClick: () => {
      onSave({ ...auditData, files })
      onHide()
    },
  }
  const actions = [
    {
      children: 'Discard',
      primary: false,
      flat: true,
      swapTheming: true,
      onClick: () => onHide && onHide(),
    },
    ...uploadBtn,
  ]

  const renderDocumentIcon = (extension) => {
    const image = ['png', 'jpeg', 'jpg']
    if (extension === 'doc') {
      return <FontIcon icon iconClassName={`mdi mdi-office mdi-36px`} />
    }
    if (extension === 'pdf') {
      return <FontIcon icon iconClassName={`mdi mdi-file-pdf mdi-36px`} />
    }
    if (extension === 'zip') {
      return <FontIcon icon iconClassName={`mdi mdi-zip-box mdi-36px`} />
    }
    if (extension === 'js') {
      return (
        <FontIcon icon iconClassName={`mdi mdi-language-javascript mdi-36px`} />
      )
    }
    if (image.includes(extension)) {
      return <FontIcon icon iconClassName={`mdi mdi-file-image mdi-36px`} />
    }
    if (
      [
        'xlsx',
        'xls',
        'vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      ].includes(extension)
    ) {
      return (
        <FontIcon
          icon
          iconClassName={`mdi mdi-file-excel mdi-36px`}
          className="color-mdi-xls"
        />
      )
    }
    if (extension === 'html') {
      return <FontIcon icon iconClassName={`mdi mdi-language-html5 mdi-36px`} />
    } else {
      return <FontIcon icon iconClassName={`mdi mdi-file mdi-36px`} />
    }
  }
  return (
    <DialogContainer
      id="new-audit-request-dialog"
      className="new-audit-request-dialog"
      visible={visible}
      onHide={onHide}
      title={title}
      actions={actions}
    >
      <div className="md-grid">
        <TextField
          label="Title"
          id="title-id"
          onChange={(v) => setAuditData({ ...auditData, title: v })}
          value={auditData?.title}
          className="new-audit-request-dialog-textField md-cell md-cell--12"
        />
        <TextField
          label="Purpose"
          id="purpose-id"
          onChange={(v) => setAuditData({ ...auditData, purpose: v })}
          value={auditData?.purpose}
          className="new-audit-request-dialog-textField md-cell md-cell--12"
        />
        <TextField
          label="Scope"
          id="scope-id"
          onChange={(v) => setAuditData({ ...auditData, scope: v })}
          value={auditData?.scope}
          className="new-audit-request-dialog-textField md-cell md-cell--12"
        />

        <div className="md-cell md-cell--12">
          <TextField
            placeholder={'Reference Date'}
            value={moment(
              new Date(auditData?.deliverablesData?.timestamp),
            ).format('ll')}
            className="new-audit-request-dialog-text"
            onChange={() => {}}
            block
            rightIcon={<FontIcon iconClassName="mdi mdi-calendar" />}
            onClick={() => setShowDatePicker(true)}
          />
          {showDatePicker && (
            <DatePicker
              singlePick
              translation={{ update: 'select' }}
              onUpdate={(date) => {
                setAuditData({ ...auditData, deliverablesData: date })
                setShowDatePicker(false)
              }}
              onCancel={() => setShowDatePicker(false)}
              startView="year"
              endView="day"
            />
          )}
        </div>
        <div className="md-cell md-cell--12">
          <HtmlEditor
            key={'description'}
            value={auditData?.description}
            onChange={(data) =>
              setAuditData({ ...auditData, description: data })
            }
            customToolbar={{
              options: [
                'inline',
                'list',
                'textAlign',
                'link',
                'fontSize',
                'fontFamily',
                'blockType',
                'image',
                'remove',
                'history',
              ],
              inline: { inDropdown: true },
              list: { inDropdown: true },
              textAlign: { inDropdown: true },
              link: { inDropdown: true },
              history: { inDropdown: true },
            }}
          />
        </div>
        <div className="new-audit-request-dialog-subtitle md-cell md-cell--12">
          Attach Supporting Documents
        </div>

        <>
          {fileLoader ? (
            <CircularProgress />
          ) : (
            <div
              {...getOptionalRootProps({
                className:
                  'new-audit-request-dialog-fileDropZone md-cell md-cell--12',
              })}
            >
              <input {...getOptionalInputProps()} multiple />
              <img src={uploadIcon} width="20px" />
              <p>
                Drag & Drop file here or <b>Select File</b>
              </p>
            </div>
          )}
          {files?.map((file) => (
            <div
              key={file.id}
              className={`new-audit-request-dialog-file md-cell md-cell--12`}
            >
              {file && file.filename
                ? renderDocumentIcon(file.filename.split('.')[1])
                : ''}

              <div className="file-info">
                <div className="file-name"> {get(file, 'filename', '')} </div>
                <div className="file-size"> {get(file, 'size', '')} </div>
              </div>
              <Button
                icon
                className="actionButton"
                iconClassName="mdi mdi-delete"
                onClick={() => {
                  setFiles(files.filter((el) => el?.id !== file.id))
                }}
              />
            </div>
          ))}
        </>
      </div>
    </DialogContainer>
  )
}

export default NewAuditRequestDialog
NewAuditRequestDialog.defaultProps = {
  title: 'Upload Monthly HSSE Report',
  blockList: [],
}
