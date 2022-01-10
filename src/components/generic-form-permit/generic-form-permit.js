import { useState, useRef } from 'react'
import {
  TextField,
  Checkbox,
  SelectField,
  FontIcon,
  CircularProgress,
  Portal,
} from 'react-md'
import Dropzone from 'react-dropzone'
import { DatePicker } from '@target-energysolutions/date-picker'
import moment from 'moment'

// import { uploadFileTus } from 'libs/api/tus-upload'
import { fileManagerUpload } from 'libs/api/api-file-manager'
import { renderFiles } from 'components/render-files'

import uploadIcon from './upload.png'

import './style.scss'

const GenericForm = ({ fields }) => {
  const [loading, setLoading] = useState(false)
  const [datePickerState, setDatePickerState] = useState(false)
  const [files, setFiles] = useState({})

  const uploadFiles = (allFiles, nodeId) => {
    setLoading(true)

    fileManagerUpload(allFiles).then((res) => {
      setFiles({ ...files, [nodeId]: [...res.files] })
      setLoading(false)
    })
    /* let newFiles = []
    setLoading(true)
    Promise.all(
      allFiles.map((file) =>
        uploadFileTus(
          file,
          null,
          (res) => {
            newFiles = [
              ...newFiles,
              {
                id: res?.url,
                url: res?.url,
                size: res?.file?.size,

                filename: res?.file?.name,
                contentType: res?.file?.type,
              },
            ]
          },
          true,
        ),
      ),
    ).then(() => {
      setFiles([...newFiles])
      setLoading(false)
    }) */
  }
  const createDropzone = (field) => {
    const inputRef = useRef()
    const onDrop = (uploadedFiles) => {
      uploadFiles(uploadedFiles, field?.id, files)
    }
    inputRef.current = onDrop
    return (
      <>
        <div className="title">{field.title}</div>
        <Dropzone
          ref={inputRef}
          id={field?.id}
          disabled={loading}
          onDrop={inputRef.current}
          accept="application/pdf"
        >
          {({ getRootProps, getInputProps }) => (
            <div
              className={`file-upload ${field.cellWidth}`}
              {...getRootProps()}
            >
              <img src={uploadIcon} />
              <input {...getInputProps()} />
              {!files.length && (
                <p>
                  {'Drag the file here or'}{' '}
                  <span
                    className="dropzone-wrapper-blue-text"
                    onClick={(e) => {}}
                  >
                    {'click to upload'}
                  </span>
                </p>
              )}
              {files?.[field?.id] && (
                <p>{files?.[field?.id]?.length} uploaded</p>
              )}
            </div>
          )}
        </Dropzone>
        {files && renderFiles(files?.[field?.id], setFiles)}
      </>
    )
  }
  const renderFields = () =>
    fields.map((field) => {
      switch (field.input) {
        case 'checkbox':
          return (
            <Checkbox
              id={field.id}
              className={`${field.cellWidth} checkBox `}
              required={field.required}
              label={field.title}
              onChange={field?.onChange}
              checked={field?.value}
            />
          )
        case 'select':
          return (
            <SelectField
              id={field.id}
              className={`${field.cellWidth} field selectField`}
              required={field.required}
              menuItems={field.menuItems}
              position={SelectField.Positions.BELOW}
              sameWidth
              placeholder={field.title}
              block
              onChange={field?.onChange}
              value={field?.value}
            />
          )
        case 'date':
          return (
            <>
              <TextField
                id={field.id}
                rows={field.rows}
                className={`${field.cellWidth} field`}
                rightIcon={<FontIcon>date_range</FontIcon>}
                required={field.required}
                placeholder={field.title}
                block
                onChange={field?.onChange}
                value={
                  field?.value &&
                  `${moment(new Date(field?.value)).format('DD/MM/YYYY')} `
                }
                onClick={() => setDatePickerState(true)}
              />
              {datePickerState && (
                <Portal
                  visible={datePickerState}
                  className="upload-permit-dialog-date"
                  lastChild={true}
                >
                  <DatePicker
                    singlePick
                    startView="year"
                    endView="day"
                    defaultView="day"
                    translation={{ update: 'select' }}
                    onUpdate={(date) => {
                      field.onChange(date.timestamp)
                      setDatePickerState(false)
                    }}
                    onCancel={() => setDatePickerState(false)}
                  />
                </Portal>
              )}
            </>
            // <DatePicker
            //   id={field.id}
            //   className={`${field.cellWidth} field datePicker`}
            //   required={field.required}
            //   placeholder={field.title}
            //   icon={false}
            //   rightIcon={<FontIcon className="mdi mdi-calendar" />}
            //   block
            // />
          )

        case 'textArea':
          return (
            <TextField
              id={field.id}
              rows={field.rows}
              className={`${field.cellWidth} field`}
              required={field.required}
              placeholder={field.title}
              block
              onChange={field?.onChange}
              value={field?.value}
              type={field.type === 'double' ? 'number' : null}
            />
          )
        case 'fileInput':
          return createDropzone(field)
        default:
          return (
            <TextField
              id={field.id}
              className={`${field.cellWidth} field`}
              required={field.required}
              placeholder={field.title}
              block
              onChange={field?.onChange}
              value={field?.value}
              type={field.type === 'double' ? 'number' : null}
            />
          )
      }
    })

  return (
    <div className="md-grid genericForm">
      {renderFields()}
      {loading && (
        <div className="loading">
          <CircularProgress />
        </div>
      )}
    </div>
  )
}
export default GenericForm
