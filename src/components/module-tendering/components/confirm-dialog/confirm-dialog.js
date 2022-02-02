import { DialogContainer, Button } from 'react-md'

import './style.scss'
export default function ConfirmDialog ({
  title,
  text,
  hideDialog,
  visible,
  handleConfirm,
}) {
  const actions = [
    <Button key={1} flat onClick={hideDialog}>
      Discard
    </Button>,
    <Button key={1} primary flat onClick={handleConfirm}>
      Confirm
    </Button>,
  ]
  return (
    <DialogContainer
      id="dialog-container"
      visible={visible}
      hide={hideDialog}
      title={title}
      className="confirmDialog"
      actions={actions}
    >
      <p>{text}</p>
    </DialogContainer>
  )
}
