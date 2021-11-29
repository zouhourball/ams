import { DialogContainer, Button } from 'react-md'

const ConfirmDialog = ({
  message = '',
  onDiscard,
  handleOverride,
  visible,
  title,
  confirmLabel = 'Override',
}) => {
  const actions = [
    <Button id="1" key="1" primary flat onClick={onDiscard}>
      Discard
    </Button>,
    <Button id="2" key="2" onClick={handleOverride} primary flat>
      {confirmLabel}
    </Button>,
  ]
  return (
    <DialogContainer
      id="override-dialog"
      actions={actions}
      visible={visible}
      title={title}
      className="override-dialog"
    >
      <div className="override-dialog-message">{message}</div>
    </DialogContainer>
  )
}

export default ConfirmDialog
