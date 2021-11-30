import {
  DialogContainer,
  TextField,
  SelectField,
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

import './style.scss'

const UploadReportDialog = ({
  title,
  blockList,
  TypeList,
  visible,
  onHide,
  onSave,
  optional,
  hideDate,
  onDisplayMHT,
  setFileList,
  filesList,
  hideBlock,
  ReportingType,
}) => {
  const fileLoader = false
  const [optionalFiles, setOptionalFile] = useState([])
  const [optionalFileLoader, setOptionalFileLoader] = useState(false)
  const [showDatePickerEnd, setShowDatePickerEnd] = useState(false)
  const [reportData, setReportData] = useState({
    referenceDate: new Date(),
  })
  const onUpload = (file) => {
    // setFileLoader(true)
    // fileManagerUpload(file).then((res) => {
    //   // onDisplayMHT
    //   //   ? onDisplayMHT(...res.files)
    //   setFile([file])
    // setFileLoader(false)
    // })
    /*
    onDisplayMHT ? onDisplayMHT(...file) : setFileList([...file[0]])
    setFileList({ ...file[0] }) */
    // onSave({ ...reportData, file, optionalFiles })
    setFileList(file[0])
    setReportData({ ...reportData, file })
  }
  const { getRootProps, getInputProps } = useDropzone({
    accept:
      'application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    onDrop: onUpload,
  })
  const onUploadOptional = (file) => {
    setOptionalFileLoader(true)
    fileManagerUpload(file).then((res) => {
      setOptionalFile([...optionalFiles, ...res.files])
      setOptionalFileLoader(false)
    })
  }
  const {
    getRootProps: getOptionalRootProps,
    getInputProps: getOptionalInputProps,
  } = useDropzone({
    accept:
      'application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    onDrop: onUploadOptional,
  })
  const actions = [
    {
      children: 'Discard',
      primary: false,
      flat: true,
      swapTheming: true,
      onClick: () => onHide && onHide(),
    },
    {
      children: 'Upload',
      primary: true,
      flat: true,
      swapTheming: true,
      onClick: () => {
        onSave({ ...reportData, filesList, optionalFiles })
        onHide()
      },
    },
  ]
  /* const renderDocumentIcon = (extension) => {
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
    if (extension === 'html') {
      return <FontIcon icon iconClassName={`mdi mdi-language-html5 mdi-36px`} />
    } else {
      return <FontIcon icon iconClassName={`mdi mdi-file mdi-36px`} />
    }
  } */
  return (
    <DialogContainer
      id="import-report-dialog"
      className="upload-report-dialog"
      visible={visible}
      onHide={onHide}
      title={title}
      actions={actions}
    >
      <div className="md-grid">
        {!hideBlock && (
          <SelectField
            className={`upload-report-dialog-selectField ${
              hideDate ? 'md-cell md-cell--12' : 'md-cell md-cell--6'
            } `}
            id="block"
            placeholder={'Select Block'}
            menuItems={blockList}
            position={SelectField.Positions.BELOW}
            value={reportData?.block}
            onChange={(v) => setReportData({ ...reportData, block: v })}
            simplifiedMenu={false}
          />
        )}
        {ReportingType && (
          <SelectField
            className={`upload-report-dialog-selectField ${
              hideDate ? 'md-cell md-cell--12' : 'md-cell md-cell--6'
            } `}
            id="type"
            placeholder={'Reporting Type'}
            menuItems={TypeList}
            position={SelectField.Positions.BELOW}
            value={reportData?.type}
            onChange={(v) => setReportData({ ...reportData, type: v })}
            simplifiedMenu={false}
          />
        )}
        {!hideDate && (
          <TextField
            placeholder={'Reference Date'}
            value={
              reportData?.referenceDate?.timestamp
                ? moment(+reportData?.referenceDate?.timestamp).format('ll')
                : moment(new Date(reportData?.referenceDate)).format('ll')
            }
            className="upload-report-dialog-text md-cell md-cell--6"
            onChange={() => {}}
            block
            rightIcon={<FontIcon iconClassName="mdi mdi-calendar" />}
            onClick={() => setShowDatePickerEnd(true)}
          />
        )}
        {showDatePickerEnd && (
          <DatePicker
            singlePick
            translation={{ update: 'select' }}
            onUpdate={(date) => {
              setReportData({ ...reportData, referenceDate: date })
              setShowDatePickerEnd(false)
            }}
            onCancel={() => setShowDatePickerEnd(false)}
            // minValidDate={{
            //   timestamp: reportData?.referenceDate?.timestamp
            //     ? reportData?.referenceDate?.timestamp
            //     : new Date().getTime(),
            // }}
            startView="year"
            endView="day"
          />
        )}
        <div className="upload-report-dialog-subtitle md-cell md-cell--12">
          Attach Report
        </div>
        {/* <div
          {...getRootProps({
            className: 'upload-report-dialog-fileDropZone md-cell md-cell--12',
          })}
        >
          <input {...getInputProps()} />
          <img src={uploadIcon} width="20px" />
          <p>
            Drag & Drop file here or <b>Select File</b>
          </p>
        </div>
        {filesList?.name && (
          <div
            key={filesList.name}
            className={`upload-report-dialog-file md-cell md-cell--12`}
          >
            {/* filesList && filesList?.name
              ? renderDocumentIcon(filesList.name.split('.')[1])
            : '' */}
        {fileLoader ? (
          <CircularProgress />
        ) : (
          <div
            {...getRootProps({
              className:
                'upload-report-dialog-fileDropZone md-cell md-cell--12',
            })}
          >
            <input {...getInputProps()} multiple />
            <img src={uploadIcon} width="20px" />
            <p>
              Drag & Drop file here or <b>Select File</b>
            </p>
          </div>
        )}
        {filesList?.name && (
          <div
            key={filesList.name}
            className={`upload-report-dialog-file md-cell md-cell--12`}
          >
            <FontIcon icon iconClassName={`mdi mdi-file-excel mdi-36px`} />
            <div className="file-info">
              <div className="file-name"> {filesList.name} </div>
              <div className="file-size"> {filesList.size} </div>
            </div>
            <Button
              icon
              className="actionButton"
              onClick={() => {
                // onDisplayMHT && setFileList({})
                // setFile(files.filter((el) => el?.id !== file.id))
                onDisplayMHT && setFileList({})
              }}
            >
              delete_outline
            </Button>
          </div>
        )}
        {optional && (
          <>
            <div className="upload-report-dialog-subtitle md-cell md-cell--12">
              {optional}
            </div>
            {optionalFileLoader ? (
              <CircularProgress />
            ) : (
              <div
                {...getOptionalRootProps({
                  className:
                    'upload-report-dialog-fileDropZone md-cell md-cell--12',
                })}
              >
                <input {...getOptionalInputProps()} multiple />
                <img src={uploadIcon} width="20px" />
                <p>
                  Drag & Drop file here or <b>Select File</b>
                </p>
              </div>
            )}
            {optionalFiles?.map((file) => (
              <div
                key={file.id}
                className={`upload-report-dialog-file md-cell md-cell--12`}
              >
                <div className="file-info">
                  <div className="file-name"> {get(file, 'filename', '')} </div>
                  <div className="file-size"> {get(file, 'size', '')} </div>
                </div>
                <Button
                  icon
                  className="actionButton"
                  iconClassName="mdi mdi-delete"
                  onClick={() => {
                    setOptionalFile(
                      optionalFiles.filter((el) => el?.id !== file.id),
                    )
                  }}
                />
              </div>
            ))}
          </>
        )}
      </div>
    </DialogContainer>
  )
}

export default UploadReportDialog
UploadReportDialog.defaultProps = {
  title: 'Upload Monthly HSSE Report',
  blockList: [],
}
