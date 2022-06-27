import React from 'react'
import PropType from 'prop-types'
import fileMnager from 'images/started-kit-cards/file_manager.svg'
import upload from 'images/started-kit-cards/upload.svg'
import './styles.scss'

const BlockFileManager = props => {
  const { onClick, onButtonClick } = props
  const handleButtonClick = event => {
    event.stopPropagation()
    onButtonClick && onButtonClick()
  }
  return (
    <div className="start-blockfilemanager-card" onClick={onClick}>
      <img src={fileMnager} className="start-blockfilemanager-card-svg" />
      <h2 className="start-blockfilemanager-card-title">File Manager</h2>
      <span className="start-blockfilemanager-card-description">
        Manage all your files of Meera Platform in one centralized file manager
      </span>
      <div
        className="start-blockfilemanager-card-foot"
        onClick={handleButtonClick}
      >
        <img src={upload} className="start-blockfilemanager-card-upload-svg" />
        <span>Upload Files</span>
      </div>
    </div>
  )
}
BlockFileManager.propTypes = {
  onClick: PropType.func,
  onButtonClick: PropType.func,
}
export default BlockFileManager
