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

import { uploadFileTus } from 'libs/api/tus-upload'
import { renderFiles } from 'components/render-files'

import uploadIcon from './upload.png'

import './style.scss'

const GenericForm = ({ fields }) => {
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(false)
  const [datePickerState, setDatePickerState] = useState(false)

  const uploadFiles = (allFiles) => {
    let newFiles = []
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
    })
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
          return (
            <>
              <div className="title">{field.title}</div>
              <Dropzone
                disabled={loading}
                onDrop={(files) => {
                  uploadFiles(files)
                }}
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
                    {files.length > 0 && <p>{files.length} uploaded</p>}
                  </div>
                )}
              </Dropzone>
              {files && renderFiles(files, setFiles)}
              {loading && (
                <div className="loading">
                  <CircularProgress />
                </div>
              )}
            </>
          )
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

  return <div className="md-grid genericForm">{renderFields()}</div>
}
export default GenericForm
GenericForm.defaultProps = {
  fields: [
    {
      id: 'date',
      title: 'date',
      cellWidth: 'md-cell md-cell--6',
      input: 'date',
      required: true,
    },
    {
      id: 'select',
      title: 'select',
      cellWidth: 'md-cell md-cell--6',
      input: 'select',
      menuItems: ['item1', 'item2', 'item3', 'item4'],
    },
    {
      id: '1',
      title: 'one',
      cellWidth: 'md-cell md-cell-4',
      input: 'textField',
      required: true,
    },
    {
      id: '2',
      title: 'two',
      cellWidth: 'md-cell md-cell--4',
      input: 'checkbox',
    },
    {
      id: '3',
      title: 'three',
      cellWidth: 'md-cell md-cell--4',
      input: 'select',
      menuItems: ['item1', 'item2', 'item3', 'item4'],
    },
    {
      id: '4',
      title: 'four',
      cellWidth: 'md-cell md-cell--4',
      input: 'date',
      required: true,
    },
    {
      id: '5',
      title: 'five',
      cellWidth: 'md-cell md-cell--4',
      input: 'textField',
    },
    {
      id: '6',
      title: 'six',
      cellWidth: 'md-cell md-cell--4',
      input: 'textField',
    },
    {
      id: '7',
      title: 'seven',
      cellWidth: 'md-cell md-cell--12',
      rows: 5,
      input: 'textArea',
    },
    {
      id: '8',
      title: 'eight',
      cellWidth: 'md-cell md-cell--12',
      rows: 5,
      input: 'fileInput',
    },
  ],
}
