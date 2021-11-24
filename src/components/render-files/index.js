import { FontIcon } from 'react-md'

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

const deleteFile = (updatedFiles, setFiles) => {
  setFiles([...updatedFiles])
}

export const renderFiles = (files, setFiles) => {
  return files?.map((file) => {
    return (
      <>
        <div className="file" key={file.id}>
          <FontIcon icon iconClassName={customIncludes(file.filename)} />
          <div className="file-data">
            <div className="file-details">
              <span className="croppedText">{file.filename}</span>
              <span>{formatFileSize(file.size)}</span>
            </div>
          </div>

          <FontIcon
            onClick={() => {
              deleteFile([...files.filter((el) => el.id !== file.id)], setFiles)
              // setFilesToDelete([...filesToDelete, file.id])
            }}
          >
            delete
          </FontIcon>
        </div>
      </>
    )
  })
}
