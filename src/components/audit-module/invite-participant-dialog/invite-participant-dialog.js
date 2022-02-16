import { Button, DialogContainer } from 'react-md'
import { useSelector } from 'react-redux'
import { useQuery } from 'react-apollo-hooks'

import { getPublicUrl } from 'libs/utils/custom-function'
import workers from 'libs/queries/workers.gql'

import AutocompleteWithCard from '../autocomplete-with-card'

import './style.scss'

const InviteParticipantDialog = ({
  visible,
  onHide,
  onSubmit,
  participants,
  setParticipants,
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
          membersList={membersByOrg()}
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
