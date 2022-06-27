import React from 'react'

import './style.scss'
import { FontIcon } from 'react-md'
import { useTranslation } from 'libs/langs'

const RemarksFooter = ({ remark, onEdit, onDelete }) => {
  const { t } = useTranslation()
  return (
    <div className="notes">
      <div className="notes-title">
        <FontIcon iconClassName="mdi mdi-message-text-outline" />
        <span>{t('remarks')}</span>
      </div>
      <div className="notes-content">
        {remark}
        {/* <div className="btn-edit">
            <Button
              icon
              className="uploadButton"
              iconClassName="mdi mdi-pen"
              onClick={() => {
                onEdit()
              }}
            ></Button>
            <Button
              icon
              className="uploadButton"
              iconClassName="mdi mdi-delete"
              onClick={() => {
                onDelete()
              }}
            ></Button>
          </div> */}
      </div>
    </div>
  )
}

export default RemarksFooter
