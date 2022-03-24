import {
  DialogContainer,
  FontIcon,
  Button,
  CircularProgress,
  TextField,
} from 'react-md'
import { useDropzone } from 'react-dropzone'
import { useState } from 'react'

import { fileManagerUpload } from 'libs/api/api-file-manager'

import uploadIcon from './upload-icon.svg'

import './style.scss'

const UploadDrillingFileDialog = ({
  title,
  visible,
  onHide,
  onUploadTemplate,
  setFileList,
  filesList,
  uploadLabel = 'Attach Spreadsheet',
}) => {
  const [fileLoader, setFileLoader] = useState(false)

  const [reportData, setReportData] = useState({})

  const onUpload = (file) => {
    setFileLoader(true)
    fileManagerUpload(file).then((res) => {
      setReportData({ ...reportData, file: res.files[0] })
      setFileLoader(false)
      setFileList(file[0])
    })

    // setReportData({ ...reportData, file })
  }
  const { getRootProps, getInputProps } = useDropzone({
    accept:
      'application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    onDrop: onUpload,
  })
  const isValidData = () => {
    if (reportData?.file) {
      return true
    }
    return false
  }
  const actions = [
    {
      children: 'Discard',
      primary: false,
      flat: true,
      swapTheming: true,
      onClick: () => onHide && onHide(),
    },
    {
      children: 'Upload Template',
      primary: false,
      flat: true,
      swapTheming: true,
      disabled: !isValidData(),
      onClick: () => onUploadTemplate(reportData),
    },
  ]

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
        <TextField
          key={1}
          className="upload-report-dialog-textField md-cell md-cell--12"
          label="Title"
          onChange={(v) => setReportData({ ...reportData, title: v })}
          value={reportData?.title}
          block
        />
        <div className="upload-report-dialog-subtitle md-cell md-cell--12">
          {uploadLabel}
        </div>
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
                // onDisplayMHT && setFileList({})
              }}
            >
              delete_outline
            </Button>
          </div>
        )}
      </div>
    </DialogContainer>
  )
}

export default UploadDrillingFileDialog
