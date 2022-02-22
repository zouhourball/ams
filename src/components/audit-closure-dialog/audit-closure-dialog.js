import { DialogContainer, FontIcon, Button, CircularProgress } from 'react-md'
import { useDropzone } from 'react-dropzone'
import { useState } from 'react'
import { get } from 'lodash-es'
import { useQuery } from 'react-apollo-hooks'
import { useSelector } from 'react-redux'
import { getPublicUrl } from 'libs/utils/custom-function'

import { fileManagerUpload } from 'libs/api/api-file-manager'

import workers from 'libs/queries/workers.gql'
// import SelectItemsWithSearch from 'components/select-items-with-search'
import AutocompleteWithCard from 'components/audit-module/autocomplete-with-card'

import uploadIcon from 'images/upload-icon.svg'

import './style.scss'

const AuditClosureDialog = ({
  title,
  visible,
  onHide,
  onSave,
  participants,
  setParticipants,
}) => {
  const [files, setFiles] = useState([])
  const [fileLoader, setFileLoader] = useState(false)
  const organizationID = useSelector((state) => state?.shell?.organizationId)

  const { data: membersByOrganisation } = useQuery(workers, {
    context: { uri: `${PRODUCT_WORKSPACE_URL}/graphql` },
    variables: { organizationID: organizationID, wsIDs: [] },
  })

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
    return !(files?.length && participants?.length)
  }
  const uploadBtn = {
    children: 'Submit',
    primary: true,
    flat: true,
    disabled: validateData(),

    onClick: () => {
      onSave(files, participants)
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

  const membersByOrg = () => {
    let members = []
    members = membersByOrganisation?.workers?.map((el) => ({
      subject: el?.profile?.subject,
      name: el?.profile?.fullName,
      email: el?.profile?.email,
      id: el?.profile?.userID,
      avatar: getPublicUrl(el?.profile?.pictureURL),
    }))

    return members
  }

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
      id="audit-closure-dialog"
      className="audit-closure-dialog"
      visible={visible}
      onHide={onHide}
      title={title}
      actions={actions}
    >
      <div className="audit-closure-dialog-content">
        <div className="md-grid">
          <AutocompleteWithCard
            membersList={membersByOrg()}
            selectedMembers={participants || []}
            setSelectedMembers={setParticipants}
            className={'md-cell md-cell--12'}
            cardClassName={'md-cell md-cell--6'}
            placeholder={'Assign User'}
          />
        </div>

        <div className="audit-closure-dialog-subtitle md-cell md-cell--12">
          Attach Document
        </div>

        <>
          {fileLoader ? (
            <CircularProgress />
          ) : (
            <div
              {...getOptionalRootProps({
                className:
                  'audit-closure-dialog-fileDropZone md-cell md-cell--12',
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
              className={`audit-closure-dialog-file md-cell md-cell--12`}
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

export default AuditClosureDialog

AuditClosureDialog.defaultProps = {
  items: [
    {
      id: 1,
      image: 'https://picsum.photos/100/100',
      fullName: 'Mohamed Ahmed',
      email: 'tariq.z@gmail.com',
    },
    {
      id: 2,
      image: 'https://picsum.photos/100/100',
      fullName: 'Ali Ahmed',
      email: 'tariq.z@gmail.com',
    },
    {
      id: 3,
      image: 'https://picsum.photos/100/100',
      fullName: 'Hammad Ahmed',
      email: 'tariq.z@gmail.com',
    },
  ],
}
