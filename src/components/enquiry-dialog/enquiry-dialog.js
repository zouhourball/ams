import { DialogContainer, FontIcon, Button, CircularProgress } from 'react-md'
import { useDropzone } from 'react-dropzone'
import { useState } from 'react'
import { get } from 'lodash-es'

import { fileManagerUpload } from 'libs/api/api-file-manager'

import uploadIcon from 'images/upload-icon.svg'

import HtmlEditor from 'components/html-editor'

import './style.scss'

const EnquiryDialog = ({
  title,
  visible,
  docLabel,
  btnLabel,
  onHide,
  onSave,
}) => {
  const [files, setFiles] = useState([])
  const [fileLoader, setFileLoader] = useState(false)
  const [description, setDescription] = useState('')

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
  const validateData = () => {
    return !(description /* && files?.length */)
  }
  const uploadBtn = {
    children: btnLabel,
    primary: true,
    flat: true,
    disabled: validateData(),

    onClick: () => {
      onSave(description, files)
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
      id="enquiry-dialog"
      className="enquiry-dialog"
      visible={visible}
      onHide={onHide}
      title={title}
      actions={actions}
    >
      <div className="md-grid">
        <div className="md-cell md-cell--12">
          <HtmlEditor
            key={'description'}
            value={description}
            onChange={(d) => setDescription(d)}
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
        <h4 className="enquiry-dialog-subtitle md-cell md-cell--12">
          {docLabel}
        </h4>

        <>
          {fileLoader ? (
            <CircularProgress />
          ) : (
            <div
              {...getOptionalRootProps({
                className: 'enquiry-dialog-fileDropZone md-cell md-cell--12',
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
              className={`enquiry-dialog-file md-cell md-cell--12`}
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

export default EnquiryDialog
