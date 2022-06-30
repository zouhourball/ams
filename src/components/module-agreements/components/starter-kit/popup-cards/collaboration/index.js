import CardLayout from '../card-layout'
import collaborationSVG from 'images/apps/collaborations.svg'

const CollaborationCard = ({
  onInviteMembers,
  onCreateGroup,
  className,
  ...rest
}) => {
  const actions = [
    {
      label: 'Invite Members',
      mdIcon: 'mdi mdi-account-plus',
      onClick: () => {
        onInviteMembers && onInviteMembers()
      },
      withoutBtn: true,
    },
    {
      label: 'Create Group',
      mdIcon: 'mdi mdi-account-multiple-plus',
      onClick: () => {
        onCreateGroup && onCreateGroup()
      },
      withoutBtn: true,
    },
  ]
  return (
    <CardLayout
      actions={actions}
      title="Collaboration"
      background="#B94609"
      description="Meera collaboration is a set of instant masseging tool which allows user to send/receive text messages, audio/video calls, broadcast messages and desktop sharing."
      iconSrc={collaborationSVG}
      {...rest}
    />
  )
}

export default CollaborationCard
