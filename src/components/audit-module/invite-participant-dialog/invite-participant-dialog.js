import { Button, DialogContainer } from 'react-md'
import AutocompleteWithCard from '../autocomplete-with-card'

import './style.scss'

const InviteParticipantDialog = ({
  visible,
  onHide,
  onSubmit,
  participants,
  setParticipants,
  members,
}) => {
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
      id="invite-participant-dialog"
      visible={visible}
      onHide={() => onHide && onHide()}
      actions={actions}
      title={'Invite Participant'}
      className="invite-participant-dialog"
      disableScrollLocking
      modal
    >
      <div className="md-grid">
        <AutocompleteWithCard
          membersList={members}
          selectedMembers={participants || []}
          setSelectedMembers={setParticipants}
          className={'md-cell md-cell--12'}
          cardClassName={'md-cell md-cell--6'}
          placeholder={'Search participants to assign'}
        />
      </div>
    </DialogContainer>
  )
}
export default InviteParticipantDialog

InviteParticipantDialog.defaultProps = {
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
