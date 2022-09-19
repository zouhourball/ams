import { Button, DialogContainer } from 'react-md'
import { useTranslation } from 'libs/langs'

import './style.scss'

const Warning = ({ closeDialog, onSave }) => {
  const { t } = useTranslation()
  return (
    <DialogContainer id="warning" className="warning-DialogForm" visible>
      <div className="warning">
        <div className="wrapperTimeline">
          <div className="warningText">
            <div className="alert-icon">
              <span className="mdi mdi-alert-outline"></span>
            </div>

            <label className="label">{t('are_you_sure')}</label>
            <span className="span">{t('this_automatically')}</span>
          </div>
          <div className="warning-modalFooter__Buttons">
            <Button flat primary onClick={closeDialog} className="no-button">
              {t('no')}
            </Button>
            <Button flat primary onClick={onSave} className="yes-button">
              {t('yes')}
            </Button>
          </div>
        </div>
      </div>
    </DialogContainer>
  )
}

export default Warning
