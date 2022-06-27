import Dropzone from 'react-dropzone'
import { get } from 'lodash-es'
import { ExpansionPanel } from 'react-md'

import { fileManagerDownload } from 'libs/api/api-psa'
import { fileManagerUpload } from 'libs/api'
import mutate from 'libs/hocs/mutate'
import Contract from 'components/module-agreements/components/attachments-file/contract.js'

import { useTranslation } from 'libs/langs'

const AttachmentCollapsePanel = ({
  mutations: { fileManagerUploadAttachment },
  //   fileManagerUploadAttachmentStatus,
  setFileList,
  fileList,
  index,
  category,
  disableDropzone,
  setPreviewFile,
  onDelete,
}) => {
  //   const prevFileManagerUploadAttachmentStatus = usePrevious({
  //     ...fileManagerUploadAttachmentStatus,
  //   })
  //   useEffect(() => {
  //     if (
  //       prevFileManagerUploadAttachmentStatus &&
  //             prevFileManagerUploadAttachmentStatus.pending &&
  //             !fileManagerUploadAttachmentStatus.pending &&
  //             fileManagerUploadAttachmentStatus.data
  //     ) {
  //       const documents = get(fileManagerUploadAttachmentStatus, 'data.files', [])
  //       const docs = documents.map(doc => {
  //         return {
  //           file_name: doc.filename,
  //           url: doc.url,
  //           size: doc.size,
  //           content_type: doc.contentType,
  //         }
  //       })
  //       setFileList(docs)
  //       //   setFileList([...fileList, ...docs])
  //     }
  //   }, [fileManagerUploadAttachmentStatus])
  const { t } = useTranslation()
  const renderListOfFiles = cat => {
    let files = fileList.map(doc => {
      return {
        name: doc.file_name,
        size: doc.size,
        type: doc.content_type,
        url: doc.url,
      }
    })
    const onClickDownload = file => {
      const url = file.url
        .split('/')
        .slice(2)
        .join('/')
      const name = file.name
      fileManagerDownload(url, name)
    }
    return (
      files &&
      files.map((file, index) => {
        return (
          <Contract
            key={index}
            file={file}
            onClickDownload={() => onClickDownload(file)}
            onDelete={() => onDelete(file, cat)}
            hideButtons={!disableDropzone}
            setPreviewFile={setPreviewFile}
            className="md-cell md-cell--4"
          />
        )
      })
    )
  }

  const uploadFiles = (listFiles, cat) => {
    fileManagerUploadAttachment(listFiles, 'upload').then(res => {
      const docs = get(res, 'data.files', []).map(doc => {
        return {
          file_name: doc.filename,
          url: doc.url,
          size: doc.size,
          content_type: doc.contentType,
        }
      })
      setFileList(docs)
    })
  }

  return (
    <ExpansionPanel
      className="attachmentPanel"
      footer={null}
      label={
        <>
          <img src={category.icon} height="18px" /> {category.label}
        </>
      }
      defaultExpanded={index === 0}
    >
      {!disableDropzone ? (
        <div className="dropzone-wrapper">
          <Dropzone
            key={index}
            onDrop={acceptedFiles => {
              uploadFiles(acceptedFiles)
            }}
          >
            {({ getRootProps, getInputProps }) => (
              <div className="dropzone" {...getRootProps()}>
                <input {...getInputProps()} />
                <p>
                  {t('drag_and_drop')}{' '}
                  <span className="dropzone-wrapper-blue-text">
                    {t('select_contract')}
                  </span>
                </p>
              </div>
            )}
          </Dropzone>
          <div className="md-grid filesContainer">
            {renderListOfFiles(category)}
          </div>
        </div>
      ) : (
        <div className="md-grid filesContainer">
          {renderListOfFiles(category)}
        </div>
      )}
    </ExpansionPanel>
  )
}

export default mutate({
  moduleName: 'AttachmentCollapsePanel',
  mutations: {
    fileManagerUploadAttachment: fileManagerUpload,
  },
})(AttachmentCollapsePanel)
