import { useState } from 'react'
import { Button, TextField, DialogContainer } from 'react-md'
import { useTranslation } from 'libs/langs'

import './style.scss'

const Remarks = ({ closeDialog, onAdd, section }) => {
  const { t } = useTranslation()
  const [remarks, setRemarks] = useState('')
  const handleChangeRemarks = (value) => {
    setRemarks(value)
  }
  const handleAdd = () => {
    onAdd(remarks)
  }

  return (
    <DialogContainer
      id="remarks"
      className="DialogForm"
      placeholder={t('add_remarks')}
      visible
      title={`${t('rem_about')} ${section}`}
    >
      <div className="remarks">
        <div className="wrapperTimeline">
          <div className="remarksText md-grid">
            <div className="md-cell md-cell--12">
              <TextField
                id="remarks-rejection"
                value={remarks}
                label={t('add_remarks')}
                onChange={(value) => handleChangeRemarks(value)}
                className="new-agreement-textField"
                autoComplete="off"
                rows={5}
              />
            </div>
          </div>
          <div className="modalFooter__Buttons">
            <Button
              flat
              primary
              onClick={closeDialog}
              className="discard-button"
            >
              {t('discard')}
            </Button>
            <Button flat primary onClick={handleAdd} className="add-button">
              {t('add')}
            </Button>
          </div>
        </div>
      </div>
    </DialogContainer>
  )
}

export default Remarks
