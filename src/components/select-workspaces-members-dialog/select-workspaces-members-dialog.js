import { useState } from 'react'
import { DialogContainer, Button } from 'react-md'
import { useDispatch } from 'react-redux'
import { messengerAct } from '@target-energysolutions/messenger'

import MembersPage from 'components/members-page'

import './style.scss'

const SelectWorkspacesMembersDialog = ({
  members,
  visible,
  onHide,
  addGroup,
  // setId,
  chatChannelHandler,
}) => {
  const dispatch = useDispatch()

  const [selectedMembers, setSelectedMembers] = useState([])

  const [workspaceName, setWorkspaceName] = useState('')

  const actions = [
    <Button key={1} className="button discard-btn" flat onClick={onHide}>
      Discard
    </Button>,
    <Button
      key={2}
      className="button add-btn"
      flat
      primary
      swapTheming
      onClick={() => {
        addGroup({
          channelName: workspaceName,
          members: selectedMembers.map((el) => ({
            subject: el?.subject,
            name: el?.fullName,
            email: el?.email,
          })),
        }).then((res) => {
          // setId(res?.id)
          chatChannelHandler(res?.id)
          dispatch(
            messengerAct.openChat({
              channelId: res?.id,
              type: 'group',
            }),
          )
        })
        onHide()
      }}
    >
      Create
    </Button>,
  ]
  return (
    <DialogContainer
      id="selectMembersWorkspacesDialog"
      className="selectMembersWorkspacesDialog"
      visible={visible}
      onHide={onHide}
      actions={actions}
      title={'Create Group'}
      portal={true}
      lastChild={true}
      disableScrollLocking={true}
      renderNode={document.body}
    >
      <MembersPage
        members={members}
        selectedMembers={selectedMembers}
        setSelectedMembers={setSelectedMembers}
        setWorkspaceName={setWorkspaceName}
        workspaceName={workspaceName}
      />
    </DialogContainer>
  )
}
export default SelectWorkspacesMembersDialog
