import { useState } from 'react'
import { Button, DialogContainer, FontIcon, Portal, TextField } from 'react-md'
import { DatePicker } from '@target-energysolutions/date-picker'
import moment from 'moment'
import AutocompleteWithCard from '../autocomplete-with-card'

import './style.scss'

const CreateAuditSpace = ({
  information,
  setInformation,
  visible,
  onHide,
  onSubmit,
  members,
}) => {
  const [datePickerStart, setDatePickerStart] = useState(false)
  const [datePickerEnd, setDatePickerEnd] = useState(false)
  const actions = [
    <Button id="1" key="1" primary flat onClick={onHide}>
      Discard
    </Button>,
    <Button id="2" key="2" onClick={onSubmit} primary flat>
      Submit
    </Button>,
  ]
  return (
    <DialogContainer
      id="create-audit-dialog"
      visible={visible}
      onHide={() => onHide && onHide()}
      actions={actions}
      title={'Create Audit Space'}
      className="create-audit-dialog"
      disableScrollLocking
      modal
    >
      <div className="md-grid">
        <TextField
          key={1}
          className="create-audit-dialog-textField md-cell md-cell--12"
          label="Propose Start Date"
          onClick={() => setDatePickerStart(true)}
          rightIcon={<FontIcon>date_range</FontIcon>}
          value={
            information?.startDate
              ? `${moment(new Date(information?.startDate)).format(
                'DD/MM/YYYY',
              )} `
              : ''
          }
          block
        />
        <TextField
          key={1}
          className="create-audit-dialog-textField md-cell md-cell--12"
          label="Propose End Date"
          onClick={() => setDatePickerEnd(true)}
          rightIcon={<FontIcon>date_range</FontIcon>}
          value={
            information?.endDate
              ? `${moment(new Date(information?.endDate)).format(
                'DD/MM/YYYY',
              )} `
              : ''
          }
          block
        />
        <AutocompleteWithCard
          membersList={members}
          selectedMembers={information?.participants || []}
          setSelectedMembers={(v) =>
            setInformation({
              ...information,
              participants: v,
            })
          }
          className={'md-cell md-cell--12'}
          cardClassName={'md-cell md-cell--6'}
          placeholder={'Search participants to assign'}
        />
      </div>
      {datePickerStart && (
        <Portal
          visible={datePickerStart}
          className="create-audit-dialog-date"
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
                startDate: date.timestamp,
              })

              setDatePickerStart(false)
            }}
            onCancel={() => setDatePickerStart(false)}
          />
        </Portal>
      )}
      {datePickerEnd && (
        <Portal
          visible={datePickerEnd}
          className="create-audit-dialog-date"
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
                endDate: date.timestamp,
              })

              setDatePickerEnd(false)
            }}
            onCancel={() => setDatePickerEnd(false)}
          />
        </Portal>
      )}
    </DialogContainer>
  )
}

export default CreateAuditSpace

CreateAuditSpace.defaultProps = {
  members: [
    {
      avatar: 'https://randomuser.me/api/portraits/men/97.jpg',
      subject: '55524512',
      name: 'tarik',
      email: 'tarik@mm.com',
    },
    {
      avatar: 'https://randomuser.me/api/portraits/men/97.jpg',
      subject: '8877445',
      name: 'mohamed',
      email: 'mohamed@mm.com',
    },
  ],
}
