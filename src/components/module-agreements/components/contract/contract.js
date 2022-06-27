import React from 'react'

import { Avatar, Button, FontIcon } from 'react-md'
import { useTranslation } from 'libs/langs'

import './contract.scss'

export default function Contract ({ title, file, user, onClickDownload }) {
  const { t } = useTranslation()
  return (
    <div className="contract">
      <div className="title-wrapper">
        <FontIcon iconClassName="mdi mdi-file-document"></FontIcon>
        <h3> {title} </h3>
      </div>
      <div className="container">
        <div className="file-details">
          {renderFileIcon(file.type)}
          <div className="file-name">
            <div> {file.title} </div>
            <div className="file-size"> {file.size} </div>
          </div>
          <Button
            icon
            className="uploadButton"
            iconClassName="mdi mdi-download"
            onClick={() => {
              onClickDownload()
            }}
          ></Button>
        </div>
        <div className="contract-footer">
          <div className="contract-footer-details">
            <Avatar src={user.avatarUrl} role="presentation" />
            <label> {user.name} </label>
          </div>
          <div className="contract-footer-details">
            <FontIcon iconClassName="mdi mdi-calendar-clock" />
            <label>
              {user.date} {t('at')}
              {user.time}
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}

const renderFileIcon = type => {
  switch (type) {
    case 'pdf':
      return (
        <FontIcon className="file-icon pdf" iconClassName="mdi mdi-file-pdf" />
      )
  }
}
