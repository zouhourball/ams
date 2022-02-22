import { useState, useEffect } from 'react'
import { FontIcon, Button, DialogContainer, Avatar } from 'react-md'
import { useQuery } from 'react-query'

import { getPublicUrl } from 'libs/api/api-file-manager'
import { getDocumentsById } from 'libs/api/supporting-document-api'

import './style.scss'

const AuditClosureDetailsDialog = ({
  onDiscard,
  visible,
  title,
  assigneeUser,
  processInstanceId,
}) => {
  const [oldFiles, setOldFiles] = useState([
    // {
    //   author: 'zouhourballoum',
    //   contentType: 'application/octet-stream',
    //   filename: 'Annual-Gas-Conservation-Plan.34cfdff3.doc',
    //   fileId: 'upload/156de7b87439bb1096823c2ad854e773a0aec771/4f3c4b801f2a87f08e7409551eec398f/Annual-Gas-Conservation-Plan.34cfdff3.doc',
    //   id: '620bcf88c5c10261f5aeaf87',
    //   processInstanceId: '88ff90a4-128e-412b-b09b-a7cde54db08b',
    //   size: '37 KB',
    //   url: '/download/upload/156de7b87439bb1096823c2ad854e773a0aec771/4f3c4b801f2a87f08e7409551eec398f/Annual-Gas-Conservation-Plan.34cfdff3.doc',
    // },
  ])

  const { data: suppDocsFiles } = useQuery(
    ['getDocumentsById', processInstanceId],
    processInstanceId && getDocumentsById,
  )

  useEffect(() => {
    if (suppDocsFiles && suppDocsFiles.length > 0) {
      setOldFiles([...suppDocsFiles])
    }
  }, [suppDocsFiles])

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

          <FontIcon
            onClick={() => {
              window.open(getPublicUrl(file?.fileId))
            }}
          >
            download
          </FontIcon>
        </div>
      )
    })
  }
  const actions = [
    <Button key={1} flat className="discard-btn" onClick={onDiscard}>
      Discard
    </Button>,
  ]

  const nodesFiles = [...renderOldFiles()]
  return (
    <DialogContainer
      id="audit-closure-details-dialog"
      visible={visible}
      onHide={() => onDiscard && onDiscard()}
      actions={actions}
      title={title}
      className="audit-closure-details-dialog"
      disableScrollLocking
      modal
    >
      <h4 className="label">Assignee</h4>
      <div className="item">
        <Avatar src={assigneeUser?.avatar} className="item-image" />
        <div className="item-info">
          <div className={`item-info-fullName`}>{assigneeUser?.name}</div>
        </div>
      </div>

      <h4 className="label">Attached Document</h4>
      <div className="supported-document">
        {nodesFiles?.length > 0 ? nodesFiles : 'There is no Files'}
      </div>
    </DialogContainer>
  )
}

export default AuditClosureDetailsDialog
AuditClosureDetailsDialog.defaultProps = {
  oldFiles: [],
  assigneeUser: {
    id: 1,
    avatar: 'https://picsum.photos/100/100',
    name: 'Mohamed Ahmed',
    email: 'tariq.z@gmail.com',
  },

  accept:
    '.doc, .docx, image/* , image/jpeg, image/png, image/jpg, application/pdf, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.wordprocessingml.document ',
}
