import { Button, FontIcon } from 'react-md'

import './styles.scss'

const File = ({ file, onDelete }) => {
  const renderDocumentIcon = (type) => {
    let extension = type.split('/')

    if (
      [
        'doc',
        'docx',
        'vnd.openxmlformats-officedocument.wordprocessingml.document',
      ].includes(extension[1])
    ) {
      return (
        <div className="docs-icon-area">
          <FontIcon
            icon
            iconClassName={`mdi mdi-file-word mdi-36px`}
            className="color-mdi-office"
          />
        </div>
      )
    }
    if (
      [
        'xlsx',
        'xls',
        'vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      ].includes(extension[1])
    ) {
      return (
        <div className="docs-icon-area">
          <FontIcon
            icon
            iconClassName={`mdi mdi-file-excel mdi-36px`}
            className="color-mdi-xls"
          />
        </div>
      )
    }
    if (extension[1] === 'pdf') {
      return (
        <div className="docs-icon-area">
          <FontIcon
            icon
            iconClassName={`mdi mdi-file-pdf mdi-36px`}
            className="color-mdi-file-pdf"
          />
        </div>
      )
    }
    if (extension[1] === 'zip') {
      return (
        <div className="docs-icon-area">
          <FontIcon
            icon
            iconClassName={`mdi mdi-zip-box mdi-36px`}
            className="color-mdi-zip-box"
          />
        </div>
      )
    }
    if (extension[1] === 'js') {
      return (
        <div className="docs-icon-area">
          <FontIcon
            icon
            iconClassName={`mdi mdi-language-javascript mdi-36px`}
          />
        </div>
      )
    }
    if (extension[1] === 'html') {
      return (
        <div className="docs-icon-area">
          <FontIcon icon iconClassName={`mdi mdi-language-html5 mdi-36px`} />
        </div>
      )
    }
    if (['jpg', 'png', 'svg', 'jpeg', 'gif'].includes(extension[1])) {
      return (
        <div className="docs-icon-area">
          <FontIcon
            icon
            iconClassName={`mdi mdi-file-image mdi-36px`}
            className="color-mdi-img"
          />
        </div>
      )
    } else {
      return (
        <div className="docs-icon-area">
          <FontIcon icon iconClassName={`mdi mdi-file mdi-36px`} />
        </div>
      )
    }
  }
  const formatFileSize = (bytes, decimalPoint) => {
    if (bytes === 0) return '0 Bytes'
    if (bytes === '') return '-'
    const k = 1000
    const dm = decimalPoint || 2
    const sizes = ['Bytes', 'Kb', 'Mb', 'Gb', 'Tb', 'Pb', 'Eb', 'Zb', 'Yb']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
  }
  return (
    <div className="newAnnualPlan_files md-cell md-cell--12">
      <div className="container">
        <div className="file-details">
          {renderDocumentIcon(file.type)}
          <div className="file-name">
            <div> {file.name} </div>
            <div className="file-size"> {formatFileSize(file.size)} </div>
          </div>
          <Button
            icon
            className="uploadButton"
            iconClassName="mdi mdi-delete"
            onClick={() => {
              onDelete(file)
            }}
          ></Button>
        </div>
      </div>
    </div>
  )
}
export default File
