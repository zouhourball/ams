import { useState, useEffect } from 'react'
import { DialogContainer, Button, TextField, FontIcon, Portal } from 'react-md'
import { DatePicker } from '@target-energysolutions/date-picker'
import moment from 'moment'
import { useQuery } from 'react-apollo-hooks'
import { useSelector } from 'react-redux'

import { getPublicUrl } from 'libs/utils/custom-function'
import workers from 'libs/queries/workers.gql'

import HtmlEditor from '../../module-tendering/components/create-agenda/html-editor'
import AutocompleteWithCard from '../autocomplete-with-card'

import './style.scss'

const CreateActionDialog = ({
  information,
  setInformation,
  visible,
  onHide,
  onSubmit,
  members,
  reportId,
}) => {
  const [datePickerState, setDatePickerState] = useState(false)
  const organizationID = useSelector((state) => state?.shell?.organizationId)

  const { data: membersByOrganisation } = useQuery(workers, {
    context: { uri: `${PRODUCT_WORKSPACE_URL}/graphql` },
    variables: { organizationID: organizationID, wsIDs: [] },
  })
  useEffect(() => {
    setInformation({ reportId })
  }, [])
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
  const actions = [
    <Button id="1" key="1" primary flat onClick={onHide}>
      Discard
    </Button>,
    <Button id="2" key="2" onClick={onSubmit} primary flat>
      Submit
    </Button>,
  ]
  const priority = [
    { label: 'Low', value: 'LOW' },
    { label: 'Medium', value: 'MEDIUM' },
    { label: 'High', value: 'HIGH' },
  ]
  return (
    <DialogContainer
      id="create-action-dialog"
      visible={visible}
      onHide={() => onHide && onHide()}
      actions={actions}
      title={'Create New Action'}
      className="create-action-dialog"
      disableScrollLocking
      modal
    >
      <h4 className="title">Action Priority</h4>
      <div className="priority-action">
        {priority.map((el, index) => (
          <div
            key={index}
            onClick={() => {
              setInformation({
                ...information,
                priority: el.value,
              })
            }}
            className={`priority-action-item ${
              el.value === information?.priority ? 'active' : ''
            }`}
          >
            {el.label}{' '}
          </div>
        ))}
      </div>
      <div className="md-grid">
        <TextField
          key={1}
          className="create-action-dialog-textField md-cell md-cell--12"
          label="Reference Audit Report ID"
          /* onChange={(v) =>
            setInformation({
              ...information,
              reportId: v,
            })
          } */
          value={information?.reportId}
          block
        />
        <TextField
          key={1}
          className="create-action-dialog-textField md-cell md-cell--12"
          label="Audit Report Reference"
          onChange={(v) =>
            setInformation({
              ...information,
              reportReference: v,
            })
          }
          value={information?.reportReference}
          block
        />
        <TextField
          key={1}
          className="create-action-dialog-textField md-cell md-cell--12"
          label="Set Deadline"
          onClick={() => setDatePickerState(true)}
          rightIcon={<FontIcon>date_range</FontIcon>}
          value={
            information?.deadline
              ? `${moment(new Date(information?.deadline)).format(
                'YYYY-MM-DD',
              )} `
              : ''
          }
          block
        />
        <div className="md-cell md-cell--12">
          <HtmlEditor
            onChange={(value) =>
              setInformation({
                ...information,
                description: value,
              })
            }
            editorLabelClassName="create-action-dialog-htmlEditor"
            value={information?.description}
            readOnly={false}
          />
        </div>
        <AutocompleteWithCard
          membersList={membersByOrg()}
          selectedMembers={information?.assignedParticipants || []}
          setSelectedMembers={(v) =>
            setInformation({
              ...information,
              assignedParticipants: v,
            })
          }
          className={'md-cell md-cell--12'}
          cardClassName={'md-cell md-cell--6'}
          placeholder={'Search participants to assign'}
        />
      </div>
      {datePickerState && (
        <Portal
          visible={datePickerState}
          className="create-action-dialog-date"
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
                deadline: date.timestamp,
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
export default CreateActionDialog

CreateActionDialog.defaultProps = {
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
