import React from 'react'
import CardLayout from '../card-layout'
import fileManagerSVG from 'images/file-manager.svg'
import uploadFilesSVG from 'images/upload-files.svg'
import viewFileStorageSVG from 'images/view-file-storage.svg'
import artboardSVG from 'images/artboard.svg'
import './styles.scss'

const FileManagerCard = ({
  onUpload,
  onUploadBtn,
  onViewFile,
  onViewFileBtn,
  onShareFile,
  onShareFileBtn,
  className,
  ...rest
}) => {
  const actions = [
    {
      label: 'Upload Files',
      iconSrc: uploadFilesSVG,
      iconClassName: 'upload-files-icon-modifysize',
      onClick: () => {
        onUpload && onUpload()
      },
      onBtnClick: () => {
        onUploadBtn && onUploadBtn()
      },
    },
    {
      label: 'View File Storage',
      iconSrc: viewFileStorageSVG,
      onClick: () => {
        onViewFile && onViewFile()
      },
      onBtnClick: () => {
        onViewFileBtn && onViewFileBtn()
      },
    },
    {
      label: 'Share Files',
      iconSrc: artboardSVG,
      onClick: () => {
        onShareFile && onShareFile()
      },
      onBtnClick: () => {
        onShareFileBtn && onShareFileBtn()
      },
    },
  ]
  return (
    <CardLayout
      actions={actions}
      title="File Manager"
      background="#ff4c00"
      description="Your files will be stored and managed in the Meera file manager. Any data sheet files will be further parsed and the data will be stored in Meera data-lake, which will be used as data source and comsume by other tools/Apps like Meera BI"
      iconSrc={fileManagerSVG}
      {...rest}
    />
  )
}

export default FileManagerCard
