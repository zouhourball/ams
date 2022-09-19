import { Button, FontIcon } from 'react-md'

import './contract.scss'
import { get } from 'lodash-es'

export default function Contract ({
  file,
  onClickDownload,
  onDelete,
  hideButtons,
  setPreviewFile,
  className,
}) {
  return (
    <div className={`file-details ${className || ''}`}>
      {file && file.type ? renderDocumentIcon(file.type.split('/')[1]) : ''}
      <div className="file-info">
        <div className="file-name"> {get(file, 'name', '')} </div>
        <div className="file-size"> {get(file, 'size', '')} </div>
      </div>
      <Button
        icon
        className="actionButton"
        iconClassName="mdi mdi-eye"
        onClick={() => {
          setPreviewFile(file)
        }}
      ></Button>
      <Button
        icon
        className="actionButton"
        iconClassName="mdi mdi-download"
        onClick={() => {
          onClickDownload()
        }}
      ></Button>
      {hideButtons && (
        <Button
          icon
          className="actionButton"
          iconClassName="mdi mdi-delete"
          onClick={() => {
            onDelete()
          }}
        ></Button>
      )}
    </div>
  )
}

const renderDocumentIcon = extension => {
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
  if (extension === 'html') {
    return <FontIcon icon iconClassName={`mdi mdi-language-html5 mdi-36px`} />
  } else {
    return <FontIcon icon iconClassName={`mdi mdi-file mdi-36px`} />
  }
}
