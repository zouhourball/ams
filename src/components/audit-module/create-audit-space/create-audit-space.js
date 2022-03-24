import { useState } from 'react'
import { Button, DialogContainer, FontIcon, Portal, TextField } from 'react-md'
import { DatePicker } from '@target-energysolutions/date-picker'
import moment from 'moment'
import AutocompleteWithCard from '../autocomplete-with-card'

import { useSelector } from 'react-redux'
import { useQuery } from 'react-apollo-hooks'

import { getPublicUrl } from 'libs/utils/custom-function'
import workers from 'libs/queries/workers.gql'

import './style.scss'

const CreateAuditSpace = ({
  information,
  setInformation,
  visible,
  onHide,
  onSubmit,
}) => {
  const organizationID = useSelector((state) => state?.shell?.organizationId)

  const { data: membersByOrganisation } = useQuery(workers, {
    context: { uri: `${PRODUCT_WORKSPACE_URL}/graphql` },
    variables: { organizationID: organizationID, wsIDs: [] },
  })

  const membersByOrg = () => {
    let members = []
    members = membersByOrganisation?.workers?.map((el) => ({
      subject: el?.profile?.subject,
      name: el?.profile?.fullName,
      email: el?.profile?.email,
      id: el?.profile?.userID,
      avatar: getPublicUrl(el?.profile?.pictureURL),
    }))

    return members
  }

  const [datePickerStart, setDatePickerStart] = useState(false)
  const [datePickerEnd, setDatePickerEnd] = useState(false)
  const validateData = () => {
    return !(
      information?.assignUsers?.length &&
      information?.proposeStartDate &&
      information?.proposeEndDate
    )
  }
  const actions = [
    <Button id="1" key="1" primary flat onClick={onHide}>
      Discard
    </Button>,
    <Button
      id="2"
      key="2"
      onClick={onSubmit}
      disabled={validateData()}
      primary
      flat
    >
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
            information?.proposeStartDate
              ? `${moment(new Date(information?.proposeStartDate)).format(
                'll',
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
            information?.proposeEndDate
              ? `${moment(new Date(information?.proposeEndDate)).format('ll')} `
              : ''
          }
          block
        />
        <h4>Assign Users</h4>
        <AutocompleteWithCard
          membersList={membersByOrg()}
          selectedMembers={
            information?.assignUsers?.map((sub) =>
              membersByOrg()?.find((member) => member?.subject === sub),
            ) || []
          }
          setSelectedMembers={(v) => {
            setInformation({
              ...information,
              assignUsers: [
                ...v?.map(
                  (el) =>
                    // email: el?.email,
                    // name: el?.name,
                    el?.subject,
                ),
              ],
            })
          }}
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
                proposeStartDate: moment(date.timestamp).format('YYYY-MM-DD'),
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
                proposeEndDate: moment(date.timestamp).format('YYYY-MM-DD'),
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
