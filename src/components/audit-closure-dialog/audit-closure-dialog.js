import {
  DialogContainer,
  FontIcon,
  Button,
  CircularProgress,
  Avatar,
} from 'react-md'
import { useDropzone } from 'react-dropzone'
import { useState } from 'react'
import { get } from 'lodash-es'

import { fileManagerUpload } from 'libs/api/api-file-manager'

import SelectItemsWithSearch from 'components/select-items-with-search'

import uploadIcon from 'images/upload.svg'

import './style.scss'

const AuditClosureDialog = ({ title, visible, onHide, onSave, items }) => {
  const [files, setFiles] = useState([])
  const [fileLoader, setFileLoader] = useState(false)
  const [selectedItems, setSelectedItems] = useState([])
  const [itemsVisibility, setItemsVisibility] = useState(false)
  const [textSearch, setTextSearch] = useState('')

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
  const uploadBtn = {
    children: 'Submit',
    primary: true,
    flat: true,

    onClick: () => {
      onSave(files, selectedItems)
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

  const addItems = (item) => {
    setSelectedItems(
      selectedItems.map((el) => el.id).includes(item.id)
        ? selectedItems.filter((el) => el.id !== item.id)
        : [...selectedItems, item],
    )
  }

  const getSelectedItems = () => {
    return (selectedItems || []).map((el) => (
      <div key={el.id} className="item md-cell md-cell--6">
        <Avatar src={el.image} className="item-image" />
        <div className="item-info">
          <div className="item-info-header">
            <div className={`item-info-fullName`}>{el.fullName}</div>
            <div className={`item-info-email`}>{el.email}</div>
          </div>
        </div>
        <div className="item-rightSide">
          {selectedItems.map((el) => el.id)?.includes(el.id) ? (
            <FontIcon
              onClick={() => {
                addItems(el)
              }}
              primary
            >
              close
            </FontIcon>
          ) : (
            ''
          )}
        </div>
      </div>
    ))
  }

  let filterList = items
  if (textSearch) {
    const expr = new RegExp(textSearch, 'i')
    filterList = filterList.filter((nal) => expr.test(nal['fullName']))
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
        <SelectItemsWithSearch
          placeholder="Assign User"
          textFieldClassName="md-cell md-cell--12"
          selectedItems={selectedItems}
          selectItem={addItems}
          itemsVisibility={itemsVisibility}
          setItemsVisibility={setItemsVisibility}
          textSearch={textSearch}
          setTextSearch={setTextSearch}
          items={filterList}
          rightIcon={<FontIcon>search</FontIcon>}
        />
        <div className="md-grid">{getSelectedItems()}</div>

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
