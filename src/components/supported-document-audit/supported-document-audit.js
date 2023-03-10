import { useState, useEffect } from 'react'
import { FontIcon, Button, DialogContainer } from 'react-md'
import Dropzone from 'react-dropzone'
import { useQuery } from 'react-query'

import documents from 'libs/hooks/documents'

import { fileManagerUpload, getPublicUrl } from 'libs/api/api-file-manager'
// import { getDocumentsById } from 'libs/api/supporting-document-api'

import { getAuditByID } from 'libs/api/api-audit'

import './style.scss'

const SupportedDocumentAudit = ({
  onDiscard,
  onSaveUpload,
  accept,
  isLoading,
  visible,
  title,
  id,
  readOnly,
}) => {
  const [files, setFiles] = useState([])
  const [oldFiles, setOldFiles] = useState([])

  const { deleteDocuments } = documents()

  const [filesToDelete, setFilesToDelete] = useState([])
  // const { data: suppDocsFiles } = useQuery(
  //   ['getDocumentsById', id],
  //   id && getDocumentsById,
  // )
  const { data: auditDetails } = useQuery(
    ['auditDetails', id],
    id && getAuditByID,
  )
  useEffect(() => {
    if (
      auditDetails?.data?.auditDocuments &&
      auditDetails?.data?.auditDocuments.length > 0
    ) {
      setOldFiles([...auditDetails?.data?.auditDocuments])
    }
  }, [auditDetails])

  const onUpload = (documents) => {
    fileManagerUpload(documents).then((res) => {
      setFiles([...files, ...res.files])
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
    return files?.map((file) => {
      return (
        <div className="file" key={file.id}>
          {!filesToDelete.includes(file.id) && (
            <>
              <div className="file-data">
                <FontIcon icon iconClassName={customIncludes(file.filename)} />
                <div className="file-details">
                  <span>{file.filename}</span>
                  <span>{formatFileSize(file.size)}</span>
                </div>
              </div>

              {!readOnly && (
                <FontIcon
                  onClick={() => {
                    setFilesToDelete([...filesToDelete, file.id])
                  }}
                >
                  delete
                </FontIcon>
              )}
              <FontIcon
                onClick={() => {
                  window.open(getPublicUrl(file?.id))
                }}
              >
                download
              </FontIcon>
            </>
          )}
        </div>
      )
    })
  }

  const renderOldFiles = () => {
    return oldFiles?.map((file) => {
      return (
        <div className="file" key={file.id}>
          <div className="file-data">
            <FontIcon icon iconClassName={customIncludes(file.filename)} />
            <div className="file-details">
              <span>{file.filename}</span>
              <span>{file.size}</span>
            </div>
          </div>

          {!readOnly && (
            <FontIcon
              onClick={() => {
                deleteDocuments([file?.id]).then(
                  (res) =>
                    res[0] &&
                    setOldFiles((prev) =>
                      prev.filter((el) => el.id !== file.id),
                    ),
                )
              }}
            >
              delete
            </FontIcon>
          )}
          <FontIcon
            onClick={() => {
              window.open(getPublicUrl(file?.apiID))
            }}
          >
            download
          </FontIcon>
        </div>
      )
    })
  }
  const actions = !readOnly
    ? [
      <Button key={1} flat className="discard-btn" onClick={onDiscard}>
          Discard
      </Button>,
      <Button
        key={2}
        flat
        swapTheming
        primary
        className="save-btn"
        onClick={() =>
          onSaveUpload(
              files?.filter(
                (file) =>
                  !filesToDelete
                    .map((fileToDelete) => fileToDelete)
                    ?.includes(file?.id),
              ),
              filesToDelete,
          )
        }
      >
        {isLoading ? (
          <FontIcon primary iconClassName="mdi mdi-spin mdi-loading" />
        ) : (
          'Upload'
        )}
      </Button>,
    ]
    : [
      <Button key={1} flat className="discard-btn" onClick={onDiscard}>
          Discard
      </Button>,
    ]
  const nodesFiles = [...renderOldFiles(), ...renderFiles()]
  return (
    <DialogContainer
      id="supported-document-dialog"
      visible={visible}
      onHide={() => onDiscard && onDiscard()}
      actions={actions}
      title={title}
      className="supported-document-dialog"
      disableScrollLocking
      modal
    >
      <div className="supported-document">
        {!readOnly && (
          <Dropzone
            onDrop={onUpload}
            accept={accept}
            multiple={true}
            className="dropzone-logo"
          >
            {({ getRootProps, getInputProps }) => (
              <section className="supported-document-dropzone">
                <div className="input-zone" {...getRootProps()}>
                  <input {...getInputProps()} />
                  <FontIcon className="delete-icon">file_upload</FontIcon>
                  <p>
                    Drag & Drop file here or <b>Select File</b>
                  </p>
                </div>
              </section>
            )}
          </Dropzone>
        )}
        {nodesFiles?.length > 0 ? nodesFiles : 'There is no Files'}
      </div>
    </DialogContainer>
  )
}

export default SupportedDocumentAudit
SupportedDocumentAudit.defaultProps = {
  oldFiles: [
    // {
    //   id: '1',
    //   filename: 'test1.png',
    //   size: 10,
    // },
    // {
    //   id: '2',
    //   filename: 'test2.png',
    //   size: 20,
    // },
  ],
  accept:
    '.doc, .docx, image/* , image/jpeg, image/png, image/jpg, application/pdf, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.wordprocessingml.document ',
}
