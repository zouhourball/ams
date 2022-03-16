import {
  DialogContainer,
  TextField,
  SelectField,
  FontIcon,
  Button,
  CircularProgress,
} from 'react-md'
import { useDropzone } from 'react-dropzone'
import { useState, useEffect } from 'react'
import { DatePicker } from '@target-energysolutions/date-picker'
import moment from 'moment'
import { get } from 'lodash-es'
import { useQuery } from 'react-query'

import { fileManagerUpload } from 'libs/api/api-file-manager'
import { getDocumentsById } from 'libs/api/supporting-document-api'

import uploadIcon from './upload-icon.svg'

import './style.scss'

const UploadReportByTemplate = ({
  title,
  blockList,
  TypeList,
  visible,
  onHide,
  onSave,
  onUploadTemp,
  optional,
  hideDate = false,
  onDisplayMHT,
  setFileList,
  filesList,
  hideBlock,
  companyList,
  ReportingType,
  previewData,
  productType,
  formatDate = 'day',
  onUpdate,
  uploadLabel = 'Attach Report',
  row,
}) => {
  const [optionalFiles, setOptionalFile] = useState([])
  const [optionalFileLoader, setOptionalFileLoader] = useState(false)
  const [fileLoader, setFileLoader] = useState(false)
  const [showDatePickerEnd, setShowDatePickerEnd] = useState(false)
  const date = new Date()
  const monthAndDay =
    formatDate === 'day'
      ? {
        month: date.getMonth() + 1,
        day: date.getDate(),
      }
      : formatDate === 'month'
        ? {
          month: date.getMonth() + 1,
        }
        : {}
  const setDate = !hideDate && {
    referenceDate: previewData
      ? moment(previewData?.referenceDate.toString()).valueOf()
      : {
        year: date.getFullYear(),
        ...monthAndDay,
        timestamp: date.getTime(),
      },
  }
  const [reportData, setReportData] = useState({
    ...setDate,
    block: previewData?.block,
  })

  const { data: suppDocsFiles } = useQuery(
    ['getDocumentsById', previewData?.processInstanceId],
    previewData && previewData?.processInstanceId && getDocumentsById,
  )

  useEffect(() => {
    if (suppDocsFiles && suppDocsFiles.length > 0) {
      setOptionalFile([...suppDocsFiles])
    }
  }, [suppDocsFiles])

  const validData = () => {
    return !(reportData?.file && reportData?.referenceDate && reportData?.block)
  }

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
    /* accept:
      'application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', */
    onDrop: onUploadOptional,
  })
  const uploadBtn = {
    children: row?.id ? 'Update ' : 'Upload',
    primary: true,
    flat: true,
    swapTheming: !validData(),
    disabled: validData(),

    onClick: () => {
      onSave({ ...reportData, filesList, optionalFiles })
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
    {
      children: 'Upload Template',
      primary: false,
      flat: true,
      swapTheming: true,
      onClick: () => onUploadTemp(reportData),
    },
    ...uploadBtn,
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
        {!hideBlock && (
          <SelectField
            className={`upload-report-dialog-selectField ${
              hideDate
                ? companyList
                  ? 'md-cell md-cell--6'
                  : 'md-cell md-cell--12'
                : 'md-cell md-cell--6'
            } `}
            id="block"
            placeholder={'Select Block'}
            menuItems={blockList}
            position={SelectField.Positions.BELOW}
            value={reportData?.block}
            onChange={(v) => setReportData({ ...reportData, block: v })}
            simplifiedMenu={false}
            // disabled={!!previewData}
          />
        )}

        {companyList && (
          <SelectField
            className={`upload-report-dialog-selectField md-cell md-cell--6`}
            id="block"
            placeholder={'Select Company'}
            menuItems={companyList}
            position={SelectField.Positions.BELOW}
            value={reportData?.company}
            onChange={(v) => setReportData({ ...reportData, company: v })}
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
        <div className="md-cell md-cell--6">
          {!hideDate && (
            <TextField
              placeholder={'Reference Date'}
              value={
                reportData?.referenceDate?.timestamp
                  ? formatDate === 'year'
                    ? moment(+reportData?.referenceDate?.timestamp).format(
                      'YYYY',
                    )
                    : formatDate === 'month'
                      ? moment(+reportData?.referenceDate?.timestamp).format(
                        'MM, YYYY',
                      )
                      : moment(+reportData?.referenceDate?.timestamp).format('ll')
                  : formatDate === 'year'
                    ? moment(reportData?.referenceDate.timestamp).format('YYYY')
                    : formatDate === 'month'
                      ? moment(new Date(reportData?.referenceDate)).format(
                        'MM, YYYY',
                      )
                      : moment(new Date(reportData?.referenceDate)).format('ll')
              }
              className="upload-report-dialog-text"
              onChange={() => {}}
              block
              rightIcon={<FontIcon iconClassName="mdi mdi-calendar" />}
              onClick={() => !previewData && setShowDatePickerEnd(true)}
              // disabled={!!previewData}
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
              endView={formatDate} // "day"
            />
          )}
        </div>
        {productType && (
          <SelectField
            className={`upload-report-dialog-selectField md-cell md-cell--12`}
            id="productType"
            placeholder={'Product type'}
            menuItems={productType}
            position={SelectField.Positions.BELOW}
            value={reportData?.hydrocarbonType}
            onChange={(v) =>
              setReportData({ ...reportData, hydrocarbonType: v })
            }
            simplifiedMenu={false}
          />
        )}
        <div className="upload-report-dialog-subtitle md-cell md-cell--12">
          {uploadLabel}
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
                // onDisplayMHT && setFileList({})
              }}
            >
              delete_outline
            </Button>
          </div>
        )}
        {optional && !previewData && (
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

export default UploadReportByTemplate
UploadReportByTemplate.defaultProps = {
  title: 'Upload Monthly HSSE Report',
  blockList: [],
}
