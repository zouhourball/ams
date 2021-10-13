import { useEffect, useState } from 'react'
import { FontIcon, Button } from 'react-md'

import Dropzone from 'react-dropzone'

import { fileManagerUpload } from 'libs/api'

import './style.scss'

const SupportedDocument = ({ oldFiles, onDiscard, onSaveUpload, accept, isLoading }) => {
  const [files, setFiles] = useState([])
  const [filesToDelete, setFilesToDelete] = useState([])

  useEffect(() => {
    if (oldFiles && oldFiles.length > 0) { setFiles(...files, oldFiles) }
  }, [oldFiles])

  const onUpload = documents => {
    fileManagerUpload(documents).then(res => {
      if (res?.files) {
        setFiles([...res?.files])
      }
    })
  }

  const renderFiles = () => {
    return (
      files?.map((file) => {
        return (
          <div key={file.id}>
            {
              !filesToDelete.includes(file.id) &&
              <div>
                <FontIcon
                  icon
                  iconClassName={customIncludes(file.filename)}
                />
                <span>{file.filename}</span>
                <span>{file.size}</span>
                <FontIcon onClick={() => {
                  setFilesToDelete([...filesToDelete, file.id])
                }}>delete</FontIcon>
              </div>
            }
          </div>
        )
      }))
  }

  const customIncludes = (fileName) => {
    let extension = fileName && fileName?.split('.').reverse()[0]
    switch (extension) {
      case 'jfif':
      case 'jpg':
      case 'png':
      case 'svg':
      case 'jpeg':
      case 'gif':
        return `mdi mdi-file-image mdi-48px`
      case 'xlsx':
      case 'xlsm':
      case 'xml':
        return `mdi mdi-file-excel mdi-48px`
      case 'doc':
      case 'docx':
        return `mdi mdi-file-word mdi-48px`
      case 'pdf':
        return `mdi  mdi-file-pdf mdi-48px`
      case 'zip':
        return `mdi mdi-zip-box mdi-48px`
      case 'html':
        return `mdi mdi-language-html5 mdi-48px`
      case 'js':
        return `mdi mdi-language-javascript mdi-48px`
      default:
        return `mdi mdi-file mdi-48px`
    }
  }
  console.log(files, 'files')
  return (
    <div className="supported-document">
      <Dropzone
        onDrop ={onUpload}
        accept = {accept}
        multiple = {true}
        className = "dropzone-logo"
      >

        {({ getRootProps, getInputProps }) => (
          <section>
            <div {...getRootProps()}>
              <input {...getInputProps()} />
              <FontIcon>file_upload</FontIcon>
              <p>Drag and drop some files here, or click to select files</p>
            </div>
          </section>
        )}
      </Dropzone>
      {renderFiles()}
      <div className="asset-details-form-footer">
        <Button onClick={onDiscard} flat>
          Discard
        </Button>
        <Button onClick={onSaveUpload(
          files?.filter(file =>
            !filesToDelete.map(fileToDelete => fileToDelete)?.includes(file?.id),
          ),
          filesToDelete,
        )} flat swapTheming primary>
          {isLoading ? <FontIcon primary iconClassName="mdi mdi-spin mdi-loading" /> : 'Upload'}
        </Button>
      </div>
    </div>
  )
}

export default SupportedDocument
SupportedDocument.defaultProps = {
  oldFiles:
    [
      {
        id: '1',
        filename: 'test1.png',
        size: 10,
      },
      {
        id: '2',
        filename: 'test2.png',
        size: 20,
      },
    ],
  accept: '.doc, .docx, image/* , image/jpeg, image/png, image/jpg, application/pdf, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.wordprocessingml.document ',
}