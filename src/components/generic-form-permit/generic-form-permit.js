import { useState } from 'react'
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
import { renderFiles } from 'components/render-files'

import uploadIcon from './upload.png'

import './style.scss'

const GenericForm = ({ fields }) => {
  const [datePickerState, setDatePickerState] = useState(false)
  const [loading, setLoading] = useState(false)
  // const [files, setFiles] = useState({})

  const createDropzone = (field) => {
    if (field?.loading !== loading) {
      setLoading(field?.loading)
    }
    return (
      <>
        <div className={`title ${field.cellWidth}`}>{field.title}</div>
        <Dropzone
          id={field?.id}
          disabled={field?.loading}
          onDrop={field?.onDrop}
          accept="application/pdf"
        >
          {({ getRootProps, getInputProps }) => (
            <div
              className={`file-upload ${field.cellWidth}`}
              {...getRootProps()}
            >
              <img src={uploadIcon} />
              <input {...getInputProps()} />
              {!field?.value?.length && (
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
              {field?.value && <p>1 uploaded</p>}
            </div>
          )}
        </Dropzone>
        {field?.value && renderFiles([field?.file], field?.setFile)}
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
