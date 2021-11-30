import { useState } from 'react'
import {
  DialogContainer,
  Button,
  SelectField,
  TextField,
  FontIcon,
  Portal,
} from 'react-md'
import { DatePicker } from '@target-energysolutions/date-picker'
import moment from 'moment'

import './style.scss'

const UploadPermitDialog = ({
  visible,
  onHide,
  onContinue,
  information,
  setInformation,
  title,
  datePlaceholder,
  blockList,
}) => {
  // const [information, setInformation] = useState({})
  const [datePickerState, setDatePickerState] = useState(false)

  const actions = [
    <Button key={1} flat onClick={() => onHide && onHide()}>
      Discard
    </Button>,
    <Button key={2} flat primary onClick={() => onContinue && onContinue()}>
      Continue
    </Button>,
  ]

  return (
    <DialogContainer
      id="upload-permit-dialog"
      visible={visible}
      onHide={() => onHide && onHide()}
      actions={actions}
      title={title}
      className="upload-permit-dialog"
      disableScrollLocking
      modal
    >
      <SelectField
        id="block"
        block
        // defaultValue={information.block}
        value={information.block}
        position={SelectField.Positions.BELOW}
        placeholder={'Select Block'}
        onChange={(v) => setInformation({ ...information, block: v })}
        className="upload-permit-dialog-selectField"
        menuItems={blockList}
      />

      <TextField
        key={1}
        className="upload-permit-dialog-textField"
        onClick={() => setDatePickerState(true)}
        rightIcon={<FontIcon>date_range</FontIcon>}
        value={
          information?.date
            ? `${moment(new Date(information?.date)).format('DD/MM/YYYY')} `
            : { datePlaceholder }
        }
        block
      />
      {datePickerState && (
        <Portal
          visible={datePickerState}
          className="upload-permit-dialog-date"
          lastChild={true}
        >
          <DatePicker
            singlePick
            startView="year"
            endView="day"
            defaultView="day"
            translation={{ update: 'select' }}
            onUpdate={(date) => {
              setInformation({
                ...information,
                date: date.timestamp,
              })

              setDatePickerState(false)
            }}
            onCancel={() => setDatePickerState(false)}
          />
        </Portal>
      )}
    </DialogContainer>
  )
}

export default UploadPermitDialog
UploadPermitDialog.defaultProps = {
  title: 'Upload Permit to Abandon Report',
  datePlaceholder: 'Abandonment Date',
}
