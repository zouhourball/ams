import { useState } from 'react'
import {
  TextField,
  Checkbox,
  SelectField,
  FontIcon,
  CircularProgress,
  Portal,
  // Autocomplete,
  // Button,
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
  /* const [language, setLanguage] = useState(false)
  // const [files, setFiles] = useState({})
  const insertChipFromAutocomplete = (suggestion, suggestionIndex, matches) => {
    const suggestionObject = matches[suggestionIndex]
    setLanguage(suggestionObject.autoLabel)
  }
  const getAllLanguages = (languagesList) => {
    if (languagesList && languagesList.length > 0) {
      const cleanDataObject = languagesList.map((elem) => {
        return { autoLabel: elem.name, autoValue: elem.id }
      })
      return cleanDataObject
      // let yFilter = skillsAdded
      /* filteredX = cleanDataObject.filter(
        itemX => !yFilter.includes(itemX.autoLabel),
      )
      return filteredX
    } else {
      return []
    }
    }
  } */
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
          /* case 'autocomplete':
          return (
            <div className="requiredLanguages-autocomplete">
              <Autocomplete
                focusInputOnAutocomplete
                simplifiedMenu={false}
                listHeightRestricted
                id={'autocomplete-suggestion'}
                className="addSkillDialog-textField addLanguagesTextField"
                filter={Autocomplete.caseInsensitiveFilter}
                placeholder={'add_languages'}
                data={[]/* getAllLanguages(field?.menuItems).filter(
                  (v) =>
                    !requiredLanguages.map((i) => i.name).includes(v.autoLabel),
                ) } */
          /* value={language}
                dataValue={'autoValue'}
                dataLabel={'autoLabel'}
                onChange={setLanguage}
                onAutocomplete={(suggestion, suggestionIndex, matches) => {
                  insertChipFromAutocomplete(
                    suggestion,
                    suggestionIndex,
                    matches,
                  )
                }}
                rightIcon={
                  <Button
                    flat
                    primary
                    disabled={!language || !isNaN(language)}
                    onClick={(e) => {
                      e.stopPropagation()
                      /* field?.menuItems?.find((lg) => lg.name === language) &&
                        field?.onChange() */
          /* onEditDetails('requiredLanguages', [
                          ...requiredLanguages,
                          field?.menuItems?.find((lg) => lg.name === language),
                        ]) */
        /* console.log('hello')
                      setLanguage('')
                    }}
                    className={`add_skill_Button ${
                      !language || !isNaN(language) ? 'disabled' : ''
                    }`}
                  >
                    {'add_lang'}
                  </Button>
                }
              />
              <div className="requiredLanguages-autocomplete-languageWrapper">
                {/* requiredLanguages &&
                  requiredLanguages.map((lang, index) => (
                    <span key={index} className="chip">
                      <span className="chip-label">{lang.name}</span>
                      <Button
                        icon
                        onClick={() => {
                          onEditDetails('requiredLanguages', [
                            ...requiredLanguages.filter(
                              (lg) => lg.id !== lang.id,
                            ),
                          ])
                        }}
                      >
                        close
                      </Button>
                    </span>
                      )) }
              </div>
            </div>
          ) */
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
