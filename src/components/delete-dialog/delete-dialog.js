import { DialogContainer, Button } from 'react-md'
import './style.scss'
export default function DeleteDialog ({
  title,
  text,
  hideDialog,
  visible,
  handleDeleteProduction,
}) {
  const actions = [
    <Button key={1} flat onClick={hideDialog}>
      Discard
    </Button>,
    <Button key={1} primary flat onClick={(handleDeleteProduction, hideDialog)}>
      Confirm
    </Button>,
  ]
  return (
    <DialogContainer
      id="dialog-container"
      visible={visible}
      hide={hideDialog}
      title={title}
      className="deleteDialog"
      actions={actions}
    >
      <p>{text}</p>
    </DialogContainer>
  )
}
