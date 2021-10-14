import { useState } from 'react'
import { FontIcon, Button } from 'react-md'
import Dropzone from 'react-dropzone'

import { uploadFileTus } from 'libs/api/tus-upload'

import './style.scss'

const SupportedDocument = ({ oldFiles, onDiscard, onSaveUpload, accept, isLoading }) => {
  const [files, setFiles] = useState(oldFiles)
  const [filesToDelete, setFilesToDelete] = useState([])

  // useEffect(() => {
  //   if (oldFiles && oldFiles.length > 0) { setFiles([...files, ...oldFiles]) }
  // }, [oldFiles])

  const onUpload = documents => {
    let newFiles = []
    Promise.all(
      documents.map(document =>
        uploadFileTus(
          document,
          null,
          res => {
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
      setFiles([...files, ...newFiles])
    })
  }

  const customIncludes = (fileName) => {
    const extension = fileName && fileName?.split('.').reverse()[0]
    switch (extension) {
      case 'jfif':
      case 'jpg':
      case 'png':
      case 'svg':
      case 'jpeg':
      case 'gif':
        return `mdi mdi-file-image mdi-36px`
      case 'xlsx':
      case 'xlsm':
      case 'xml':
        return `mdi mdi-file-excel mdi-36px`
      case 'doc':
      case 'docx':
        return `mdi mdi-file-word mdi-36px`
      case 'pdf':
        return `mdi  mdi-file-pdf mdi-36px`
      case 'zip':
        return `mdi mdi-zip-box mdi-36px`
      case 'html':
        return `mdi mdi-language-html5 mdi-36px`
      case 'js':
        return `mdi mdi-language-javascript mdi-36px`
      default:
        return `mdi mdi-file mdi-36px`
    }
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    if (bytes === '') return '-'
    const k = 1000
    const sizes = ['Bytes', 'Kb', 'Mb', 'Gb', 'Tb', 'Pb', 'Eb', 'Zb', 'Yb']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const renderFiles = () => {
    return (
      files?.map((file) => {
        return (
          <div className="file" key={file.id}>
            {
              !filesToDelete.includes(file.id) &&
              <><div className="file-data">
                <FontIcon
                  icon
                  iconClassName={customIncludes(file.filename)}
                />
                <div className="file-details">
                  <span>{file.filename}</span>
                  <span>{formatFileSize(file.size)}</span>
                </div>

              </div>

                <FontIcon onClick={() => {
                  setFilesToDelete([...filesToDelete, file.id])
                }}>delete</FontIcon>
              </>
            }
          </div>
        )
      }))
  }

  return (
    <div className="supported-document">
      <div className="supported-document-header">
        <h2>Upload Supporting Documents</h2>
      </div>
      <div className="supported-document-body">
        <Dropzone
          onDrop={onUpload}
          accept={accept}
          multiple={true}
          className="dropzone-logo"
        >

          {({ getRootProps, getInputProps }) => (
            <section className="supported-document-body-dropzone">
              <div className="input-zone" {...getRootProps()}>
                <input {...getInputProps()} />
                <FontIcon className="delete-icon">file_upload</FontIcon>
                <p>Drag & Drop file here or <b>Select File</b></p>
              </div>
            </section>
          )}
        </Dropzone>
        {renderFiles()}
      </div>
      <div className="supported-document-footer">
        <Button
          flat
          className="discard-btn"
          onClick={onDiscard}
        >
          Discard
        </Button>
        <Button
          flat
          swapTheming
          primary
          className="save-btn"
          onClick={onSaveUpload(
          files?.filter(file =>
            !filesToDelete.map(fileToDelete => fileToDelete)?.includes(file?.id),
          ),
          filesToDelete,
          )}
        >
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