import { useState } from 'react'
import {
  DialogContainer,
  Button,
  SelectField,
  TextField,
  FontIcon,
} from 'react-md'
import { DatePicker } from '@target-energysolutions/date-picker'
import moment from 'moment'

import './style.scss'

const UploadPermitDialog = ({ visible, onHide, onContinue, information, setInformation }) => {
  // const [information, setInformation] = useState({})
  const [datePickerState, setDatePickerState] = useState(false)

  const actions = []
  actions.push(
    <Button flat onClick={() => onHide && onHide()}>
      Discard
    </Button>,
    <Button flat primary onClick={() => onContinue && onContinue()} >
      Continue
    </Button>,
  )

  return (
    <DialogContainer
      id="new-project-dialog"
      visible={true}
      onHide={() => onHide && onHide()}
      actions={actions}
      title={'Upload Permit to Drill Report'}
      className="upload-permit-dialog"
      disableScrollLocking
      modal
    >
      <div>
        <SelectField
          id="block"
          block
          // defaultValue={information.block}
          value={information.block}
          position={SelectField.Positions.BELOW}
          label={'Select Block'}
          onChange={(v) => setInformation({ ...information, block: v })}
          className="new-project-dialog-selectField  md-cell md-cell--6 md-cell--4-tablet md-cell--4-phone"
          menuItems={['block 10']}
        />
      </div>
      <div className="new-project-dialog-date">
        <TextField
          key={1}
          className="dateField"
          onClick={() => setDatePickerState(true)}
          rightIcon={<FontIcon>date_range</FontIcon>}
          value={
            information?.date
              ? `${moment(new Date(information?.date)).format('DD/MM/YYYY')} `
              : 'Spud Date'
          }
        />
        {datePickerState && (
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
        )}
      </div>
    </DialogContainer>
  )
}

export default UploadPermitDialog
